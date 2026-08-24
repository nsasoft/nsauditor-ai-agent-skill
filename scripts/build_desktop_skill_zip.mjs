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

fs.rmSync(out, { force: true });
execFileSync('zip', ['-q', '-r', out, ...members, '-x', '*.DS_Store'], { cwd: here });

// Assert on the ARTIFACT, not on the inputs: read back what the zip actually holds.
const listed = execFileSync('unzip', ['-Z1', out], { cwd: here, encoding: 'utf8' })
  .split('\n').map((s) => s.trim()).filter((s) => s && !s.endsWith('/'));
const absent = members.filter((m) => !listed.includes(m));
if (absent.length) {
  console.error(`refusing: built the zip but it does not contain ${absent.join(', ')}`);
  process.exit(1);
}

// ⚠️ NO "100%" FIGURE IS PRINTED, and its absence is deliberate. The first version computed
// `total / total` and announced "carries 100% of the skill" — true by construction, impossible to
// falsify, and therefore not a measurement at all. What IS measurable is the share SKILL.md alone
// would have delivered, and that is the number an operator needs.
const alonePct = Math.round((skillOnly / total) * 100);
console.log(`built ${out}`);
console.log(`  members (derived): ${listed.length} — ${listed.join(', ')}`);
console.log(`  ${total} B across ${listed.length} file(s). Uploading SKILL.md ALONE would deliver ${alonePct}% (${skillOnly} B) and leave every reference dangling.`);
console.log('  ⛔ Upload THIS FILE to Claude Desktop, not SKILL.md. Full-quit and relaunch Desktop after replacing a skill.');
