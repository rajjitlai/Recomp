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
  program?: "recomposition-v1";
  blockWeek?: number;
  trainingLevel?: TrainingLevel;
  days: Record<WorkoutDay, DayPlan>;
}
export const trainingLevels = ["beginner", "intermediate", "advanced"] as const;
export type TrainingLevel = (typeof trainingLevels)[number];
export interface TrainingProfile {
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
  version: 1;
  weekOffset: number;
  plans: Record<string, WeeklyPlan>;
  history: Record<string, WorkoutHistory>;
  notes: Record<string, string>;
  settings: Settings;
  training: TrainingProfile;
}
