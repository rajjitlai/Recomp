import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import type { Exercise, WorkoutDay } from "../data/exerciseTypes";
import { ExerciseImage } from "./ExerciseImage";

export function ExerciseCard({
  exercise,
  index,
  day,
  week,
  done,
  toggle,
  timing,
  rounds,
  disabled = false,
}: {
  exercise: Exercise;
  index: number;
  day: WorkoutDay;
  week: number;
  done: boolean;
  toggle: () => void;
  timing: number;
  rounds: number;
  disabled?: boolean;
}) {
  return (
    <View
      className={`mb-3 flex-row items-center gap-3 rounded-2xl border p-3 ${done ? "border-[#556b37] bg-[#20291a]" : "border-line bg-panel"}`}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${exercise.name}`}
        onPress={() =>
          router.push({
            pathname: "/exercise/[id]",
            params: { id: exercise.id, day, week },
          })
        }
        className="flex-1 flex-row items-center gap-3"
      >
        <ExerciseImage exercise={exercise} />
        <View className="flex-1">
          <Text className="mb-1 text-[10px] font-bold uppercase tracking-[2px] text-muted">
            {String(index + 1).padStart(2, "0")} / {exercise.category}
          </Text>
          <Text className="text-base font-bold text-white">
            {exercise.name}
          </Text>
          <Text className="mt-1 text-sm text-muted">
            {rounds > 1
              ? `${timing}s work · ${rounds} rounds`
              : `${exercise.sets} ${exercise.sets === 1 ? "set" : "sets"} × ${exercise.reps} reps`}
          </Text>
          {rounds === 1 && exercise.strengthRestSeconds && (
            <Text className="mt-1 text-xs text-muted">
              Rest {exercise.strengthRestSeconds}s · {exercise.repsInReserve}{" "}
              reps left
            </Text>
          )}
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done, disabled }}
        disabled={disabled}
        style={{ opacity: disabled ? 0.4 : 1 }}
        accessibilityLabel={`Complete ${exercise.name}`}
        onPress={toggle}
        className="h-12 w-12 items-center justify-center"
      >
        <View
          className={`h-8 w-8 items-center justify-center rounded-full border ${done ? "border-lime bg-lime" : "border-[#66705d]"}`}
        >
          {done && <Feather name="check" size={18} color="#10120f" />}
        </View>
      </Pressable>
    </View>
  );
}
