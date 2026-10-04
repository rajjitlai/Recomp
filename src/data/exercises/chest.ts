import { createExercise } from "../exerciseFactory";

export const chestExercises = [
  "Barbell Bench Press",
  "Incline Barbell Bench Press",
  "Decline Barbell Bench Press",
  "Flat Dumbbell Press",
  "Incline Dumbbell Press",
  "Decline Dumbbell Press",
  "Dumbbell Fly",
  "Incline Dumbbell Fly",
  "Cable Crossover",
  "High-to-Low Cable Fly",
  "Low-to-High Cable Fly",
  "Pec Deck",
  "Machine Chest Press",
  "Incline Machine Press",
  "Decline Machine Press",
  "Push-Ups",
  "Wide-Grip Push-Ups",
  "Diamond Push-Ups",
  "Chest Dips",
  "Dumbbell Pullover",
].map((name) => createExercise(name, "chest"));
