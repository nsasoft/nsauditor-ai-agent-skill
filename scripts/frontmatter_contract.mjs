// The skill frontmatter CEILING. The zip builder already guards a FLOOR — declared members, a
// REQUIRED set, a byte minimum — because the failure it was built for was shipping too little.
// This is the opposite edge, and it has no alarm anywhere else:
//
// ⚠️ THE DESCRIPTION IS 983 OF 1024 CHARACTERS. Forty-one characters of headroom. Adding ONE more
// trigger phrase breaks the skill on EVERY surface at once — Claude Code, Desktop and the API —
// and it breaks silently: the frontmatter is simply rejected, so the skill stops loading rather
// than loading wrong. Nothing in this repo measured it before this file existed.
//
// Limits are the documented ones (platform.claude.com, 2026-09-18): `name` ≤ 64, `[a-z0-9-]` only,
// may not contain "anthropic" or "claude"; `description` non-empty, ≤ 1024.
export const NAME_MAX = 64;
export const DESCRIPTION_MAX = 1024;
const RESERVED = ['anthropic', 'claude'];

/** Parse the YAML frontmatter far enough to measure it. Folded (`>`) blocks are the live shape. */
export function parseFrontmatter(text) {
  const m = String(text).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const out = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_-]+):\s?(.*)$/);
    if (kv) { key = kv[1]; out[key] = kv[2] === '>' || kv[2] === '|' ? '' : kv[2]; }
    else if (key) out[key] = `${out[key]} ${line.trim()}`.trim();
  }
  return out;
}

/** @returns {string[]} violations — empty means compliant. */
export function frontmatterViolations(text) {
  const fm = parseFrontmatter(text);
  if (!fm) return ['SKILL.md has no YAML frontmatter block'];
  const v = [];
  const name = (fm.name ?? '').trim();
  const description = (fm.description ?? '').trim();

  if (!name) v.push('`name` is empty');
  else {
    if (name.length > NAME_MAX) v.push(`\`name\` is ${name.length} chars, over the ${NAME_MAX} limit`);
    if (!/^[a-z0-9-]+$/.test(name)) v.push(`\`name\` "${name}" must match [a-z0-9-] only`);
    for (const r of RESERVED) if (name.toLowerCase().includes(r)) v.push(`\`name\` may not contain "${r}"`);
  }
  if (!description) v.push('`description` is empty');
  else if (description.length > DESCRIPTION_MAX) {
    v.push(`\`description\` is ${description.length} chars, over the ${DESCRIPTION_MAX} limit — `
      + 'the skill will be REJECTED on every surface, silently');
  }
  return v;
}
