// WHAT THE SKILL TEACHES ABOUT COMPARING RUNS AND ABOUT scan_host (0.2.54 build 3 — the audit seat's ruling on the
// Gate 3-A preparation: fold all seven teaching defects, plus the decision-tree row and the scan_host scope).
//
// (1) references/workflows.md taught comparing runs BY HAND — "scan_host twice … compare the two scan outputs yourself …
//     diff the per-run out-dirs … New/resolved findings". Done by hand, that is the false clean 1.2.0 exists to close:
//     a finding that vanished because its port went unmeasured, its lookup failed, its agent did not run, or the
//     vulnerability data changed reads RESOLVED. The comparison is `report --since`, which states what it could not
//     compare. (2) scan_host returns services and the service checks' findings only — no CVE lookup, no analysis agents —
//     and a Desktop reply that relayed "Security findings: 0" called a router with 16 CVEs clean.
//
// FOURTH QUADRANT FIRST: the teaching that must stay is pinned before the teaching that must go.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
// Every teaching surface that SHIPS: SKILL.md, README.md, and every .md under references/ and examples/ (the build-3 review:
// examples/agent-interactions.md ships and taught a scan_host `findings[]` array that does not exist).
const TEACHING = ['SKILL.md', 'README.md', ...['references', 'examples'].flatMap((d) => fs.readdirSync(path.join(ROOT, d))
  .filter((f) => f.endsWith('.md')).map((f) => `${d}/${f}`))];
const scanHostSection = () => {
  const s = read('SKILL.md');
  const i = s.indexOf('#### `scan_host`');
  assert.ok(i >= 0, 'SKILL.md has its scan_host section');
  const j = s.indexOf('\n#### ', i + 10);
  return s.slice(i, j > i ? j : undefined);
};

// ── FOURTH QUADRANT ──────────────────────────────────────────────────────────────────────────────
test('(q) the scan_host section still says what it DOES: a full plugin scan', () => {
  assert.match(scanHostSection(), /Run a full plugin scan/);
});

test('(q) the Full Security Audit recipe still pairs scan_host with get_vulnerabilities per service', () => {
  assert.match(read('SKILL.md'), /Full Security Audit\*\* — list_plugins → scan_host → get_vulnerabilities per service/);
});

// ── THE DEFECTS ──────────────────────────────────────────────────────────────────────────────────
test('no teaching file tells a user to compare runs BY HAND', () => {
  const byHand = /compare the two scan outputs yourself|diff the per-run out-dirs|diff the `scan_compliance_<fw>\.json`/i;
  const hits = TEACHING.filter((f) => byHand.test(read(f)));
  assert.deepEqual(hits, [], `a by-hand comparison is still taught in: ${hits.join(', ')}`);
});

test('both decision trees route "compare two scans" to report --since', () => {
  for (const f of ['SKILL.md', 'references/workflows.md']) {
    assert.match(read(f), /Compare two scans[^\n]*report --from <dir> --format executive --since/, `${f}'s decision tree`);
  }
});

test('the scan_host section says it does NOT look up CVEs, and that zero findings is not a clean verdict', () => {
  const s = scanHostSection();
  for (const f of ['certAudit', 'tribeHealth', 'dnsSecurity']) assert.match(s, new RegExp(`\`${f}\``), 'the 040 / 050 / 060 audits are named as returned, with their fields');
  assert.match(s, /does NOT look up CVEs/);
  assert.match(s, /analysis agents/);
  assert.match(s, /NOT a clean verdict|not a statement that the host has no known vulnerabilities/i);
  assert.match(s, /get_vulnerabilities/);
});

test('both decision trees qualify "scan a host comprehensively" — NO CVE lookup', () => {
  for (const f of ['SKILL.md', 'references/workflows.md']) {
    assert.match(read(f), /Scan a host comprehensively[^\n]*NO CVE lookup/, `${f}'s decision tree`);
  }
});

test('both decision trees route TLS / DNS / debug audits to probe_service — scan_host does not return their findings', () => {
  for (const f of ['SKILL.md', 'references/workflows.md']) {
    for (const row of ['Audit TLS certificates', 'Check DNS security', 'Detect debug leaks']) {
      assert.match(read(f), new RegExp(`${row}[^\\n]*→ probe_service`), `${f}: "${row}"`);
    }
  }
});

test('no teaching file shows a scan_host result carrying a findings[] array (the tool returns none)', () => {
  // The window must reach past a realistic result block: Example 1's services list alone runs ~900 characters, so a
  // findings array placed after it would slip a 700-character window (found writing this guard's own mutant).
  const shape = /scan_host\(\{[^)]*\}\)[\s\S]{0,2000}?\bfindings:\s*\[/;
  const hits = TEACHING.filter((f) => shape.test(read(f)));
  assert.deepEqual(hits, [], `a phantom scan_host findings[] is taught in: ${hits.join(', ')}`);
});

test('the ServiceRecord schema carries no phantom cves field — nothing on the scan path fills one', () => {
  assert.doesNotMatch(read('references/schemas.md'), /^\s*cves\?:/m);
});

// ── THE CI SECTION (architect seat's review of build 3: `--fail-on` exits 1, and it reads four flags) ──────────────
const ciSection = () => {
  const s = read('references/workflows.md');
  const i = s.indexOf('## 4. CI/CD Pipeline Integration');
  assert.ok(i >= 0, 'workflows.md has its CI section');
  return s.slice(i, s.indexOf('\n## 5.', i));
};

test('no teaching file redirects stdout into a SARIF file — the CLI writes SARIF into the output directory', () => {
  // A shell redirect: `>` at a line start or after whitespace (`scan_<host>.sarif.json` carries a `>` inside a placeholder).
  const hits = TEACHING.filter((f) => /(?:^|\s)>\s*[\w./$-]*\.sarif\b/m.test(read(f)));
  assert.deepEqual(hits, [], `stdout redirected into a .sarif file in: ${hits.join(', ')}`);
  assert.match(ciSection(), /scan_results\.sarif\.json/);
});

test('the CI section names the four flags --fail-on reads, says what it does not, and that info fails every host', () => {
  const s = ciSection();
  for (const re of [/anonymous FTP/, /zone transfer/, /SSH/, /dangerous HTTP methods/, /`--fail-on info` fails every/,
    /SNMP/, /MCP/, /not computed from the SARIF/i, /NOT a clean host/]) assert.match(s, re);
  assert.doesNotMatch(s, /Never blocks/, 'INFO blocks `--fail-on info` on every concluded scan');
  assert.doesNotMatch(s, /Blocks on `--fail-on \w+` and above/, 'the gate column had the direction inverted');
});

// ── SECOND REVIEW ROUND (build 3): what a scan_host service record can actually carry ──────────────────────────────
// Measured in CE: the HTTP probe (006) has no concluder adapter, so no service record carries dangerousMethods; the
// adapters of 014 / 024 / 040 / 050 / 060 and Enterprise's 1023 are never reached; the anonymous-FTP and zone-transfer
// checks run only with FTP_CHECK_ANON / DNS_CHECK_AXFR set. CE pins the behaviour (tests/concluder_drops_honesty).
test('the scan_host section lists only what a record can carry, names what it drops, and says two checks are opt-in', () => {
  const s = scanHostSection();
  const p = s.slice(s.indexOf('What `scan_host` returns'));
  const returned = p.slice(0, p.search(/does NOT return|It RUNS/));
  assert.doesNotMatch(returned, /dangerous HTTP methods/, 'no scan_host service record carries dangerousMethods');
  for (const f of ['mcpAnonymousAccess', 'mcpAnonymousToolList', 'mcpCleartextTransport', 'mcpDeprecatedProtocol',
    'mcpInspectorExposed']) assert.match(returned, new RegExp(f));
  for (const re of [/FTP_CHECK_ANON/, /DNS_CHECK_AXFR/, /006/, /014/, /1023/, /MCP server flags/, /`cpe: null`/]) assert.match(p, re);
});

test('no teaching file carries the OpenSSH cpe with an unsplit version — the scanner returns 8.9:p1', () => {
  const hits = TEACHING.filter((f) => /openssh:8\.9p1:/.test(read(f)));
  assert.deepEqual(hits, [], `unsplit OpenSSH cpe in: ${hits.join(', ')}`);
});

// (probe_service returns the RAW plugin result, where 006's dangerousMethods IS present — workflows.md §2 is right to
// list it; only the scan_host ServiceRecord must not.)
test('the ServiceRecord schema carries dangerousMethods with its tested state, and never calls it un-carried', () => {
  const s = read('references/schemas.md');
  assert.match(s, /dangerousMethods\?: string\[\] \| null;[^\n]*methodsTested/);
  assert.match(s, /methodsTested\?: boolean;/);
  assert.doesNotMatch(s, /NOT carried onto a scan_host record/);
});

test('the SARIF example shows only rules the writer emits', () => {
  const s = read('references/schemas.md');
  assert.doesNotMatch(s, /tls-deprecated-protocol|defaultConfiguration/);
  assert.match(s, /"ruleId": "ftp-anonymous-login"/);
});

test('the CI section says dangerous HTTP methods count only where an Allow header was read, and the critical checks are opt-in', () => {
  const s = ciSection();
  assert.match(s, /FTP_CHECK_ANON/); assert.match(s, /only where an Allow header was read/);
  assert.doesNotMatch(s, /never reach/, 'since Community 0.2.57 the HTTP probe\'s methods reach the conclusion');
  assert.doesNotMatch(s, /the Markdown report counts the first three/, 'the Markdown does not count the MCP checks');
});

test('Example 1 reports the SNMP community finding once, and Example 6 claims no STARTTLS check 060 does not make', () => {
  const ex = read('examples/agent-interactions.md');
  const one = ex.slice(ex.indexOf('## Example 1'), ex.indexOf('## Example 2'));
  assert.equal((one.match(/: SNMP default community string/g) || []).length, 1);
  assert.doesNotMatch(ex, /✅[^\n]*STARTTLS|starttls:/, '060 has no STARTTLS check — a negation of it is fine, a claim is not');
  assert.doesNotMatch(read('references/plugins.md'), /mail exchange records and TLS support/);
});

// ── BUILD 4: Gate 3-A on EE 1.2.0 build 3 and the skill-claims audit (audit-evidence-samples/ee-1.2.0-gate3/) ─────────
// Capability wordings the shipped code refutes. The facts that are DATA (HSTS routing, the default port set, the egress
// register, the redaction tokens, PCI eligibility, the EE table's SOC 2 column, CE priorities) are derived on the EE side:
// tests/skill_teaching_matches_shipped_data.test.mjs reads this skill beside the data.
const frontmatter = () => { const s = read('SKILL.md'); return s.slice(4, s.indexOf('\n---\n', 4)); };

test('the suppression section teaches the signed / FAILED renders the smoke drove', () => {
  const s = read('SKILL.md');
  assert.match(s, /### Suppressions/);
  assert.match(s, /`signed \(approver\)`/); assert.match(s, /signature FAILED verification/);
});

test('suppression signing is not taught as absent — Gate 2 drove keygen, suppress, signed, tamper, FAILED', () => {
  const hits = TEACHING.filter((f) => /nothing calls the signer|the signature does NOT|Never tell an operator their suppressions are cryptographically signed/.test(read(f)));
  assert.deepEqual(hits, [], `signing taught as absent in: ${hits.join(', ')}`);
});

test('no teaching file promises GRC egress is redacted — it is off by default', () => {
  const hits = TEACHING.filter((f) => /ZDE-redacted/i.test(read(f)));
  assert.deepEqual(hits, [], `"ZDE-redacted" in: ${hits.join(', ')}`);
  assert.match(read('SKILL.md'), /NOT redacted by default/);
});

test('the pipeline diagram shows analysis agents over collected evidence, never verification agents that probe', () => {
  const s = read('SKILL.md');
  assert.doesNotMatch(s, /Phase 3: INTELLIGENCE[^\n]*verification agents/i);
  assert.match(s, /Phase 3: INTELLIGENCE[^\n]*ANALYSIS agents/);
});

test('the watch-mode webhook payload is the one the CLI posts, not an invented delta shape', () => {
  const hits = TEACHING.filter((f) => /"event":\s*"scan_delta"|"new_services":/.test(read(f)));
  assert.deepEqual(hits, [], `the invented payload in: ${hits.join(', ')}`);
});

test('no teaching file states a Desktop per-call limit as a fact — a call returned after ~138 s on 2026-09-30', () => {
  // \s+ spans the hard wrap: the defect read "~60 s\ntool-call limit", and a single-space pattern passed over it.
  const hits = TEACHING.filter((f) => /~\s?60\s?s\s+tool-call\s+limit|Desktop's\s+~\s?60/i.test(read(f)));
  assert.deepEqual(hits, [], `a ~60 s limit taught in: ${hits.join(', ')}`);
});

test('the frontmatter triggers on install / upgrade / version questions, and no longer excludes "non-security topics"', () => {
  const d = frontmatter();
  for (const re of [/install/i, /upgrad/i, /version compatibility/i, /not loading/i]) assert.match(d, re);
  assert.doesNotMatch(d, /non-security topics/);
});

test('the mirror rule is restated where the Community floor is taught', () => {
  const s = read('SKILL.md');
  const i = s.indexOf('check their Community version first');
  assert.ok(i >= 0, 'the floor sentence is present');
  assert.match(s.slice(i, i + 400), /answer from this skill even while npm or the public site does not list/);
});

test('UNVERIFIED is taught with its reading rule beside it, in SKILL.md', () => {
  assert.match(read('SKILL.md'), /UNVERIFIED[\s\S]{0,120}never means "tried and could not be\s+confirmed"/);
});

test('probe_service is not taught with a plugin name that matches nothing', () => {
  assert.doesNotMatch(read('SKILL.md'), /e\.g\. `"ssh_scanner"`/);
});

test('the framework list is not counted as seven', () => {
  const hits = TEACHING.filter((f) => /all seven shipped/.test(read(f)));
  assert.deepEqual(hits, [], `"all seven shipped" in: ${hits.join(', ')}`);
});

// ── 0.2.54 BUILD 6: THE HEADLINE IS ONE REGISTER, AND IT STATES TWO MEASURED LIMITS (EE 1.2.0 build 6, text) ────────────
// "Nothing a scan could not re-check is counted as fixed, and no control it failed reads PASS" was false on the installed
// binary twice: after a CVE lookup that FAILED the control its rows failed stays unheld and can read PASS (the rows
// themselves are withheld), and when compared scans ran different `--plugins`, a row an analysis agent or the CVE mapper
// derived from a plugin only one of them requested reads RESOLVED or NEW — and, when the later scan left it out, closes in
// MTTR with its control reading PASS. The release now says so in ONE register, `R` below, verbatim in SKILL.md's header
// and in references/workflows.md (and on three Enterprise surfaces). PINNED, NOT ENDORSED: Enterprise's
// tests/headline_scope_matches_behaviour.test.mjs DRIVES the shipped entry point, Community's delta and the compliance
// phase, holds every copy of R equal and ties R to the behaviour, so it goes red the day a limit stops being true. This
// block holds the skill's own copy and scopes it to the Enterprise version the header RENDERS: the release that moves
// `ee-version` must re-adjudicate R against those legs, never carry it forward.
const R = 'A finding on a port, region or producer a scan did not measure is not counted as fixed, and with SLA tracking '
  + 'on the control it failed is held FAILED — including the prior CVE rows on a service whose lookup failed, the C'
  + 'VE mapper\'s and the service agent\'s rows on a TCP port whose service the scan could not identify, and an analy'
  + 'sis agent\'s or the CVE mapper\'s rows when a plugin they read was left out of the scan or did not complete. Two'
  + ' measured limits: a scan made before EE 1.3.0 could not record a plugin left out of it, so in a comparison wit'
  + 'h one, an agent\'s row that scan lacks is not refused — the report\'s Basis cell says so on the row; and a scan '
  + 'that discovered ports with the Nmap plugin (024) alone records no port oracle, so an analysis agent\'s or the C'
  + 'VE mapper\'s row on a port it did not measure can read RESOLVED and count as closed in MTTR, and the control it'
  + ' failed can read PASS — include the port scanner (003).';
const T = 'a finding on a port, region or producer a scan did not measure is not counted as fixed — two measured limits stated';
const R_EE = '1.3.0'; // the Enterprise release R was measured against
const occurrences = (hay, needle) => hay.split(needle).length - 1;
const renderedEeVersion = () => /<!-- nsa:derived id="ee-version" -->([^<]+)<!-- \/nsa:derived -->/.exec(read('SKILL.md'))?.[1];
const currentHeader = () => { const s = read('SKILL.md'); return s.slice(s.indexOf('> **Version:**'), s.indexOf('\n>\n> **Prior:')); };

test('(q) the true 1.2.0 teaching stays: the four not-comparable cases (a), the hold (b), an agent that did not run', () => {
  const s = read('SKILL.md');
  assert.match(s, /\(a\) \*\*The NOT-COMPARABLE bucket catches four more cases\.\*\*/);
  assert.match(s, /\(b\) \*\*A compliance control can FAIL on a finding the PRIOR scan recorded\.\*\*/);
  assert.match(s, /analysis agent that DID NOT RUN[^\n]*?while that agent's controls fail closed in every framework/);
});

test('the headline carries the register R verbatim, once, scoped to the Enterprise version the header renders', () => {
  assert.equal(renderedEeVersion(), R_EE, `the header now renders EE ${renderedEeVersion()}: re-adjudicate R against Enterprise's `
    + 'headline_scope_matches_behaviour legs, then restate or remove it and move R_EE here');
  const h = currentHeader();
  assert.equal(occurrences(h, R), 1, 'SKILL.md\'s current header must carry R verbatim, exactly once');
  assert.ok(h.includes(`— **${R_EE}: ${R}** Teach these first`), 'R is the headline itself, in bold, before "Teach these first"');
  assert.equal(occurrences(read('SKILL.md'), R), 1, 'R is written once in SKILL.md, history included');
});

test('references/workflows.md states R once, at the "never by hand" comparison paragraph', () => {
  const wf = read('references/workflows.md');
  assert.equal(occurrences(wf, R), 1, 'workflows.md must carry R verbatim, exactly once');
  const i = wf.indexOf('the comparison is NEVER done by hand');
  const j = wf.indexOf(R);
  assert.ok(i >= 0 && j > i && j - i < 1200, 'R sits in the paragraph that routes the comparison to report --since');
});

test('the CHANGELOG 0.2.54 heading carries the short form T', () => {
  const v = JSON.parse(read('package.json')).version;
  const head = new RegExp(`^## ${v.replace(/\./g, '\\.')} \\([^)]*\\) — (.+)$`, 'm').exec(read('CHANGELOG.md'))?.[1];
  assert.ok(head, `the CHANGELOG has a ## ${v} heading`);
  assert.equal(occurrences(head, T), 1, `the ${v} heading must carry T verbatim: "${head}"`);
});

test('no teaching file or the changelog carries a 1.2.0 absolute the shipped code refutes', () => {
  for (const re of [/nothing a scan could not re-check is counted as fixed/i, /no control it failed reads PASS/i,
    /(?<!Those refusals' )compliance verdicts always failed closed/i, /the false clean 1\.2\.0 closes/i, /did not measure its surface/i,
    /a host or plugin not run/i, /Two limits remain/i, /only one (?:of them|run) requested[^.]{0,40}\bRESOLVED\b(?! or NEW)/]) {
    const hits = [...TEACHING, 'CHANGELOG.md'].filter((f) => re.test(read(f).replace(/`/g, '')));
    assert.deepEqual(hits, [], `${re} in: ${hits.join(', ')}`);
  }
  // …and the 0.43.0 sentence is SCOPED, not deleted: it is true of the up:false refusals it is about (EE CHANGELOG 0.43.0 (1)).
  assert.match(read('SKILL.md'), /Those refusals' compliance verdicts always failed closed/);
});

test('the comparison is taught with the limits that remain — the decision tree and README.md (1.3.0)', () => {
  // 1.3.0 refuses a row whose input plugin the later scan left out, so the gloss that said report --since reads it as
  // fixed is gone; it names the two limits Enterprise's headline legs still measure instead.
  assert.doesNotMatch(read('SKILL.md'), /report --since does too for an/);
  assert.match(read('SKILL.md'), /report --since refuses it, but\s*\n│\s+the header's two measured limits still apply/);
  assert.match(read('README.md'), /two measured limits — a scan made before Enterprise 1\.3\.0 could not record a plugin left out of it/);
  assert.match(read('README.md'), /Nmap plugin \(024\) alone records no port oracle, so an analysis agent's or the CVE mapper's row on a port it did not measure can read RESOLVED and count as closed in MTTR, and the control it failed can read PASS/);
});

// ── pluginsRan (Community 0.2.57): the manifest's `ran` entries ──────────────────────────────────────────────────────
// The scan_host example's `pluginsRan` is DERIVED from the example's own manifest, never typed: no derived id names a
// per-scan count (`plugins:ce` counts plugins that SHIP, and would print a false "27 ran"), and a region marker inside
// this ```json block breaks the two Enterprise readers that JSON.parse it. Enterprise's agent_skill_tool_surface leg
// ties the same definition to the shipped handler's own return.
test('the scan_host example derives pluginsRan from its own manifest — never a typed count', () => {
  const s = read('references/schemas.md');
  const sec = s.slice(s.indexOf('## Scan Result Schema (`scan_host` output)'));
  const v = JSON.parse(/```json\n([\s\S]*?)\n```/.exec(sec)[1]);
  assert.ok(v.manifest.some((m) => m.status === 'ran') && v.manifest.some((m) => m.status !== 'ran'),
    'non-vacuity: the example shows a plugin that ran and one that did not');
  assert.equal(v.pluginsRan, v.manifest.filter((m) => m.status === 'ran').length);
});
