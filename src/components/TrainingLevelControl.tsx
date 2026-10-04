import { useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useWorkout } from "../context/WorkoutContext";
import { trainingLevels, type TrainingLevel } from "../data/exerciseTypes";
import { trainingProfiles } from "../data/trainingLevels";
import {
  trainingProgress,
  weekHasActivity,
} from "../services/trainingProgress";
import { Button, Panel } from "./ui";
import { ConfirmDialog, type Confirmation } from "./ConfirmDialog";

export function TrainingLevelControl() {
  const { data, week, plan, dispatch } = useWorkout();
  const [selected, setSelected] = useState<TrainingLevel>(data.training.level);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  useEffect(() => setSelected(data.training.level), [data.training.level]);
  const profile = trainingProfiles[selected];
  const progress = trainingProgress(data);
  const pending = !data.training.configured || selected !== data.training.level;
  const preserved = weekHasActivity(data, week);
  const activeLevel = plan.trainingLevel ?? "intermediate";
  const apply = () =>
    dispatch({
      type: "trainingLevel",
      level: selected,
      week,
      date: new Date().toISOString(),
    });
  return (
    <Panel>
      <Text className="text-lg font-bold text-white">
        {data.training.configured
          ? "Training level & style"
          : "Choose your starting level"}
      </Text>
      <Text className="mb-4 mt-2 text-sm leading-5 text-muted">
        Choose the workload you can recover from. You can change it anytime in
        Settings.
      </Text>
      <View className="gap-2">
        {trainingLevels.map((level) => (
          <Pressable
            key={level}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected === level }}
            accessibilityLabel={`${trainingProfiles[level].label}. ${trainingProfiles[level].schedule}`}
            onPress={() => setSelected(level)}
            className={`min-h-14 flex-row items-center gap-3 rounded-2xl border p-3 ${selected === level ? "border-lime bg-[#252f1e]" : "border-line bg-ink"}`}
          >
            <Feather
              name={selected === level ? "check-circle" : "circle"}
              size={20}
              color={selected === level ? "#d4f77d" : "#8d9586"}
            />
            <View className="flex-1">
              <Text className="font-bold text-white">
                {trainingProfiles[level].label}
              </Text>
              <Text className="mt-1 text-xs leading-5 text-muted">
                {trainingProfiles[level].schedule}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <Text className="my-4 text-sm leading-6 text-muted">
        {profile.description} Every fourth week uses fewer sets for recovery.
      </Text>
      {pending && (
        <Button
          label={`Use ${profile.label.toLowerCase()} plan`}
          icon="check"
          onPress={() => {
            if (!data.training.configured) {
              apply();
              return;
            }
            setConfirmation({
              title: `Switch to ${profile.label.toLowerCase()}?`,
              message: `${preserved ? "This week already has activity and will stay unchanged. The new style applies to your next untouched week." : "Your untouched current week will update now."} Your history and notes stay saved. The automatic-progression counter restarts for the selected level.`,
              label: "Change training level",
              action: apply,
            });
          }}
        />
      )}
      {data.training.configured &&
        preserved &&
        activeLevel !== data.training.level && (
          <Text className="mt-3 text-sm leading-5 text-lime">
            {trainingProfiles[data.training.level].label} selected for your next
            untouched week. This week keeps its{" "}
            {plan.program
              ? trainingProfiles[activeLevel].label.toLowerCase()
              : "previous"}{" "}
            plan.
          </Text>
        )}
      {data.training.promotedAt && (
        <Text className="mt-3 text-sm text-lime">
          Automatically moved to{" "}
          {trainingProfiles[data.training.level].label.toLowerCase()} on{" "}
          {new Date(data.training.promotedAt).toLocaleDateString()}.
        </Text>
      )}
      <View className="mt-5 flex-row items-center gap-3 border-t border-line pt-4">
        <View className="flex-1">
          <Text className="font-bold text-white">Automatic progression</Text>
          <Text className="mt-1 text-xs leading-5 text-muted">
            Move up after consistent months of training.
          </Text>
        </View>
        <Switch
          accessibilityLabel="Automatic training-level progression"
          value={data.training.autoAdvance}
          onValueChange={(enabled) =>
            dispatch({ type: "trainingAuto", enabled })
          }
          trackColor={{ false: "#454e3c", true: "#879f54" }}
          thumbColor="#d4f77d"
        />
      </View>
      <Text className="mt-3 text-sm leading-6 text-muted">
        {progress.nextLevel
          ? `${progress.activeWeeks} / ${progress.weeksToAdvance} active weeks toward ${trainingProfiles[progress.nextLevel].label.toLowerCase()}${data.training.autoAdvance ? "" : " · automatic changes paused"}. `
          : "Advanced is the highest level; no further automatic increase. "}
        A week counts after it ends, with 3 completed lifting sessions on
        separate dates. Beginner → intermediate takes at least 12 active weeks
        (about 3 months); intermediate → advanced takes another 24 (about 6
        months). Skips, circuits and manually advancing the week do not count.
      </Text>
      <Text className="mt-2 text-xs leading-5 text-muted">
        These are app pacing defaults, not a readiness assessment. Level changes
        adjust the plan’s workload, never your lifting weight. Turn this off or
        choose a lower level when recovery needs it.
      </Text>
      <ConfirmDialog
        confirmation={confirmation}
        close={() => setConfirmation(null)}
      />
    </Panel>
  );
}
