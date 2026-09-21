// Distribution — how the skill actually REACHES a user.
//
// ⚠️ THE DEFECT THIS LANE EXISTS FOR IS NOT A MISSING BUILDER. `scripts/build_desktop_skill_zip.mjs`
// already takes `--out <path>` and is already guarded (derived members, a REQUIRED floor, a byte
// floor, a wrapper-folder assertion). It simply was not DELIVERED: `files[]` excluded `scripts/`
// and there was no `bin`, so a working builder reached ZERO users while the maintainer used it
// from a checkout every release. A capability that ships to nobody is indistinguishable from one
// that does not exist — which is why the packaging assertion below is a test and not a note.
//
// ⛔ AND IT IS AN EXPLICIT COMMAND, NEVER A `postinstall`. Writing into $HOME from postinstall is
// skipped under --ignore-scripts, breaks in CI and sandboxes, orphans files on uninstall, and is a
// supply-chain shape reviewers distrust.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BIN = path.join(ROOT, 'bin', 'nsauditor-ai-agent-skill.mjs');
const run = (...args) => spawnSync(process.execPath, [BIN, ...args], { encoding: 'utf8', cwd: ROOT });
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'nsa-skill-'));

// The member set is DERIVED from disk, exactly as the zip builder derives it — a hand list here
// would pass while the real install silently dropped a reference file.
const expectedMembers = () => ['SKILL.md',
  ...fs.readdirSync(path.join(ROOT, 'references')).filter((f) => f.endsWith('.md')).map((f) => `references/${f}`)].sort();

test('the PACKAGE SHIPS the builder and the CLI — the whole defect was that it did not', () => {
  const r = spawnSync('npm', ['pack', '--dry-run', '--json'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const files = JSON.parse(r.stdout)[0].files.map((f) => f.path);
  // ⚠️ MEASURED, so the next reader is not puzzled by an unkillable mutant: npm FORCE-INCLUDES any
  // file referenced by `bin`, whatever `files[]` says — removing `"bin/"` from files[] leaves the
  // CLI in the tarball, so that mutation is EQUIVALENT rather than a coverage gap. The `"bin/"`
  // entry is kept as a declaration of intent; it is npm's behaviour that makes it redundant.
  assert.ok(files.includes('bin/nsauditor-ai-agent-skill.mjs'), 'the CLI must be in the tarball');
  assert.ok(files.includes('scripts/build_desktop_skill_zip.mjs'),
    'the zip builder must be in the tarball — it works, it was simply never delivered');
});

test('the CHANGELOG is NOT shipped, and nothing shipped POINTS at it', () => {
  // ⚠️ BOARD S1. `CHANGELOG.md` is 200 kB of a 428 kB tarball — 47% of what every agent
  // installing this skill downloads — and no shipped code reads it, the Desktop zip never
  // included it (its members are SKILL.md + references/*.md, derived), and no test pinned it.
  // Dropping it halves the package.
  //
  // ⚠️ THE SECOND ASSERTION IS THE ONE THAT NEARLY SHIPPED BROKEN. Removing a file leaves the
  // POINTERS to it, and the README does ship: it carried two relative links, `[CHANGELOG.md]
  // (./CHANGELOG.md)`, which resolve to nothing inside an installed package. npm rewrites
  // relative links on the package PAGE, so the defect would have been invisible exactly where
  // people look and live exactly where they do not. They point at the repository now.
  const r = spawnSync('npm', ['pack', '--dry-run', '--json'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const files = JSON.parse(r.stdout)[0].files.map((f) => f.path);
  assert.ok(!files.includes('CHANGELOG.md'),
    'the CHANGELOG is back in the tarball — it is 47% of the package and nothing reads it');
  const shipped = files.filter((f) => f.endsWith('.md'));
  for (const f of shipped) {
    const body = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const relative = [...body.matchAll(/\]\((\.\/)?CHANGELOG\.md\)/g)];
    assert.equal(relative.length, 0,
      `${f} links to ./CHANGELOG.md relatively, which is dead inside an installed package`);
  }
});

test('`install --dest` copies EVERY shipped member, not merely SKILL.md', () => {
  const dest = tmp();
  const r = run('install', '--dest', dest);
  assert.equal(r.status, 0, r.stderr);
  const skillDir = path.join(dest, 'nsauditor-ai');
  const got = [];
  const walk = (d, pre = '') => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(d, e.name), `${pre}${e.name}/`);
      else got.push(`${pre}${e.name}`);
    }
  };
  walk(skillDir);
  assert.deepEqual(got.sort(), expectedMembers(),
    'a partial copy that exits 0 is the dangerous shape — the skill loads and silently lacks a reference');
});

test('a MISSING verb is refused with usage, never a silent no-op', () => {
  const r = run();
  assert.equal(r.status, 2);
  assert.match(r.stderr + r.stdout, /build-zip/);
  assert.match(r.stderr + r.stdout, /install/);
});

test('an UNKNOWN verb is refused BY NAME rather than falling through to a default', () => {
  const r = run('instal');           // a plausible typo
  assert.equal(r.status, 2);
  assert.match(r.stderr + r.stdout, /instal/, 'the refusal must name what was typed');
});

test('`build-zip --out` delegates to the real builder and writes the zip there', () => {
  const dest = tmp();
  const r = run('build-zip', '--out', dest);
  assert.equal(r.status, 0, r.stderr);
  const zips = fs.readdirSync(dest).filter((f) => f.endsWith('.zip'));
  assert.equal(zips.length, 1, `expected one zip in ${dest}, got ${zips.join(', ')}`);
});

test('`build-zip --out <dir>` is the documented UX and must not throw EISDIR', () => {
  // The directive's own target UX is `--out ~/Desktop` — a DIRECTORY. The builder's `--out` is a
  // FILE path, so passing a directory threw from inside the zip write: a stack trace where the
  // user expected a file. Resolved at the CLI layer; the guarded builder keeps its contract.
  const dest = tmp();
  const r = run('build-zip', '--out', dest);
  assert.equal(r.status, 0, `expected a clean build, got ${r.status}: ${r.stderr}`);
  assert.doesNotMatch(r.stderr, /EISDIR|illegal operation on a directory/);
});

test('a value-less --out is refused, not treated as absent', () => {
  const r = run('build-zip', '--out');
  assert.equal(r.status, 2);
});

// ── C — the plugin-marketplace manifests. ────────────────────────────────────────────────────
// A marketplace source costs nothing per release ONLY if the manifests carry no version: a version
// here would have to be bumped in lockstep with package.json forever, which is the per-release cost
// the lane exists to remove. Omitted deliberately, so it tracks the commit SHA — and asserted as
// ABSENT below, so nobody restores it as a tidiness edit without meeting this test.
//
// ⚠️ STATED NON-REACH, because it is the operator's actual pain: a marketplace installs into Claude
// CODE only. It does NOT reach Claude Desktop, and nothing does — Desktop takes an uploaded zip.
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

test('marketplace.json carries the required shape and names this plugin', () => {
  const m = readJson('.claude-plugin/marketplace.json');
  assert.match(m.name, /^[a-z0-9-]+$/, 'marketplace name must be kebab-case');
  assert.ok(m.owner && typeof m.owner.name === 'string' && m.owner.name.length, 'owner.name is required');
  assert.ok(Array.isArray(m.plugins) && m.plugins.length === 1, 'exactly one plugin ships from this root');
  assert.equal(m.plugins[0].source, './');
});

test('plugin.json carries a kebab-case name and NO version — the version is the point', () => {
  const p = readJson('.claude-plugin/plugin.json');
  assert.match(p.name, /^[a-z0-9-]+$/);
  assert.equal('version' in p, false,
    'a version here must be bumped every release forever; omitting it tracks the commit SHA, which '
    + 'is what makes a marketplace source cost zero per release');
});

test('the manifests SHIP — a marketplace source reads the git tree, but npm users see them too', () => {
  const r = spawnSync('npm', ['pack', '--dry-run', '--json'], { cwd: ROOT, encoding: 'utf8' });
  const files = JSON.parse(r.stdout)[0].files.map((f) => f.path);
  assert.ok(files.includes('.claude-plugin/plugin.json'));
  assert.ok(files.includes('.claude-plugin/marketplace.json'));
});
