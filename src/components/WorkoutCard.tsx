import { Pressable, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import type { DayPlan, WorkoutHistory } from "../data/exerciseTypes";
import { ProgressBar } from "./ProgressBar";

export function WorkoutCard({
  workout,
  week,
  done,
  today,
  skipped,
}: {
  workout: DayPlan;
  week: number;
  done: number;
  today: boolean;
  skipped?: WorkoutHistory["skipped"];
}) {
  const complete = !skipped && done === workout.exercises.length;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${workout.day}, ${workout.title}, ${skipped ? `Skipped, ${skipped.reason}, ` : ""}${done} of ${workout.exercises.length} completed`}
      onPress={() =>
        router.push({
          pathname: "/workout/[day]",
          params: { day: workout.day, week },
        })
      }
      className={`mb-3 flex-row items-center gap-4 rounded-2xl border p-4 ${today ? "border-[#778d50] bg-[#242d1c]" : "border-line bg-panel"}`}
    >
      <View className="w-11">
        <Text
          className={`text-xs font-bold uppercase tracking-widest ${today ? "text-lime" : "text-muted"}`}
        >
          {workout.day.slice(0, 3)}
        </Text>
        <Text className="mt-1 text-xs text-muted">
          {workout.rounds > 1 ? "MOVE" : "LIFT"}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold text-white">{workout.title}</Text>
        <Text className="mb-2 mt-1 text-xs text-muted">
          {skipped
            ? `Skipped · ${skipped.reason}`
            : complete
              ? "Workout complete"
              : `${done} / ${workout.exercises.length} completed`}
          {today ? " · Today" : ""}
        </Text>
        <ProgressBar value={done} total={workout.exercises.length} />
      </View>
      <Feather
        name={
          skipped
            ? "minus-circle"
            : complete
              ? "check-circle"
              : "arrow-up-right"
        }
        size={20}
        color={complete ? "#d4f77d" : "#a3aa9c"}
      />
    </Pressable>
  );
}
