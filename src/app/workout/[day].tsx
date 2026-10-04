import { getPlan } from "../../services/trainingProgress";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Page, Label, Panel, Empty } from "../../components/ui";
import { ProgressBar } from "../../components/ProgressBar";
import { ExerciseCard } from "../../components/ExerciseCard";
import { DaySelector } from "../../components/DaySelector";
import { SkipWorkoutControl } from "../../components/SkipWorkoutControl";
import { historyKey } from "../../services/state";
import { useWorkout } from "../../context/WorkoutContext";
import { workoutDays, type WorkoutDay } from "../../data/exerciseTypes";
import { weekLabel } from "../../services/workoutRotation";

export default function Workout() {
  const params = useLocalSearchParams<{ day: string; week?: string }>();
  const { data, week: activeWeek, completed, dispatch } = useWorkout();
  const week = params.week === undefined ? activeWeek : Number(params.week);
  if (
    !workoutDays.includes(params.day as WorkoutDay) ||
    !Number.isSafeInteger(week) ||
    Math.abs(week) > 1_000_000
  )
    return (
      <Page back>
        <Empty
          title="Workout not found"
          body="Choose a day from your training week."
        />
      </Page>
    );
  const day = params.day as WorkoutDay;
  const plan = getPlan(data, week);
  const workout = plan.days[day];
  const done = completed(day, week);
  const skipped = data.history[historyKey(week, day)]?.skipped;
  return (
    <Page back title="Workout">
      <Label>{weekLabel(week)}</Label>
      <Text className="mb-2 mt-3 text-4xl font-black text-white">
        {workout.title}
      </Text>
      <Text className="mb-6 text-base text-muted">{workout.subtitle}</Text>
      <DaySelector selected={day} week={week} />
      <SkipWorkoutControl key={`${week}:${day}`} week={week} day={day} />
      {workout.guidance && (
        <View className="mb-5">
          <Panel>
            <Label accent>
              {plan.blockWeek === 4
                ? "LIGHTER WEEK"
                : `BUILD PHASE · WEEK ${plan.blockWeek} OF 4`}
            </Label>
            <Text className="mt-3 text-sm leading-6 text-muted">
              {workout.guidance}
            </Text>
          </Panel>
        </View>
      )}
      <Panel>
        <View className="mb-3 flex-row justify-between">
          <Text className="font-bold text-white">
            {skipped
              ? "Progress before skipping"
              : done.length === workout.exercises.length
                ? "Session complete. Well done."
                : "Your session"}
          </Text>
          <Text className="font-bold text-lime">
            {done.length} / {workout.exercises.length}
          </Text>
        </View>
        <ProgressBar value={done.length} total={workout.exercises.length} />
        {workout.rounds > 1 && (
          <Text className="mt-4 text-sm leading-6 text-muted">
            {workout.rounds} rounds · {data.settings.workSeconds}s work ·{" "}
            {data.settings.restSeconds}s transition{"\n"}Rest{" "}
            {data.settings.roundRestSeconds}s between rounds. Check off each
            movement after all {workout.rounds} rounds.
          </Text>
        )}
      </Panel>
      <View className="mt-6">
        {plan.program && (
          <Text className="mb-4 text-sm leading-6 text-muted">
            Choose one exercise per slot, not both. Use an alternative when
            equipment is unavailable; select a suitable weight for that
            movement. Tap the selected exercise for instructions.
          </Text>
        )}
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index}
            day={day}
            week={week}
            done={done.includes(exercise.id)}
            disabled={!!skipped}
            timing={data.settings.workSeconds}
            rounds={workout.rounds}
            swap={() =>
              dispatch({ type: "swapExercise", week, day, id: exercise.id })
            }
            toggle={() =>
              dispatch({
                type: "toggle",
                week,
                day,
                id: exercise.id,
                date: new Date().toISOString(),
              })
            }
          />
        ))}
      </View>
      <Text className="mt-2 text-center text-xs text-muted">
        Progress is saved on this device.
      </Text>
    </Page>
  );
}
