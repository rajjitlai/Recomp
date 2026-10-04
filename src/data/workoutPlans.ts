import type { WorkoutDay } from "./exerciseTypes";

export const split: Record<
  WorkoutDay,
  { title: string; subtitle: string; short: string }
> = {
  monday: {
    title: "Chest + Triceps",
    subtitle: "6 chest · 3 triceps",
    short: "Push day",
  },
  tuesday: {
    title: "Back + Biceps",
    subtitle: "6 back · 3 biceps",
    short: "Pull day",
  },
  wednesday: {
    title: "Legs",
    subtitle: "Quads · hamstrings · glutes · calves",
    short: "Lower body",
  },
  thursday: {
    title: "Shoulders + Traps",
    subtitle: "6 shoulders · 3 traps",
    short: "Upper body",
  },
  friday: {
    title: "Arms + Accessories",
    subtitle: "6 biceps · 3 triceps",
    short: "Arms day",
  },
  saturday: {
    title: "Cardio Circuit",
    subtitle: "9 movements · 3 rounds",
    short: "Conditioning",
  },
};
