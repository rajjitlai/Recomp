import { useState } from "react";
import { Linking, Platform, Pressable, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { Button, Label, Page, Panel, SectionTitle } from "../../components/ui";
import {
  ConfirmDialog,
  type Confirmation,
} from "../../components/ConfirmDialog";
import { useWorkout } from "../../context/WorkoutContext";
import { todayDay, weekLabel } from "../../services/workoutRotation";
import { workoutDays, type WorkoutDay } from "../../data/exerciseTypes";
import { remindersAvailable, setReminders } from "../../services/notifications";
import { version as appVersion } from "../../../package.json";
import { ProgramStyleControl } from "../../components/ProgramStyleControl";
import { TrainingLevelControl } from "../../components/TrainingLevelControl";

const authorLinks = [
  { label: "GitHub", url: "https://github.com/rajjitlai" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/rajjitlaishram" },
  { label: "Instagram", url: "https://www.instagram.com/rajjitlaishram/" },
  {
    label: "Facebook",
    url: "https://www.facebook.com/rajjitlaishram",
  },
  { label: "YouTube", url: "https://www.youtube.com/@rjinstitute.rajjit" },
];

const projectLinks = [
  {
    label: "View the source",
    description: "Explore the Recomp code and releases",
    icon: "github" as const,
    url: "https://github.com/rajjitlai/Recomp",
  },
  {
    label: "Report a bug or idea",
    description: "Share feedback or request an improvement",
    icon: "message-circle" as const,
    url: "https://github.com/rajjitlai/Recomp/issues/new",
  },
  {
    label: "Contribute to Recomp",
    description: "Read the project’s contribution guide",
    icon: "git-pull-request" as const,
    url: "https://github.com/rajjitlai/Recomp/blob/main/CONTRIBUTING.md",
  },
];

function ExternalAction({
  label,
  description,
  icon,
  url,
}: (typeof projectLinks)[number]) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${label}: ${description}`}
      className="min-h-[68px] flex-row items-center gap-3 rounded-2xl border border-line bg-ink px-3 py-3 active:opacity-75"
      onPress={() => void Linking.openURL(url)}
    >
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#252b21]">
        <Feather name={icon} size={18} color="#d4f77d" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-white">{label}</Text>
        <Text className="mt-1 text-xs leading-4 text-muted">{description}</Text>
      </View>
      <Feather name="arrow-up-right" size={17} color="#879f54" />
    </Pressable>
  );
}

function Stepper({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) {
  return (
    <View className="flex-row items-center justify-between gap-3 py-3">
      <Text className="flex-1 text-base text-white">{label}</Text>
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          disabled={value <= min}
          onPress={() => onChange(Math.max(min, value - 5))}
          className="h-12 w-12 items-center justify-center rounded-xl border border-line"
        >
          <Feather
            name="minus"
            size={18}
            color={value <= min ? "#505648" : "#d4f77d"}
          />
        </Pressable>
        <Text className="w-12 text-center font-bold text-white">{value}s</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
          disabled={value >= max}
          onPress={() => onChange(Math.min(max, value + 5))}
          className="h-12 w-12 items-center justify-center rounded-xl border border-line"
        >
          <Feather
            name="plus"
            size={18}
            color={value >= max ? "#505648" : "#d4f77d"}
          />
        </Pressable>
      </View>
    </View>
  );
}
export default function Settings() {
  const { data, week, dispatch } = useWorkout();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [resetDay, setResetDay] = useState<WorkoutDay>(todayDay() ?? "monday");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const canUseReminders = remindersAvailable();
  const toggleNotifications = async (enabled: boolean) => {
    setBusy(true);
    setMessage("");
    try {
      await setReminders(enabled);
      dispatch({ type: "settings", settings: { notifications: enabled } });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update reminders.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <Page>
      <Label>MAKE IT YOURS</Label>
      <Text className="mb-3 mt-3 text-4xl font-black text-white">
        Settings.
      </Text>
      <Text className="text-base text-muted">Your routine, on your terms.</Text>
      <SectionTitle title="Workout programs" />
      <ProgramStyleControl />
      <SectionTitle title="Your training" />
      <TrainingLevelControl />
      <SectionTitle title="Circuit timing" caption="Conditioning sessions" />
      <Panel>
        <Text className="mb-1 text-sm leading-5 text-muted">
          Tune work and recovery intervals for your conditioning circuits.
        </Text>
        <Stepper
          label="Work"
          value={data.settings.workSeconds}
          min={10}
          max={120}
          onChange={(workSeconds) =>
            dispatch({ type: "settings", settings: { workSeconds } })
          }
        />
        <Stepper
          label="Transition"
          value={data.settings.restSeconds}
          min={5}
          max={120}
          onChange={(restSeconds) =>
            dispatch({ type: "settings", settings: { restSeconds } })
          }
        />
        <Stepper
          label="Between rounds"
          value={data.settings.roundRestSeconds}
          min={60}
          max={120}
          onChange={(roundRestSeconds) =>
            dispatch({ type: "settings", settings: { roundRestSeconds } })
          }
        />
      </Panel>
      <SectionTitle title="Workout reminders" />
      <Panel>
        <View className="flex-row items-center gap-4">
          <View className="flex-1">
            <Text className="text-base font-bold text-white">
              A little nudge to show up
            </Text>
            <Text className="mt-2 text-sm leading-5 text-muted">
              {Platform.OS === "web"
                ? "Available in the Android and iOS app."
                : !canUseReminders
                  ? "Requires an Android development build; unavailable in Expo Go."
                  : "Monday–Saturday at 8:00 AM, device time."}
            </Text>
          </View>
          <Switch
            accessibilityLabel="Workout reminders"
            disabled={busy || !canUseReminders}
            value={canUseReminders && data.settings.notifications}
            onValueChange={(value) => void toggleNotifications(value)}
            trackColor={{ false: "#454e3c", true: "#879f54" }}
            thumbColor="#d4f77d"
          />
        </View>
        {message !== "" && (
          <Text
            accessibilityRole="alert"
            className="mt-3 text-sm text-[#efc6a4]"
          >
            {message}
          </Text>
        )}
      </Panel>
      <SectionTitle title="Your program" caption={weekLabel(week)} />
      <View className="gap-3">
        <Button
          label="Workout + health guide"
          secondary
          icon="target"
          onPress={() => router.push("/program")}
        />
        <Button
          label="View exercise library"
          secondary
          icon="book-open"
          onPress={() => router.push("/library")}
        />
        <Button
          label="Regenerate current week"
          secondary
          icon="refresh-cw"
          onPress={() =>
            setConfirmation({
              title: "Rebuild this week?",
              message:
                "The same week produces the same exercises. This refreshes the saved plan and keeps your completion history. Your main lifts stay consistent for a four-week block.",
              label: "Rebuild plan",
              action: () => {
                dispatch({ type: "regenerate", week });
                setMessage("This week’s plan has been rebuilt.");
              },
            })
          }
        />
        <Button
          label="Start a new week"
          secondary
          icon="arrow-right"
          onPress={() =>
            setConfirmation({
              title: "Move to the next week?",
              message:
                "Advance your program by one week. Exercises change at the next four-week block; week four uses fewer sets. Your previous progress stays in History. This adds one week to your calendar offset.",
              label: "Start next week",
              action: () => dispatch({ type: "newWeek" }),
            })
          }
        />
      </View>
      <SectionTitle title="Reset progress" />
      <Panel>
        <Text className="mb-4 text-sm leading-5 text-muted">
          Choose the workout to reset. Other days stay saved.
        </Text>
        <View className="mb-4 flex-row flex-wrap gap-2">
          {workoutDays.map((day) => (
            <Pressable
              key={day}
              accessibilityRole="button"
              accessibilityState={{ selected: day === resetDay }}
              onPress={() => setResetDay(day)}
              className={`min-h-12 items-center justify-center rounded-xl px-3 ${day === resetDay ? "bg-lime" : "bg-ink"}`}
            >
              <Text
                className={`text-xs font-bold uppercase ${day === resetDay ? "text-ink" : "text-muted"}`}
              >
                {day.slice(0, 3)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Button
          label="Reset selected workout"
          secondary
          icon="rotate-ccw"
          onPress={() =>
            setConfirmation({
              title: `Reset ${resetDay}?`,
              message:
                "Clear completion marks for this workout in the current week. Your exercise notes will be kept.",
              label: "Reset workout",
              action: () =>
                dispatch({ type: "resetWorkout", week, day: resetDay }),
            })
          }
        />
        <View className="mt-3">
          <Button
            label="Reset all history"
            secondary
            icon="trash-2"
            onPress={() =>
              setConfirmation({
                title: "Delete all workout history?",
                message:
                  "This clears every completion mark and past session on this device, including the activity counted toward automatic level progression. It cannot be undone. Your current level, plans, notes, and settings will be kept.",
                label: "Delete all history",
                action: () => dispatch({ type: "clearHistory" }),
              })
            }
          />
        </View>
      </Panel>
      <SectionTitle title="About the author" />
      <Panel>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">
              Rajjit Laishram
            </Text>
            <Text className="mt-1 text-sm font-semibold leading-5 text-lime">
              Drone Software Developer · Autonomous Systems Engineer
            </Text>
          </View>
          <View className="rounded-full border border-line px-3 py-1.5">
            <Text className="text-[10px] font-bold tracking-wider text-muted">
              CREATOR
            </Text>
          </View>
        </View>
        <Text className="mt-3 text-sm leading-5 text-muted">
          Based in Manipur, Rajjit works as a Project Assistant at NIELIT
          Imphal’s Drone Electronics Lab. He builds autonomous drone software,
          ground control systems, and IoT and edge-AI tools that connect
          intelligent software with real-world hardware.
        </Text>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Visit rajjitlaishram.netlify.app"
          className="mt-3 min-h-11 flex-row items-center gap-2"
          onPress={() =>
            void Linking.openURL("https://rajjitlaishram.netlify.app")
          }
        >
          <Text className="text-sm font-semibold text-lime">
            rajjitlaishram.netlify.app
          </Text>
          <Feather name="external-link" size={14} color="#d4f77d" />
        </Pressable>
        <Text className="mb-2 mt-3 text-xs font-bold uppercase tracking-wider text-muted">
          Connect
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {authorLinks.map(({ label, url }) => (
            <Pressable
              key={label}
              accessibilityRole="link"
              accessibilityLabel={`Visit Rajjit on ${label}`}
              className="min-h-11 flex-row items-center gap-2 rounded-xl border border-line bg-ink px-3"
              onPress={() => void Linking.openURL(url)}
            >
              <Text className="text-sm font-semibold text-white">{label}</Text>
              <Feather name="external-link" size={12} color="#d4f77d" />
            </Pressable>
          ))}
        </View>
      </Panel>
      <SectionTitle title="Support & contribute" caption="Open source" />
      <Panel>
        <Text className="mb-4 text-sm leading-5 text-muted">
          Recomp is open source under the MIT License. Found a bug, have an
          idea, or want to help improve it? Start here.
        </Text>
        <View className="gap-2.5">
          {projectLinks.map((link) => (
            <ExternalAction key={link.label} {...link} />
          ))}
        </View>
      </Panel>
      <Text className="mt-7 text-center text-xs leading-5 text-muted">
        RECOMP / VERSION {appVersion}
        {"\n"}Offline by design. Your progress lives on this device.
      </Text>
      <ConfirmDialog
        confirmation={confirmation}
        close={() => setConfirmation(null)}
      />
    </Page>
  );
}
