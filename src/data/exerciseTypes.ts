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
  days: Record<WorkoutDay, DayPlan>;
}
export interface WorkoutHistory {
  weekNumber: number;
  date: string;
  day: WorkoutDay;
  exercises: string[];
  completedExercises: string[];
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
}
