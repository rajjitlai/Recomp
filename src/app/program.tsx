import { Linking, Text, View } from "react-native";
import { Label, Page, Panel, SectionTitle, Button } from "../components/ui";
import { useWorkout } from "../context/WorkoutContext";
import { trainingProfiles } from "../data/trainingLevels";
import { workoutDays } from "../data/exerciseTypes";

export default function Program() {
  const { plan } = useWorkout();
  const profile = trainingProfiles[plan.trainingLevel ?? "intermediate"];
  return (
    <Page back title="Your plan">
      <Label accent>FAT LOSS + MUSCLE GAIN</Label>
      <Text className="mt-3 text-4xl font-black text-white">
        {"Build strength.\nKeep it sustainable."}
      </Text>
      <Text className="mt-4 text-base leading-7 text-muted">
        {profile.label} plan. {profile.description} Progress depends on
        training, food, and recovery; losing fat and gaining muscle together is
        possible, but not guaranteed.
      </Text>
      <SectionTitle title="Your weekly rhythm" />
      <Panel>
        <Text className="text-base leading-8 text-white">
          {workoutDays
            .map(
              (day) =>
                `${day[0]!.toUpperCase()}${day.slice(1)} · ${plan.days[day].title}`,
            )
            .join("\n")}
          {"\n"}Sunday · Rest
        </Text>
        <Text className="mt-4 text-sm leading-6 text-muted">
          {plan.program
            ? `You are in week ${plan.blockWeek} of a four-week block.`
            : "Your already-started legacy week is preserved. This program applies to new weeks."}{" "}
          Keep the same main lifts across the block so you can compare
          performance.
        </Text>
      </Panel>
      <SectionTitle title="The muscle-building logic" />
      <Panel>
        <Text className="text-base leading-7 text-white">
          1. Use the listed working sets after warming up.{"\n"}2. Finish with
          2–3 good reps left, rather than forcing failure.{"\n"}3. Add reps
          within the range first.{"\n"}4. When every set reaches the top with
          the prescribed effort and good form, add the smallest available weight
          next session.{"\n"}5. If reps or form deteriorate, keep or reduce the
          weight.
        </Text>
        <Text className="mt-4 text-sm leading-6 text-muted">
          Week four reduces working sets as a conservative recovery default. It
          is not a requirement for everyone. Reduce volume earlier if recovery
          suffers. Use exercise notes to record weights, reps, and how the sets
          felt. Automatic level progression uses completed training weeks to
          adjust volume, but never increases your lifting weight. You can change
          level or disable automatic progression in Settings.
        </Text>
      </Panel>
      <SectionTitle title="The fat-loss logic" />
      <Panel>
        <Text className="text-base leading-7 text-white">
          Keep lifting while using a modest, sustainable calorie deficit.
          Include a protein source at meals. Avoid aggressive cuts that
          undermine training and recovery.
        </Text>
        <Text className="mt-4 text-base leading-7 text-muted">
          Gradually work toward at least 150 minutes of moderate aerobic
          activity per week, including brisk walks. The short circuits alone do
          not meet this target, and their rest periods are not automatically
          counted as activity. Adjust food and activity using trends over
          several weeks, not one weigh-in.
        </Text>
      </Panel>
      <SectionTitle title="Recover to keep progressing" />
      <Panel>
        <Text className="text-base leading-7 text-muted">
          Keep conditioning conversational rather than all-out. Prioritize
          regular sleep and your rest day. If strength keeps declining, soreness
          persists, or sessions become hard to recover from, reduce training
          stress and reassess the deficit. Stop an exercise that causes pain.
        </Text>
      </Panel>
      <SectionTitle title="Missed days and holidays" />
      <Panel>
        <Text className="text-base leading-7 text-muted">
          Open the session and choose Skip workout, then a reason. Skipped days
          stay in history without counting as completed. Your calendar schedule
          and four-week block continue normally; missed workouts are not added
          to the next day. Reopen a skipped session anytime to continue its
          saved progress. For a holiday, mark each affected session. Turn
          reminders off in Settings while away if needed.
        </Text>
      </Panel>
      <SectionTitle title="Why this setup?" />
      <Text className="mb-4 text-sm leading-6 text-muted">
        General adult guidance supports resistance training across major muscle
        groups and regular aerobic activity. The exact split, rep ranges, rest
        periods, and four-week blocks here are app programming choices, not a
        personalized medical or nutrition prescription.
      </Text>
      <View className="gap-3">
        <Button
          label="ACSM resistance-training guidance"
          secondary
          icon="external-link"
          onPress={() =>
            void Linking.openURL(
              "https://acsm.org/resistance-training-guidelines-update-2026/",
            )
          }
        />
        <Button
          label="CDC activity and weight guidance"
          secondary
          icon="external-link"
          onPress={() =>
            void Linking.openURL(
              "https://www.cdc.gov/healthy-weight-growth/physical-activity/",
            )
          }
        />
      </View>
    </Page>
  );
}
