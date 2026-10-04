import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { workoutDays, type WorkoutDay } from "../data/exerciseTypes";
export function DaySelector({
  selected,
  week,
}: {
  selected: WorkoutDay;
  week: number;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-5"
    >
      <View className="flex-row gap-2">
        {workoutDays.map((day) => (
          <Pressable
            key={day}
            accessibilityRole="button"
            accessibilityState={{ selected: day === selected }}
            onPress={() =>
              router.replace({
                pathname: "/workout/[day]",
                params: { day, week },
              })
            }
            className={`min-h-12 min-w-14 items-center justify-center rounded-xl border px-4 ${selected === day ? "border-lime bg-lime" : "border-line bg-panel"}`}
          >
            <Text
              className={`text-xs font-bold uppercase ${selected === day ? "text-ink" : "text-muted"}`}
            >
              {day.slice(0, 3)}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
