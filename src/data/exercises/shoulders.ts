import { createExercise } from "../exerciseFactory";

export const shouldersExercises = [
  "Barbell Overhead Press",
  "Dumbbell Shoulder Press",
  "Arnold Press",
  "Machine Shoulder Press",
  "Smith Machine Shoulder Press",
  "Push Press",
  "Dumbbell Lateral Raise",
  "Cable Lateral Raise",
  "Machine Lateral Raise",
  "Leaning Cable Lateral Raise",
  "Front Dumbbell Raise",
  "Front Plate Raise",
  "Cable Front Raise",
  "Rear Delt Dumbbell Fly",
  "Cable Rear Delt Fly",
  "Reverse Pec Deck",
  "Bent-Over Rear Delt Raise",
  "Upright Row",
  "Face Pull",
].map((name) => createExercise(name, "shoulders"));
