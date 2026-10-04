import { createExercise } from "../exerciseFactory";

export const trapsExercises = [
  "Barbell Shrugs",
  "Dumbbell Shrugs",
  "Smith Machine Shrugs",
  "Cable Shrugs",
  "Behind-the-Back Shrugs",
  "Farmer's Walk",
  "Rack Pull",
  "Face Pull",
].map((name) => createExercise(name, "traps"));
