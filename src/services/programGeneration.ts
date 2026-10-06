import { pools } from "../data/exercises";
import type {
  Exercise,
  WeeklyPlan,
  TrainingLevel,
  ProgramStyle,
  WeekendOrder,
  AerobicActivity,
  WorkoutDay,
} from "../data/exerciseTypes";
import { workoutDays } from "../data/exerciseTypes";
import {
  splitChest,
  splitTriceps,
  splitBack,
  splitBiceps,
  splitLegs,
  splitShoulders,
  healthStrength,
  type Pair,
} from "../data/additionalPrograms";
import { generateWeeklyWorkout } from "./workoutRotation";

export function generateProgram(
  week: number,
  level: TrainingLevel,
  program: ProgramStyle = "recomposition-v1",
  weekendOrder: WeekendOrder = "cardio-first",
  aerobicActivity: AerobicActivity = "walking",
): WeeklyPlan {
  if (program === "recomposition-v1") return generateWeeklyWorkout(week, level);
  const base = generateWeeklyWorkout(week, level);
  const block = Math.floor(week / 4);
  const lighter = base.blockWeek === 4;
  const strength = (pairs: Pair[]): Exercise[] =>
    pairs.map((slot, index) => {
      const options = slot.names.map((name) => {
        const e = pools[slot.pool].find((e) => e.name === name);
        if (!e) throw new Error("Missing program exercise: " + name);
        return e;
      });
      const position = ((block % 2) + 2) % 2;
      const exercise = options[position]!;
      const sets =
        program === "muscle-split-v1"
          ? level === "beginner"
            ? 1
            : level === "advanced" || index < 2
              ? 2
              : 1
          : level === "beginner" && index >= 4
            ? 1
            : 2;
      return {
        ...exercise,
        alternateId: options[1 - position]!.id,
        sets: Math.max(1, sets - (lighter ? 1 : 0)),
        reps: slot.reps!,
        strengthRestSeconds: slot.rest!,
        repsInReserve:
          level === "beginner" || lighter || base.blockWeek === 1 ? 3 : 2,
      };
    });
  const cardio = generateWeeklyWorkout(week, "beginner").days.tuesday;
  const warmup =
    "Warm up for 5–10 minutes at an easy pace, then rehearse the first lift with light warm-up sets. Working sets are listed separately. For one-sided movements, perform the target reps on each side. Rest 60–120 seconds as shown, longer if needed. Stop movements that cause pain. ";
  const liftingGuide =
    warmup +
    (lighter
      ? "Recovery week: reduced sets where possible; use lighter loads and keep at least 3 good reps left. "
      : "Keep 2–3 good reps left. Build reps within the range, then add the smallest suitable weight only when every set is controlled. ");
  const aerobic =
    "Build gradually toward 150–300 minutes of moderate activity per week. " +
    (aerobicActivity === "cycling"
      ? "Try 20–30 minutes of comfortable cycling; use a stationary bike or a safe route."
      : "Try 20–30 minutes of brisk walking on a comfortable route.") +
    " Start with 5–10 minutes if needed. You should be able to talk. Spread activity across the week; these short circuits alone do not meet the weekly target. Finish with 3–5 easy minutes.";
  const arms = [...splitBiceps.slice(0, 3), ...splitTriceps.slice(0, 3)];
  const cardioDay = weekendOrder === "arms-first" ? "saturday" : "friday";
  const entries = workoutDays.map((day) => {
    if (program === "general-health-v1") {
      const lift = ["monday", "wednesday", "friday"].includes(day);
      return [
        day,
        lift
          ? {
              day,
              title:
                "Full-body health · " +
                (day === "monday" ? "A" : day === "wednesday" ? "B" : "C"),
              subtitle: "6 movements · legs, push, pull and trunk control",
              exercises: strength(healthStrength),
              rounds: 1,
              guidance:
                liftingGuide +
                "Use a comfortable range of motion. Finish with easy walking and gentle mobility. " +
                aerobic,
            }
          : {
              ...cardio,
              day,
              optional: true,
              title: "Optional movement + mobility",
              subtitle: "6 easy movements · walking or cycling encouraged",
              guidance:
                aerobic +
                " The circuit is optional: choose it, a walk/ride, or rest. Add 3–5 minutes of gentle ankle, hip and shoulder movement without forcing range.",
            },
      ];
    }
    if (day === cardioDay)
      return [
        day,
        {
          ...cardio,
          day,
          title: "Cardio + core",
          subtitle: "6 easy movements · 2 rounds",
          guidance:
            aerobic +
            " Keep this circuit conversational. March instead of jumping; shorten intervals or rest more when needed.",
        },
      ];
    const pairs =
      day === "monday"
        ? [...splitChest, ...splitTriceps]
        : day === "tuesday"
          ? [...splitBack, ...splitBiceps]
          : day === "wednesday"
            ? splitLegs
            : day === "thursday"
              ? splitShoulders
              : arms;
    const title =
      day === "monday"
        ? "Chest + Triceps"
        : day === "tuesday"
          ? "Back + Biceps"
          : day === "wednesday"
            ? "Leg Day"
            : day === "thursday"
              ? "Shoulders"
              : "Arms";
    const subtitle =
      day === "monday"
        ? "5 chest + 4 triceps · 9 movements"
        : day === "tuesday"
          ? "5 back + 4 biceps · 9 movements"
          : day === "thursday"
            ? "5 shoulder + 1 trap · 6 movements"
            : "6 movements · controlled working sets";
    return [
      day,
      {
        day,
        title,
        subtitle,
        exercises: strength(pairs),
        rounds: 1,
        guidance:
          liftingGuide +
          "This is a high-variety split: the small set count is intentional. Do not multiply it to 3–4 sets for every movement. If soreness or performance worsens, reduce work or take a rest day. Arms already work during chest and back sessions. " +
          (day === "thursday"
            ? "Keep shoulder raises in a comfortable range and avoid forcing overhead motion. "
            : "") +
          "Sunday is rest. " +
          aerobic,
      },
    ];
  });
  return {
    ...base,
    program,
    weekendOrder,
    aerobicActivity,
    days: Object.fromEntries(entries) as Record<
      WorkoutDay,
      WeeklyPlan["days"][WorkoutDay]
    >,
  };
}
