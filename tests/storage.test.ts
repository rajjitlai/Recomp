import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createSaveQueue,
  decodeData,
  historyKey,
  initialData,
  reduceData,
} from "../src/services/state";

test("completion, notes, settings and history survive restart and new week", () => {
  let data = reduceData(initialData(), { type: "ensureWeek", week: 350 });
  const id = data.plans[350]!.days.monday.exercises[0]!.id;
  data = reduceData(data, {
    type: "toggle",
    week: 350,
    day: "monday",
    id,
    date: "2026-10-05T10:00:00Z",
  });
  data = reduceData(data, { type: "note", id, note: "Keep elbows stable" });
  data = reduceData(data, { type: "settings", settings: { workSeconds: 50 } });
  const restored = decodeData(JSON.stringify(data));
  assert.deepEqual(restored, data);
  data = reduceData(restored, { type: "newWeek" });
  assert.equal(data.weekOffset, 1);
  assert.deepEqual(
    data.history[historyKey(350, "monday")]!.completedExercises,
    [id],
  );
  const regenerated = reduceData(data, { type: "regenerate", week: 350 });
  assert.deepEqual(regenerated.history, data.history);
  const undone = reduceData(data, {
    type: "toggle",
    week: 350,
    day: "monday",
    id,
    date: "2026-10-05T11:00:00Z",
  });
  assert.equal(
    undone.history[historyKey(350, "monday")]!.completedExercises.length,
    0,
  );
});

test("targeted resets preserve other days, notes and settings", () => {
  let data = reduceData(initialData(), { type: "ensureWeek", week: 350 });
  for (const day of ["monday", "tuesday"] as const)
    data = reduceData(data, {
      type: "toggle",
      week: 350,
      day,
      id: data.plans[350]!.days[day].exercises[0]!.id,
      date: new Date().toISOString(),
    });
  data = reduceData(data, { type: "resetWorkout", week: 350, day: "monday" });
  assert.equal(data.history["350:monday"], undefined);
  assert.equal(data.history["350:tuesday"]!.completedExercises.length, 1);
  assert.equal(
    Object.keys(reduceData(data, { type: "clearHistory" }).history).length,
    0,
  );
  assert.deepEqual(
    reduceData(data, { type: "clearHistory" }).settings,
    data.settings,
  );
});

test("invalid saved data is rejected instead of resetting it silently", () => {
  assert.deepEqual(decodeData(null), initialData());
  for (const raw of [
    "",
    "{}",
    "null",
    "{bad",
    JSON.stringify({ ...initialData(), version: 2 }),
    JSON.stringify({ ...initialData(), settings: {} }),
  ])
    assert.throws(() => decodeData(raw));
});

test("rapid writes are serialized and a failed write does not block retry", async () => {
  const writes: string[] = [];
  let attempt = 0;
  const save = createSaveQueue(async (raw) => {
    if (++attempt === 1) throw new Error("disk unavailable");
    await new Promise((resolve) => setTimeout(resolve, 5));
    writes.push(raw);
  });
  const first = save(initialData());
  const secondData = { ...initialData(), weekOffset: 1 };
  const second = save(secondData);
  const third = save({ ...secondData, weekOffset: 2 });
  await assert.rejects(first);
  await Promise.all([second, third]);
  assert.deepEqual(
    writes.map((raw) => JSON.parse(raw).weekOffset),
    [1, 2],
  );
});
