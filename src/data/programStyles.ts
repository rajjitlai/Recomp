import type { ProgramStyle, WeeklyPlan, TrainingLevel } from "./exerciseTypes";
import { trainingProfiles } from "./trainingLevels";
export const programProfiles: Record<
  ProgramStyle,
  { label: string; description: string; schedule: string }
> = {
  "recomposition-v1": {
    label: "Muscle & fat loss",
    description:
      "The existing full-body or upper/lower plan, with workload based on your training level.",
    schedule: "Strength and easy conditioning",
  },
  "muscle-split-v1": {
    label: "Body-part split",
    description:
      "Your six-day gym routine: 5 chest/back movements + 4 arm movements on Monday/Tuesday; 6 items on each other day. More exercises means fewer sets per movement. This split trains some major groups once weekly; use the other programs if twice-weekly full-body coverage is your priority.",
    schedule:
      "Chest + triceps · back + biceps · legs · shoulders · cardio/arms",
  },
  "general-health-v1": {
    label: "General health",
    description:
      "Three full-body strength days with six movements, plus optional easy movement days. Build aerobic activity gradually through walking or cycling.",
    schedule: "3 full-body days · 3 optional movement days · Sunday rest",
  },
};
export const programSchedule = (plan: WeeklyPlan) =>
  plan.program === "muscle-split-v1"
    ? "Chest/triceps · back/biceps · legs · shoulders · " +
      (plan.weekendOrder === "arms-first" ? "arms · cardio" : "cardio · arms")
    : plan.program === "general-health-v1"
      ? programProfiles[plan.program].schedule
      : trainingProfiles[plan.trainingLevel ?? "intermediate"].schedule;
export const levelDescription = (
  level: TrainingLevel,
  program: ProgramStyle,
) =>
  program === "recomposition-v1"
    ? trainingProfiles[level].description
    : program === "muscle-split-v1"
      ? level === "beginner"
        ? "1 working set per movement; practise technique and keep 3 reps in reserve."
        : level === "intermediate"
          ? "2 sets for the first two movements; 1 set for the remaining movements. Keep 2–3 reps in reserve."
          : "2 working sets per movement; keep 2–3 reps in reserve and reduce volume if recovery suffers."
      : level === "beginner"
        ? "1–2 working sets per strength movement, with 3 reps in reserve."
        : "2 working sets per strength movement, with 2–3 reps in reserve. Build consistency before load.";
