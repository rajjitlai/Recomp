import { createExercise } from "../exerciseFactory";

export const posteriorExercises = [
  "Romanian Deadlift",
  "Stiff-Leg Deadlift",
  "Good Morning",
  "Lying Leg Curl",
  "Seated Leg Curl",
  "Standing Leg Curl",
  "Nordic Hamstring Curl",
  "Hip Thrust",
  "Barbell Hip Thrust",
  "Glute Bridge",
  "Cable Pull-Through",
  "Bulgarian Split Squat",
  "Reverse Lunge",
].map((name) => createExercise(name, "posterior"));
