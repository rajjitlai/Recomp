import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import type { AppData, WeeklyPlan, WorkoutDay } from "../data/exerciseTypes";
import { currentWeekNumber } from "../services/workoutRotation";
import {
  historyKey,
  initialData,
  reduceData,
  type Action,
} from "../services/state";
import { loadData, saveData } from "../services/storage";
import { getPlan } from "../services/trainingProgress";

interface Context {
  data: AppData;
  week: number;
  plan: WeeklyPlan;
  loading: boolean;
  loadError: string | null;
  saveError: string | null;
  dispatch: (action: Action) => void;
  retry: () => void;
  retrySave: () => void;
  completed: (day: WorkoutDay, week?: number) => string[];
}
const WorkoutContext = createContext<Context | null>(null);
export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(initialData);
  const latest = useRef(data);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const revision = useRef(0);
  const [calendar, setCalendar] = useState(() => ({
    week: currentWeekNumber(),
    day: new Date().toDateString(),
  }));
  const persist = useCallback((next: AppData) => {
    const ticket = ++revision.current;
    void saveData(next).then(
      () => {
        if (revision.current === ticket) setSaveError(null);
      },
      () => {
        if (revision.current === ticket)
          setSaveError(
            "Your changes could not be saved. Keep the app open and retry.",
          );
      },
    );
  }, []);
  const dispatch = useCallback(
    (action: Action) => {
      const next = reduceData(latest.current, action);
      if (next === latest.current) return;
      latest.current = next;
      setData(next);
      persist(next);
    },
    [persist],
  );
  const retry = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    void loadData().then(
      (value) => {
        latest.current = value;
        setData(value);
        setLoading(false);
      },
      () => {
        setLoadError(
          "We could not read your saved workouts. Your saved data has been left untouched.",
        );
        setLoading(false);
      },
    );
  }, []);
  useEffect(retry, [retry]);
  useEffect(() => {
    const refresh = () => {
      const now = new Date();
      const day = now.toDateString();
      setCalendar((previous) =>
        previous.day === day ? previous : { week: currentWeekNumber(now), day },
      );
    };
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    const interval = setInterval(refresh, 60_000);
    return () => {
      listener.remove();
      clearInterval(interval);
    };
  }, []);
  const week = calendar.week + data.weekOffset;
  useEffect(() => {
    if (!loading && !loadError) {
      dispatch({
        type: "advanceTraining",
        week,
        date: new Date().toISOString(),
      });
      dispatch({ type: "ensureWeek", week });
    }
  }, [
    week,
    calendar.day,
    loading,
    loadError,
    data.training.autoAdvance,
    data.training.configured,
    dispatch,
  ]);
  const plan = getPlan(data, week);
  return (
    <WorkoutContext.Provider
      value={{
        data,
        week,
        plan,
        loading,
        loadError,
        saveError,
        dispatch,
        retry,
        retrySave: () => persist(latest.current),
        completed: (day, targetWeek = week) =>
          data.history[historyKey(targetWeek, day)]?.completedExercises ?? [],
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error("WorkoutProvider is missing");
  return context;
}
