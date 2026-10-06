import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useWorkout } from "../context/WorkoutContext";
import {
  programStyles,
  type ProgramStyle,
  type WeekendOrder,
  type AerobicActivity,
  workoutDays,
} from "../data/exerciseTypes";
import { programProfiles, levelDescription } from "../data/programStyles";
import { generateProgram } from "../services/programGeneration";
import { weekHasActivity } from "../services/trainingProgress";
import { Button, Panel, Label } from "./ui";
import { ConfirmDialog, type Confirmation } from "./ConfirmDialog";
export function ProgramStyleControl() {
  const { data, plan, week, dispatch } = useWorkout();
  const [program, setProgram] = useState<ProgramStyle>(
    data.training.program ?? "recomposition-v1",
  );
  const [order, setOrder] = useState<WeekendOrder>(
    data.training.weekendOrder ?? "cardio-first",
  );
  const [aerobic, setAerobic] = useState<AerobicActivity>(
    data.training.aerobicActivity ?? "walking",
  );
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  useEffect(() => {
    setProgram(data.training.program ?? "recomposition-v1");
    setOrder(data.training.weekendOrder ?? "cardio-first");
    setAerobic(data.training.aerobicActivity ?? "walking");
  }, [
    data.training.program,
    data.training.weekendOrder,
    data.training.aerobicActivity,
  ]);
  const preview = generateProgram(
    week,
    data.training.level,
    program,
    order,
    aerobic,
  );
  const changed =
    program !== (data.training.program ?? "recomposition-v1") ||
    order !== (data.training.weekendOrder ?? "cardio-first") ||
    aerobic !== (data.training.aerobicActivity ?? "walking");
  const pending =
    plan.program !== (data.training.program ?? "recomposition-v1") ||
    (plan.program !== "recomposition-v1" &&
      (plan.weekendOrder !== (data.training.weekendOrder ?? "cardio-first") ||
        plan.aerobicActivity !== (data.training.aerobicActivity ?? "walking")));
  return (
    <Panel>
      <Text className="text-lg font-bold text-white">Workout program</Text>
      <Text className="my-3 text-sm leading-6 text-muted">
        Choose your weekly routine. Your training level controls its workload;
        automatic progression changes level within the selected program.
      </Text>
      <View className="gap-3">
        {programStyles.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityState={{ checked: program === value }}
            aria-checked={program === value}
            accessibilityLabel={programProfiles[value].label}
            onPress={() => setProgram(value)}
            className={
              "rounded-2xl border p-4 " +
              (program === value
                ? "border-lime bg-[#252f1e]"
                : "border-line bg-ink")
            }
          >
            <Text className="font-bold text-white">
              {program === value ? "✓ " : ""}
              {programProfiles[value].label}
            </Text>
            <Text className="mt-2 text-sm leading-5 text-muted">
              {programProfiles[value].description}
            </Text>
          </Pressable>
        ))}
      </View>
      {program === "muscle-split-v1" && (
        <View className="mt-4 gap-2">
          <Label>Friday / Saturday</Label>
          {(["cardio-first", "arms-first"] as const).map((value) => (
            <Button
              key={value}
              label={
                (order === value ? "✓ " : "") +
                (value === "cardio-first"
                  ? "Friday cardio · Saturday arms"
                  : "Friday arms · Saturday cardio")
              }
              secondary
              onPress={() => setOrder(value)}
            />
          ))}
        </View>
      )}
      {program !== "recomposition-v1" && (
        <View className="mt-4 gap-2">
          <Label>Preferred aerobic activity</Label>
          {(["walking", "cycling"] as const).map((value) => (
            <Button
              key={value}
              label={
                (aerobic === value ? "✓ " : "") +
                (value === "walking" ? "Brisk walking" : "Comfortable cycling")
              }
              secondary
              onPress={() => setAerobic(value)}
            />
          ))}
          <Text className="text-xs leading-5 text-muted">
            Guidance only; activity minutes are not automatically tracked. Start
            with manageable bouts and build gradually.
          </Text>
        </View>
      )}
      <Text className="mt-4 text-sm leading-6 text-muted">
        {levelDescription(data.training.level, program)}
      </Text>
      <Text className="my-4 text-sm leading-7 text-white">
        {workoutDays
          .map(
            (day) =>
              day[0]!.toUpperCase() +
              day.slice(1) +
              " · " +
              preview.days[day].title +
              " · " +
              preview.days[day].exercises.length +
              " items",
          )
          .join("\n")}
        {"\nSunday · Rest"}
      </Text>
      {changed && (
        <Button
          label="Apply workout program"
          onPress={() =>
            setConfirmation({
              title: "Change workout program?",
              message:
                (weekHasActivity(data, week)
                  ? "This week has activity and keeps its saved plan. Your next untouched week uses this selection."
                  : "Your untouched current week updates now.") +
                " Earlier history and exercise notes stay saved. Level-progression counting restarts for this program.",
              label: "Apply program",
              action: () =>
                dispatch({
                  type: "programStyle",
                  program,
                  weekendOrder: order,
                  aerobicActivity: aerobic,
                  week,
                  date: new Date().toISOString(),
                }),
            })
          }
        />
      )}
      {pending && (
        <Text className="mt-3 text-sm text-lime">
          Your selected program or options apply to the next untouched week.
          This week keeps its saved routine.
        </Text>
      )}
      <ConfirmDialog
        confirmation={confirmation}
        close={() => setConfirmation(null)}
      />
    </Panel>
  );
}
