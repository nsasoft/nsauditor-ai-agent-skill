// THE SKILL TEACHES WHAT THE 1.2.0 TRIO DOES — the release-doc fold before the 0.2.54 publish (2026-09-30; the
// operator's rulings "Fix docs now + claim the name", "Fix all three now", "Keep it, explain it").
//
// (1) npx MAY ONLY RUN A PACKAGE THIS PROJECT PUBLISHES TO BE RUN. `nsauditor-ai-mcp` is a BIN inside `nsauditor-ai`,
//     not a package. When npx does not find that bin installed it asks the npm REGISTRY for a package of that name, and
//     the name was unclaimed — and this skill taught `npx nsauditor-ai-mcp`, plus a Desktop block whose command was
//     `npx -y`, which suppressed npx's own install prompt. Only COMMAND POSITIONS are read — fenced code and inline code
//     spans — because prose that names npx runs nothing; the one exemption is POSITIONAL, the warning form
//     "never `npx …`" immediately before the span.
// (2) Below the Community floor the symptom is the MEASURED one: Community 0.2.55 still loads the Enterprise plugins
//     and `license --plugins` reports Enterprise `(loaded)`, but the scan skips Enterprise's intelligence,
//     analysis-agent and compliance stages. "The scan runs as Community" and "does not load at all" were driven false
//     on a 0.2.55 sandbox (Gate 3-A's K3 grades the answer this teaching produces).
// (3) NSA_ALLOW_ALL_HOSTS (Community 0.2.57, CE 999cd93): over MCP every address a host name resolves to is checked in
//     BOTH arms; the variable admits private ranges only — never loopback, link-local or metadata — and turns on only
//     for 1 / true / yes / on. Wherever the skill tells a user to set it for the MCP server it says so, no shipped file
//     still teaches the 0.2.56 "turns that check off" semantics, and no file claims DNS rebinding is blocked.
// (4) `vulnerability-data-changed` is scoped: neither rule reaches a port that answers with two different identified
//     programs or versions, so no teaching file says such a row is NEVER a closed finding.
//
// SUBJECT — derived: the .md files `npm pack --dry-run` ships. FOURTH QUADRANT FIRST.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

/** The .md files the tarball carries — derived, never listed by hand. */
function shippedMarkdown() {
  const r = spawnSync('npm', ['pack', '--dry-run', '--json'], { cwd: ROOT, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const md = JSON.parse(r.stdout)[0].files.map((f) => f.path).filter((p) => p.endsWith('.md'));
  for (const must of ['README.md', 'SKILL.md']) {
    assert.ok(md.includes(must), `the subject derivation is blind: ${must} is not among ${md.join(', ')}`);
  }
  return md;
}

// ── (1) npx ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const RUNNABLE = new Set(['nsauditor-ai', 'nsauditor-ai-agent-skill']);
const NPX = /\bnpx\b((?:\s+(?:-y|--yes|-q|--quiet|--no-install|--offline|(?:-p|--package)(?:=|\s+)[^\s`'"]+))*)\s+([@a-z0-9][^\s`'"]*)/g;
const pkgName = (s) => (s.startsWith('@') ? s.replace(/^(@[^/]+\/[^@]+)@.*$/, '$1') : s.replace(/@.*$/, ''));

/** Fenced lines and inline code spans of a markdown text, each with its offset in the source. */
function codeRegions(md) {
  const out = [];
  let off = 0;
  let fence = null;
  for (const line of md.split('\n')) {
    const f = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length) fence = null;
      // a shell / JS comment line is prose: only its inline code spans are commands — unless the comment IS a command,
      // commented out (`# npx …`, `# $ npx …`), which is read whole (v77-9, 1.3.0). Prose that merely names npx mid-line
      // ("when npx does not find that bin") is not a command and is not read.
      else if (/^\s*(?:#|\/\/)/.test(line)) {
        const cmd = /^(\s*(?:#|\/\/)\s*(?:\$\s*)?)(npx\b.*)$/.exec(line);
        if (cmd) out.push({ start: off + cmd[1].length, text: cmd[2] });
        else for (const s of line.matchAll(/`([^`]+)`/g)) out.push({ start: off + s.index + 1, text: s[1] });
      } else out.push({ start: off, text: line });
    } else if (f) {
      fence = f[1];
    } else {
      for (const s of line.matchAll(/`([^`]+)`/g)) out.push({ start: off + s.index + 1, text: s[1] });
    }
    off += line.length + 1;
  }
  return out;
}

/** { bad, ok }: every npx command position, judged; every Desktop block whose command is npx is bad. */
function npxCommands(md) {
  const bad = [];
  const ok = [];
  for (const r of codeRegions(md)) {
    if (/"command"\s*:\s*"npx"/.test(r.text)) bad.push(`a Desktop block runs npx: ${r.text.trim()}`);
    for (const m of r.text.matchAll(NPX)) {
      const p = /(?:-p|--package)(?:=|\s+)([^\s`'"]+)/.exec(m[1]);
      const name = pkgName(p ? p[1] : m[2]);
      if (RUNNABLE.has(name)) { ok.push(m[0]); continue; }
      if (/\bnever\s+`$/i.test(md.slice(0, r.start + m.index))) { ok.push(`never ${m[0]}`); continue; }
      bad.push(`npx runs \`${name}\`, which this project does not publish to be run: ${m[0]}`);
    }
  }
  return { bad, ok };
}

test('(q) npx: the forms that run OUR packages, a warning, and prose naming npx all stay green', () => {
  const { bad, ok } = npxCommands([
    '```bash', 'npx nsauditor-ai scan --host 192.0.2.1 --plugins all', '```',
    'Build it with `npx nsauditor-ai-agent-skill build-zip --out ~/Desktop`.',
    'Run the installed bin, never `npx nsauditor-ai-mcp`: when npx does not find that bin it asks the registry.',
    '   ```bash', '   # Never `npx nsauditor-ai-mcp`: the server is a bin inside the nsauditor-ai package, and when npx does not', '   # find that bin it looks the name up (no global install), which never starts this server', '   ```',
    // v77-9 (1.3.0): a COMMENTED-OUT command is read as a command — and one that runs OUR package stays green.
    '```bash', '# npx nsauditor-ai scan --host 192.0.2.1', '```',
  ].join('\n'));
  assert.deepEqual(bad, []);
  assert.equal(ok.length, 5, ok.join(' | '));
});

test('npx: an unowned name in any command position is red — bare, -y, after `--`, inline, and a Desktop npx block', () => {
  for (const md of [
    '```bash\nnpx nsauditor-ai-mcp\n```',
    '```bash\n# Or via npx (no global install)\nnpx nsauditor-ai-mcp\n```',
    // v77-9 (1.3.0): a commented-out command — the guard read only backtick spans inside a comment, so these were invisible.
    '```bash\n# npx nsauditor-ai-mcp\n```',
    '```bash\n# $ npx -y nsauditor-ai-mcp\n```',
    '```bash\nclaude mcp add nsauditor-ai --env K=v -- npx nsauditor-ai-mcp\n```',
    'Or run `npx -y nsauditor-ai-mcp` with no global install.',
    '```bash\nnpx -p someone-elses-package nsauditor-ai\n```',
    '```json\n{\n  "mcpServers": {\n    "nsauditor-ai": {\n      "command": "npx",\n      "args": ["nsauditor-ai"]\n    }\n  }\n}\n```',
    // the exemption is positional: "never" elsewhere in the sentence does not reach the span
    'Never mind the install step and run `npx nsauditor-ai-mcp`.',
  ]) assert.equal(npxCommands(md).bad.length, 1, md);
});

test('npx: no shipped .md runs a package this project does not publish to be run (subject from npm pack)', () => {
  let accepted = 0;
  for (const rel of shippedMarkdown()) {
    const { bad, ok } = npxCommands(read(rel));
    assert.deepEqual(bad, [], `${rel}:\n  ${bad.join('\n  ')}`);
    accepted += ok.length;
  }
  // positive control: the corpus does print npx commands of our own, so a reader blind to them fails here
  assert.ok(accepted >= 2, `the npx reader accepted ${accepted} commands in the shipped docs — it is not reading them`);
});

// ── (2) below the floor ──────────────────────────────────────────────────────────────────────────────────────────────
const BELOW_FLOOR_FALSE = [/\b(?:runs?|running|ran) (?:silently )?as Community\b/i, /\bnot load at all\b/i,
  /(?<!index )\bwould not load below it\b/i, /\bload(?:s|ed)? it as "not installed"/i];
const SYMPTOM = /plugins load, but the scan skips its intelligence, analysis-agent and compliance stages/;

test('(q) below the floor: the index not loading reads green; Enterprise as a whole not loading reads red', () => {
  assert.ok(!BELOW_FLOOR_FALSE.some((re) => re.test("because Enterprise's index would not LOAD below it")));
  for (const s of ['because Enterprise would not LOAD below it', 'the scan runs as Community and says nothing',
    'on 0.2.55 Enterprise 1.2.0 does not load at all']) assert.ok(BELOW_FLOOR_FALSE.some((re) => re.test(s)), s);
});

test('below the floor: no shipped .md teaches "runs as Community", and README + SKILL.md teach the measured symptom', () => {
  for (const rel of shippedMarkdown()) {
    const s = read(rel);
    for (const re of BELOW_FLOOR_FALSE) assert.doesNotMatch(s, re, `${rel} teaches a below-floor symptom 0.2.55 does not show`);
  }
  assert.match(read('README.md'), SYMPTOM);
  const skill = read('SKILL.md');
  assert.match(skill, /still loads the Enterprise plugins, and `license --plugins` reports Enterprise 1\.2\.0 `\(loaded\)`, but the scan skips its intelligence, analysis-agent and compliance stages/);
  assert.match(skill, SYMPTOM);
});

// ── (3) NSA_ALLOW_ALL_HOSTS ──────────────────────────────────────────────────────────────────────────────────────────
const DISCLOSES = /admits private ranges only/;
// The 0.2.56 semantics, in every wording the skill used for it (\s+ spans a hard wrap).
const STALE_ALLOW_ALL = /no longer a name that resolves to a loopback or cloud-metadata address|a name that resolves to a loopback or metadata address then gets through|turns off the MCP server's check of the address a host name resolves to|while `NSA_ALLOW_ALL_HOSTS` is unset\s+it also checks|without the variable it also\s+checks the address/;

/** The text right after the code block that sets NSA_ALLOW_ALL_HOSTS for the MCP server — where a reader looks next. */
const afterDesktopBlock = (s) => {
  const at = s.indexOf('"NSA_ALLOW_ALL_HOSTS": "1"');
  if (at < 0) return null;
  const close = s.indexOf('```', at);
  return close < 0 ? null : s.slice(close, close + 1200);
};

test('NSA_ALLOW_ALL_HOSTS: every Desktop block that sets it is followed by what it opens; no file claims rebinding is blocked', () => {
  for (const rel of ['README.md', 'SKILL.md']) {
    const after = afterDesktopBlock(read(rel));
    assert.ok(after, `${rel} no longer shows the Desktop env block — re-derive this leg's subject`);
    assert.match(after, DISCLOSES, `${rel} tells a user to set NSA_ALLOW_ALL_HOSTS for the MCP server without saying, right after, what it opens`);
  }
  // and the SSRF item that says what the server refuses says what the variable opens, in the same item
  const item = /\*\*SSRF Protection:\*\*[\s\S]*?(?=\n\d+\. \*\*|\n\n)/.exec(read('SKILL.md'))?.[0];
  assert.ok(item, 'SKILL.md no longer has its SSRF Protection item — re-derive this leg');
  assert.match(item, DISCLOSES, 'the SSRF Protection item does not say what NSA_ALLOW_ALL_HOSTS opens');
  for (const rel of shippedMarkdown()) {
    const s = read(rel);
    assert.doesNotMatch(s, /DNS rebinding is (?:also )?blocked/i, rel);
    assert.doesNotMatch(s, /This prevents SSRF/, rel);
    assert.doesNotMatch(s, STALE_ALLOW_ALL, `${rel} still teaches NSA_ALLOW_ALL_HOSTS as turning the resolved-address check off`);
    assert.doesNotMatch(s, /stay blocked through the MCP server either way/, rel);
  }
});

// ── (4) vulnerability-data-changed, scoped ───────────────────────────────────────────────────────────────────────────
test('vulnerability-data-changed: taught with its scope, never as an unconditional "never a closed finding"', () => {
  const s = read('SKILL.md');
  assert.match(s, /two different identified programs or versions/);
  for (const rel of shippedMarkdown()) assert.doesNotMatch(read(rel), /\bnever a closed finding\b/i, rel);
});
