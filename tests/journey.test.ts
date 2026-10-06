import test from "node:test";
import assert from "node:assert/strict";
import { initialData, reduceData, decodeData } from "../src/services/state";
import { programStyles, trainingLevels } from "../src/data/exerciseTypes";
test("fresh installs require the journey even after a preview plan is saved", () => {
  const fresh = decodeData(null);
  assert.equal(fresh.journeyCompleted, false);
  const preview = reduceData(fresh, { type: "ensureWeek", week: 350 });
  assert.equal(
    decodeData(JSON.stringify(preview), 350).journeyCompleted,
    false,
  );
  assert.equal(preview.training.configured, false);
});
test("journey completion saves every choice and builds matching plans for all programs and levels", () => {
  for (const program of programStyles)
    for (const level of trainingLevels) {
      const data = reduceData(initialData(), {
        type: "completeJourney",
        program,
        level,
        weekendOrder: "arms-first",
        aerobicActivity: "cycling",
        autoAdvance: false,
        week: 350,
        date: "2026-10-06T12:00:00Z",
      });
      assert.equal(data.journeyCompleted, true);
      assert.equal(data.training.configured, true);
      assert.equal(data.training.autoAdvance, false);
      assert.equal(data.training.level, level);
      assert.equal(data.training.program, program);
      assert.equal(data.training.weekendOrder, "arms-first");
      assert.equal(data.training.aerobicActivity, "cycling");
      assert.equal(data.plans[350]!.program, program);
      assert.equal(data.plans[350]!.trainingLevel, level);
      assert.deepEqual(decodeData(JSON.stringify(data), 350), data);
      assert.equal(
        reduceData(data, {
          type: "completeJourney",
          program: "recomposition-v1",
          level: "beginner",
          weekendOrder: "cardio-first",
          aerobicActivity: "walking",
          autoAdvance: true,
          week: 350,
          date: "2026-10-07T12:00:00Z",
        }),
        data,
      );
    }
});
test("existing saves bypass onboarding without losing their selections and invalid flags are rejected", () => {
  const old = JSON.parse(
    JSON.stringify(
      reduceData(initialData(), {
        type: "trainingLevel",
        level: "advanced",
        week: 350,
        date: "2026-10-06T12:00:00Z",
      }),
    ),
  );
  delete old.journeyCompleted;
  const migrated = decodeData(JSON.stringify(old), 350);
  assert.equal(migrated.journeyCompleted, true);
  assert.equal(migrated.training.level, "advanced");
  assert.deepEqual(JSON.parse(JSON.stringify(migrated.plans)), old.plans);
  const oldUnconfigured = JSON.parse(JSON.stringify(initialData()));
  delete oldUnconfigured.journeyCompleted;
  assert.equal(
    decodeData(JSON.stringify(oldUnconfigured), 350).journeyCompleted,
    true,
  );
  old.journeyCompleted = "false";
  assert.throws(() => decodeData(JSON.stringify(old), 350), /journey/);
});
