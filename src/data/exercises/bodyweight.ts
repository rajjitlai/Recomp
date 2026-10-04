import { createExercise } from "../exerciseFactory";

export const bodyweightExercises = [
  "Push-Ups",
  "Wide Push-Ups",
  "Diamond Push-Ups",
  "Incline Push-Ups",
  "Decline Push-Ups",
  "Pike Push-Ups",
  "Hindu Push-Ups",
  "Bodyweight Squats",
  "Jump Squats",
  "Lunges",
  "Reverse Lunges",
  "Walking Lunges",
  "Bulgarian Split Squats",
  "Step-Ups",
].map((name) => createExercise(name, "bodyweight"));
