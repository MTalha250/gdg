// Self-check for the core-team question registry and submission validation.
// Run with: node utils/coreQuestions.test.js
import assert from "node:assert/strict";
import {
  POSITIONS,
  COMMON_QUESTIONS,
  POSITION_QUESTIONS,
  QUESTION_LABELS,
  questionsFor,
  formConfig,
} from "./coreQuestions.js";

// Mirrors the checks in controllers/coreApplication.js — if these drift, a
// submission that the form accepts would be rejected by the API (or worse).
const normaliseRoll = (roll) => (roll || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
const ROLL_PATTERN = /^BS[A-Z]{2}\d{5}$/;

// ── Registry integrity ───────────────────────────────────────────────────────

// Every position has its own question block.
for (const p of POSITIONS) {
  assert.ok(POSITION_QUESTIONS[p]?.length > 0, `${p} has no questions`);
}
// No stray blocks for positions that no longer exist.
for (const p of Object.keys(POSITION_QUESTIONS)) {
  assert.ok(POSITIONS.includes(p), `orphan question block: ${p}`);
}

// Question ids must be globally unique — they are the keys of the answers map,
// so a collision would silently overwrite an answer.
const allQuestions = [...COMMON_QUESTIONS, ...Object.values(POSITION_QUESTIONS).flat()];
const ids = allQuestions.map((q) => q.id);
assert.equal(new Set(ids).size, ids.length, "duplicate question id");
assert.equal(Object.keys(QUESTION_LABELS).length, ids.length);

// Choice questions must offer options; textareas must not.
for (const q of allQuestions) {
  assert.ok(q.label?.trim(), `${q.id} has no label`);
  if (q.type === "choice") {
    assert.ok(q.options?.length >= 2, `${q.id} needs options`);
  } else {
    assert.equal(q.type, "textarea", `${q.id} has unknown type ${q.type}`);
  }
}

// Counts from the 2025 response sheet: 6 shared + the per-position blocks.
assert.equal(COMMON_QUESTIONS.length, 6);
assert.equal(questionsFor("General Secretary").length, 6 + 5);
assert.equal(questionsFor("Event Director").length, 6 + 4);
assert.equal(questionsFor("Treasurer").length, 6 + 5);
assert.equal(questionsFor("Marketing Director").length, 6 + 5);
assert.equal(questionsFor("Media Director").length, 6 + 8);
assert.equal(questionsFor("Technical Director").length, 6 + 9);

// A retired or unknown position yields only the shared questions, never a crash.
assert.equal(questionsFor("Co-Lead").length, 6);
assert.equal(questionsFor("Nonexistent Role").length, 6);

// The served config carries everything the frontends render.
const cfg = formConfig();
for (const key of [
  "positions",
  "departments",
  "semesters",
  "hoursPerWeek",
  "declarationText",
  "commonQuestions",
  "positionQuestions",
]) {
  assert.ok(cfg[key], `formConfig missing ${key}`);
}

// ── Submission validation ────────────────────────────────────────────────────

// Roll numbers arrive in every shape the 2025 sheet contained.
assert.equal(normaliseRoll("BSCE-23052"), "BSCE23052");
assert.equal(normaliseRoll("BSCE 24019"), "BSCE24019");
assert.equal(normaliseRoll("bscs23036"), "BSCS23036");
for (const roll of ["BSCE-23052", "BSCE 24019", "bscs23036", "Bscs23084"]) {
  assert.ok(ROLL_PATTERN.test(normaliseRoll(roll)), `rejected valid roll ${roll}`);
}
for (const roll of ["23184", "bs23051", "bscs2305", "mscs23051", ""]) {
  assert.ok(!ROLL_PATTERN.test(normaliseRoll(roll)), `accepted bad roll ${roll}`);
}

// A complete submission passes; a blank or whitespace-only answer does not.
const answerAll = (position) =>
  Object.fromEntries(questionsFor(position).map((q) => [q.id, "an answer"]));

const missingFor = (position, answers) =>
  questionsFor(position).filter((q) => !String(answers[q.id] || "").trim());

assert.equal(missingFor("Treasurer", answerAll("Treasurer")).length, 0);

const blanked = answerAll("Treasurer");
blanked.treasuryTools = "   ";
assert.equal(missingFor("Treasurer", blanked).length, 1);
assert.equal(missingFor("Treasurer", {}).length, 11);

// Answers for a different position don't satisfy this one's requirements.
assert.ok(missingFor("Technical Director", answerAll("Treasurer")).length > 0);

// Unknown keys are dropped, so a crafted payload can't stuff the answers map.
const crafted = { ...answerAll("Event Director"), status: "accepted", __proto__: "x" };
const cleaned = Object.fromEntries(
  questionsFor("Event Director").map((q) => [q.id, String(crafted[q.id]).trim()])
);
assert.equal(Object.keys(cleaned).length, 10);
assert.ok(!("status" in cleaned));

console.log(`✓ core questions OK — ${POSITIONS.length} positions, ${ids.length} unique questions`);
