import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkout } from "../context/WorkoutContext";
import {
  trainingLevels,
  programStyles,
  workoutDays,
  type TrainingLevel,
  type ProgramStyle,
  type WeekendOrder,
  type AerobicActivity,
} from "../data/exerciseTypes";
import { trainingProfiles } from "../data/trainingLevels";
import { programProfiles, levelDescription } from "../data/programStyles";
import { generateProgram } from "../services/programGeneration";
import { Button, Label, Panel } from "./ui";

function Choice({
  label,
  description,
  selected,
  onPress,
}: {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      aria-checked={selected}
      onPress={onPress}
      className={
        "rounded-2xl border p-4 " +
        (selected ? "border-lime bg-[#252f1e]" : "border-line bg-panel")
      }
    >
      <Text className="text-base font-bold text-white">
        {selected ? "✓ " : ""}
        {label}
      </Text>
      <Text className="mt-2 text-sm leading-6 text-muted">{description}</Text>
    </Pressable>
  );
}
export function JourneySetup() {
  const { data, week, dispatch } = useWorkout();
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState<TrainingLevel>(data.training.level);
  const [program, setProgram] = useState<ProgramStyle>(
    data.training.program ?? "recomposition-v1",
  );
  const [order, setOrder] = useState<WeekendOrder>(
    data.training.weekendOrder ?? "cardio-first",
  );
  const [aerobic, setAerobic] = useState<AerobicActivity>(
    data.training.aerobicActivity ?? "walking",
  );
  const [auto, setAuto] = useState(data.training.autoAdvance);
  const scroll = useRef<ScrollView>(null);
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [step]);
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step === 0) return false;
      setStep(step - 1);
      return true;
    });
    return () => sub.remove();
  }, [step]);
  const preview = generateProgram(week, level, program, order, aerobic);
  const titles = [
    "Start your journey.",
    "Choose your routine.",
    "Make it yours.",
    "Your plan is ready.",
  ];
  const descriptions = [
    "Tell us where you are starting. Choose the workload you can recover from; you can change it later.",
    "Choose the setup that fits your goal and available training days.",
    "Set your preferences before your first workout.",
    "Review your week. Everything here can be adjusted in Settings.",
  ];
  return (
    <SafeAreaView className="flex-1 bg-ink">
      <ScrollView ref={scroll} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full max-w-2xl self-center gap-5 px-5 py-8">
          <Text className="text-2xl font-black text-white">
            recomp<Text className="text-lime">.</Text>
          </Text>
          <Label accent>YOUR JOURNEY · STEP {step + 1} OF 4</Label>
          <View className="flex-row gap-2">
            {titles.map((_, i) => (
              <View
                key={i}
                className={
                  "h-1 flex-1 rounded-full " +
                  (i <= step ? "bg-lime" : "bg-line")
                }
              />
            ))}
          </View>
          <Text
            accessibilityRole="header"
            className="text-4xl font-black text-white"
          >
            {titles[step]}
          </Text>
          <Text className="text-base leading-6 text-muted">
            {descriptions[step]}
          </Text>
          {step === 0 && (
            <View className="gap-3">
              {trainingLevels.map((value) => (
                <Choice
                  key={value}
                  label={trainingProfiles[value].label}
                  description={
                    value === "beginner"
                      ? "New to lifting or returning after a long break. Start with manageable volume and practise technique."
                      : value === "intermediate"
                        ? "Training consistently and comfortable with the main movements. Ready for moderate volume."
                        : "Experienced with reliable technique and recovery. Comfortable managing higher training demands."
                  }
                  selected={level === value}
                  onPress={() => setLevel(value)}
                />
              ))}
            </View>
          )}
          {step === 1 && (
            <View className="gap-3">
              {programStyles.map((value) => (
                <Choice
                  key={value}
                  label={programProfiles[value].label}
                  description={programProfiles[value].description}
                  selected={program === value}
                  onPress={() => setProgram(value)}
                />
              ))}
              <Panel>
                <Text className="text-sm leading-6 text-muted">
                  {levelDescription(level, program)}
                </Text>
              </Panel>
            </View>
          )}
          {step === 2 && (
            <View className="gap-5">
              {program === "muscle-split-v1" && (
                <View className="gap-3">
                  <Label>Friday and Saturday</Label>
                  <Choice
                    label="Cardio Friday · Arms Saturday"
                    description="Keep your cardio session before your arm session."
                    selected={order === "cardio-first"}
                    onPress={() => setOrder("cardio-first")}
                  />
                  <Choice
                    label="Arms Friday · Cardio Saturday"
                    description="End the training week with easy conditioning."
                    selected={order === "arms-first"}
                    onPress={() => setOrder("arms-first")}
                  />
                </View>
              )}
              {program !== "recomposition-v1" && (
                <View className="gap-3">
                  <Label>Preferred aerobic activity</Label>
                  <Choice
                    label="Walking"
                    description="Use walking for your aerobic activity guidance."
                    selected={aerobic === "walking"}
                    onPress={() => setAerobic("walking")}
                  />
                  <Choice
                    label="Cycling"
                    description="Use comfortable cycling for your aerobic activity guidance."
                    selected={aerobic === "cycling"}
                    onPress={() => setAerobic("cycling")}
                  />
                </View>
              )}
              <Panel>
                <View className="flex-row items-center gap-4">
                  <Text className="flex-1 text-base font-bold text-white">
                    Automatic level progression
                  </Text>
                  <Switch
                    accessibilityLabel="Automatic level progression"
                    value={auto}
                    onValueChange={setAuto}
                    trackColor={{ false: "#454e3c", true: "#879f54" }}
                    thumbColor="#d4f77d"
                  />
                </View>
                <Text className="mt-3 text-sm leading-6 text-muted">
                  Move from Beginner after 12 active weeks, then to Advanced
                  after another 24. A week counts with 3 completed lifting
                  sessions on separate dates, after the week ends. Skips and
                  circuits do not count. This adjusts your plan’s volume, never
                  your lifting weight. You can turn it off anytime.
                </Text>
              </Panel>
              <Text className="text-sm leading-6 text-muted">
                Notifications start off. You can enable workout reminders in
                Settings when you are ready.
              </Text>
            </View>
          )}
          {step === 3 && (
            <View className="gap-4">
              <Panel>
                <Text className="text-xl font-bold text-white">
                  {programProfiles[program].label}
                </Text>
                <Text className="mt-2 text-base text-lime">
                  {trainingProfiles[level].label}
                </Text>
                <Text className="mt-3 text-sm leading-6 text-muted">
                  {levelDescription(level, program)}
                </Text>
                <Text className="mt-3 text-sm text-muted">
                  Automatic progression: {auto ? "On" : "Off"}
                </Text>
                {program !== "recomposition-v1" && (
                  <Text className="mt-2 text-sm text-muted">
                    Aerobic preference: {aerobic}
                  </Text>
                )}
              </Panel>
              <Panel>
                {workoutDays.map((day) => (
                  <View key={day} className="mb-3">
                    <Text className="text-xs font-bold uppercase text-muted">
                      {day}
                    </Text>
                    <Text className="mt-1 text-base text-white">
                      {preview.days[day].title} ·{" "}
                      {preview.days[day].exercises.length} items
                    </Text>
                  </View>
                ))}
                <Text className="text-base text-lime">
                  Sunday · Rest and recovery
                </Text>
              </Panel>
              <Text className="text-sm leading-6 text-muted">
                Your plan follows the current calendar week. Start with today’s
                session; earlier days do not need to be made up. Your progress
                is saved on this device.
              </Text>
            </View>
          )}
          <Button
            label={step === 3 ? "Start my journey" : "Continue"}
            onPress={() => {
              if (step < 3) setStep(step + 1);
              else
                dispatch({
                  type: "completeJourney",
                  level,
                  program,
                  weekendOrder: order,
                  aerobicActivity: aerobic,
                  autoAdvance: auto,
                  week,
                  date: new Date().toISOString(),
                });
            }}
          />
          {step > 0 && (
            <Button
              label="Back"
              secondary
              icon="arrow-left"
              onPress={() => setStep(step - 1)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
