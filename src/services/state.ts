import type {
  AppData,
  WorkoutDay,
  Settings,
  SkipReason,
  TrainingLevel,
} from "../data/exerciseTypes";
import {
  workoutDays,
  skipReasons,
  trainingLevels,
} from "../data/exerciseTypes";
import {
  applyTrainingLevel,
  getPlan,
  trainingProgress,
} from "./trainingProgress";
import { exerciseById } from "../data/exercises";
import { swapExercise } from "./exerciseAlternatives";
import {
  generateWeeklyWorkout,
  generateClassicWeeklyWorkout,
  currentWeekNumber,
} from "./workoutRotation";

export const initialData = (): AppData => ({
  version: 1,
  weekOffset: 0,
  plans: {},
  history: {},
  notes: {},
  training: {
    level: "beginner",
    configured: false,
    autoAdvance: true,
    startedAt: null,
  },
  settings: {
    workSeconds: 40,
    restSeconds: 20,
    roundRestSeconds: 90,
    notifications: false,
  },
});
export const historyKey = (week: number, day: WorkoutDay) => `${week}:${day}`;
export type Action =
  | { type: "swapExercise"; week: number; day: WorkoutDay; id: string }
  | { type: "trainingLevel"; level: TrainingLevel; week: number; date: string }
  | { type: "trainingAuto"; enabled: boolean }
  | { type: "advanceTraining"; week: number; date: string }
  | { type: "ensureWeek"; week: number }
  | { type: "toggle"; week: number; day: WorkoutDay; id: string; date: string }
  | { type: "resetWorkout"; week: number; day: WorkoutDay }
  | {
      type: "skipWorkout";
      week: number;
      day: WorkoutDay;
      reason: SkipReason;
      date: string;
    }
  | { type: "resumeWorkout"; week: number; day: WorkoutDay }
  | { type: "regenerate"; week: number }
  | { type: "newWeek" }
  | { type: "clearHistory" }
  | { type: "settings"; settings: Partial<Settings> }
  | { type: "note"; id: string; note: string };

export function reduceData(data: AppData, action: Action): AppData {
  if (action.type === "swapExercise") {
    const key = historyKey(action.week, action.day);
    const entry = data.history[key];
    if (entry?.skipped || entry?.completedExercises.includes(action.id))
      return data;
    const plan = getPlan(data, action.week);
    const workout = swapExercise(plan.days[action.day], action.id);
    if (workout === plan.days[action.day]) return data;
    return {
      ...data,
      plans: {
        ...data.plans,
        [action.week]: {
          ...plan,
          days: { ...plan.days, [action.day]: workout },
        },
      },
      history: entry
        ? {
            ...data.history,
            [key]: { ...entry, exercises: workout.exercises.map((e) => e.id) },
          }
        : data.history,
    };
  }
  if (action.type === "trainingLevel") {
    if (data.training.configured && action.level === data.training.level)
      return data;
    return applyTrainingLevel(data, action.level, action.week, action.date);
  }
  if (action.type === "trainingAuto")
    return {
      ...data,
      training: { ...data.training, autoAdvance: action.enabled },
    };
  if (action.type === "advanceTraining") {
    if (!data.training.configured || !data.training.autoAdvance) return data;
    const progress = trainingProgress(data, new Date(action.date));
    return progress.ready && progress.nextLevel
      ? applyTrainingLevel(
          data,
          progress.nextLevel,
          action.week,
          action.date,
          true,
        )
      : data;
  }
  if (action.type === "ensureWeek")
    return data.plans[action.week]
      ? data
      : {
          ...data,
          plans: {
            ...data.plans,
            [action.week]: getPlan(data, action.week),
          },
        };
  if (action.type === "skipWorkout") {
    const key = historyKey(action.week, action.day);
    const plan = getPlan(data, action.week);
    const exercises = plan.days[action.day].exercises.map((e) => e.id);
    const entry = data.history[key];
    if (entry?.completedExercises.length === exercises.length) return data;
    return {
      ...data,
      plans: { ...data.plans, [action.week]: plan },
      history: {
        ...data.history,
        [key]: {
          weekNumber: action.week,
          day: action.day,
          date: action.date,
          exercises,
          completedExercises: entry?.completedExercises ?? [],
          skipped: { reason: action.reason, date: action.date },
        },
      },
    };
  }
  if (action.type === "resumeWorkout") {
    const key = historyKey(action.week, action.day);
    const entry = data.history[key];
    if (!entry?.skipped) return data;
    const { skipped, ...resumed } = entry;
    return { ...data, history: { ...data.history, [key]: resumed } };
  }
  if (action.type === "toggle") {
    const plan = getPlan(data, action.week);
    const ids = plan.days[action.day].exercises.map((e) => e.id);
    if (!ids.includes(action.id)) return data;
    const key = historyKey(action.week, action.day);
    if (data.history[key]?.skipped) return data;
    const previous = data.history[key]?.completedExercises ?? [];
    const completed = previous.includes(action.id)
      ? previous.filter((id) => id !== action.id)
      : [...previous, action.id];
    return {
      ...data,
      plans: { ...data.plans, [action.week]: plan },
      history: {
        ...data.history,
        [key]: {
          weekNumber: action.week,
          day: action.day,
          date: action.date,
          exercises: ids,
          completedExercises: completed,
        },
      },
    };
  }
  if (action.type === "resetWorkout") {
    const history = { ...data.history };
    delete history[historyKey(action.week, action.day)];
    return { ...data, history };
  }
  if (action.type === "regenerate")
    return {
      ...data,
      plans: {
        ...data.plans,
        [action.week]: getPlan(data, action.week),
      },
    };
  if (action.type === "newWeek")
    return { ...data, weekOffset: data.weekOffset + 1 };
  if (action.type === "clearHistory") return { ...data, history: {} };
  if (action.type === "settings")
    return { ...data, settings: { ...data.settings, ...action.settings } };
  return { ...data, notes: { ...data.notes, [action.id]: action.note } };
}

const record = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const strings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string");
// Validate before use. Corrupt or newer-format saves are never silently overwritten.
export function decodeData(
  raw: string | null,
  calendarWeek = currentWeekNumber(),
): AppData {
  if (raw === null) return initialData();
  const value: unknown = JSON.parse(raw);
  if (
    !record(value) ||
    value.version !== 1 ||
    !Number.isSafeInteger(value.weekOffset) ||
    typeof value.weekOffset !== "number" ||
    value.weekOffset < 0 ||
    value.weekOffset > 10000 ||
    !record(value.settings) ||
    !record(value.history) ||
    !record(value.notes) ||
    !record(value.plans)
  )
    throw new Error("Unrecognized saved data");
  const settings = value.settings;
  for (const key of ["workSeconds", "restSeconds", "roundRestSeconds"])
    if (
      typeof settings[key] !== "number" ||
      !Number.isInteger(settings[key]) ||
      settings[key] < 5 ||
      settings[key] > 300
    )
      throw new Error("Invalid saved timing");
  if (
    typeof settings.notifications !== "boolean" ||
    !Object.values(value.notes).every((n) => typeof n === "string")
  )
    throw new Error("Invalid saved settings");
  for (const [key, entry] of Object.entries(value.history)) {
    if (
      !record(entry) ||
      !Number.isSafeInteger(entry.weekNumber) ||
      typeof entry.weekNumber !== "number" ||
      typeof entry.day !== "string" ||
      !workoutDays.includes(entry.day as WorkoutDay) ||
      typeof entry.date !== "string" ||
      !Number.isFinite(Date.parse(entry.date)) ||
      !strings(entry.exercises) ||
      !strings(entry.completedExercises) ||
      key !== historyKey(entry.weekNumber, entry.day as WorkoutDay)
    )
      throw new Error("Invalid saved workout");
    const ids = entry.exercises;
    if (
      entry.skipped !== undefined &&
      (!record(entry.skipped) ||
        !skipReasons.includes(entry.skipped.reason as SkipReason) ||
        typeof entry.skipped.date !== "string" ||
        !Number.isFinite(Date.parse(entry.skipped.date)) ||
        entry.completedExercises.length === ids.length)
    )
      throw new Error("Invalid saved skip");
    if (
      entry.completedExercises.some((id) => !ids.includes(id)) ||
      new Set(entry.completedExercises).size !==
        entry.completedExercises.length ||
      new Set(ids).size !== ids.length
    )
      throw new Error("Invalid saved completion marks");
    if (entry.exercises.some((id) => !exerciseById[id]))
      throw new Error("Unknown saved exercise");
  }
  const data = value as unknown as AppData;
  if (value.training === undefined) {
    // Existing users retain the former six-month/intermediate program. Begin
    // progression tracking now rather than promoting from historical workouts.
    data.training = {
      level: "intermediate",
      configured: true,
      autoAdvance: true,
      startedAt: new Date().toISOString(),
    };
  } else {
    const training = value.training;
    if (
      !record(training) ||
      !trainingLevels.includes(training.level as TrainingLevel) ||
      typeof training.configured !== "boolean" ||
      typeof training.autoAdvance !== "boolean" ||
      (training.startedAt !== null &&
        (typeof training.startedAt !== "string" ||
          !Number.isFinite(Date.parse(training.startedAt)))) ||
      (training.configured && training.startedAt === null) ||
      (training.promotedAt !== undefined &&
        (typeof training.promotedAt !== "string" ||
          !Number.isFinite(Date.parse(training.promotedAt))))
    )
      throw new Error("Invalid saved training profile");
  }
  // Preserve already-started legacy weeks. Only untouched current/future weeks
  // move to the new program; historical exercise IDs and completion stay intact.
  data.plans = Object.fromEntries(
    [
      ...new Set([
        ...Object.keys(data.plans),
        ...Object.values(data.history).map((entry) => String(entry.weekNumber)),
      ]),
    ].map((key) => {
      const week = Number(key);
      const saved = data.plans[key];
      if (!Number.isSafeInteger(week) || Math.abs(week) > 1_000_000)
        throw new Error("Invalid saved plan week");
      if (
        saved?.trainingLevel !== undefined &&
        !trainingLevels.includes(saved.trainingLevel)
      )
        throw new Error("Invalid saved training level");
      const started = Object.values(data.history).some(
        (entry) =>
          entry.weekNumber === week &&
          (entry.completedExercises.length > 0 || !!entry.skipped),
      );
      if (saved?.program && saved.program !== "recomposition-v1")
        throw new Error("Unknown workout program");
      const useNew =
        saved?.program === "recomposition-v1" ||
        (!started && week >= calendarWeek + data.weekOffset);
      const plan = useNew
        ? generateWeeklyWorkout(
            week,
            saved?.program === "recomposition-v1"
              ? (saved.trainingLevel ?? "intermediate")
              : data.training.level,
          )
        : generateClassicWeeklyWorkout(week);
      // Saved history is authoritative for legacy exercise membership.
      if (saved?.program === "recomposition-v1")
        for (const day of workoutDays) {
          const choices = saved.days?.[day]?.selectedAlternatives;
          if (choices === undefined) continue;
          if (!record(choices))
            throw new Error("Invalid saved exercise alternatives");
          for (const [id, alternateId] of Object.entries(choices)) {
            const exercise = plan.days[day].exercises.find((e) => e.id === id);
            if (!exercise || exercise.alternateId !== alternateId)
              throw new Error("Invalid saved exercise alternative");
            const swapped = swapExercise(plan.days[day], id);
            if (swapped === plan.days[day])
              throw new Error("Duplicate saved exercise alternative");
            plan.days[day] = swapped;
          }
        }
      if (!useNew)
        for (const day of workoutDays) {
          const entry = data.history[historyKey(week, day)];
          if (entry)
            plan.days[day].exercises = entry.exercises.map(
              (id) => exerciseById[id]!,
            );
        }
      return [key, plan];
    }),
  );
  return data;
}

export function createSaveQueue(write: (raw: string) => Promise<void>) {
  let pending = Promise.resolve();
  return (data: AppData) => {
    const raw = JSON.stringify(data);
    const next = pending.catch(() => undefined).then(() => write(raw));
    pending = next;
    return next;
  };
}
