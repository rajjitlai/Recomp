import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { exercises, pools } from "../src/data/exercises";
import { workoutDays } from "../src/data/exerciseTypes";
import {
  currentWeekNumber,
  generateClassicWeeklyWorkout as generateWeeklyWorkout,
  weekStart,
} from "../src/services/workoutRotation";

test("every requested exercise is present, IDs are unique, metadata is usable", () => {
  const brief = readFileSync("Agent.md", "utf8");
  const sections = brief.slice(
    brief.indexOf("# 5. Complete Exercise Database"),
    brief.indexOf("# 9. Sets and Reps"),
  );
  const names = [...sections.matchAll(/```text\s*([\s\S]*?)```/g)]
    .flatMap((match) => match[1]!.trim().split(/\r?\n/))
    .filter(
      (name) =>
        name.trim() &&
        !/^(Quads|Hamstrings|Glutes|Calves|40 seconds|20 seconds|1–2 minutes|Week \d:)/.test(
          name,
        ),
    );
  for (const name of names)
    assert.ok(
      exercises.some((e) => e.name === name.trim()),
      name,
    );
  assert.equal(new Set(exercises.map((e) => e.id)).size, exercises.length);
  for (const e of exercises) {
    assert.ok(e.instructions.length > 30);
    assert.ok(e.equipment);
    assert.ok(e.sets >= 3);
    assert.ok(e.imagePath.endsWith(".jpg"));
  }
});

test("200 weekly plans preserve counts, category balance, uniqueness, and determinism", () => {
  const seen = new Set<string>();
  for (let week = 0; week < 200; week++) {
    const plan = generateWeeklyWorkout(week);
    assert.deepEqual(plan, generateWeeklyWorkout(week));
    for (const day of workoutDays) {
      const selected = plan.days[day].exercises;
      assert.equal(selected.length, day === "wednesday" ? 6 : 9);
      assert.equal(
        new Set(selected.map((e) => e.name)).size,
        selected.length,
        `${week} ${day} duplicate`,
      );
      selected.forEach((e) => seen.add(e.id));
    }
    for (const [day, major, minor] of [
      ["monday", "chest", "triceps"],
      ["tuesday", "back", "biceps"],
      ["thursday", "shoulders", "traps"],
      ["friday", "biceps", "triceps"],
    ] as const) {
      assert.equal(
        plan.days[day].exercises.filter((e) => e.category === major).length,
        6,
      );
      assert.equal(
        plan.days[day].exercises.filter((e) => e.category === minor).length,
        3,
      );
    }
    const legs = plan.days.wednesday.exercises;
    for (const group of ["quads", "hamstrings", "glutes", "calves"])
      assert.ok(legs.some((e) => e.category === group));
    assert.equal(plan.days.saturday.rounds, 3);
    for (const pool of ["conditioning", "bodyweight", "core"])
      assert.equal(
        plan.days.saturday.exercises.filter((e) => e.pool === pool).length,
        3,
      );
    for (const [pattern, count] of [
      ["jump", 2],
      ["locomotion", 1],
      ["push", 1],
      ["legs", 2],
      ["stability", 1],
      ["core-flexion", 2],
    ] as const)
      assert.equal(
        plan.days.saturday.exercises.filter(
          (e) => e.movementPattern === pattern,
        ).length,
        count,
      );
    const arms = [plan.days.monday, plan.days.tuesday, plan.days.friday]
      .flatMap((day) => day.exercises)
      .filter((e) => ["biceps", "triceps"].includes(e.category));
    assert.equal(new Set(arms.map((e) => e.id)).size, arms.length);
  }
  // Alternatives outside the legacy pools are intentionally not auto-selected.
  for (const exercise of Object.values(pools).flat())
    assert.ok(seen.has(exercise.id), `${exercise.id} never selected`);
});

test("adjacent weeks avoid repeating major groups and shared arm pools", () => {
  for (let week = 0; week < 100; week++) {
    const a = Object.values(generateWeeklyWorkout(week).days).flatMap(
      (d) => d.exercises,
    );
    const b = Object.values(generateWeeklyWorkout(week + 1).days).flatMap(
      (d) => d.exercises,
    );
    for (const pool of [
      "chest",
      "back",
      "biceps",
      "triceps",
      "shoulders",
      "quads",
      "calves",
      "bodyweight",
      "conditioning",
    ] as const) {
      const previous = new Set(
        a.filter((e) => e.pool === pool).map((e) => e.id),
      );
      assert.equal(
        b.filter((e) => e.pool === pool && previous.has(e.id)).length,
        0,
        `${week} ${pool}`,
      );
    }
  }
  assert.ok(pools.biceps.length >= 18);
});

test("week IDs use local Monday boundaries including year and DST transitions", () => {
  assert.equal(
    currentWeekNumber(new Date(2026, 9, 4, 23, 59)),
    currentWeekNumber(new Date(2026, 8, 28)),
  );
  assert.equal(
    currentWeekNumber(new Date(2026, 9, 5)),
    currentWeekNumber(new Date(2026, 9, 4)) + 1,
  );
  for (let week = -10; week < 500; week++) {
    assert.equal(weekStart(week).getDay(), 1);
    assert.equal(currentWeekNumber(weekStart(week)), week);
  }
  assert.throws(() => generateWeeklyWorkout(NaN));
  assert.throws(() => generateWeeklyWorkout(1.5));
});
