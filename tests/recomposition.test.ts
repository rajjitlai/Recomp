import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generateWeeklyWorkout,
  generateClassicWeeklyWorkout,
} from "../src/services/workoutRotation";
import { initialData, decodeData, reduceData } from "../src/services/state";
import { workoutDays } from "../src/data/exerciseTypes";

test("recomposition uses four balanced lifting days and two low-impact circuits", () => {
  for (let week = -4; week < 100; week++) {
    const plan = generateWeeklyWorkout(week);
    assert.deepEqual(plan, generateWeeklyWorkout(week));
    assert.equal(plan.program, "recomposition-v1");
    for (const day of workoutDays) {
      const workout = plan.days[day];
      assert.equal(
        new Set(workout.exercises.map((e) => e.name)).size,
        workout.exercises.length,
      );
      assert.ok(workout.guidance);
      if (day === "wednesday" || day === "saturday") {
        assert.ok(workout.rounds >= 2);
        assert.equal(workout.exercises.length, day === "wednesday" ? 6 : 9);
        assert.ok(workout.exercises.every((e) => e.movementPattern !== "jump"));
      } else {
        assert.equal(workout.rounds, 1);
        assert.ok(
          workout.exercises.every(
            (e) =>
              e.type === "strength" &&
              e.sets >= 1 &&
              e.sets <= 3 &&
              e.strengthRestSeconds! >= 75 &&
              e.repsInReserve! >= 2,
          ),
        );
        const categories = new Set(workout.exercises.map((e) => e.category));
        for (const category of day === "monday" || day === "thursday"
          ? ["chest", "back", "shoulders"]
          : ["quads", "hamstrings", "glutes", "calves"])
          assert.ok(
            categories.has(
              category as (typeof workout.exercises)[number]["category"],
            ),
          );
      }
    }
  }
});

test("four-week exercise consistency with a lower-volume fourth week and block rotation", () => {
  for (let block = 0; block < 20; block++) {
    const start = generateWeeklyWorkout(block * 4);
    for (let phase = 1; phase <= 3; phase++) {
      const later = generateWeeklyWorkout(block * 4 + phase);
      for (const day of workoutDays)
        assert.deepEqual(
          later.days[day].exercises.map((e) => e.id),
          start.days[day].exercises.map((e) => e.id),
        );
    }
    const lighter = generateWeeklyWorkout(block * 4 + 3);
    for (const day of ["monday", "tuesday", "thursday", "friday"] as const) {
      assert.ok(
        lighter.days[day].exercises.reduce((n, e) => n + e.sets, 0) <
          start.days[day].exercises.reduce((n, e) => n + e.sets, 0),
      );
    }
    assert.notDeepEqual(
      generateWeeklyWorkout((block + 1) * 4).days.monday.exercises.map(
        (e) => e.id,
      ),
      start.days.monday.exercises.map((e) => e.id),
    );
  }
});

test("migration updates untouched current weeks but preserves started and past legacy plans", () => {
  let data = initialData();
  data.plans[352] = generateClassicWeeklyWorkout(352);
  data.plans[351] = generateClassicWeeklyWorkout(351);
  const migrated = decodeData(JSON.stringify(data), 352);
  assert.equal(migrated.plans[352]!.program, "recomposition-v1");
  assert.deepEqual(migrated.plans[351], data.plans[351]);
  data = reduceData(data, {
    type: "toggle",
    week: 352,
    day: "monday",
    id: data.plans[352]!.days.monday.exercises[0]!.id,
    date: "2026-10-05T12:00:00Z",
  });
  const preserved = decodeData(JSON.stringify(data), 352);
  assert.deepEqual(preserved.history, data.history);
  assert.deepEqual(preserved.plans[352], data.plans[352]);
  assert.deepEqual(
    reduceData(preserved, { type: "regenerate", week: 352 }).plans[352],
    data.plans[352],
  );
  assert.deepEqual(decodeData(JSON.stringify(migrated), 352), migrated);
});
