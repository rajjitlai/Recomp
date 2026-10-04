import { Text, View, useWindowDimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useWorkout } from "../../context/WorkoutContext";
import { workoutDays } from "../../data/exerciseTypes";
import { todayDay, weekLabel } from "../../services/workoutRotation";
import { Button, Label, Page, Panel, SectionTitle } from "../../components/ui";
import { WorkoutCard } from "../../components/WorkoutCard";
import { ProgressBar } from "../../components/ProgressBar";

import { historyKey } from "../../services/state";
export default function Home() {
  const { data, plan, week, completed } = useWorkout();
  const wide = useWindowDimensions().width >= 850;
  const today = todayDay();
  const workout = plan.days[today ?? "monday"];
  const completeDays = workoutDays.filter(
    (day) =>
      !data.history[historyKey(week, day)]?.skipped &&
      completed(day).length === plan.days[day].exercises.length,
  ).length;
  const completeExercises = workoutDays.reduce(
    (sum, day) => sum + completed(day).length,
    0,
  );
  const skippedDays = workoutDays.filter(
    (day) => data.history[historyKey(week, day)]?.skipped,
  ).length;
  const todaySkipped = today && data.history[historyKey(week, today)]?.skipped;
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "GOOD MORNING" : hour < 17 ? "GOOD AFTERNOON" : "GOOD EVENING";
  return (
    <Page>
      <Label>{greeting} / LET’S BUILD CONSISTENCY</Label>
      <Text className="mb-2 mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
        Show up. Get stronger.
      </Text>
      <Text className="mb-7 text-base text-muted">
        Build muscle. Support fat loss. Recover well.
      </Text>
      <View style={{ flexDirection: wide ? "row" : "column", gap: 28 }}>
        <View style={{ flex: wide ? 1.1 : undefined }}>
          <View className="overflow-hidden rounded-3xl border border-[#657a45] bg-[#28351e] p-6 md:p-8">
            <View className="flex-row items-center justify-between">
              <Label accent>
                {today ? "TODAY’S WORKOUT" : "SUNDAY / RECOVERY"}
              </Label>
              <Feather name={today ? "zap" : "sun"} size={22} color="#d4f77d" />
            </View>
            <Text className="mt-9 text-sm capitalize text-[#c2ceb3]">
              {today ?? "Rest day"}
            </Text>
            <Text className="mb-4 mt-2 text-4xl font-black leading-[44px] tracking-tight text-white">
              {today ? workout.title : "Rest. Recover.\nCome back stronger."}
            </Text>
            <Text className="mb-8 text-base leading-6 text-[#c2ceb3]">
              {today
                ? todaySkipped
                  ? `Skipped · ${todaySkipped.reason}`
                  : workout.subtitle
                : `Recharge today. Your ${plan.days.monday.title} session is ready when you are.`}
            </Text>
            <View className="mb-7 flex-row gap-8 border-t border-[#495b35] pt-5">
              <View>
                <Text className="text-2xl font-bold text-white">
                  {today
                    ? workout.exercises.length.toString().padStart(2, "0")
                    : "06"}
                </Text>
                <Text className="mt-1 text-xs text-[#c2ceb3]">
                  {today ? "Exercises" : "Training days"}
                </Text>
              </View>
              <View>
                <Text className="text-2xl font-bold text-white">
                  {workout.rounds > 1
                    ? String(workout.rounds).padStart(2, "0")
                    : "01"}
                </Text>
                <Text className="mt-1 text-xs text-[#c2ceb3]">
                  {workout.rounds > 1 ? "Rounds" : "Session at a time"}
                </Text>
              </View>
            </View>
            <Button
              label={
                today
                  ? todaySkipped
                    ? "View skipped workout"
                    : completed(today).length
                      ? "Continue workout"
                      : "Start workout"
                  : "View Monday’s workout"
              }
              onPress={() =>
                router.push({
                  pathname: "/workout/[day]",
                  params: { day: today ?? "monday", week },
                })
              }
            />
          </View>
          <View className="mt-5">
            <Button
              label="Your muscle + fat-loss plan"
              secondary
              icon="target"
              onPress={() => router.push("/program")}
            />
          </View>
          <SectionTitle title="Small steps. Real progress." />
          <Panel>
            <View className="mb-5 flex-row justify-between">
              <View>
                <Text className="text-3xl font-bold text-lime">
                  {completeDays}
                  <Text className="text-lg text-muted"> / 6</Text>
                </Text>
                <Text className="mt-1 text-sm text-muted">
                  Sessions completed
                </Text>
              </View>
              <Feather name="trending-up" size={28} color="#d4f77d" />
            </View>
            <ProgressBar value={completeDays} total={6} />
            <Text className="mt-3 text-sm text-muted">
              {skippedDays} skipped · {6 - completeDays - skippedDays} sessions
              remaining
            </Text>
            <Text className="mt-4 text-sm text-muted">
              {completeExercises} of{" "}
              {workoutDays.reduce(
                (sum, day) => sum + plan.days[day].exercises.length,
                0,
              )}{" "}
              exercises completed this week
            </Text>
          </Panel>
          <View className="mt-5 flex-row items-start gap-3 px-1">
            <Feather name="refresh-cw" size={17} color="#a3aa9c" />
            <Text className="flex-1 text-sm leading-5 text-muted">
              {plan.program
                ? `Four lifting days. Two conditioning days. Week ${plan.blockWeek} of 4${plan.blockWeek === 4 ? " — lighter volume for recovery" : " — build quality reps before adding weight"}.`
                : "Your started week stays unchanged. The new muscle + fat-loss program begins next week."}
            </Text>
          </View>
        </View>
        <View style={{ flex: wide ? 1 : undefined }}>
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">This week</Text>
            <Text className="text-xs text-muted">{weekLabel(week)}</Text>
          </View>
          {workoutDays.map((day) => (
            <WorkoutCard
              key={day}
              workout={plan.days[day]}
              week={week}
              done={completed(day).length}
              skipped={data.history[historyKey(week, day)]?.skipped}
              today={day === today}
            />
          ))}
          <View className="flex-row items-center gap-4 px-4 py-3">
            <Text className="w-11 text-xs font-bold tracking-widest text-muted">
              SUN
            </Text>
            <Text className="flex-1 text-sm text-muted">Rest & recovery</Text>
            <Feather name="moon" size={17} color="#a3aa9c" />
          </View>
        </View>
      </View>
    </Page>
  );
}
