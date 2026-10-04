import { chestExercises } from "./chest";
import { tricepsExercises } from "./triceps";
import { backExercises } from "./back";
import { bicepsExercises } from "./biceps";
import { shouldersExercises } from "./shoulders";
import { trapsExercises } from "./traps";
import { quadsExercises } from "./quads";
import { posteriorExercises } from "./posterior";
import { calvesExercises } from "./calves";
import { conditioningExercises } from "./conditioning";
import { bodyweightExercises } from "./bodyweight";
import { coreExercises } from "./core";

export const pools = {
  chest: chestExercises,
  triceps: tricepsExercises,
  back: backExercises,
  biceps: bicepsExercises,
  shoulders: shouldersExercises,
  traps: trapsExercises,
  quads: quadsExercises,
  posterior: posteriorExercises,
  calves: calvesExercises,
  conditioning: conditioningExercises,
  bodyweight: bodyweightExercises,
  core: coreExercises,
};
export const exercises = Object.values(pools).flat();
export const exerciseById = Object.fromEntries(
  exercises.map((exercise) => [exercise.id, exercise]),
);
