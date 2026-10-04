import type { TrainingLevel } from "./exerciseTypes";

// Product pacing defaults, not clinical thresholds or a measure of readiness.
export const trainingProfiles: Record<
  TrainingLevel,
  {
    label: string;
    description: string;
    schedule: string;
    nextLevel: TrainingLevel | null;
    weeksToAdvance: number;
  }
> = {
  beginner: {
    label: "Beginner",
    description:
      "New to lifting or returning after a long break. Build technique with 2 working sets and 3 good reps left.",
    schedule: "3 full-body days · optional easy movement between",
    nextLevel: "intermediate",
    weeksToAdvance: 12,
  },
  intermediate: {
    label: "Intermediate",
    description:
      "Comfortable with the main movements and consistent training. Follow an upper/lower split with 2–3 working sets.",
    schedule: "4 lifting days · 2 easy conditioning days",
    nextLevel: "advanced",
    weeksToAdvance: 24,
  },
  advanced: {
    label: "Advanced",
    description:
      "Experienced with good technique and recovery. Use the upper/lower split with 3–4 working sets, adjusting volume when needed.",
    schedule: "4 lifting days · 2 easy conditioning days",
    nextLevel: null,
    weeksToAdvance: 0,
  },
};
