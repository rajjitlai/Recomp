import test from "node:test";
import assert from "node:assert/strict";
import {
  programStyles,
  trainingLevels,
  workoutDays,
} from "../src/data/exerciseTypes";
import { generateProgram } from "../src/services/programGeneration";
import {
  initialData,
  reduceData,
  decodeData,
  historyKey,
} from "../src/services/state";
import { generateWeeklyWorkout } from "../src/services/workoutRotation";
import { trainingProgress } from "../src/services/trainingProgress";
import { alternativeFor } from "../src/services/exerciseAlternatives";
const date = "2026-10-06T10:00:00Z";
test("split has requested counts, muscle groups and reversible cardio/arms order at all levels", () => {
  for (const level of trainingLevels)
    for (let week = 0; week < 16; week++)
      for (const order of ["cardio-first", "arms-first"] as const) {
        const plan = generateProgram(week, level, "muscle-split-v1", order);
        assert.deepEqual(
          workoutDays.map((d) => plan.days[d].exercises.length),
          [9, 9, 6, 6, 6, 6],
        );
        for (const [day, major, minor] of [
          ["monday", "chest", "triceps"],
          ["tuesday", "back", "biceps"],
        ] as const) {
          assert.equal(
            plan.days[day].exercises.filter((e) => e.category === major).length,
            5,
          );
          assert.equal(
            plan.days[day].exercises.filter((e) => e.category === minor).length,
            4,
          );
        }
        assert.equal(
          plan.days.thursday.exercises.filter((e) => e.category === "shoulders")
            .length,
          5,
        );
        const cardio = order === "cardio-first" ? "friday" : "saturday";
        const arms = order === "cardio-first" ? "saturday" : "friday";
        assert.equal(plan.days[cardio].rounds, 2);
        assert.equal(plan.days[arms].rounds, 1);
        assert.equal(
          plan.days[arms].exercises.filter((e) => e.category === "biceps")
            .length,
          3,
        );
        assert.equal(
          plan.days[arms].exercises.filter((e) => e.category === "triceps")
            .length,
          3,
        );
        assert.ok(plan.days.monday.exercises.every((e) => e.sets <= 2));
      }
});
test("every added program has distinct alternative pairs, stable blocks, conservative recovery and valid prescriptions", () => {
  for (const program of programStyles)
    for (const level of trainingLevels)
      for (let week = 0; week < 24; week++) {
        const plan = generateProgram(week, level, program);
        assert.deepEqual(plan, generateProgram(week, level, program));
        for (const day of workoutDays) {
          const ids = new Set<string>();
          for (const exercise of plan.days[day].exercises) {
            const alt = alternativeFor(exercise)!;
            assert.ok(alt, exercise.name);
            for (const id of [exercise.id, alt.id]) {
              assert.ok(!ids.has(id), program + " " + day + " " + id);
              ids.add(id);
            }
            assert.equal(alt.sets, exercise.sets);
            assert.ok(exercise.sets >= 1);
            assert.ok(exercise.instructions.length > 30);
          }
        }
        if (week % 4 === 3) {
          const normal = generateProgram(week - 1, level, program);
          for (const day of workoutDays) {
            assert.deepEqual(
              plan.days[day].exercises.map((e) => e.id),
              normal.days[day].exercises.map((e) => e.id),
            );
            assert.ok(
              plan.days[day].exercises.every(
                (e, i) => e.sets <= normal.days[day].exercises[i]!.sets,
              ),
            );
          }
        }
      }
});
test("general health covers major movement groups three days and has optional movement with aerobic preferences", () => {
  for (const level of trainingLevels) {
    const plan = generateProgram(
      300,
      level,
      "general-health-v1",
      "cardio-first",
      "cycling",
    );
    for (const day of ["monday", "wednesday", "friday"] as const) {
      const cats = plan.days[day].exercises.flatMap((e) => [
        e.category,
        ...e.secondaryCategories,
      ]);
      for (const cat of ["quads", "chest", "back", "hamstrings", "core"])
        assert.ok(cats.includes(cat as (typeof cats)[number]));
      assert.equal(plan.days[day].rounds, 1);
      assert.equal(plan.days[day].exercises.length, 6);
      assert.match(plan.days[day].guidance!, /cycling/);
    }
    for (const day of ["tuesday", "thursday", "saturday"] as const) {
      assert.equal(plan.days[day].optional, true);
      assert.equal(plan.days[day].exercises.length, 6);
      assert.match(plan.days[day].guidance!, /150–300/);
    }
  }
});
test("program selection preserves history and started weeks, updates untouched future plans, and survives restart with swaps", () => {
  let data = reduceData(initialData(), { type: "ensureWeek", week: 300 });
  data = reduceData(data, { type: "ensureWeek", week: 301 });
  const id = data.plans[300]!.days.monday.exercises[0]!.id;
  data = reduceData(data, {
    type: "toggle",
    week: 300,
    day: "monday",
    id,
    date,
  });
  const old = data.plans[300];
  data = reduceData(data, {
    type: "programStyle",
    program: "muscle-split-v1",
    weekendOrder: "arms-first",
    aerobicActivity: "cycling",
    week: 300,
    date,
  });
  assert.deepEqual(data.plans[300], old);
  assert.equal(data.plans[301]!.program, "muscle-split-v1");
  assert.equal(data.plans[301]!.days.friday.title, "Arms");
  const selected = data.plans[301]!.days.monday.exercises[0]!;
  data = reduceData(data, {
    type: "swapExercise",
    week: 301,
    day: "monday",
    id: selected.id,
  });
  assert.deepEqual(decodeData(JSON.stringify(data), 300), data);
  assert.deepEqual(
    data.history[historyKey(300, "monday")]!.completedExercises,
    [id],
  );
  data = reduceData(data, {
    type: "trainingLevel",
    level: "advanced",
    week: 301,
    date,
  });
  assert.equal(data.plans[301]!.program, "muscle-split-v1");
  assert.equal(data.plans[301]!.weekendOrder, "arms-first");
});
test("v1 saves keep recomposition and reject unknown new program settings", () => {
  let data = reduceData(initialData(), { type: "ensureWeek", week: 300 });
  assert.deepEqual(
    decodeData(JSON.stringify(data), 300).plans[300],
    generateWeeklyWorkout(300, "beginner"),
  );
  for (const field of ["program", "weekendOrder", "aerobicActivity"]) {
    const bad = JSON.parse(JSON.stringify(data));
    bad.training[field] = "invalid";
    assert.throws(() => decodeData(JSON.stringify(bad), 300), /program/);
  }
  const bad = JSON.parse(JSON.stringify(data));
  bad.plans[300].program = "invalid";
  assert.throws(() => decodeData(JSON.stringify(bad), 300), /program/);
});

test("automatic advancement stays in selected program and optional circuits do not count", () => {
  for (const program of ["muscle-split-v1", "general-health-v1"] as const) {
    const start = new Date(2026, 0, 5, 9);
    const startWeek = Math.floor(
      (Date.UTC(2026, 0, 5) - Date.UTC(2020, 0, 6)) / (7 * 86400000),
    );
    let data = reduceData(initialData(), {
      type: "programStyle",
      program,
      weekendOrder: "arms-first",
      aerobicActivity: "cycling",
      week: startWeek,
      date: start.toISOString(),
    });
    if (program === "general-health-v1") {
      let optionalData = data;
      for (let w = 0; w < 12; w++) {
        const week = startWeek + w;
        optionalData = reduceData(optionalData, { type: "ensureWeek", week });
        for (const day of ["tuesday", "thursday", "saturday"] as const) {
          const at = new Date(start);
          at.setDate(at.getDate() + w * 7 + workoutDays.indexOf(day));
          at.setHours(18);
          for (const e of optionalData.plans[week]!.days[day].exercises)
            optionalData = reduceData(optionalData, {
              type: "toggle",
              week,
              day,
              id: e.id,
              date: at.toISOString(),
            });
        }
      }
      const now = new Date(start);
      now.setDate(now.getDate() + 12 * 7);
      assert.equal(trainingProgress(optionalData, now).activeWeeks, 0);
    }
    for (let w = 0; w < 12; w++) {
      const week = startWeek + w;
      data = reduceData(data, { type: "ensureWeek", week });
      const days =
        program === "general-health-v1"
          ? (["monday", "wednesday", "friday"] as const)
          : (["monday", "tuesday", "wednesday"] as const);
      for (const day of days) {
        const at = new Date(start);
        at.setDate(at.getDate() + w * 7 + workoutDays.indexOf(day));
        at.setHours(18);
        for (const e of data.plans[week]!.days[day].exercises)
          data = reduceData(data, {
            type: "toggle",
            week,
            day,
            id: e.id,
            date: at.toISOString(),
          });
      }
    }
    const now = new Date(start);
    now.setDate(now.getDate() + 12 * 7);
    data = reduceData(data, {
      type: "advanceTraining",
      week: startWeek + 12,
      date: now.toISOString(),
    });
    assert.equal(data.training.level, "intermediate");
    assert.equal(data.plans[startWeek + 12]!.program, program);
    assert.equal(data.plans[startWeek + 12]!.weekendOrder, "arms-first");
    const switched = reduceData(data, {
      type: "programStyle",
      program: "recomposition-v1",
      weekendOrder: "cardio-first",
      aerobicActivity: "walking",
      week: startWeek + 12,
      date: now.toISOString(),
    });
    assert.equal(
      reduceData(switched, {
        type: "advanceTraining",
        week: startWeek + 12,
        date: now.toISOString(),
      }).training.level,
      "intermediate",
    );
  }
});
