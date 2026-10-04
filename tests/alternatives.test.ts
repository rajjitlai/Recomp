import test from "node:test";
import assert from "node:assert/strict";
import { trainingLevels, workoutDays } from "../src/data/exerciseTypes";
import { generateWeeklyWorkout } from "../src/services/workoutRotation";
import { alternativeFor } from "../src/services/exerciseAlternatives";
import {
  initialData,
  reduceData,
  decodeData,
  historyKey,
} from "../src/services/state";

test("every level and slot offers a distinct alternative with matching workload and no daily collisions", () => {
  for (const level of trainingLevels)
    for (let week = 0; week < 48; week++) {
      const plan = generateWeeklyWorkout(week, level);
      for (const day of workoutDays) {
        const ids = new Set<string>();
        for (const exercise of plan.days[day].exercises) {
          const alternative = alternativeFor(exercise)!;
          assert.ok(alternative, exercise.name);
          assert.notEqual(alternative.id, exercise.id);
          for (const id of [exercise.id, alternative.id]) {
            assert.ok(!ids.has(id), `${level} ${day}: ${id} collides`);
            ids.add(id);
          }
          assert.equal(alternative.sets, exercise.sets);
          assert.equal(alternative.reps, exercise.reps);
          assert.equal(alternative.repsInReserve, exercise.repsInReserve);
          assert.equal(
            alternative.strengthRestSeconds,
            exercise.strengthRestSeconds,
          );
          assert.equal(alternativeFor(alternative)?.id, exercise.id);
        }
      }
    }
});

test("swaps persist and record the actual exercise without losing other completions or notes", () => {
  let data = reduceData(initialData(), { type: "ensureWeek", week: 100 });
  const [first, second] = data.plans[100]!.days.monday.exercises;
  data = reduceData(data, {
    type: "note",
    id: first!.id,
    note: "Keep this note",
  });
  data = reduceData(data, {
    type: "toggle",
    week: 100,
    day: "monday",
    id: second!.id,
    date: "2026-01-05T12:00:00Z",
  });
  data = reduceData(data, {
    type: "swapExercise",
    week: 100,
    day: "monday",
    id: first!.id,
  });
  const swapped = data.plans[100]!.days.monday.exercises[0]!;
  assert.equal(swapped.id, first!.alternateId);
  assert.deepEqual(
    data.history[historyKey(100, "monday")]!.completedExercises,
    [second!.id],
  );
  assert.ok(
    data.history[historyKey(100, "monday")]!.exercises.includes(swapped.id),
  );
  assert.deepEqual(decodeData(JSON.stringify(data), 100), data);
  data = reduceData(data, {
    type: "swapExercise",
    week: 100,
    day: "monday",
    id: swapped.id,
  });
  assert.equal(data.plans[100]!.days.monday.exercises[0]!.id, first!.id);
  assert.equal(data.notes[first!.id], "Keep this note");
  assert.deepEqual(decodeData(JSON.stringify(data), 100), data);
});

test("completed and skipped exercises cannot swap; invalid saved choices are rejected", () => {
  let data = reduceData(initialData(), { type: "ensureWeek", week: 100 });
  const first = data.plans[100]!.days.monday.exercises[0]!;
  data = reduceData(data, {
    type: "toggle",
    week: 100,
    day: "monday",
    id: first.id,
    date: "2026-01-05T12:00:00Z",
  });
  assert.equal(
    reduceData(data, {
      type: "swapExercise",
      week: 100,
      day: "monday",
      id: first.id,
    }),
    data,
  );
  data = reduceData(data, {
    type: "skipWorkout",
    week: 100,
    day: "monday",
    reason: "Holiday",
    date: "2026-01-05T12:00:00Z",
  });
  const second = data.plans[100]!.days.monday.exercises[1]!;
  assert.equal(
    reduceData(data, {
      type: "swapExercise",
      week: 100,
      day: "monday",
      id: second.id,
    }),
    data,
  );
  const bad = JSON.parse(JSON.stringify(data));
  bad.plans[100].days.monday.selectedAlternatives = { [first.id]: second.id };
  assert.throws(() => decodeData(JSON.stringify(bad), 100), /alternative/);
});
