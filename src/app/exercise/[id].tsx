import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { exerciseById } from "../../data/exercises";
import { workoutDays, type WorkoutDay } from "../../data/exerciseTypes";
import { ExerciseImage } from "../../components/ExerciseImage";
import {
  Button,
  Empty,
  Label,
  Page,
  Panel,
  SectionTitle,
} from "../../components/ui";
import { useWorkout } from "../../context/WorkoutContext";
import { generateWeeklyWorkout } from "../../services/workoutRotation";

import { historyKey } from "../../services/state";

export default function ExerciseDetail() {
  const {
    id,
    day,
    week: routeWeek,
  } = useLocalSearchParams<{ id: string; day?: string; week?: string }>();
  const { data, week: activeWeek, completed, dispatch } = useWorkout();
  const baseExercise = exerciseById[id];
  const week = routeWeek === undefined ? activeWeek : Number(routeWeek);
  const [note, setNote] = useState(data.notes[id] ?? "");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setNote(data.notes[id] ?? "");
    setSaved(false);
  }, [id]);
  if (!baseExercise)
    return (
      <Page back>
        <Empty
          title="Exercise not found"
          body="Open an exercise from your workout or the exercise library."
        />
      </Page>
    );
  const validDay =
    day && workoutDays.includes(day as WorkoutDay) ? (day as WorkoutDay) : null;
  const validWeek = Number.isSafeInteger(week) && Math.abs(week) <= 1_000_000;
  const dayPlan =
    validDay && validWeek
      ? (data.plans[week] ?? generateWeeklyWorkout(week)).days[validDay]
      : null;
  const prescribed = dayPlan?.exercises.find((e) => e.id === id);
  const exercise = prescribed ?? baseExercise;
  const inWorkout = !!prescribed;
  const lighter =
    validWeek &&
    (data.plans[week] ?? generateWeeklyWorkout(week)).blockWeek === 4;
  const done = validDay && completed(validDay, week).includes(id);
  const skipped = validDay && data.history[historyKey(week, validDay)]?.skipped;
  const circuit = (dayPlan?.rounds ?? 1) > 1 || exercise.type !== "strength";
  return (
    <Page back title="Exercise">
      <ExerciseImage key={id} exercise={exercise} large />
      <View className="mt-6">
        <Label accent>{exercise.category.toUpperCase()}</Label>
        <Text className="mb-2 mt-3 text-3xl font-black text-white">
          {exercise.name}
        </Text>
        <Text className="mb-6 text-base text-muted">{exercise.equipment}</Text>
      </View>
      <View className="flex-row gap-3">
        <Panel style={{ flex: 1 }}>
          <Label>{circuit ? "ROUNDS" : "SETS"}</Label>
          <Text className="mt-3 text-3xl font-bold text-white">
            {circuit ? (dayPlan?.rounds ?? exercise.sets) : exercise.sets}
          </Text>
        </Panel>
        <Panel style={{ flex: 1 }}>
          <Label>{circuit ? "WORK" : "REPS"}</Label>
          <Text className="mt-3 text-3xl font-bold text-white">
            {circuit ? `${data.settings.workSeconds}s` : exercise.reps}
          </Text>
        </Panel>
      </View>
      <SectionTitle title="Make every rep count." />
      {!circuit && exercise.strengthRestSeconds && (
        <Panel>
          <Text className="text-base text-lime">
            Rest {exercise.strengthRestSeconds}s between sets · Keep{" "}
            {exercise.repsInReserve} reps in reserve
          </Text>
          <Text className="mt-3 text-sm leading-6 text-muted">
            {lighter
              ? "Lighter week: keep or reduce the weight. Reassess progression at normal volume in the next block."
              : "Reach the top of the rep range on every set with good form and the same effort before adding the smallest available weight. Completion marks alone do not mean you are ready to increase."}
          </Text>
        </Panel>
      )}
      <Text className="text-base leading-7 text-muted">
        {exercise.instructions}
      </Text>
      {circuit && (
        <Text className="mt-3 text-base text-muted">
          {data.settings.restSeconds}s transition ·{" "}
          {data.settings.roundRestSeconds}s between rounds
        </Text>
      )}
      <SectionTitle title="Your notes" caption="Saved on this device" />
      <TextInput
        accessibilityLabel="Exercise notes"
        multiline
        value={note}
        onChangeText={(value) => {
          setNote(value);
          setSaved(false);
        }}
        placeholder="A setup cue, a reminder, something to remember…"
        placeholderTextColor="#747d6c"
        textAlignVertical="top"
        className="mb-3 min-h-28 rounded-2xl border border-line bg-panel p-4 text-base text-white"
      />
      <Button
        label={saved ? "Note saved" : "Save note"}
        secondary
        icon="check"
        onPress={() => {
          dispatch({ type: "note", id, note });
          setSaved(true);
        }}
      />
      {inWorkout && validDay && (
        <View className="mt-5">
          <Button
            label={
              skipped
                ? "Reopen from workout page"
                : done
                  ? "Completed — undo"
                  : "Mark complete"
            }
            icon="check-circle"
            onPress={() =>
              skipped
                ? router.push({
                    pathname: "/workout/[day]",
                    params: { day: validDay, week },
                  })
                : dispatch({
                    type: "toggle",
                    week,
                    day: validDay,
                    id,
                    date: new Date().toISOString(),
                  })
            }
          />
        </View>
      )}
    </Page>
  );
}
