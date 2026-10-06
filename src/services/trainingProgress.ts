import type { AppData, TrainingLevel } from "../data/exerciseTypes";
import { trainingProfiles } from "../data/trainingLevels";
import { currentWeekNumber } from "./workoutRotation";
import { generateProgram } from "./programGeneration";

export const getPlan = (data: AppData, week: number) =>
  data.plans[week] ??
  generateProgram(
    week,
    data.training.level,
    data.training.program,
    data.training.weekendOrder,
    data.training.aerobicActivity,
  );

export const weekHasActivity = (data: AppData, week: number) =>
  Object.values(data.history).some(
    (entry) =>
      entry.weekNumber === week &&
      (entry.completedExercises.length > 0 || !!entry.skipped),
  );

// Count real calendar weeks, not the manual program-week offset. Three fully
// completed lifting sessions on distinct dates qualify; circuits and skips do not.
export function trainingProgress(data: AppData, now = new Date()) {
  const profile = trainingProfiles[data.training.level];
  const start = data.training.startedAt
    ? new Date(data.training.startedAt)
    : null;
  const current = currentWeekNumber(now);
  const weeks = new Map<number, Set<string>>();
  if (start)
    for (const entry of Object.values(data.history)) {
      const date = new Date(entry.date);
      const calendarWeek = currentWeekNumber(date);
      const plan = data.plans[entry.weekNumber];
      const workout = plan?.days[entry.day];
      if (
        date < start ||
        date > now ||
        calendarWeek >= current ||
        entry.skipped ||
        !workout ||
        workout.rounds !== 1 ||
        !plan?.program ||
        plan.program !== (data.training.program ?? "recomposition-v1") ||
        (plan.trainingLevel ?? "intermediate") !== data.training.level ||
        workout.exercises.length === 0 ||
        entry.exercises.length !== workout.exercises.length ||
        !workout.exercises.every((e) => entry.completedExercises.includes(e.id))
      )
        continue;
      const dates = weeks.get(calendarWeek) ?? new Set<string>();
      dates.add(date.toDateString());
      weeks.set(calendarWeek, dates);
    }
  const activeWeeks = [...weeks.values()].filter(
    (dates) => dates.size >= 3,
  ).length;
  const elapsedWeeks = start
    ? Math.max(0, current - currentWeekNumber(start))
    : 0;
  return {
    ...profile,
    activeWeeks,
    elapsedWeeks,
    ready:
      !!profile.nextLevel &&
      activeWeeks >= profile.weeksToAdvance &&
      elapsedWeeks >= profile.weeksToAdvance,
  };
}

export function applyTrainingLevel(
  data: AppData,
  level: TrainingLevel,
  activeWeek: number,
  date: string,
  automatic = false,
): AppData {
  const { promotedAt, ...training } = data.training;
  const next: AppData = {
    ...data,
    training: {
      ...training,
      level,
      configured: true,
      startedAt: date,
      ...(automatic ? { promotedAt: date } : {}),
    },
    plans: { ...data.plans },
  };
  // Keep history and any week already in progress, including partially skipped weeks.
  for (const key of new Set([...Object.keys(data.plans), String(activeWeek)])) {
    const week = Number(key);
    if (week >= activeWeek && !weekHasActivity(data, week))
      next.plans[week] = generateProgram(
        week,
        level,
        data.training.program,
        data.training.weekendOrder,
        data.training.aerobicActivity,
      );
  }
  return next;
}
