import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useWorkout } from "../../context/WorkoutContext";
import { workoutDays } from "../../data/exerciseTypes";

import { historyKey } from "../../services/state";
import {
  generateWeeklyWorkout,
  weekLabel,
} from "../../services/workoutRotation";
import { Empty, Label, Panel } from "../../components/ui";

export default function History() {
  const { data, week } = useWorkout();
  const weeks = [
    ...new Set([
      week,
      ...Object.values(data.history).map((entry) => entry.weekNumber),
    ]),
  ].sort((a, b) => b - a);
  const finished = Object.values(data.history).filter(
    (entry) =>
      !entry.skipped &&
      entry.completedExercises.length === entry.exercises.length &&
      entry.exercises.length > 0,
  ).length;
  return (
    <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-ink">
      <FlatList
        data={weeks}
        keyExtractor={(item) => String(item)}
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 40,
          maxWidth: 1000,
          width: "100%",
          alignSelf: "center",
        }}
        ListHeaderComponent={
          <View className="mb-6 mt-4">
            <Label>THE WORK ADDS UP</Label>
            <Text className="mb-3 mt-3 text-4xl font-black text-white">
              Your history.
            </Text>
            <Text className="mb-6 text-base text-muted">
              {finished} completed {finished === 1 ? "session" : "sessions"}.{" "}
              {
                Object.values(data.history).filter((entry) => entry.skipped)
                  .length
              }{" "}
              skipped.
            </Text>
            {Object.keys(data.history).length === 0 && (
              <Empty
                title="Your story starts here."
                body="Complete your first exercise and your progress will appear below. Every week stays saved on this device."
              />
            )}
          </View>
        }
        renderItem={({ item: targetWeek }) => (
          <View className="mb-5">
            <Panel>
              <Label accent>
                {weekLabel(targetWeek)}
                {targetWeek === week ? " / CURRENT" : ""}
              </Label>
              <View className="mt-3">
                {workoutDays.map((day) => {
                  const workout = (
                    data.plans[targetWeek] ?? generateWeeklyWorkout(targetWeek)
                  ).days[day];
                  const entry = data.history[historyKey(targetWeek, day)];
                  const count = entry?.completedExercises.length ?? 0;
                  const total =
                    entry?.exercises.length ?? workout.exercises.length;
                  return (
                    <Pressable
                      key={day}
                      accessibilityRole="button"
                      accessibilityLabel={`View ${day} workout for ${weekLabel(targetWeek)}${entry?.skipped ? `, skipped, ${entry.skipped.reason}` : ""}`}
                      onPress={() =>
                        router.push({
                          pathname: "/workout/[day]",
                          params: { day, week: targetWeek },
                        })
                      }
                      className="min-h-16 flex-row items-center gap-3 border-b border-line py-4"
                    >
                      <Feather
                        name={
                          entry?.skipped
                            ? "minus-circle"
                            : count === total
                              ? "check-circle"
                              : count > 0
                                ? "clock"
                                : "circle"
                        }
                        size={19}
                        color={count === total ? "#d4f77d" : "#8d9586"}
                      />
                      <View className="flex-1">
                        <Text className="text-xs capitalize text-muted">
                          {day}
                        </Text>
                        <Text className="mt-1 text-sm font-bold text-white">
                          {workout.title}
                        </Text>
                        {entry?.skipped && (
                          <Text className="mt-1 text-xs text-muted">
                            Skipped · {entry.skipped.reason}
                          </Text>
                        )}
                      </View>
                      <Text className="text-xs text-muted">
                        {count}/{total}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Panel>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
