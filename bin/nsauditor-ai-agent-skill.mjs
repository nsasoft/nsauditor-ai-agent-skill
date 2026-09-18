#!/usr/bin/env node
// The delivery CLI for the NSAuditor AI agent skill.
//
// ⚠️ WHY THIS EXISTS: `scripts/build_desktop_skill_zip.mjs` already worked and already took
// `--out`. It was never DELIVERED — `files[]` excluded `scripts/` and there was no `bin` — so the
// maintainer used it from a checkout every release while it reached zero users. A capability that
// ships to nobody is indistinguishable from one that does not exist.
//
// ⛔ AN EXPLICIT COMMAND, NEVER A `postinstall`. Writing into $HOME from a postinstall is skipped
// under `--ignore-scripts`, breaks in CI and sandboxes, orphans files on uninstall, and is a
// supply-chain shape reviewers distrust. The user asks for the install; the install does not
// happen to them.
//
// ⚠️ THE TWO SURFACES ARE NOT THE SAME AND THE DIFFERENCE IS STRUCTURAL, not an oversight in our
// packaging: Claude Code loads skills from the FILESYSTEM (`~/.claude/skills/`), so `install` is a
// copy; Claude Desktop accepts skills ONLY as an uploaded zip through Settings, so `build-zip`
// makes the artifact and a human uploads it. Skills do not sync between surfaces.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_NAME = 'nsauditor-ai';

const USAGE = `nsauditor-ai-agent-skill — deliver the NSAuditor AI skill to a Claude surface

  nsauditor-ai-agent-skill install [--dest <dir>]
      Copy the skill into Claude Code's skills directory (default ~/.claude/skills).
      Claude Code loads skills from the filesystem; restart is not required.

  nsauditor-ai-agent-skill build-zip [--out <dir|file>]
      Build the Claude Desktop upload zip. Desktop accepts skills ONLY as a zip
      uploaded through Settings > Features — there is no directory it watches.

Skills do NOT sync between Claude Code, Claude Desktop and the API.`;

const flag = (argv, name) => {
  const i = argv.indexOf(name);
  if (i === -1) return undefined;
  const v = argv[i + 1];
  // A value-less flag is NOT the same as an absent one: absent means "use the default", while a
  // swallowed value is an operator mistake that must not silently produce the default anyway.
  return v === undefined || v.startsWith('--') ? true : v;
};

// DERIVED from disk, exactly as the zip builder derives its members. A hand list here would pass
// its own test while a real install silently dropped a reference file — and a skill that loads
// without its references degrades quietly rather than failing.
function members() {
  const refs = fs.readdirSync(path.join(ROOT, 'references'))
    .filter((f) => f.endsWith('.md')).map((f) => `references/${f}`);
  return ['SKILL.md', ...refs];
}

function install(argv) {
  const destFlag = flag(argv, '--dest');
  if (destFlag === true) {
    console.error('install: --dest needs a directory. A flag that quietly does nothing is how an '
      + 'operator concludes an install succeeded.');
    return 2;
  }
  const dest = destFlag ?? path.join(os.homedir(), '.claude', 'skills');
  const target = path.join(dest, SKILL_NAME);

  const list = members();
  const missing = list.filter((m) => !fs.existsSync(path.join(ROOT, m)));
  if (missing.length) {
    // Refuse rather than copy what is present: a partial skill loads and is silently poorer.
    console.error(`install: refusing — these members are missing from the package: ${missing.join(', ')}`);
    return 1;
  }

  try {
    for (const m of list) {
      const to = path.join(target, m);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(path.join(ROOT, m), to);
    }
  } catch (e) {
    console.error(`install: ${e?.message || e}`);
    return 1;
  }
  console.log(`Installed ${list.length} file(s) to ${target}`);
  console.log('Claude Code will pick it up from the filesystem. This does NOT reach Claude Desktop —');
  console.log('for Desktop run `build-zip` and upload the zip in Settings > Features.');
  return 0;
}

function buildZip(argv) {
  const script = path.join(ROOT, 'scripts', 'build_desktop_skill_zip.mjs');
  // ⚠️ THE BUILDER'S `--out` IS A FILE PATH; THE USEFUL UX IS A DIRECTORY (`--out ~/Desktop`).
  // Handing it a directory throws EISDIR from inside the zip write — a stack trace where the user
  // expected a file. Resolved HERE rather than in the builder, because the builder's contract is
  // guarded (derived members, REQUIRED floor, byte floor, wrapper-folder assertion) and this is a
  // UX concern, not a packaging one. A value-less `--out` is refused for the same reason `install`
  // refuses a value-less `--dest`.
  const out = flag(argv, '--out');
  if (out === true) {
    console.error('build-zip: --out needs a path.');
    return 2;
  }
  let argvOut = argv;
  if (typeof out === 'string') {
    let resolved = out;
    try {
      if (fs.existsSync(out) && fs.statSync(out).isDirectory()) {
        const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
        resolved = path.join(out, `nsauditor-ai-skill-${version}.zip`);
      }
    } catch { /* fall through with the literal value; the builder reports its own failure */ }
    argvOut = argv.map((a, i) => (i === argv.indexOf('--out') + 1 ? resolved : a));
  }
  if (!fs.existsSync(script)) {
    console.error(`build-zip: the builder is not in this package (${script}). This is the packaging `
      + 'defect this CLI exists to close — report it rather than working around it.');
    return 1;
  }
  // SPAWNED, not imported: the builder is a top-level script whose exit codes are its contract
  // (1 = a declared member missing or coverage below the floor). Importing it would swallow them.
  const r = spawnSync(process.execPath, [script, ...argvOut], { stdio: 'inherit' });
  return r.status ?? 1;
}

const [verb, ...rest] = process.argv.slice(2);
let code;
switch (verb) {
  case 'install': code = install(rest); break;
  case 'build-zip': code = buildZip(rest); break;
  case '--help': case '-h': case 'help': console.log(USAGE); code = 0; break;
  case undefined:
    console.error('nsauditor-ai-agent-skill: a verb is required.\n');
    console.error(USAGE);
    code = 2; break;
  default:
    // Name what was typed. A refusal that does not quote the input reads as a tool failure.
    console.error(`nsauditor-ai-agent-skill: unknown verb \`${verb}\`.\n`);
    console.error(USAGE);
    code = 2;
}
process.exit(code);
