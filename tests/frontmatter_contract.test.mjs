// The frontmatter CEILING — the cheapest guard in this lane and the one with the least warning.
//
// ⚠️ THE LIVE DESCRIPTION IS 983 OF 1024. Forty-one characters of headroom. One more trigger
// phrase — the exact edit anyone tuning discoverability would make — breaks the skill on Claude
// Code, Desktop AND the API at once, and breaks it SILENTLY: the frontmatter is rejected, so the
// skill stops loading rather than loading wrong. The builder already refuses on a member FLOOR and
// a byte FLOOR; nothing measured the other edge until this existed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { frontmatterViolations, DESCRIPTION_MAX } from '../scripts/frontmatter_contract.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fm = (name, description) => `---\nname: ${name}\ndescription: ${description}\n---\n\n# body\n`;

test('ACCEPT — the SHIPPED SKILL.md is compliant, measured from disk and not from a fixture', () => {
  assert.deepEqual(frontmatterViolations(fs.readFileSync(path.join(ROOT, 'SKILL.md'), 'utf8')), [],
    'a ceiling that refuses the real file would be deleted by the next person who met it');
});

test('the live description is close enough to the cap that this guard is load-bearing', () => {
  const text = fs.readFileSync(path.join(ROOT, 'SKILL.md'), 'utf8');
  const desc = (frontmatterViolations(text), text.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  const len = desc.replace(/^[\s\S]*?description:\s*>?\s*/m, '').replace(/\n\s*/g, ' ').trim().length;
  assert.ok(len > DESCRIPTION_MAX * 0.9,
    `headroom is ${DESCRIPTION_MAX - len} chars — if this ever drops far below the cap, say so rather than deleting the guard`);
});

test('REFUSE — a description one character over the cap is named with its length', () => {
  const v = frontmatterViolations(fm('nsauditor-ai', 'x'.repeat(DESCRIPTION_MAX + 1)));
  assert.equal(v.length, 1);
  assert.match(v[0], new RegExp(`${DESCRIPTION_MAX + 1} chars`));
  assert.match(v[0], /silently/, 'the consequence must be stated, not just the limit');
});

test('REFUSE — the name charset, length and reserved words, each independently', () => {
  assert.match(frontmatterViolations(fm('NSAuditor-AI', 'ok'))[0], /\[a-z0-9-\]/);
  assert.match(frontmatterViolations(fm('a'.repeat(65), 'ok'))[0], /65 chars/);
  assert.ok(frontmatterViolations(fm('claude-helper', 'ok')).some((x) => /may not contain "claude"/.test(x)));
  assert.ok(frontmatterViolations(fm('anthropic-tool', 'ok')).some((x) => /may not contain "anthropic"/.test(x)));
});

test('THE BUILDER ACTUALLY CALLS IT — proven by driving the real script, not by reading its source', () => {
  // A guard imported but never invoked reads exactly like one that runs. This lane has already
  // shipped an inert leg whose unit test was green, so the wiring is driven end to end.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nsa-fm-'));
  fs.mkdirSync(path.join(tmp, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'references'), { recursive: true });
  for (const f of ['build_desktop_skill_zip.mjs', 'frontmatter_contract.mjs']) {
    fs.copyFileSync(path.join(ROOT, 'scripts', f), path.join(tmp, 'scripts', f));
  }
  for (const f of fs.readdirSync(path.join(ROOT, 'references'))) {
    fs.copyFileSync(path.join(ROOT, 'references', f), path.join(tmp, 'references', f));
  }
  fs.copyFileSync(path.join(ROOT, 'package.json'), path.join(tmp, 'package.json'));
  fs.writeFileSync(path.join(tmp, 'SKILL.md'), fm('nsauditor-ai', 'y'.repeat(DESCRIPTION_MAX + 1)), 'utf8');

  const r = spawnSync(process.execPath, [path.join(tmp, 'scripts', 'build_desktop_skill_zip.mjs'),
    '--out', path.join(tmp, 'out.zip')], { encoding: 'utf8' });
  assert.equal(r.status, 1, 'the builder must REFUSE an over-cap description');
  assert.match(r.stderr, /frontmatter breaches its published contract/);
  assert.equal(fs.existsSync(path.join(tmp, 'out.zip')), false, 'and must not have written a zip');
});
