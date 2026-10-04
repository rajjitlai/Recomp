import { test } from "node:test";
import assert from "node:assert/strict";
import {
  trainingLevels,
  workoutDays,
  type AppData,
  type TrainingLevel,
  type WorkoutDay,
} from "../src/data/exerciseTypes";
import {
  initialData,
  reduceData,
  decodeData,
  historyKey,
} from "../src/services/state";
import {
  currentWeekNumber,
  generateWeeklyWorkout,
} from "../src/services/workoutRotation";
import { trainingProgress } from "../src/services/trainingProgress";

const start = new Date(2026, 0, 5, 9);
const dateAt = (days: number) => {
  const date = new Date(start);
  date.setDate(date.getDate() + days);
  date.setHours(18);
  return date;
};
const selected = (level: TrainingLevel = "beginner") =>
  reduceData(initialData(), {
    type: "trainingLevel",
    level,
    week: currentWeekNumber(start),
    date: start.toISOString(),
  });
function complete(
  data: AppData,
  week: number,
  day: WorkoutDay,
  date: Date,
): AppData {
  data = reduceData(data, { type: "ensureWeek", week });
  for (const e of data.plans[week]!.days[day].exercises)
    data = reduceData(data, {
      type: "toggle",
      week,
      day,
      id: e.id,
      date: date.toISOString(),
    });
  return data;
}
function trained(level: TrainingLevel, weeks: number): AppData {
  let data = selected(level);
  const days: [WorkoutDay, number][] =
    level === "beginner"
      ? [
          ["monday", 0],
          ["wednesday", 2],
          ["friday", 4],
        ]
      : [
          ["monday", 0],
          ["tuesday", 1],
          ["thursday", 3],
        ];
  for (let w = 0; w < weeks; w++)
    for (const [day, offset] of days)
      data = complete(
        data,
        currentWeekNumber(start) + w,
        day,
        dateAt(w * 7 + offset),
      );
  return data;
}

test("all levels are deterministic and balanced, with lighter fourth weeks", () => {
  for (const level of trainingLevels)
    for (let week = 0; week < 32; week++) {
      const plan = generateWeeklyWorkout(week, level);
      assert.deepEqual(plan, generateWeeklyWorkout(week, level));
      assert.equal(plan.trainingLevel, level);
      assert.equal(
        workoutDays.filter((d) => plan.days[d].rounds === 1).length,
        level === "beginner" ? 3 : 4,
      );
      for (const day of workoutDays) {
        const session = plan.days[day];
        assert.equal(
          new Set(session.exercises.map((e) => e.id)).size,
          session.exercises.length,
        );
        if (session.rounds > 1) {
          assert.ok(
            session.exercises.every((e) => e.movementPattern !== "jump"),
          );
          continue;
        }
        assert.ok(
          session.exercises.every((e) => e.sets >= 1 && e.repsInReserve! >= 2),
        );
        if (level === "beginner") {
          assert.equal(session.exercises.length, 5);
          for (const category of ["quads", "chest", "back"])
            assert.ok(session.exercises.some((e) => e.category === category));
          assert.ok(
            session.exercises.every(
              (e) =>
                !e.name.includes("Barbell") &&
                e.sets <= 2 &&
                e.repsInReserve === 3,
            ),
          );
        }
        if (week % 4 === 3) {
          const prior = generateWeeklyWorkout(week - 1, level).days[day];
          assert.deepEqual(
            session.exercises.map((e) => e.id),
            prior.exercises.map((e) => e.id),
          );
          assert.ok(
            session.exercises.every(
              (e, i) => e.sets < prior.exercises[i]!.sets,
            ),
          );
        }
      }
    }
  assert.ok(
    generateWeeklyWorkout(0, "advanced").days.monday.exercises.every(
      (e, i) =>
        e.sets >
        generateWeeklyWorkout(0, "intermediate").days.monday.exercises[i]!.sets,
    ),
  );
});

test("new user selection persists, and existing users retain intermediate plans and history", () => {
  assert.equal(initialData().training.configured, false);
  assert.equal(initialData().training.level, "beginner");
  const data = selected("advanced");
  assert.deepEqual(decodeData(JSON.stringify(data)), data);
  const old = JSON.parse(JSON.stringify(trained("intermediate", 1)));
  delete old.training;
  for (const plan of Object.values(old.plans) as { trainingLevel?: string }[])
    delete plan.trainingLevel;
  const migrated = decodeData(JSON.stringify(old));
  assert.equal(migrated.training.level, "intermediate");
  assert.equal(migrated.training.configured, true);
  assert.deepEqual(migrated.history, old.history);
  assert.equal(trainingProgress(migrated).activeWeeks, 0);
  assert.deepEqual(decodeData(JSON.stringify(migrated)), migrated);
});

test("manual level changes update untouched plans and preserve started, skipped and past weeks", () => {
  const week = currentWeekNumber(start);
  let data = selected();
  data = reduceData(data, { type: "ensureWeek", week: week - 1 });
  data = reduceData(data, { type: "ensureWeek", week: week + 1 });
  const changed = reduceData(data, {
    type: "trainingLevel",
    level: "advanced",
    week,
    date: start.toISOString(),
  });
  assert.equal(changed.plans[week]!.trainingLevel, "advanced");
  assert.equal(changed.plans[week + 1]!.trainingLevel, "advanced");
  assert.deepEqual(changed.plans[week - 1], data.plans[week - 1]);
  for (const withActivity of [
    complete(data, week, "monday", dateAt(0)),
    reduceData(data, {
      type: "skipWorkout",
      week,
      day: "monday",
      reason: "Holiday",
      date: dateAt(0).toISOString(),
    }),
  ]) {
    const changed = reduceData(withActivity, {
      type: "trainingLevel",
      level: "intermediate",
      week,
      date: dateAt(1).toISOString(),
    });
    assert.deepEqual(changed.plans[week], withActivity.plans[week]);
    assert.deepEqual(changed.history, withActivity.history);
    assert.deepEqual(decodeData(JSON.stringify(changed)), changed);
  }
});

test("automatic progression requires completed real weeks and never promotes for holidays or a manual week jump", () => {
  const now = dateAt(12 * 7);
  const week = currentWeekNumber(now);
  let data = trained("beginner", 12);
  assert.equal(trainingProgress(data, now).activeWeeks, 12);
  assert.equal(trainingProgress(data, dateAt(11 * 7 + 6)).activeWeeks, 11);
  const promoted = reduceData(data, {
    type: "advanceTraining",
    week,
    date: now.toISOString(),
  });
  assert.equal(promoted.training.level, "intermediate");
  assert.equal(promoted.plans[week]!.trainingLevel, "intermediate");
  assert.deepEqual(promoted.history, data.history);
  assert.equal(
    reduceData(promoted, {
      type: "advanceTraining",
      week,
      date: now.toISOString(),
    }),
    promoted,
  );
  assert.deepEqual(decodeData(JSON.stringify(promoted)), promoted);
  const key = historyKey(currentWeekNumber(start), "monday");
  data = {
    ...data,
    history: {
      ...data.history,
      [key]: {
        ...data.history[key]!,
        completedExercises: [],
        skipped: { reason: "Holiday", date: dateAt(0).toISOString() },
      },
    },
  };
  assert.equal(trainingProgress(data, now).activeWeeks, 11);
  const skipped = reduceData(data, { type: "newWeek" });
  assert.equal(
    reduceData(skipped, {
      type: "advanceTraining",
      week: week + 500,
      date: now.toISOString(),
    }).training.level,
    "beginner",
  );
  assert.equal(trainingProgress(selected(), dateAt(365)).activeWeeks, 0);
});

test("circuits, partial sessions, future dates and same-date duplicate sessions do not qualify", () => {
  let data = selected();
  const week = currentWeekNumber(start);
  for (const day of ["monday", "wednesday", "friday"] as const)
    data = complete(data, week, day, dateAt(0));
  assert.equal(trainingProgress(data, dateAt(100)).activeWeeks, 0);
  data = selected();
  for (const [day, offset] of [
    ["tuesday", 1],
    ["thursday", 3],
    ["saturday", 5],
  ] as const)
    data = complete(data, week, day, dateAt(offset));
  assert.equal(trainingProgress(data, dateAt(100)).activeWeeks, 0);
  data = trained("beginner", 12);
  assert.equal(trainingProgress(data, start).activeWeeks, 0);
  const entry = data.history[historyKey(week, "monday")]!;
  entry.completedExercises.pop();
  assert.equal(trainingProgress(data, dateAt(100)).activeWeeks, 11);
});

test("automatic progression respects opt-out, caps advanced, preserves started weeks and resets on manual choice", () => {
  const now = dateAt(24 * 7);
  const week = currentWeekNumber(now);
  let data = trained("intermediate", 24);
  const paused = reduceData(data, { type: "trainingAuto", enabled: false });
  assert.equal(
    reduceData(paused, {
      type: "advanceTraining",
      week,
      date: now.toISOString(),
    }),
    paused,
  );
  data = complete(data, week, "monday", now);
  const advanced = reduceData(data, {
    type: "advanceTraining",
    week,
    date: now.toISOString(),
  });
  assert.equal(advanced.training.level, "advanced");
  assert.deepEqual(advanced.plans[week], data.plans[week]);
  assert.equal(
    reduceData(advanced, {
      type: "advanceTraining",
      week,
      date: dateAt(800).toISOString(),
    }),
    advanced,
  );
  const lower = reduceData(advanced, {
    type: "trainingLevel",
    level: "beginner",
    week,
    date: now.toISOString(),
  });
  assert.equal(trainingProgress(lower, now).activeWeeks, 0);
  assert.equal(lower.training.promotedAt, undefined);
  const cleared = reduceData(data, { type: "clearHistory" });
  assert.equal(trainingProgress(cleared, now).activeWeeks, 0);
  assert.equal(cleared.training.level, "intermediate");
});

test("invalid training settings and saved plan levels are rejected", () => {
  for (const field of [
    { level: "expert" },
    { autoAdvance: "yes" },
    { startedAt: "bad" },
    { configured: true, startedAt: null },
  ]) {
    const data = initialData();
    assert.throws(() =>
      decodeData(
        JSON.stringify({ ...data, training: { ...data.training, ...field } }),
      ),
    );
  }
  const data = selected();
  const raw = JSON.parse(JSON.stringify(data));
  raw.plans[currentWeekNumber(start)].trainingLevel = "expert";
  assert.throws(() => decodeData(JSON.stringify(raw)));
});
