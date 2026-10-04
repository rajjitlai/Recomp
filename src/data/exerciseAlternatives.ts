import { createExercise } from "./exerciseFactory";

// Extra easy options do not change the historical rotation pools.
export const easyAlternatives = [
  {
    name: "Side Steps",
    instructions:
      "Step gently from side to side, keeping both feet close to the floor. Let your arms swing comfortably and keep a conversational pace.",
  },
  {
    name: "March in Place",
    instructions:
      "Stand tall and alternate lifting each foot just off the floor. Keep the steps comfortable, avoid bouncing, and use a stable support if needed.",
  },
  {
    name: "Standing Heel Curls",
    instructions:
      "Stand tall and slowly bring one heel toward your glutes, then lower it and alternate legs. Keep your knees close together and use a stable support if needed.",
  },
].map(({ name, instructions }) => ({
  ...createExercise(name, "conditioning"),
  instructions,
}));

export const easyAlternativeNames: Record<string, string> = {
  "Shadow Boxing": "Side Steps",
  "High Knees": "March in Place",
  "Butt Kicks": "Standing Heel Curls",
};
