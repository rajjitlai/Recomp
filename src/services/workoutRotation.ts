import { pools } from "../data/exercises";
import {
  easyAlternatives,
  easyAlternativeNames,
} from "../data/exerciseAlternatives";
import type {
  DayPlan,
  Exercise,
  WeeklyPlan,
  WorkoutDay,
  TrainingLevel,
} from "../data/exerciseTypes";
import { split } from "../data/workoutPlans";
import {
  strengthSlots,
  beginnerStrengthSlots,
  conditioningSlots,
  recompositionSplit,
  type TrainingSlot,
} from "../data/recomposition";
import { workoutDays } from "../data/exerciseTypes";

const DAY_MS = 86_400_000;
const MONDAY_EPOCH = Date.UTC(2020, 0, 6);

// Calendar dates, rather than elapsed local milliseconds, avoid DST drift.
export function currentWeekNumber(date = new Date()): number {
  return Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      MONDAY_EPOCH) /
      (7 * DAY_MS),
  );
}
export function weekStart(week: number): Date {
  const date = new Date(MONDAY_EPOCH + week * 7 * DAY_MS);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    12,
  );
}
export function weekLabel(week: number): string {
  const start = weekStart(week);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${start.toLocaleDateString("en", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}`;
}
export function todayDay(date = new Date()): WorkoutDay | null {
  return (
    [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ] as const
  )[date.getDay()] === "sunday"
    ? null
    : ((
        [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ] as const
      )[date.getDay()] as WorkoutDay);
}
function seeded(seed: number) {
  return () => {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function ordered(pool: Exercise[], seed: number): Exercise[] {
  const result = [...pool];
  const random = seeded(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}
// A seeded circular deck exhausts every pool, keeps recent picks spaced apart,
// and has no adjacent-week overlap whenever pool size >= 2 * weekly demand.
function select(
  pool: Exercise[],
  count: number,
  week: number,
  seed: number,
  excluded: string[] = [],
): Exercise[] {
  const deck = ordered(pool, seed);
  const result: Exercise[] = [];
  const start = (((week * count) % deck.length) + deck.length) % deck.length;
  for (let i = 0; i < deck.length && result.length < count; i++) {
    const candidate = deck[(start + i) % deck.length]!;
    if (!excluded.includes(candidate.name)) result.push(candidate);
  }
  if (result.length !== count)
    throw new Error("Exercise pool cannot satisfy the workout split.");
  return result;
}

// Four-week blocks prioritize repeatable practice and progressive overload.
// Week four reduces sets; completing a checkbox never increases the load.
export function generateWeeklyWorkout(
  weekNumber: number,
  level: TrainingLevel = "intermediate",
): WeeklyPlan {
  if (!Number.isSafeInteger(weekNumber) || Math.abs(weekNumber) > 1_000_000)
    throw new Error("Invalid week number");
  const block = Math.floor(weekNumber / 4);
  const blockWeek = (((weekNumber % 4) + 4) % 4) + 1;
  const lighter = blockWeek === 4;
  const pick = (slot: TrainingSlot, offset: number): Exercise => {
    const pool = slot.names.map((name) => {
      const exercise = pools[slot.pool].find((e) => e.name === name);
      if (!exercise) throw new Error(`Missing program exercise: ${name}`);
      return exercise;
    });
    const exercise =
      pool[(((block + offset) % pool.length) + pool.length) % pool.length]!;
    const alternative =
      pool.find(
        (e) => e.id !== exercise.id && e.equipment !== exercise.equipment,
      ) ??
      pool.find((e) => e.id !== exercise.id) ??
      easyAlternatives.find(
        (e) => e.name === easyAlternativeNames[exercise.name],
      );
    if (!alternative) throw new Error(`Missing alternative: ${exercise.name}`);
    return {
      ...exercise,
      alternateId: alternative.id,
      sets: Math.max(
        1,
        (level === "beginner"
          ? 2
          : slot.sets + (level === "advanced" ? 1 : 0)) - (lighter ? 1 : 0),
      ),
      reps: level === "beginner" && slot.reps === "6–10" ? "8–12" : slot.reps,
      strengthRestSeconds: slot.rest,
      repsInReserve: level === "beginner" || lighter || blockWeek === 1 ? 3 : 2,
    };
  };
  const days = Object.fromEntries(
    workoutDays.map((day) => {
      const slots = (
        level === "beginner" ? beginnerStrengthSlots : strengthSlots
      )[day];
      const rounds =
        level === "beginner" || day === "wednesday" || lighter ? 2 : 3;
      const circuitSlots =
        level === "beginner" || day === "wednesday"
          ? [
              conditioningSlots[0]!,
              conditioningSlots[3]!,
              conditioningSlots[4]!,
              conditioningSlots[2]!,
              conditioningSlots[5]!,
              conditioningSlots[8]!,
            ]
          : conditioningSlots;
      const exercises = slots
        ? slots.map((slot) =>
            pick(slot, day === "thursday" || day === "friday" ? 1 : 0),
          )
        : circuitSlots.map((slot) => ({
            ...pick(slot, 0),
            sets: rounds,
            repsInReserve: undefined,
            strengthRestSeconds: undefined,
          }));
      const guidance = slots
        ? lighter
          ? "Lighter week: warm up, then use fewer working sets and keep 3 good reps left. Keep or reduce the weight. Do not use this reduced-volume session to justify a load increase; reassess at normal volume in the next block."
          : `Warm up, then complete the listed working sets. Finish each set with ${level === "beginner" || blockWeek === 1 ? 3 : 2} good reps left. When every set reaches the top of its range at that effort, increase by the smallest available weight next time. If form or reps drop, keep or reduce the load.`
        : `${level === "beginner" ? "Optional recovery day: rest or take an easy walk instead if you prefer. " : ""}Keep a conversational pace; this is not an all-out HIIT test. March for high knees, use standing heel curls for butt kicks, and step rather than jump. Take extra rest or shorten the session when needed. For side planks, split the work interval between sides.`;
      return [
        day,
        {
          day,
          ...recompositionSplit[day],
          ...(level === "beginner"
            ? {
                title: slots
                  ? `Full body · ${day === "monday" ? "A" : day === "wednesday" ? "B" : "C"}`
                  : "Optional · Move + Recover",
                subtitle: slots
                  ? "Technique practice · 5 movements · manageable volume"
                  : "Rest, walk, or try an easy 2-round circuit",
              }
            : {}),
          exercises,
          rounds: slots ? 1 : rounds,
          guidance,
        },
      ];
    }),
  ) as Record<WorkoutDay, DayPlan>;
  return {
    weekNumber,
    version: 1,
    program: "recomposition-v1",
    trainingLevel: level,
    blockWeek,
    days,
  };
}

export function generateClassicWeeklyWorkout(weekNumber: number): WeeklyPlan {
  if (!Number.isSafeInteger(weekNumber) || Math.abs(weekNumber) > 1_000_000)
    throw new Error("Invalid week number");
  // Allocate shared arm pools across the entire week, avoiding Mon/Fri and Tue/Fri duplicates.
  const biceps = select(pools.biceps, 9, weekNumber, 41);
  const triceps = select(pools.triceps, 6, weekNumber, 29);
  const shoulders = select(pools.shoulders, 6, weekNumber, 53);
  const conditioning = [
    ...select(
      pools.conditioning.filter((e) => e.movementPattern === "jump"),
      2,
      weekNumber,
      71,
    ),
    ...select(
      pools.conditioning.filter((e) => e.movementPattern === "locomotion"),
      1,
      weekNumber,
      72,
    ),
  ];
  const bodyweight = [
    ...select(
      pools.bodyweight.filter((e) => e.movementPattern === "push"),
      1,
      weekNumber,
      73,
    ),
    ...select(
      pools.bodyweight.filter((e) => e.movementPattern === "legs"),
      2,
      weekNumber,
      74,
    ),
  ];
  const core = [
    ...select(
      pools.core.filter((e) => e.movementPattern === "stability"),
      1,
      weekNumber,
      79,
      conditioning.map((e) => e.name),
    ),
    ...select(
      pools.core.filter((e) => e.movementPattern === "core-flexion"),
      2,
      weekNumber,
      80,
    ),
  ];
  const hamstrings = pools.posterior.filter((e) => e.category === "hamstrings");
  const glutes = pools.posterior.filter((e) => e.category === "glutes");
  const quads = select(pools.quads, 2, weekNumber, 61);
  const day = (
    key: WorkoutDay,
    exercises: Exercise[],
    rounds = 1,
  ): DayPlan => ({ day: key, ...split[key], exercises, rounds });
  return {
    weekNumber,
    version: 1,
    days: {
      monday: day("monday", [
        ...select(pools.chest, 6, weekNumber, 11),
        ...triceps.slice(0, 3),
      ]),
      tuesday: day("tuesday", [
        ...select(pools.back, 6, weekNumber, 31),
        ...biceps.slice(0, 3),
      ]),
      wednesday: day("wednesday", [
        ...quads,
        ...select(hamstrings, 2, weekNumber, 63),
        ...select(
          glutes,
          1,
          weekNumber,
          65,
          quads.map((e) => e.name),
        ),
        ...select(pools.calves, 1, weekNumber, 67),
      ]),
      thursday: day("thursday", [
        ...shoulders,
        ...select(
          pools.traps,
          3,
          weekNumber,
          59,
          shoulders.map((e) => e.name),
        ),
      ]),
      friday: day("friday", [...biceps.slice(3), ...triceps.slice(3)]),
      saturday: day(
        "saturday",
        [
          conditioning[0]!,
          bodyweight[0]!,
          core[0]!,
          conditioning[1]!,
          bodyweight[1]!,
          core[1]!,
          conditioning[2]!,
          bodyweight[2]!,
          core[2]!,
        ],
        3,
      ),
    },
  };
}
