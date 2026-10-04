import { createExercise } from "../exerciseFactory";

export const conditioningExercises = [
  "Burpees",
  "Burpee Broad Jumps",
  "Mountain Climbers",
  "High Knees",
  "Butt Kicks",
  "Jumping Jacks",
  "Star Jumps",
  "Tuck Jumps",
  "Squat Jumps",
  "Split Jumps",
  "Skater Jumps",
  "Broad Jumps",
  "Lateral Jumps",
  "Box Jumps",
  "Jump Rope",
  "Shadow Boxing",
].map((name) => createExercise(name, "conditioning"));
