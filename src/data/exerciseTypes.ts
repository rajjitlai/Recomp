import type { ImageSourcePropType } from "react-native";

export type ExerciseCategory =
  | "chest"
  | "triceps"
  | "back"
  | "biceps"
  | "shoulders"
  | "traps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "cardio"
  | "core";
export type Pool =
  | Exclude<ExerciseCategory, "hamstrings" | "glutes" | "cardio">
  | "posterior"
  | "conditioning"
  | "bodyweight";
export interface Exercise {
  alternateId?: string;
  id: string;
  name: string;
  category: ExerciseCategory;
  secondaryCategories: ExerciseCategory[];
  pool: Pool;
  movementPattern:
    | "strength"
    | "push"
    | "legs"
    | "stability"
    | "core-flexion"
    | "jump"
    | "locomotion";
  type: "strength" | "cardio" | "core";
  equipment: string;
  sets: number;
  repsInReserve?: number;
  strengthRestSeconds?: number;
  reps: string;
  workSeconds: number;
  restSeconds: number;
  instructions: string;
  image?: ImageSourcePropType;
  imagePath: string;
}
export const workoutDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;
export type WorkoutDay = (typeof workoutDays)[number];
export interface DayPlan {
  optional?: boolean;
  selectedAlternatives?: Record<string, string>;
  day: WorkoutDay;
  title: string;
  subtitle: string;
  exercises: Exercise[];
  rounds: number;
  guidance?: string;
}
export interface WeeklyPlan {
  weekNumber: number;
  version: 1;
  program?: ProgramStyle;
  weekendOrder?: WeekendOrder;
  aerobicActivity?: AerobicActivity;
  blockWeek?: number;
  trainingLevel?: TrainingLevel;
  days: Record<WorkoutDay, DayPlan>;
}
export const trainingLevels = ["beginner", "intermediate", "advanced"] as const;
export type TrainingLevel = (typeof trainingLevels)[number];
export const programStyles = [
  "recomposition-v1",
  "muscle-split-v1",
  "general-health-v1",
] as const;
export type ProgramStyle = (typeof programStyles)[number];
export type WeekendOrder = "cardio-first" | "arms-first";
export type AerobicActivity = "walking" | "cycling";
export interface TrainingProfile {
  program?: ProgramStyle;
  weekendOrder?: WeekendOrder;
  aerobicActivity?: AerobicActivity;
  level: TrainingLevel;
  configured: boolean;
  autoAdvance: boolean;
  startedAt: string | null;
  promotedAt?: string;
}
export const skipReasons = [
  "Holiday",
  "Travel",
  "Rest",
  "Busy",
  "Other",
] as const;
export type SkipReason = (typeof skipReasons)[number];
export interface WorkoutHistory {
  weekNumber: number;
  date: string;
  day: WorkoutDay;
  exercises: string[];
  completedExercises: string[];
  skipped?: { reason: SkipReason; date: string };
}
export interface Settings {
  workSeconds: number;
  restSeconds: number;
  roundRestSeconds: number;
  notifications: boolean;
}
export interface AppData {
  journeyCompleted?: boolean;
  version: 1;
  weekOffset: number;
  plans: Record<string, WeeklyPlan>;
  history: Record<string, WorkoutHistory>;
  notes: Record<string, string>;
  settings: Settings;
  training: TrainingProfile;
}
