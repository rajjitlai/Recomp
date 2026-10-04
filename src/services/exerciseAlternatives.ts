import { exerciseById } from "../data/exercises";
import type { DayPlan, Exercise } from "../data/exerciseTypes";

export function alternativeFor(exercise: Exercise): Exercise | undefined {
  const alternative =
    exercise.alternateId && exerciseById[exercise.alternateId];
  if (!alternative) return undefined;
  return {
    ...alternative,
    alternateId: exercise.id,
    sets: exercise.sets,
    reps: exercise.reps,
    repsInReserve: exercise.repsInReserve,
    strengthRestSeconds: exercise.strengthRestSeconds,
    workSeconds: exercise.workSeconds,
    restSeconds: exercise.restSeconds,
  };
}

export function swapExercise(workout: DayPlan, id: string): DayPlan {
  const exercise = workout.exercises.find((e) => e.id === id);
  const alternative = exercise && alternativeFor(exercise);
  if (!alternative || workout.exercises.some((e) => e.id === alternative.id))
    return workout;
  const selectedAlternatives = { ...workout.selectedAlternatives };
  const original = Object.keys(selectedAlternatives).find(
    (key) => selectedAlternatives[key] === id,
  );
  if (original) delete selectedAlternatives[original];
  else selectedAlternatives[id] = alternative.id;
  const next: DayPlan = {
    ...workout,
    selectedAlternatives,
    exercises: workout.exercises.map((e) => (e.id === id ? alternative : e)),
  };
  if (Object.keys(selectedAlternatives).length === 0)
    delete next.selectedAlternatives;
  return next;
}
