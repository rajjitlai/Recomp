import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import {
  skipReasons,
  type SkipReason,
  type WorkoutDay,
} from "../data/exerciseTypes";
import { useWorkout } from "../context/WorkoutContext";
import { historyKey } from "../services/state";
import { generateWeeklyWorkout } from "../services/workoutRotation";
import { Button, Panel } from "./ui";

export function SkipWorkoutControl({
  week,
  day,
}: {
  week: number;
  day: WorkoutDay;
}) {
  const { data, dispatch } = useWorkout();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<SkipReason>("Holiday");
  const entry = data.history[historyKey(week, day)];
  const total = (data.plans[week] ?? generateWeeklyWorkout(week)).days[day]
    .exercises.length;
  if (entry?.completedExercises.length === total && !entry.skipped) return null;
  return (
    <View className="my-5">
      {entry?.skipped ? (
        <Panel>
          <Text className="text-lg font-bold text-white">
            Skipped · {entry.skipped.reason}
          </Text>
          <Text className="my-3 text-sm leading-6 text-muted">
            Your next scheduled workout stays unchanged. Any completed exercises
            are saved. Reopen this session to continue it.
          </Text>
          <Button
            label="Reopen workout"
            secondary
            icon="rotate-ccw"
            onPress={() => dispatch({ type: "resumeWorkout", week, day })}
          />
        </Panel>
      ) : (
        <Button
          label="Skip workout"
          secondary
          icon="minus-circle"
          onPress={() => setOpen(true)}
        />
      )}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-center bg-black/80 px-6">
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 24,
            }}
          >
            <View
              accessibilityViewIsModal
              className="w-full max-w-md gap-4 rounded-3xl border border-line bg-panel p-6"
            >
              <Text className="text-2xl font-bold text-white">
                Taking a day off?
              </Text>
              <Text className="text-sm leading-6 text-muted">
                Choose a reason. This session will be marked skipped, with
                partial progress kept. It won’t count as completed or move other
                workouts. You can reopen it anytime.
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {skipReasons.map((item) => (
                  <Pressable
                    key={item}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: reason === item }}
                    accessibilityLabel={item}
                    onPress={() => setReason(item)}
                    className={`min-h-12 justify-center rounded-xl border px-4 ${reason === item ? "border-lime bg-[#28351e]" : "border-line"}`}
                  >
                    <Text className="font-bold text-white">{item}</Text>
                  </Pressable>
                ))}
              </View>
              <Text className="text-xs leading-5 text-muted">
                Away for several days? Mark each session you’ll miss. Reminders
                stay active; turn them off in Settings while away.
              </Text>
              <Button
                label="Confirm skip"
                icon="minus-circle"
                onPress={() => {
                  dispatch({
                    type: "skipWorkout",
                    week,
                    day,
                    reason,
                    date: new Date().toISOString(),
                  });
                  setOpen(false);
                }}
              />
              <Button
                label="Cancel"
                secondary
                icon="x"
                onPress={() => setOpen(false)}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
