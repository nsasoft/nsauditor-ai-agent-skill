#!/usr/bin/env node
/**
 * BUILD THE CLAUDE DESKTOP SKILL ZIP.
 *
 * ⚠️ WHY THIS EXISTS: uploading SKILL.md alone installs 37% OF THE SKILL — measured, not
 * estimated. SKILL.md is ~54 KB of ~145 KB; the missing 63% is references/plugins.md (~68 KB),
 * schemas.md and workflows.md, which SKILL.md POINTS AT and which simply are not there if only
 * SKILL.md is uploaded. Two published pages still instruct that upload, and the previous zip was
 * built by hand — a hand-built artifact has no record of what went into it.
 *
 * The zip is NOT committed. A binary in git cannot be reviewed in a diff and goes stale silently
 * the moment SKILL.md changes; the repo's forced-add guard refuses one, correctly. Generate it.
 *
 *   node scripts/build_desktop_skill_zip.mjs [--out <path>]
 *
 *   0  built, and the coverage figure below is derived from the bytes that went in
 *   1  a declared member is missing, or coverage fell below the floor
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(fs.readFileSync(path.join(here, 'package.json'), 'utf8')).version;
const outArg = process.argv.indexOf('--out');
const out = outArg !== -1 ? process.argv[outArg + 1]
  : path.join(here, `nsauditor-ai-skill-${version}.zip`);

// Members are DERIVED so a new reference file ships without anyone editing this script.
const members = ['SKILL.md', ...fs.readdirSync(path.join(here, 'references'))
  .filter((f) => f.endsWith('.md')).sort().map((f) => `references/${f}`)];

/**
 * ⚠️ A DERIVED SET CANNOT DETECT ITS OWN SHRINKAGE, AND THE FIRST VERSION OF THIS SCRIPT PROVED IT.
 * It derived `members` from readdirSync and then "checked" that every member existed — comparing a
 * list against the directory it had just been read from, which is a tautology. A mutant that
 * DELETED references/schemas.md built happily and reported success: the file was simply absent from
 * the derived list, so nothing was missing. That is the shape this project calls a false clean, and
 * the delivery it would have produced is a skill missing a reference SKILL.md points at.
 *
 * The floor below is the INDEPENDENT axis the derivation cannot supply: a minimum member set that
 * someone has to consciously edit, plus a byte floor. Deriving membership keeps it from rotting;
 * declaring a minimum keeps it from silently emptying.
 */
const REQUIRED = ['SKILL.md', 'references/plugins.md', 'references/schemas.md', 'references/workflows.md'];
const BYTE_FLOOR = 120_000;

const missing = REQUIRED.filter((m) => !members.includes(m) || !fs.existsSync(path.join(here, m)));
if (missing.length) {
  console.error(`refusing: required member(s) absent — ${missing.join(', ')}. `
    + 'The skill points at these; shipping without one delivers a skill with dangling references.');
  process.exit(1);
}

const total = members.reduce((n, m) => n + fs.statSync(path.join(here, m)).size, 0);
const skillOnly = fs.statSync(path.join(here, 'SKILL.md')).size;
if (total < BYTE_FLOOR) {
  console.error(`refusing: members total ${total} B, below the ${BYTE_FLOOR} B floor — `
    + 'something got smaller by a lot and a silent partial delivery is the failure this guards.');
  process.exit(1);
}

// ⚠️ THE ENTRIES ARE WRAPPED IN A TOP-LEVEL SKILL FOLDER, AND THE FLAT LAYOUT THIS SCRIPT
// FIRST SHIPPED WAS A LIVE DEFECT — found by the OPERATOR looking at Desktop, not by any check
// here. The canonical package format (skill-creator's package_skill.py) writes every entry as
// `<skill-name>/…` — arcname relative to the skill folder's PARENT. Fed a FLAT zip instead,
// Claude Desktop ingested SKILL.md and silently dropped references/ — the UI read "Contents · 1"
// and the install was the exact 37%-delivery failure this script exists to prevent, reintroduced
// by this script's own layout. The hand-built zip it replaced worked precisely because
// compressing the FOLDER produces the wrapper. The folder name is DERIVED from the frontmatter
// `name:` so it cannot drift from the skill's identity.
const nameMatch = /^name:\s*(\S+)\s*$/m.exec(fs.readFileSync(path.join(here, 'SKILL.md'), 'utf8'));
if (!nameMatch) {
  console.error('refusing: SKILL.md frontmatter has no `name:` — the wrapper folder is derived from it.');
  process.exit(1);
}
const SKILL_DIR = nameMatch[1];
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-zip-'));
try {
  for (const m of members) {
    const dest = path.join(stage, SKILL_DIR, m);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(here, m), dest);
  }
  fs.rmSync(out, { force: true });
  execFileSync('zip', ['-q', '-r', out, SKILL_DIR, '-x', '*.DS_Store'], { cwd: stage });
} finally {
  fs.rmSync(stage, { recursive: true, force: true });
}

// Assert on the ARTIFACT, not on the inputs: read back what the zip actually holds — the
// WRAPPED paths, because the wrapper is the property whose absence broke the install.
const expectedEntries = members.map((m) => `${SKILL_DIR}/${m}`);
const listed = execFileSync('unzip', ['-Z1', out], { cwd: here, encoding: 'utf8' })
  .split('\n').map((s) => s.trim()).filter((s) => s && !s.endsWith('/'));
const absent = expectedEntries.filter((m) => !listed.includes(m));
if (absent.length) {
  console.error(`refusing: built the zip but it does not contain ${absent.join(', ')}`);
  process.exit(1);
}
const strays = listed.filter((m) => !expectedEntries.includes(m));
if (strays.length) {
  console.error(`refusing: the zip contains entries outside ${SKILL_DIR}/ — ${strays.join(', ')} — `
    + 'a flat or mixed layout is how Desktop silently drops references/.');
  process.exit(1);
}

// ⚠️ NO "100%" FIGURE IS PRINTED, and its absence is deliberate. The first version computed
// `total / total` and announced "carries 100% of the skill" — true by construction, impossible to
// falsify, and therefore not a measurement at all. What IS measurable is the share SKILL.md alone
// would have delivered, and that is the number an operator needs.
/**
 * ⛔ CURRENCY SWEEP OVER THE SHIPPED BYTES — enumerate the vocabulary, do not pattern-match.
 *
 * ⚠️ WHY THIS IS CODE AND NOT A HABIT. Three liveness claims were cut from this header by hand in
 * one session and a FOURTH survived both a reviewer's sweep and mine — `(EE 0.40.0, live)` —
 * because each sweep grepped for the phrases the previous diff had REMOVED. That is a diff-shaped
 * check of a reading-shaped property: it verifies what changed, never what the file now says. A
 * liveness vocabulary is a vocabulary, and a missed spelling costs SILENCE.
 *
 * The refusal is narrow on purpose: a liveness adjective ATTACHED TO A VERSION is the defect class,
 * because it carries a real rot trigger — superseded versions get deprecated at the next publish.
 * Bare uses of the word are PRINTED for adjudication, never refused: "live tenant", "NOT live
 * state", "exercised against a live TSA" are all correct, and a rule that killed them would be a
 * false-positive machine nobody would keep.
 *
 * ⚠️ STATED LIMIT, AND IT IS THIS RULE'S OWN LESSON POINTED AT ITSELF. The vocabulary below is
 * THREE adjectives. That narrowness is deliberate — it is what keeps the rule out of false
 * positives — but it means a FOURTH spelling ("0.40.1, published", "0.40.1, shipping", "0.40.1,
 * GA") is INVISIBLE until someone adds it, and an incomplete vocabulary costs SILENCE rather than
 * noise. That asymmetry is exactly how three spellings of this claim got past two hand sweeps.
 *
 * SO: GROW THE ALTERNATION AND THE PROBE SET TOGETHER, in the same edit. A word added to
 * VERSION_LIVENESS without a matching entry in MUST_FIRE is a rule nobody has watched fire, and
 * this file already refuses to build on exactly that condition — use it.
 */
const shipped = execFileSync('unzip', ['-p', out, `${SKILL_DIR}/SKILL.md`], { cwd: here, encoding: 'utf8' });
// A version and a liveness adjective separated ONLY by punctuation/space — `(EE 0.40.0, live)`.
// `(?![-\w])` is load-bearing: without it `live-TSA` matches and the rule fires on an honest
// past-tense record. The window is deliberately tiny; a wide one spans intervening words and
// invents defects, which this rule did on its first run.
const VERSION_LIVENESS = /\d+\.\d+\.\d+[\s,;·—-]{1,4}(?:the\s)?(?:live|latest|current)(?![-\w])/gi;

// ⛔ SELF-TEST, BOTH DIRECTIONS, EVERY RUN. A rule that cannot fire is decoration; a rule that
// fires on honest prose gets deleted by the next maintainer. Both failure modes are real here —
// the first version of this regex committed the second one.
const MUST_FIRE = ['**What this release (EE 0.40.0, live) teaches:**', 'EE 0.40.1 — latest'];
const MUST_NOT_FIRE = [
  'which EE 0.33.0 falsified and the live-TSA smokes then falsified twice over',
  'a per-session cache (NOT live state; cleared when the MCP server restarts)',
  'it was exercised against a live Time-Stamp Authority on BOTH delivery vehicles',
  'derives the live total and marks each Enterprise plugin',
];
for (const probe of MUST_FIRE) {
  if (!new RegExp(VERSION_LIVENESS.source, 'i').test(probe)) {
    console.error(`refusing: the currency rule is DEAD — it did not fire on ${JSON.stringify(probe)}`);
    process.exit(1);
  }
}
for (const probe of MUST_NOT_FIRE) {
  if (new RegExp(VERSION_LIVENESS.source, 'i').test(probe)) {
    console.error(`refusing: the currency rule is a FALSE-POSITIVE MACHINE — it fired on honest prose: ${JSON.stringify(probe)}`);
    process.exit(1);
  }
}
const rot = [...shipped.matchAll(VERSION_LIVENESS)].map((m) => m[0].trim());
if (rot.length) {
  console.error('refusing: a liveness claim is attached to a VERSION in the shipped SKILL.md. It goes false');
  console.error('the next time that version is superseded, and a shipped file cannot know registry state:');
  for (const r of rot) console.error(`    ${r}`);
  console.error('  Drop the adjective — the knowledge bound in the version header already carries the semantics.');
  process.exit(1);
}
const bareLive = [...shipped.matchAll(/\blive\b/gi)].length;

// ⛔ THE ID→DEFECT MAPPING MUST STAY ON THE ALWAYS-LOADED SURFACE (P10-RETEST, 2026-08-28).
// It lived only in an on-demand reference once, and a first-ask agent told a reader the
// partition-side fix did not exist. Asserted on the SKILL.md read back from the ZIP, so a
// mapping that retreats to references/ — or an edit that drops an id — refuses the build.
// ⚠️ Scoped to the MAPPING SEGMENT, not bare id presence — the first version of this guard
// checked `shipped.includes(id)` and a mutant that DELETED an id from the mapping survived,
// because every id also appears elsewhere (the misattribution warning, the plugin table).
// A guard satisfiable by the wrong occurrence is unfalsifiable for exactly the edit it guards.
// The segment ends at the FIRST ⚠️ after the mapping — the misattribution warning that follows
// it also carries backticked ids (`1110`, `1050`), and a window that reached into it was the
// SECOND unfalsifiable version of this guard: the warning's `1050` satisfied a check about the
// mapping's. Non-greedy to the warning marker bounds exactly the id list.
const mapSeg = (shipped.match(/THE ID→DEFECT MAPPING[\s\S]*?⚠️/) || [''])[0];
const ALWAYS_LOADED_IDS = ['1020', '1030', '1110', '1050', '1200', '1040'];
const missingIds = ALWAYS_LOADED_IDS.filter((id) => !mapSeg.includes('`' + id + '`'));
if (!mapSeg || missingIds.length) {
  console.error(`refusing: the shipped SKILL.md's ID→DEFECT MAPPING segment is ${mapSeg ? 'missing id(s) '
    + missingIds.join(', ') : 'ABSENT'} — the mapping must stay on the always-loaded surface `
    + '(P10-RETEST class: an agent answered "the fix does not exist" while it sat in an on-demand reference).');
  process.exit(1);
}

const alonePct = Math.round((skillOnly / total) * 100);
console.log(`built ${out}`);
console.log(`  members (derived): ${listed.length} — ${listed.join(', ')}`);
console.log(`  ${total} B across ${listed.length} file(s). Uploading SKILL.md ALONE would deliver ${alonePct}% (${skillOnly} B) and leave every reference dangling.`);
console.log(`  currency sweep: 0 version-attached liveness claim(s) · ${bareLive} bare "live" use(s), printed not refused`);
console.log('  ⛔ Upload THIS FILE to Claude Desktop, not SKILL.md. Full-quit and relaunch Desktop after replacing a skill.');
