import { test } from "node:test";
import assert from "node:assert/strict";
import { decodeData, initialData, reduceData } from "../src/services/state";
import { generateClassicWeeklyWorkout } from "../src/services/workoutRotation";

const skip = {
  type: "skipWorkout",
  week: 350,
  day: "monday",
  reason: "Holiday",
  date: "2026-10-01T10:00:00Z",
} as const;

test("holiday skip persists without shifting the plan or completing exercises", () => {
  const data = reduceData(initialData(), skip);
  const restored = decodeData(JSON.stringify(data));
  assert.deepEqual(restored, data);
  assert.deepEqual(data.history["350:monday"]!.completedExercises, []);
  assert.equal(data.history["350:monday"]!.skipped?.reason, "Holiday");
  const next = reduceData(reduceData(data, { type: "newWeek" }), {
    type: "ensureWeek",
    week: 351,
  });
  assert.equal(next.history["351:monday"], undefined);
  assert.deepEqual(next.plans[350], data.plans[350]);
});

test("skipping partial work locks completion until reopened and retains marks and notes", () => {
  let data = reduceData(initialData(), { type: "ensureWeek", week: 350 });
  const id = data.plans[350]!.days.monday.exercises[0]!.id;
  const toggle = {
    type: "toggle",
    week: 350,
    day: "monday",
    id,
    date: skip.date,
  } as const;
  data = reduceData(reduceData(data, toggle), {
    type: "note",
    id,
    note: "Working weight",
  });
  data = reduceData(data, skip);
  assert.equal(reduceData(data, toggle), data);
  data = reduceData(decodeData(JSON.stringify(data)), {
    type: "resumeWorkout",
    week: 350,
    day: "monday",
  });
  assert.equal(data.history["350:monday"]!.skipped, undefined);
  assert.deepEqual(data.history["350:monday"]!.completedExercises, [id]);
  assert.equal(data.notes[id], "Working weight");
  assert.deepEqual(
    reduceData(data, toggle).history["350:monday"]!.completedExercises,
    [],
  );
});

test("completed workouts cannot be skipped; targeted reset leaves other skips alone", () => {
  let data = reduceData(initialData(), { type: "ensureWeek", week: 350 });
  for (const ex of data.plans[350]!.days.monday.exercises)
    data = reduceData(data, {
      type: "toggle",
      week: 350,
      day: "monday",
      id: ex.id,
      date: skip.date,
    });
  assert.equal(reduceData(data, skip), data);
  data = reduceData(data, { ...skip, day: "tuesday" });
  data = reduceData(data, { type: "resetWorkout", week: 350, day: "monday" });
  assert.equal(data.history["350:monday"], undefined);
  assert.equal(data.history["350:tuesday"]!.skipped?.reason, "Holiday");
});

test("skip validation rejects malformed saved data and preserves skipped legacy plans", () => {
  const data = initialData();
  data.plans[350] = generateClassicWeeklyWorkout(350);
  const skipped = reduceData(data, skip);
  assert.deepEqual(decodeData(JSON.stringify(skipped), 350), skipped);
  for (const invalid of [
    null,
    { reason: "Bad", date: skip.date },
    { reason: "Holiday", date: "bad" },
  ]) {
    const raw = JSON.parse(JSON.stringify(skipped));
    raw.history["350:monday"].skipped = invalid;
    assert.throws(() => decodeData(JSON.stringify(raw)));
  }
});
