# Changelog

Release notes for **`nsauditor-ai-agent-skill`** — installable knowledge package that teaches AI coding agents how to use NSAuditor AI's MCP tools, schemas, plugins, and security audit workflows.

---

## 0.2.44 (2026-08-23) — paired with EE 0.40.2: the TSA status gate reaches the skill's teaching

**Requires CE >= 0.2.45 — UNCHANGED.** Paired with **Enterprise 0.40.2 / Community 0.2.46**.

What EE 0.40.2 adds to the taught knowledge, and the skill now teaches:

- **A TSA rejection is refused, never written as evidence.** The response status is read before
  anything reaches disk; a refusal writes no `.tsr`, leaves a prior success's sidecar byte-identical,
  and records `signed: false` with one of five reason codes in the chain-of-custody envelope
  (`artifacts[].tsa.signed` / `.error` is the per-artifact ledger). A missing `.tsr` beside a
  `.sha256` means REFUSED, not failed. `signed: true` attests protocol status, never cryptography —
  `openssl ts -verify` remains the adjudicator.
- **The TSA policy-OID option works on OpenSSL ≥ 3.0 hosts for the first time** — the query flag is
  attempted as `-tspolicy` with a `-policy` fallback (LibreSSL kept the old spelling; both report a
  3.x version, so no version table can decide it), and the result carries `tsaPolicyFlagFallback`
  when the legacy spelling was used. This is the option commercial TSAs require.
- **Parenthesised `(Dim N)` internal dimension codes are out of GCP finding prose**; bare `Dim N`
  references remain in some GCP IAM finding text, a census-pinned residual the agent should not
  report as a new defect.

Plugin catalog UNCHANGED at 28 EE / 55 overall; all eight coverage matrices UNCHANGED.

Also in this release: the header-correction set below — made at 0.2.43 as unreleased edits, shipping
now with the bump.

### The SKILL.md header corrections (made pre-release at 0.2.43)

Four corrections to the header, none of them a knowledge change, recorded here because the
CHANGELOG is where a record belongs.

1. **The version line read `post-EE-0.40.0` while EE 0.40.1 was live.** The skill's own version is
   correct and is not moving; what drifted is the EE release it claims currency with. EE 0.40.1 was
   a prose correction that changed no capability this skill teaches — which is exactly why nothing
   forced the label to move. A version label that rots on somebody ELSE's release is invisible to
   every code-triggered review. Second instance in this file; `7146320` fixed the same class when
   the header still read 0.2.42.

2. **The added pre-publish note bled into live teaching.** It ended mid-paragraph and the
   eighth-framework content continued in the same block, so the header read as though
   `--compliance nist-800-171` were part of what the unpublished EE 0.40.2 will carry. It shipped at
   0.40.0 and is live. Sell-before-ship arriving by punctuation rather than by claim — caused by the
   note written to prevent that class.

3. **⚠️ AND THE CORRECTIONS THEMSELVES WERE WRITTEN INTO THE WRONG SURFACE.** The fixes for (1) and
   (2) were made as commentary INSIDE `SKILL.md`: a warning about what the line used to read, a
   commit hash, and a paragraph on how version labels rot. `SKILL.md` is an agent's INSTRUCTIONS and
   the first thing Claude Desktop renders — so an agent loading the skill read an incident report
   about a version label before it read anything about NSAuditor, and a customer saw it in the
   Skills pane. Repo process commentary does not belong on a surface a customer sees and an agent
   consumes. 618 characters removed; the operator-facing note is now two sentences telling the agent
   what to do — do not teach 0.40.2, say it is not released — and the record is here instead.

4. **⚠️ A FOURTH INSTANCE, AND IT WAS THE FIX FOR THE THIRD.** The replacement note read *"EE 0.40.2
   exists but is NOT published — do not teach it. If asked, say it is not released."* Measured: that
   line was the **ONLY** mention of 0.40.2 anywhere in the skill. An agent that never read it could
   not have taught 0.40.2 — so its sole effect was to hand every customer's agent the fact it
   otherwise lacked. **Pre-release existence disclosure delivered by the sentence written to prevent
   talking about it.** It also carried a rot clock pointing the wrong way: the moment 0.40.2
   publishes, *"is NOT published"* becomes a FALSE INSTRUCTION and agents would DENY a shipped
   release — the underclaim class — repairable only by three coupled motions (edit, re-zip,
   redistribute), any one of which could be missed. Replaced with a version-agnostic behavioural
   rule that never needs editing: if tool output reports a version newer than the knowledge bound,
   say the skill does not cover it. Also cut *"the LIVE Enterprise release"* and *"live today"* —
   mutable registry state a shipped file cannot know, false at the next publish. The bounded
   *"knowledge current as of EE 0.40.1"* stays: it is true, and it stays true after 0.40.2 ships.

**THE DURABLE RULE, CORRECTED — the first version of it was keyed on the wrong noun.** It read *"a
fix and its record are different artifacts"*, with the discriminator being whether a surface is
CONSUMED by an agent or MAINTAINED by a human. That boundary does not survive contact: CI consumes
test files, and it would eventually be used to strip the annotations that make a red test
diagnosable. The working test is behavioural — **an annotation earns its place iff it changes what
THIS reader DOES at the moment of reading.** The board and `tasks/CLAUDE.md` records change a
maintainer's next action (do not retry that approach; do not delete that guard) — load-bearing. A
test-file annotation serves the human staring at a red — load-bearing. An incident narrative in
`SKILL.md` changes nothing an advising agent should do — pure cost, and it occupies the most
expensive real estate an agent surface has.

## 0.2.43 (2026-08-20) — post-EE 0.40.0: the EIGHTH framework, and the words the skill must never use

**Requires CE >= 0.2.45 — RAISED.** Enterprise 0.40.0 registers `nist-800-171`, and CE 0.2.44 does
NOT carry the stem: a 0.40.0 Enterprise paired with an older CE rejects the framework name. This is
the one floor-raising entry in this cycle, and the floor is derived from the version that SHIPS the
stem, not from whatever the sibling working tree happened to read.

Enterprise 0.40.0 adds **NIST SP 800-171 Rev 2** as the eighth compliance framework, scoped as
**evidence substrate for CMMC Level 2 preparation**. What the skill must teach, and what it must
refuse to say:

- `--compliance nist-800-171` is available alongside the other seven; all eight route from a single
  scan.
- All 110 Rev 2 requirements are enumerated with a written reason each — no declared subset.
- Coverage is claimed at the **SP 800-171A determination-statement (objective) level**, which is why
  only two requirements are `covered`: a requirement clears that bar only when EVERY objective is a
  statement of technical state the scan reads directly.
- **Rev 2 is pinned.** CMMC assesses Rev 2 by rule; Rev 3 is a different 97-requirement universe with
  organization-defined parameters, and answering a Rev 3 question with Rev 2 output is drift.
- ⚠️ **NEVER tell a user the output is a CMMC certification, a FedRAMP authorization, a MET / NOT MET
  determination, or an SPRS score.** It is none of those. Each is a C3PAO's determination, and a
  misrepresented 800-171 posture is the shape the DOJ Civil Cyber-Fraud Initiative settles — which is
  why this is a refusal rule for the agent, not a style note.
- CUI scope is the operator's assertion. The scanner cannot see CUI, cannot distinguish FCI from CUI,
  and cannot see an enclave boundary.

---

## 0.2.42 (2026-08-19) — post-EE 0.39.0: teach `deferredScope` as a per-PLUGIN boundary, and correct a stale "not yet proven"

**Requires CE >= 0.2.43 — UNCHANGED.** Enterprise 0.39.0 raises no floor.

Enterprise 0.39.0 gives every GCP and Azure plugin a `details.deferredScope` declaration (1021, 1022,
1024, 1025, 1220, 1221, 1222), joining the AWS plugins that already had one. The skill teaches four
things about it, and each is a mis-teaching this package could otherwise ship:

- A declaration is a **static capability boundary**, not an evidence gap and not a finding. It routes
  to **zero** compliance controls by design. Report it as "not assessed".
- It is emitted **even over an empty estate**, because "zero findings" is otherwise indistinguishable
  from "assessed and clean".
- ⚠️ **An empty or short list is NEVER a claim of full coverage.** Not every plugin declares its
  boundaries, so the list bounds only what the DECLARING plugins state. This is stated as a per-plugin
  invariant rather than a provider roster, deliberately: a roster sentence goes stale on the peer's
  next release, and CE floats over a peer RANGE and cannot derive Enterprise's plugin set.
- Two AWS declarations (1080, 1130) now emit **once per run** rather than once per region, so the count
  no longer scales with the estate.

Also taught: GCP impersonation now **refuses** an impersonated client that yields no Authorization
header — by name, with the target principal — surfacing as `up:false` plus a warning that fires
scanner-down synthesis. That refusal is the fail-closed design working and must not be taught as a
regression; what it replaced was silent anonymous requests producing FALSE evidence gaps.

### A correction this package owed, in the underclaim direction

0.2.41 taught that pack signing was *"reachable, not yet proven"*. **True when written, false since
2026-08-17**, when the published-bytes gate ran against the EE 0.38.0 registry bytes and passed. Every
"not yet proven" clause about pack signing is corrected here. npm freezes this package's prose at
publish time, so the correction needed its own release. The **scope** bound did not move and is the
part to keep repeating: one framework's envelope and the artifacts it enumerates, an operator-held
key, never a vendor attestation, never proof the scan ran.

Plugin catalog UNCHANGED at 28 EE / 55 overall; all seven matrices UNCHANGED.

---

## 0.2.41 (2026-08-17) — post-EE 0.38.0: the evidence pack can be signed

**Requires CE >= 0.2.43** — both new verbs are routed from CE.

Enterprise 0.38.0 ships `compliance sign-pack` and `compliance verify-pack` — reachable, **not yet** proven. The skill teaches the
scope precisely, because this is the claim most easily overstated: a verified signature proves the
holder of a key asserted authorship of **one framework's** chain-of-custody envelope at a stated
time, relative to **operator** key custody. It is never a vendor attestation, never proof the scan
ran, and never proof the findings are true — and it covers that envelope plus the four artifacts it
enumerates, not the directory and not the pack.

Also taught: `verify-pack` recomputes every enumerated artifact hash as well as checking the
signature (so an edited report fails while the signature still reads VERIFIED); the two trust
anchors and what the `--public-key` arm discloses it skipped; and the exit contract, where **2**
means the run could not measure and is never a failure.

Correction carried from EE: a **gzipped** KEV/EPSS store loaded with zero entries, so exploit
banding reported *no store* rather than a band. Misdiagnosis, not a false security verdict.

## 0.2.40 (2026-08-15) — post-EE 0.37.0: offline CVE data can be hand-carried

**Requires CE >= 0.2.42** — raised, because the new entry points live in CE.

Enterprise 0.37.0 ships `feed bundle` and `feed import` — delivered as a **restricted** distribution, amd64 only.
They merge NVD feed files downloaded on a connected host into one archive, carry it, and import it
into the offline store on an isolated host. What an agent working with these artifacts must know:

- **`feed bundle` bundles the FEEDS YOU DOWNLOADED, never "your database".** The offline store is a
  lossy derivation of an NVD feed and cannot be turned back into one. Do not describe this as a
  store export, and do not tell an operator it will back up their store.
- **No KEV or EPSS data ships with the product.** `--kev` / `--epss` carry the operator's own
  downloads from CISA and FIRST. "Exploit intelligence ships with NSAuditor" is wrong.
- **A bundle is integrity-checked, not authenticated.** The recorded SHA-256 detects alteration in
  transit; it cannot establish authorship, because it travels inside the archive it covers. Never
  describe an imported bundle as trusted or verified-as-genuine.
- **Import skips about a quarter of a real NVD year file by design** — withdrawn CVEs and entries
  with no CPE match data. That is not data loss. Malformed records are a different signal and mean
  re-download.
- **The air-gap delivery claims are EARNED BACK at this release, as a restricted distribution, amd64 only** — the offline installation tarball is restricted, the install script is restricted, the feed-import CLI moves the feeds you downloaded, and air-gapped deployment is restricted and amd64 only. Teach them WITH those conditions, which
  are part of the claim: the bundle is a **restricted** distribution (not a public `npm install`) and
  it is **amd64** only. **arm64 images remain WITHDRAWN**, so never describe an arm64 enclave as
  supported.

---

## 0.2.39 (2026-08-13) — post-EE 0.36.0: the report verifies the signatures it renders

**Requires CE >= 0.2.40** (unchanged — nothing this cycle needs new CE code).

Enterprise 0.36.0 makes every compliance report cryptographically verify each suppression signature — the Ed25519 suppression-signing capability this exercises stays **not yet proven**, its verification gate not having run against published bytes — writing `report.signatureVerification` beside `identityVerification` in the machine-JSON report. What an agent reading these artifacts must know:

- A **missing** verdict for a suppression means NOT CHECKED, never FAILED. Only `verified: false` is a failure. Do not report an unchecked approval as tampered.
- `verified` and `cryptoValid` are different questions — should this suppression stand, versus did these bytes come from the named key. They diverge on a revoked key, which is the case that matters.
- `cryptoValid` is ABSENT when unanswerable and never `false`.
- `identityVerification.configured` means A REGISTRY IS PRESENT; `signatureVerification.configured` means KEY MATERIAL IS PRESENT. The join of the two is the partial-migration state.

**Ed25519 suppression signing remains reachable and NOT YET PROVEN** — its verification gate has not run against published bytes, so do not describe a produced signature as verified evidence.

## 0.2.38 (2026-08-12) — post-EE-0.35.0: the suppression-approval commands are reachable

Paired with EE 0.35.0 / CE 0.2.40. Four Enterprise commands reach the CLI — `compliance suppress | review | renew | keygen` — so the suppression-approval workflow has an operator entry point for the first time. ⚠️ The skill's own prose is corrected with them: Ed25519 suppression signing was taught as NOT REACHABLE, which this release makes false. It is now **reachable and not yet proven** — the verification gate has not run against published bytes, so a produced signature must never be presented as verified evidence. Plugin catalog UNCHANGED at 28 EE / 55 overall; all seven matrices UNCHANGED.


## 0.2.37 (2026-08-10) — post-EE-0.34.0: teach exploit intelligence, and stop teaching a risk-score formula the code never used

Enterprise findings carrying CVEs are joined by CVE-ID against a local **CISA KEV** catalog and a
local **FIRST EPSS** scores file, banded `KNOWN_EXPLOITED` / `ELEVATED` / `BASELINE`, with the
finding queue ordered exploit-first.

Two things an agent must get right when it explains this:

1. **No feed data ships with the product.** Both stores are operator-populated via
   `NSAUDITOR_EXPLOIT_KEV_STORE` / `NSAUDITOR_EXPLOIT_EPSS_STORE` — the same rule as the offline
   NVD store — and both fail closed when stale (KEV 14-day / EPSS 10-day windows), so an
   out-of-date catalog never reports "not exploited". Never describe the feeds as included.
2. **`riskScore` is unchanged.** `exploitPriority` is a new axis beside it, not a re-weighting.

Corrected in this package's own prose: the risk score is **CVSS weighted by verification status
with an initial-access uplift**, not "severity x exploitability x impact x exposure" — that
phrasing named an exploitability input that did not exist until EE 0.34.0.

Plugin catalog UNCHANGED at 28 EE / 55 overall; all seven matrices UNCHANGED.

---

## 0.2.36 (2026-08-07) — the opt-in RFC 3161 wording corrected: a hedge that had outlived its measurement

`SKILL.md` described RFC 3161 timestamping as *"implemented but not yet wired to a flag — do
not quote it as shipping"*. EE 0.33.0 wired it via `NSAUDITOR_TSA_URL`, and on 2026-08-07 the
live smoke exercised it against a real Time-Stamp Authority through the published binary
(`openssl ts -verify` returning OK, with a one-byte-mutated copy returning FAILED as the
control). The sentence had been false for a full release, and because this file is
instruction material for AI agents it did not merely sit there — a live Claude Desktop reply
repeated it downstream, which is how it was found.

The row now states what is true: opt-in via `NSAUDITOR_TSA_URL`, no CLI flag and no default,
an outbound call to the Time-Stamp Authority you name, and exercised against a live authority
on the npm path. ⚠️ **Superseded within the day:** the in-container live round-trip was then
run too, from inside the pushed `:0.33.0` image, so BOTH delivery vehicles are proven end to
end. The only container caveat that survives is version scope — retained images at `:0.32.11`
and earlier carry no `openssl` and nothing here speaks for them.

No behaviour change; wording only. Paired with the EE-side renderer correction on the same
root cause.

---

## 0.2.35 (2026-08-07) — paired with EE 0.33.0 · requires CE ≥ 0.2.37

Three new CE entry points to teach: `compliance attest` (Type II recurring-scan attestation;
exit 3 on an empty history, because absence of evidence is the finding), plus `--sla-policy`
and `--compliance-history`. A startup posture veto refuses an offline-plus-egress
contradiction with exit 2.

Two corrections to this package's own prose:

- The `compliance_check` disclosure in `SKILL.md` now carries the **WITHDRAWN** marker in the
  same sentence. An absence guard cannot tell a disclosure from the thing it discloses, and
  the sentence whose whole job is to say the tool does not exist was being read as a claim.
- The Enterprise row no longer calls plugin **1023** a cloud auditor. Measured by driving the
  CLI: it scores zero-trust posture from a **network-host** scan, never runs on a cloud pass,
  and cannot be invoked with `--plugins 1023` — it needs a discovery plugin to confirm the
  host is up first, so selecting it alone removes its own precondition.

Plugin catalog UNCHANGED at 28 EE / 55 overall; all seven matrices UNCHANGED.

## 0.2.34 (2026-08-05) — Paired with EE 0.32.11 · a withdrawn capability, and SEVEN MCP tools that do not exist

### The tools that were never there

Found by Gate-3 prompt 6, in a live reply. Asked how to build a SOC 2 Type II evidence package, the assistant answered: *"`scan_compare` (Pro) gives risk-weighted deltas between runs, which is how you show a finding appeared, was remediated, and stayed closed."* *(WITHDRAWN — recorded here as the withdrawal itself.)*

**`scan_compare` is WITHDRAWN — it does not exist.** Measured against the live registry, SEVEN tools this package advertised return 0 entries in `TOOLS` and `undefined` from `toolHandlers`:

WITHDRAWN, all seven: `risk_summary` · `scan_compare` · `save_finding` · `start_assessment` · `prioritize_risks` · `compliance_check` · `export_report`

The shipped set is exactly `scan_host`, `scan_cloud`, `get_findings`, `compliance_matrix`, `probe_service`, `get_vulnerabilities`, `list_plugins`.

**And the seven are not one class — a correction to this entry's first draft.** Four (`compliance_check`, `export_report`, `start_assessment`, `prioritize_risks`) have **no implementation anywhere**: `registerEnterpriseTools()` is an empty no-op. Three (`risk_summary`, `scan_compare`, `save_finding`) are **implemented but UNREACHABLE** — real handlers and real tests exist in EE's `PRO_MCP_TOOLS`, but `registerProTools()` has **zero non-test call sites**, so nothing ever registers them. Either way the skill must not advertise them, but the fixes differ: the first four need building or forgetting; the last three need WIRING, and are on the EE board as such. *(WITHDRAWN — recorded here as the withdrawal itself.)*

`compliance_check` was the worst: it appeared **4 times in `SKILL.md` and 13 times across the package**, including a behavioural imperative — *"If unsure, run `compliance_check` and report what the pack says."* *(An earlier draft of this entry said "11 occurrences"; that figure was wrong and is corrected here — counted, not remembered.)* An agent loads this file into context and follows its imperatives, so an operator assembling the artifact an auditor SAMPLES was being routed at a tool that is not there. `export_report` promised "PDF, HTML" — the same phantom as the `pdfExport` capability flag, WITHDRAWN by EE this cycle, wearing a different name. *(WITHDRAWN — recorded here as the withdrawal itself.)*

**The correction is not a deletion.** `compliance_check`'s row carried a great deal of accurate framework detail; what was wrong was the MECHANISM it hung on. Compliance is a **CLI** surface: `nsauditor-ai scan --host <target> --compliance <fw> --out <dir>` runs the compliance phase and writes the pack. `scan_cloud` maps findings to frameworks but never runs that phase, so **no MCP call produces a pack**. The detail is kept and re-attributed; use `compliance_matrix` to state COVERAGE and the CLI to produce EVIDENCE. *(WITHDRAWN — recorded here as the withdrawal itself.)*

**`compliance_matrix` is now documented** — it shipped in CE 0.2.36 and this package had never mentioned it, which is the other direction of the same defect: a tool an agent is not told about is a tool it will not reach for.

### Why nothing caught it, and what now does

`gate:claims` sweeps for withdrawn capability WORDING. **A tool NAME matches no claim pattern** — it is a claim that exists only as an identifier, exactly like the withdrawn capability flags. EE now ships `tests/agent_skill_tool_surface.test.mjs`, which pins this package's advertised tool set against CE's live `TOOLS` **in both directions** (advertised-but-absent, and shipped-but-undocumented), fails rather than skips when the sibling repo is missing, and proves its own extractor on a probe. Both directions are mutation-proven.

> The sweep that first found this was itself too narrow — it enumerated the name prefixes already seen and so missed `start_assessment` and `prioritize_risks`. The guard therefore extracts the documentation STRUCTURALLY rather than grepping for tool-shaped words. *(WITHDRAWN — recorded here as the withdrawal itself.)*

---

## 0.2.34 — also: a withdrawn capability was still being taught, in the one repo no gate reached

**This is a correction release, and the reason it was needed matters more than the two lines it fixes.**

The Verification Engine was **withdrawn at EE 0.32.7**. This package went on presenting it as a shipped pipeline phase for four releases:

- `SKILL.md` showed WITHDRAWN Phase-4 text — *"For each finding: run SAFE non-destructive verification probe"* — as a phase that runs.
- `references/schemas.md` glossed `VERIFIED` with the WITHDRAWN wording *"Active safe probe confirmed the vulnerability."*
- A safety bullet asserted the WITHDRAWN claim *"All verification probes are safe read-only queries."*
- **The pricing table sold the WITHDRAWN "verification probes" as a Pro feature.**

All four are corrected. The status ENUM stays — the field and its risk-weighting scaffolding are real, which is why the schema documents them — but the gloss describing an active probe is WITHDRAWN, and every finding is now stated to be emitted `UNVERIFIED`. `Phase 4` remains in the diagram, labelled **planned, not shipped**, so the pipeline's shape stays legible without claiming the phase runs.

**Why nothing caught it.** The withdrawal was executed as a capability-FLAG removal plus README edits, so the *wording* was never patterned — and `gate:claims` sweeps web document roots while the honesty test is scoped to six hand-listed docs. This package is a third repo, published with every trio, outside both. It was found by a reader during the Gate-3 battery, not by any matcher.

**The durable fix, upstream:** EE 0.32.11 adds a `verification-engine` claim pattern and this repo is now swept by `gate:claims`. On its first run that pattern also found **two live unhedged claims on nsasoft.us**, including the homepage hero — so the gap was never only about this package.

---

## 0.2.33 (2026-08-03) — Paired with EE 0.32.10 · no knowledge change, one honesty correction upstream

**No change to the skill's guidance, schemas, or plugin references.** Published in lockstep with Enterprise 0.32.10 and CE 0.2.35 so an agent installing the trio never mixes versions.

Worth knowing if you are teaching an agent to reason about NSAuditor's evidence: the Enterprise release corrects what its dependency-advisory gate measures (the packed-and-installed customer closure, not the maintainer's working tree) and makes it prove an advisory source answered before reporting clean. The SOC 2 matrix is now enumerated in full at **10 / 4 / 37 = 51** — enumeration completeness, not a coverage change. Plugin catalog UNCHANGED at **28 EE / 55 overall**.

## 0.2.32 (2026-07-29) — Paired with EE 0.32.9 · the skill package's own provenance sweep

**This package carried the marker class the EE cycle existed to kill, and npm freezes it at publish.** `references/plugins.md` is loaded into an LLM's context and quoted back to customers. Swept from the shipped `files[]` set: **330 occurrences → 0** — memory-slug wiki links (19), reviewer-fold codes (274), internal roadmap ids (35) and internal audit-review names (5).

**`EE 0.x.y` version stamps are deliberately KEPT** — 382 of them, count asserted unchanged. In a changelog, and in "NEW EE 0.7.0" in the plugin catalogue, the version IS the useful provenance: it tells a reader which release introduced a capability.

Paired EE 0.32.9 highlights: the evidence pack no longer carries internal roadmap ids; a cloud scanner that could not run no longer renders as a clean PASS; and the evidence-gap routing prefix changed value (re-point text-matched suppressions — see the EE CHANGELOG).

## 0.2.31 (2026-07-28) — paired content bump for EE 0.32.8 (capability-claim honesty pass, part 2: the air-gapped-delivery class)

- **Two corrections in this package's own tier tables — both were overclaims this skill would otherwise teach an agent to repeat.** `SKILL.md` line 524 listed **"RFC 3161 timestamps"** unhedged among shipping Enterprise capabilities; RFC 3161 timestamping is *implemented but not yet wired to a flag*, so the row now says so explicitly and directs readers not to quote it as shipping. **SHA-256 chain-of-custody is the layer that ships.** Both `SKILL.md` and `README.md` also said the now-WITHDRAWN **"air-gapped deployment"**, which implied a delivery mechanism that does not exist; both now say **"air-gapped operation (offline licensing + offline CVE matching under `NSAUDITOR_OFFLINE_ONLY=1`)"**.
- Version line updated to post-EE-0.32.8. Enterprise 0.32.8 is a documentation-and-prose release: **27 withdrawn-claim sites** (distinct lines) across the three published packages, each verified against the code — an arm64 image (the build forces `--platform linux/amd64`), offline-installable tarballs (an `npm pack` tarball still resolves its dependencies from a registry), monthly NVD feed bundles (nothing produces one), an air-gapped installation script (none exists in the tree), a `feed import` CLI command (`importFeed()` has zero non-test callers), and CE's absolute "every feature works without internet access". **Five of the sites were rendered runtime strings, not documentation** — coverage-gap rationales that render verbatim into the assessor-facing evidence pack and named a command that does not exist.
- No MCP tool, plugin, schema or workflow change. `references/plugins.md` UNCHANGED. Plugin count UNCHANGED at 28; all seven coverage matrices UNCHANGED.

---

## 0.2.30 (2026-07-21) — paired content bump for EE 0.32.7 (cross-framework routing + capability-claim honesty pass)

- Version line updated to post-EE-0.32.7. Enterprise 0.32.7 routes the network-scan analysis agents' findings across **all seven compliance frameworks** (previously SOC 2 only off the same scan) and runs a **capability-claim honesty pass** — several Pro/Enterprise capabilities advertised without a shipping implementation (verification engine, branded reports, usage metering, Docker isolation, and the ZDE "policy engine" / Enterprise-CTEM datastore framings) are withdrawn; the real cores (the code-enforced ZDE read-only guarantee, Pro-tier CTEM retention) ship and are described honestly. Plugin count UNCHANGED at 28; all seven coverage matrices UNCHANGED.
- **`references/plugins.md` correction:** plugin 040 (TLS Certificate & Cipher Auditor) was credited with HSTS-header verification it does not perform — the missing-HSTS check is the network-scan `crypto_agent`'s. 040's real cert/cipher/chain audit is unchanged.
- **`SKILL.md` — new cross-framework routing note (closes a Gate-3 MCP-desktop finding).** The shipped skill did not encode the §4B HSTS disposition, so an agent asked about routing semantics would freehand-map Missing HSTS to HIPAA / ISO A.8.9 / CIS 3.10 — the exact overclaim §4B deleted from the engine. Added an authoritative "cite the engine, do not freehand-map" note recording the narrow dispositions (Missing HSTS → **SOC 2 CC6.7 only**; aggregate open-port count + opportunistic/port-inferred cleartext → SOC 2 only; confirmed cleartext → all seven), each firsthand-verified against the real engine. The engine was already correct; this aligns the conversational surface with it.

## 0.2.29 (2026-07-19) — paired content bump for EE 0.32.6 (network-scan false-negative closures)

- Version line updated to post-EE-0.32.6. Matrix-neutral cycle on the EE analysis-agent (network-scan) path: **cleartext transport** now flagged (a conditional inversion in the crypto agent — a should-be-encrypted service offering no TLS at all used to read clean → **SOC 2 CC6.7**), **SMB-alone** exposure now its own **HIGH** finding (a severity-inverted conjunction in the exposure agent — SMB without RDP is the higher-risk case → **CC6.6**), and **WinRM 5985/5986 · Elasticsearch 9300 · MSRPC 135 · a new aggregate open-port-count rule** as new exposure signals (→ **CC6.6**). Routed SOC 2-first with drift-detector coverage; **SOC 2 routing only this cycle — cross-framework mappings (HIPAA §164.312(e)(1) · CIS 4.x · NIST PR.*) deferred.** Plugin count UNCHANGED at 28; all seven coverage matrices UNCHANGED.

## 0.2.28 (2026-07-18) — paired content bump for EE 0.32.5 (report quality + routing integrity)

- Version line updated to post-EE-0.32.5. Matrix-neutral cycle: API Gateway mapping repair (routing was never broken — the defect was stale auditor-facing prose), HIPAA §164.312(c)(1) WAF mapping removed on doctrine, six rationale rewrites, `renderJSON` no longer shipping raw routing regexes, a CI/CD AccessDenied false-negative closed fail-closed, and three mutation-proven compliance-guard hardenings. Plugin count UNCHANGED at 28; all seven coverage matrices UNCHANGED.

## 0.2.27 (2026-07-13) — Paired content bump for EE 0.32.4 (RDS false-negative depth pass, part 2)

Paired content bump for the EE 0.32.4 trio. SKILL.md reflects the RDS auditor's expanded false-negative coverage on plugin 1140: **RDS Proxy client↔proxy TLS** (`DescribeDBProxies.RequireTLS` — a proxy that does not require TLS accepts cleartext client connections, a transit leg distinct from the DB-engine SSL parameter; fail-closed on false-or-absent → routes == the DB-SSL transit axis), a new **retained / cross-region-replicated automated-backup at-rest surface** (`DescribeDB{Instance,Cluster}AutomatedBackups` — an unencrypted automated backup that survives instance/cluster deletion, invisible to the live-resource and snapshot scans), the **Aurora cluster-member double-audit closure** (provisioned Aurora members defer the cluster-scoped SSL / Multi-AZ dims to the cluster, closing self-contradictory instance-level false positives), and a **cross-framework report-quality leak closure** (a renderer backstop strips foreign framework control-ids out of the violation prose). Matrix-neutral: no new framework, plugin count UNCHANGED at 28, all seven coverage matrices UNCHANGED. Paired **EE 0.32.4** + **CE 0.2.29**.

---

## 0.2.26 (2026-07-12) — Paired content bump for EE 0.32.3 (RDS cluster-level SSL enforcement + CE GRC-push preflight)

Paired content bump for the EE 0.32.3 trio. SKILL.md reflects the RDS auditor's new **cluster-level SSL enforcement** dimension (plugin 1140 now audits the Aurora **cluster** parameter group via `DescribeDBClusterParameters` — closing a cleartext false-negative on instance-less Aurora Serverless v1 clusters that the instance-level SSL check never saw) and the **staged-parameter (`ParameterApplyStatus`) discipline** (a set-but-not-yet-applied `rds.force_ssl` / `pgaudit` is no longer affirmed as effective). Also notes the CE CLI's new **GRC-push startup preflight** (fail-fast on bad GRC config before the scan; CLI-only, not MCP-reachable). Matrix-neutral: no new framework, plugin count UNCHANGED at 28, all seven coverage matrices UNCHANGED. Paired **EE 0.32.3** + **CE 0.2.28**.

---

## 0.2.25 (2026-07-10) — Paired content bump for EE 0.32.2 (GRC connector trio complete — Secureframe + cross-framework report-quality leak closure)

Paired content bump for the EE 0.32.2 trio. SKILL.md now teaches the completed **Vanta · Drata · Secureframe** GRC connector trio (enable Secureframe with `COMPLIANCE_GRC_PROVIDER=secureframe` — records model, your Secureframe rules evaluate the pushed control records; outbound, single-workspace, opt-in early-access; API shape published-assumed, live-tenant validation deferred) and reflects the closed **cross-framework foreign-token leak** in the "Why this violates" rationales (no internal `Inherits from soc2.json` note, bare foreign control-ids, cross-framework routing-maps, or `real-engine verified ==` QA-note leaks a foreign framework's name into a customer's Report on Compliance). Matrix-neutral: no new framework, plugin count UNCHANGED at 28, all seven coverage matrices UNCHANGED. Paired **EE 0.32.2** + **CE 0.2.27**.

---

## 0.2.24 (2026-07-09) — Paired content bump for EE 0.32.1 (compliance report-quality hygiene + deeper positive-substrate curation + GRC-connector DRY refactor)

Paired version bump for the EE 0.32.1 trio — matrix-neutral patch. EE 0.32.1 cleans internal engineering markers (`[[wiki-links]]`, `EE-RT` work-codes, reviewer-codes, `Rn-SEVERITY` review-round IDs) out of the "Why this violates" rationales rendered into every Report on Compliance across all seven frameworks (~900 rationales, subsequence-invariant-proven), fixes a KMS-parse-failure rationale that leaked a reviewer-code + a foreign-framework token into all seven reports, opts more Azure + deeper-AWS PASS-tier findings into the display-only positive-substrate RoC view, and collapses the Vanta + Drata push loops into a shared `_runPushBatch`. No new framework, plugin count UNCHANGED at 28, all seven coverage matrices UNCHANGED. Paired **EE 0.32.1** + **CE 0.2.26**.

---

## 0.2.23 (2026-07-07) — Paired content bump for EE 0.32.0 (Enterprise GRC push activation — Vanta + Drata)

Paired content bump (SKILL.md version line + the `compliance_check` capability's GRC-connector mention + the `COMPLIANCE_GRC_PROVIDER` Environment-Variables entry + this changelog). **EE 0.32.0** wires the dormant Vanta connector for **scan-time GRC push activation** (`COMPLIANCE_GRC_PROVIDER=vanta` + `COMPLIANCE_GRC_TOKEN` → the compliance phase maps findings to Vanta test results and pushes them, opt-in + ZDE-redacted, token never serialized) and ships a new **Drata** connector (Custom Connections; your Drata Test Builder rules evaluate the pushed records); Secureframe is on the roadmap. Also ships the **T1/T2 AWS positive-substrate curation** (60 PASS-tier findings opt into the per-control RoC positive-substrate view; display-only, non-flipping, count-neutral). Honest status: connectors shipped + opt-in + extensively tested; live validation against production tenants is in progress — early-access, single-workspace, not a multi-tenant sync. **No new MCP tools or schemas. No new framework, no new plugins (still 28), all seven coverage matrices UNCHANGED.** Paired **EE 0.32.0** + **CE 0.2.25**. *(WITHDRAWN at 0.2.34 — the tool named here does not exist; this line is the historical record of what the package said at the time.)*

## 0.2.22 (2026-07-05) — Paired content bump for the CE 0.2.24 multi-cloud scope-integrity fix + EE 0.31.10 (GCP gate + T4 positive-substrate)

Paired content bump (SKILL.md version line + this changelog). **CE 0.2.24** closes a multi-cloud false-clean: `--host aws,gcp,azure` (and a `--host-file` of cloud sentinels) under a stale / tool-implied `CLOUD_PROVIDER` used to silently skip the un-covered cloud legs and report them **"audited-clean" over zero API calls**; the CLI now reconciles `CLOUD_PROVIDER` against the requested cloud legs (fail-fast on a mismatch, else imply the union) and classifies a gate-skipped provider as `'skipped'` (not audited). **EE 0.31.10** adds the EE half — a `CLOUD_PROVIDER` scope-integrity gate on the GCP plugins 1024/1025 (they run only when the effective provider includes `gcp`) — plus the **T4 GCP positive-substrate curation** (17 GCP PASS-tier findings opt into the per-control RoC positive-substrate view; display-only, non-flipping, count-neutral). No new MCP tools or schemas. **No new framework, no new plugins (still 28), all seven coverage matrices UNCHANGED.** Paired **CE 0.2.24** + **EE 0.31.10**.

---

## 0.2.21 (2026-07-03) — Paired content bump for the CE 0.2.23 operator bug-fix cycle + EE 0.31.9 GAP-1 #3

Paired content bump (SKILL.md version line + this changelog). **CE 0.2.23** hardens cloud-scan scope integrity (a cloud auditor runs only on its own sentinel host — a network `--host` never triggers cloud plugins, including via the MCP `probe_service` tool; `--host` is the sole cloud-intent signal, credentials are not), AI-conclusion robustness (payload-scaled timeout + a fail-visible `scan_response_ai.txt` stub), and the AI bail message. **EE 0.31.9** closes the GAP-1 #3 RoC positive-substrate render-site parity (false-positive controls now render their substrate in HTML too) + FP-correct auditor wording. No new MCP tools or schemas; the `probe_service` tool now enforces the cloud-intent contract (a cloud auditor requires its sentinel host; a network plugin is rejected on a sentinel host). **No new framework, no new plugins (still 28), all seven coverage matrices UNCHANGED.** Paired **CE 0.2.23** + **EE 0.31.9**.

---

## 0.2.20 (2026-07-01) — Paired content bump for EE 0.31.8 (GAP-1 positive-substrate polish: framework-aware PCI Req 10.5.1 caveat restoration + SOC 2 GRC-push hygiene)

Paired content bump for the EE 0.31.8 cycle (SKILL.md version line + this changelog). EE 0.31.8 restores per-framework precision to the 0.31.7 positive-substrate caveat — the RDS audit-log-retention substrate finding now carries a per-framework caveat override so the PCI report restores the `Req 10.5.1` citation while SOC 2 keeps the neutral base (no PCI leak) — and hardens the mechanism (framework-neutral category so no `pci` machine substring rides the SOC 2 renderJSON → GRC push, empty-string-safe caveat selection, genuine renderJSON GRC-channel tests). **No new framework, no new plugins (still 28), all seven coverage matrices UNCHANGED.** Paired **EE 0.31.8** + CE 0.2.22.

---

## 0.2.19 (2026-06-29) — Paired content bump for EE 0.31.7 (RDS audit-log no-false-clean (generation + retention) + opt-in positive-substrate RoC surfacing)

Paired content bump for the EE 0.31.7 cycle (SKILL.md version line + this changelog). EE 0.31.7 makes a database producing no audit logs — CloudWatch exports off, or PostgreSQL pgAudit disabled/misconfigured — fail closed against every framework's audit-log-**generation** control (SOC 2 CC7.2 · HIPAA §164.312(b) · PCI 10.2.1 · CIS 8.2 + 8.5 · NIST PR.PS-04 · ISO A.8.15, + NIST DE.CM-09 for pgAudit), adds a conservative PCI DSS 10.5.1 ≥12-month retention substrate, and surfaces opt-in positive-substrate evidence per-control in the RoC. **No new framework, no new plugins (still 28), all seven coverage matrices UNCHANGED.** Paired **EE 0.31.7** + CE 0.2.21.

---

## 0.2.18 (2026-06-27) — Paired content bump for EE 0.31.6 (RDS enumeration-truncation no-false-clean class CLOSED + audit-log retention routing-depth sweep; CIS matrix 17/22/114 → 17/23/113)

Paired content bump for the EE 0.31.6 cycle (SKILL.md version line + the `compliance_check` CIS count). EE 0.31.6 makes every RDS enumerator fail closed on page-cap truncation, registers the RDS auditor in the compliance-engine drift detector, and maps RDS audit-log retention to PCI DSS 10.5.1 / NIST CSF PR.PS-04 / ISO A.8.15 / CIS Safeguard 8.10 — flipping **CIS Controls v8 Safeguard 8.10 OOS → partial** (CIS matrix **17/22/114 → 17/23/113**; IG1 cyber-insurance baseline UNCHANGED at 23/56, IG2-cum 38, IG3-cum 40). The other six matrices are UNCHANGED; plugin count UNCHANGED at 28. Paired **EE 0.31.6** + CE 0.2.20. *(WITHDRAWN at 0.2.34 — the tool named here does not exist; this line is the historical record of what the package said at the time.)*

---

## 0.2.17 (2026-06-26) — Paired content bump for EE 0.31.5 (RDS Multi-AZ DB cluster REAL snapshot detection + at-rest snapshot routing fleet sweep)

Paired content bump — no CE engine behavior change (detection + routing live in the Enterprise engine). The Enterprise engine promotes a non-Aurora **RDS Multi-AZ DB cluster** snapshot to real detection (public `restore=all` CRITICAL, cross-account / unencrypted HIGH — was a fail-closed residual gap) and closes a cross-framework **single-framework snapshot false-clean**: an unencrypted snapshot now routes to the at-rest control in **all seven** frameworks (was SOC 2 + HIPAA only — NIST PR.DS-01 · PCI 3.5.1 · ISO A.8.24 · CIS 3.11 + 11.3 · GDPR Art.32(1)(a)); a public/cross-account share also routes to access-control (SOC 2 CC6.1 + the Required HIPAA §164.312(a)(1)). **No new framework, no new plugins (still 28), all seven coverage matrices UNCHANGED.** Paired with EE 0.31.5 + CE 0.2.19. **EE 0.31.5 requires CE 0.2.8+.**

## 0.2.16 (2026-06-25) — Paired content bump for EE 0.31.4 (cloud-scan presentation false-clean fix + `--compliance all` / fail-fast validation)

Paired content bump — no new framework, no new plugins (still 28), all seven coverage matrices UNCHANGED. EE 0.31.4 is a report-surface + CLI-UX hardening patch: a cloud scan (`--host aws|azure|gcp`) with real findings no longer surfaces the CE network concluder's *"Host is UP — No open services detected"* headline (the conclusion is rewritten to a cloud-appropriate N-by-severity summary with top risks), and a plugin that **times out or errors** routes to **coverage UNVERIFIED** rather than an affirmative clean verdict — the cardinal presentation-layer false-clean, closed (detection unchanged, oracle-validated). `--compliance all` expands to all seven frameworks; an unknown token **fails fast** (no "Framework load failed" stub). The skill's `compliance_check` tool reference + HIPAA usage example now document `--compliance all`; the version blurb is refreshed. Paired with EE 0.31.4 + CE 0.2.16. **EE 0.31.4 requires CE 0.2.8+.** *(WITHDRAWN at 0.2.34 — the tool named here does not exist; this line is the historical record of what the package said at the time.)*

## 0.2.15 (2026-06-24) — Paired content bump for EE 0.31.3 (Enumeration-failure fleet sweep + Aurora DB-cluster snapshot dimension)

Paired content bump — no new framework. EE 0.31.3 closes a fleet-wide class of **enumeration-failure** false-cleans across **12 AWS plugins**: a scanner that cannot enumerate a resource population (a generic throw that escapes `run()`, a throw caught inside the per-region body, or an AccessDenied that returns without throwing) now fails **CLOSED** with a routed evidence-gap == the source's native control set, instead of letting the region/source read CLEAN. It also adds the Aurora **DB-cluster snapshot** dimension to plugin 1140 — `DescribeDBClusterSnapshots` reads the cluster snapshot surface member instances never see (a public `restore=all` cluster snapshot is CRITICAL, cross-account HIGH, unencrypted HIGH on the cluster `.StorageEncrypted` field), with a Multi-AZ DB cluster fail-close. The skill version blurb is refreshed; plugin count UNCHANGED at 28; all seven coverage matrices UNCHANGED. Paired with EE 0.31.3 + CE 0.2.15.

## 0.2.14 (2026-06-22) — Paired content bump for EE 0.31.2 (At-rest → ISO A.8.24 fleet sweep + cross-cloud KEY-CUSTODY-HOME doctrine + SOC 2 file-lock fix)

Paired content bump — no new framework. EE 0.31.2 completes **every AWS at-rest-encryption source** (RDS · S3 · EC2/EBS · SQS/SNS · ElastiCache) to the canonical 7-control at-rest set {SOC 2 C1.1 / HIPAA 164.312(a)(2)(iv) / NIST PR.DS-01 / PCI 3.5.1 / ISO A.8.24 / CIS 3.11 / GDPR Art.32(1)(a)}, fixes the DynamoDB + EC2-indeterminate class-O false-cleans (an unverifiable/unclassifiable encryption posture now fails-close instead of reading CLEAN), and establishes the **cross-cloud KEY-CUSTODY-HOME doctrine** — a provider-managed key on an always-encrypted service routes to {SOC 2 C1.1 (GCP CC6.1) / HIPAA / ISO A.8.24} (key management), NOT the encryption-presence set, closing a live PCI 3.5.1 + GDPR Art.32(1)(a) over-claim on always-encrypted Azure storage (GDPR scope-doctrine held — Art. 32 infrastructure substrate only; the GDPR-touching copy carries the operator legal review). It also fixes a SOC 2 "no silent data loss" mutual-exclusion bug in the Enterprise-side suppression/WORM file lock (in-process mutex + re-entrancy guard + EINVAL fold). The skill version blurb is refreshed; plugin count UNCHANGED at 28; all seven coverage matrices UNCHANGED. Paired with EE 0.31.2 + CE 0.2.14.

## 0.2.13 (2026-06-21) — Paired content bump for EE 0.30.1 (AWS RDS + API Gateway false-negative depth pass + AXIS_MAP graduation)

Paired content bump — no new framework. EE 0.30.1 closes the last two AWS sources' silent false-cleans: **RDS (1140)** snapshot-sharing exposure (a `restore=all` shared snapshot is CRITICAL even when encrypted) + a `DescribeDBInstances` evidence-gap, and **API Gateway (1050)** WAF deep-audit gap arm (6 evidence-gaps now fail-close the WAF native set == the positives) + unknown-auth + WebSocket-skip + deleted-WebACL + unencrypted-cache routing — and graduates both `KNOWN_UNCOVERED → AXIS_MAP`, so every AWS source now has a dedicated false-negative pass. Cross-framework parity folds route the API Gateway resource-policy public-grant to **PCI 7.2.1 + GDPR Art.32(1)(b)**, the deleted-WebACL to **PCI 6.4.1 / ISO A.8.21**, and the unencrypted cache to **ISO A.8.24** (GDPR scope-doctrine held — Art. 32 infrastructure substrate only; the GDPR-touching copy carries the operator legal review). The skill version blurb is refreshed; plugin count UNCHANGED at 28; all seven coverage matrices UNCHANGED. Paired with EE 0.30.1 + CE 0.2.13.

## 0.2.12 (2026-06-18) — Paired content bump for EE 0.30.0 (AWS + Azure false-negative depth-pass + cross-source compliance-mapping parity)

Paired content bump — no new framework. EE 0.30.0 is a detection-depth + mapping-correctness release: it closes a wave of cloud-misconfiguration false-negatives across AWS (S3 access-points · resource-policy effective-exposure · EC2-SG public-CIDR/split-range · KMS effective-decrypt/cross-account · IAM ListUsers truncation) and Azure (storage/NSG/Key-Vault/cloud-scanner class-O fail-opens), and routes architecturally-identical confidentiality / least-privilege exposures consistently across all seven frameworks (e.g. a public application entry-point now appears on a NIST CSF **PR.AA-05** least-privilege report; KMS / queue read-exposure reaches GDPR **Art.32(1)(b)**). The skill's version blurb + the `compliance_check` capability row are refreshed to seven frameworks (corrected a stale "six/hexa-framework" reference); plugin count UNCHANGED at 28; all seven coverage matrices UNCHANGED. Paired with EE 0.30.0 + CE 0.2.12. *(WITHDRAWN at 0.2.34 — the tool named here does not exist; this line is the historical record of what the package said at the time.)*

## 0.2.11 (2026-06-12) — GDPR Article 32 framework taught (paired with CE 0.2.11 + EE 0.20.0)

> **Published 2026-06-12 — live on npm.**

**A real content change (not a pin).** The skill now teaches the **seventh compliance framework** EE 0.20.0 adds: GDPR **Article 32 (security of processing) infrastructure substrate**. The new teaching covers the **scope doctrine** (this is GDPR Article 32 infrastructure substrate ONLY, **NOT GDPR compliance** — Art. 32 is the only article an infrastructure scanner can substrate-evidence; the rest of GDPR is OOS-by-design, so an agent must never report "GDPR coverage" / "GDPR certified" off an Art. 32 result), the **four-factor proportionality** discipline (state of the art / cost of implementation / nature-scope-context-purposes / risk — the engine produces substrate FOR the operator's "appropriate to the risk" determination, nothing is absolute pass/fail), the **sub-measure discipline** (cite at the Art. 32(1)(a)–(d) / 32(2) / 32(4) unit, never the paragraph; 4 covered / 5 partial / 2 OOS), the **personal-data-scope attestation** (the scanner cannot know which resources hold personal data), and the **Art. 83(4) LOWER fine tier** (Art. 32 violations sit in the €10M / 2% tier, NOT the €20M / 4% headline tier — overstating fine exposure is itself an overclaim). Plugin count UNCHANGED at 28; the six existing coverage matrices UNCHANGED. Paired with **CE 0.2.11** (the `scan_cloud` description lists the framework) + **EE 0.20.0** (the framework).

## 0.2.10 (2026-06-11) — get_findings drill-down documented + MCP affordance II (paired with CE 0.2.10 + EE 0.19.4)

**A real content change (not a pin).** The skill now documents the CE 0.2.10 MCP-affordance feature so agents discover and use it: a new **`get_findings`** tool entry (drill the MOST RECENT scan's per-provider, **per-session** cache; pass the `scanId` from the `scan_cloud` summary footer; filter by provider/plugin/severity/category; paginate with `cursor`/`limit`; on a stale-cache error **re-run `scan_cloud`, don't retry**; Enterprise-gated), `get_findings` added to the MCP-tool list, and the "interpreting `scan_cloud` results" guidance extended to treat **`findingsSummary[provider].rollup`** (the MEDIUM/LOW category rollup) as actionable — reporting only CRITICAL/HIGH while the rollup is non-empty is itself a false clean, and the resources behind a rollup category are reachable via `get_findings`. Paired with **CE 0.2.10** (the feature) + **EE 0.19.4** (unchanged; peer `nsauditor-ai >=0.2.8` already satisfied).

## 0.2.9 (2026-06-11) — Paired release for EE 0.19.4 + CE 0.2.9 — Routing-Integrity Hardening

Paired no-op bump (knowledge-package version sync; SKILL.md body + `references/plugins.md` UNCHANGED — no change to the MCP tool/plugin schemas this skill documents). EE 0.19.4 closes the routing-integrity false-clean class: a generic build-time routing guard (complete-partition `nativeFrameworks` allowlist) so no marked evidence-gap routes to zero controls + GuardDuty (1200) dedupe/class-O routing + a single-source `MULTI_REGION_GAP_PREFIX`; a deferred-scope unmark across 8 plugins (capability boundary ≠ evidence-gap → the MCP "unverified" list shrinks); the 1160 AWS-default VPC-endpoint full-access policy down-rated CRITICAL→MEDIUM with its 3 policy-gap emissions routed (SOC 2 CC6.6 / HIPAA 164.312(a)(1) + PCI 1.4.1 / ISO A.8.22 / CIS 12.2); 1150 SQS/SNS alarm-independence (alarm posture classified even under a `Get*Attributes` deny; all four alarm-coverage-unverifiable causes fail-close soc2{A1.2,CC7.2}+hipaa{164.312(b)}). **PCI DSS matrix shifts 20/8/39 → 19/9/39** (Req 7.2.2 covered→partial, backed by 1030 over-privilege mapping). Plugin count UNCHANGED at 28; the other five matrices UNCHANGED.

## 0.2.8 (2026-06-09) — Paired release for EE 0.19.3 + CE 0.2.8 — MCP affordance + class-O truncation sweep

Version sync for a cycle that **changes documented MCP behavior** (input schemas unchanged; the skill's existing `scan_cloud` guidance remains correct): CE 0.2.8's `scan_cloud` tool description now enumerates the per-service coverage (AWS S3/IAM/KMS/CloudTrail/CodePipeline-CodeBuild SoD/Lambda/API GW/DynamoDB/RDS/SQS-SNS/Secrets/Backup/VPC endpoints/SG perimeter/ElastiCache/SES/GuardDuty · Azure KV/Storage/NSG/RBAC · GCP firewall/storage/impersonation) + the 6 frameworks, so agents route service-named audit asks to the scanner; the `[⚠ EVIDENCE GAP]` summary lines lead with the GAP clause and carry the first actionable clause as an `· actionable:` companion (internal routing tags stripped). EE 0.19.3: Lambda inline-credential env-var names + the `AWS_LAMBDA_`/`AWS_XRAY_` exclusion-prefix evasion bypass (1080); truncation/AccessDenied evidence-gaps across 8 AWS auditors now fail-close their sources' native controls in all six frameworks (class-O sweep incl. the 1110 P-16 grant-bypass); a new Azure NSG Dim 2a flags restricted-port exposure to the tenant-rentable `AzureCloud`/`AzureCloud.<region>` service tags (1221); public-subnet Redis replication groups no longer silently downgrade (1180). Plugin count UNCHANGED at 28; all six coverage matrices UNCHANGED at the count level.

## 0.2.7 (2026-06-08) — Paired-release pin for EE 0.19.2 + CE 0.2.7 — Confirmed false-negative tail

Paired no-op bump (knowledge-package version sync). EE 0.19.2 closes six more gauntlet-confirmed Tier-B false-negatives across the Pro/Enterprise cloud auditors (1222 Azure KV legacy access-policy per-verb breadth + 2 anchor-drifts + drift-detector closure · 1021 GCP broad-but-not-full public firewall ranges · 1070 AWS KMS PendingDeletion key-policy audit · 1100 CodePipeline sticky approval-latch · 1024 GCP Storage bucket-enumeration truncation evidence-gap · 1040 CloudTrail data-events read-coverage caveat), each TDD'd + independently adversarially reviewed. Plugin count UNCHANGED at 28; all six coverage matrices UNCHANGED. No change to the MCP tool/plugin schemas this skill documents.

## 0.2.6 (2026-06-08) — Paired-release pin for EE 0.19.1 + CE 0.2.6 — Confirmed false-negative batch

Paired no-op bump (knowledge-package version sync). EE 0.19.1 closes seven gauntlet-confirmed Tier-B false-negatives across the Pro/Enterprise cloud auditors (1030 AWS IAM prefix-glob privesc + access-key hygiene · 1150 SQS wildcard-Principal queue-policy audit · 1130 air-gapped KMS CreateGrant/GenerateDataKey · 1120 S3 versioned-bucket noncurrent-version disposal · 1080 Lambda deprecated/unknown-runtime currency · 1025 GCP OIDC-impersonation + WIF-provider admin-equivalence · 1160 VPC-endpoint sensitive-action service-namespace matching), each TDD'd + independently adversarially reviewed. Plugin count UNCHANGED at 28; all six coverage matrices UNCHANGED. No change to the MCP tool/plugin schemas this skill documents.

## 0.2.5 (2026-06-07) — Paired-release pin for EE 0.19.0 + CE 0.2.5 — No silent false-clean

Paired no-op bump (SKILL.md version banner only; SKILL.md body + `references/plugins.md` UNCHANGED). EE 0.19.0 is the largest false-clean-class closure since the framework cycles: an un-scanned cloud region, a denied API call, or a logging-but-not-delivering trail can no longer read CLEAN at EITHER the compliance verdict OR the MCP `scan_cloud` transport. The shared `forEachRegion` fan-out (all 16 regional AWS plugins) now emits a per-region `region-scan-evidence-gap` LOW+evidenceGap finding for every errored/access-denied region — pre-fix an errored region was recorded in scanScope but emitted ZERO findings, so the findings-only compliance engine + the MCP summary saw it as CLEAN; class-O routing then fail-closes EXACTLY that source's native attested controls across all six frameworks (208 additive titlePattern anchors; matrices UNCHANGED at the count level). Four per-plugin swallow→gap retrofits: 1150 SQS/SNS region AccessDenied, 1022 Azure storage enumeration-error (SDK-absent soft-degrade vs real failure), 1200 GuardDuty `ListDetectors` AccessDenied no longer mis-classified as a definitive "NOT ENABLED" HIGH, and 1040 CloudTrail now reads `LatestDeliveryError` so a trail that is logging but failing to deliver to S3 is flagged HIGH. Plus two air-gapped/IAM criticals from the Mythos review (offline CVE matcher fails-CLOSED on distro/epoch/build-suffixed versions; plugin 1110 keeps HIGH on the AWS-default root-delegation key policy) and the EE AI-enrichment prompt no longer leaks the scan target (public IP/hostname/MAC/secrets) to the external LLM — every target host is anonymized to a deterministic `[target-N]` label and routed through CE's content-scrubber. No skill-logic change. **Plugin count UNCHANGED at 28; all six coverage matrices UNCHANGED** (SOC 2 + HIPAA + NIST CSF 2.0 + PCI DSS v4.0.1 + ISO 27001:2022 + CIS Controls v8). Published + live on npm 2026-06-07 (61st trio).

## 0.2.4 (2026-06-05) — Paired-release pin for EE 0.18.3 + CE 0.2.4 — GCP IAM + Azure Key Vault false-negative hardening III

Paired no-op bump (SKILL.md version banner only; SKILL.md body + `references/plugins.md` UNCHANGED). EE 0.18.3 closes three cloud false-negatives: Azure Key Vault narrow-verb custom roles — a role granting only a data-plane crypto/extraction verb (`decrypt`/`wrap`/`unwrap`/`release`/`backup`/…) is now flagged (plugin 1222); the GCP IAM impersonation-BFS depth-cap truncation now fail-closes to a completeness evidence-gap instead of "zero reachability paths" (plugin 1025 H3); and the googleapis-SDK-absent path now fail-closes the GCP IAM dims to compliance-routed evidence-gaps (plugin 1025 M2). Plugin count UNCHANGED at 28; all six coverage matrices UNCHANGED at the count level.

## 0.2.3 (2026-06-05) — Paired-release pin for EE 0.18.2 + CE 0.2.3 — scan_cloud evidence-gap visibility (end-to-end)

Paired no-op bump (no agent-skill content change beyond the SKILL.md version banner; SKILL.md body + `references/plugins.md` UNCHANGED). EE 0.18.2 + CE 0.2.3 make the no-false-clean evidence-gaps the cloud plugins emit **visible through the MCP `scan_cloud` transport, end-to-end**: the CE collector renders a dedicated "Evidence gaps (unverified)" section, and a new EE CI producer-contract guarantees every cloud plugin (AWS / Azure / GCP) marks its scan-coverage gaps so they reach it (retrofitted AWS S3 1020 + Azure 1220/1221/1222 + AWS IAM 1030). EE 0.18.2 also hardens the hand-rolled source scanners against a regex-literal desync (including the ZDE read-only security meta-test, where it could have masked a mutating cloud call) and adds the proprietary `LICENSE` / EULA (now shipped in the package) + per-file copyright headers. Plugin count UNCHANGED at 28; all six coverage matrices UNCHANGED.

---

## 0.2.2 (2026-06-05) — Paired-release pin for EE 0.18.1 + CE 0.2.2 — GCP false-negative hardening II + read-only enforcement

Paired no-op bump (no agent-skill content change beyond the SKILL.md version banner; SKILL.md body + `references/plugins.md` UNCHANGED). EE 0.18.1 closes three more GCP false-negative defects at substrate depth on already-covered controls — **(1) plugin 1021** split-range firewall rules that cover the whole IPv4 internet without literally writing `0.0.0.0/0` now flag as the `0.0.0.0/0` CRITICAL (conservative full-coverage helper); **(2) plugin 1025** the SA-impersonation BFS fail-closes with a LOW evidence-gap instead of a falsely-clean `GRAPH_CLEAN` when any graph input is degraded (per-SA policy denied / custom-roles unavailable / list pagination-truncated); **(3) plugin 1024** a bucket whose DEFAULT object ACL is public (every future object born public) is now detected — and adds a structural read-only guarantee (a CI meta-test that fails the build on any mutating cloud call across all 28 plugins) plus the matching customer-facing read-only-credential requirement (EULA §5.5). No skill-logic change. **Plugin count UNCHANGED at 28; all six coverage matrices UNCHANGED** (SOC 2 + HIPAA + NIST CSF 2.0 + PCI DSS v4.0.1 + ISO 27001:2022 + CIS Controls v8).

---

## 0.2.1 (2026-06-03) — Paired-release pin for EE 0.18.0 + CE 0.2.1 — GCP false-negative hardening

Paired no-op bump (no standalone agent-skill content change beyond the SKILL.md version banner; SKILL.md body + `references/plugins.md` UNCHANGED). EE 0.18.0 closes five GCP false-negative defects at substrate depth on already-covered controls: **(1) plugin 1021 — AccessDenied evidence-gaps now route into `result.findings[]`** (16 single-owner anchors), so a denied GCP firewall / IAM / bucket enumeration FAILS its controls instead of reading CLEAN (was a compliance-layer false-CLEAN); **(2) plugin 1021 — project-IAM-public check now calls the correct client** — it had called `getIamPolicy` on `@google-cloud/compute`'s `ProjectsClient`, which has NO IAM methods, so the check ALWAYS threw live (`client.getIamPolicy is not a function`) and evidence-gapped → real project-IAM-public detection never fired (a pre-0.18.0 bug; the 1021 evidence-gap made it fail gracefully with no false-CLEAN, but the detection was dead); fixed to `@google-cloud/resource-manager`'s `ProjectsClient.getIamPolicy` (the client plugin 1025 already uses), live-validated under pure ADC; **(3) plugin 1025 — googleapis IAM-admin client now authenticates under pure ADC** — the `googleapis` REST client that powers 1025's Dim4-6 (custom-role inventory, SA-key custody, and the impersonation breadth-first-search where the K1/K2 paths below live) only set auth for the impersonation/key-file credential modes; in PURE Application-Default-Credentials it had NO auth set, and unlike the `@google-cloud` gax clients (storage / resource-manager) which auto-detect ADC, the `googleapis` library does NOT — so Dim4-6 returned AccessDenied even as project owner and never ran live (caught by the live Task 12 owner-ADC smoke). Fixed with an explicit scoped `GoogleAuth` for the pure-ADC path; pre-existing, same class as fix (2); **(4) plugin 1024 (GCP Cloud Storage) — NEW legacy-ACL public-exposure detection**, a bucket made public via a legacy ACL (`allUsers` / `allAuthenticatedUsers`) while Uniform Bucket-Level Access is disabled now scans the bucket ACL + a sampled object-ACL surface → CRITICAL / HIGH + evidence-gap (routed to SOC 2 CC6.6 / HIPAA §164.312(a)(1) / CIS Controls v8 3.3) instead of CLEAN; **(5) plugin 1025 (GCP IAM impersonation-BFS) completeness** — project-scope `roles/iam.serviceAccountKeyAdmin` (mint a long-lived key for ANY service account = offline impersonation) now fires the project-scope impersonation CRITICAL, and a service account privileged via an admin-equivalent CUSTOM role (`iam.serviceAccounts.actAs` etc.) is now marked admin in the impersonation graph so paths terminating there are detected instead of reading clean — both live-validated (K1 fired on a project-scope `serviceAccountKeyAdmin` binding; K2 fired on a custom-role-`actAs` SA reached via a `tokenCreator` edge). No skill-logic change. **Plugin count UNCHANGED at 28; all six coverage matrices UNCHANGED** (SOC 2 + HIPAA + NIST CSF 2.0 + PCI DSS v4.0.1 + ISO 27001:2022 + CIS Controls v8) — these are substrate-depth false-negative fixes on already-covered controls, NOT new controls. Live-validated under pure owner-ADC against a test-infra GCP project (1025-K1/K2 fired; 1025-adc Dim4-6 confirmed running; 1021 client read works with no false-clean under degraded auth); the 1024-C1 public-bucket + 1021 allUsers-binding findings could not be exercised live because the org enforces `publicAccessPrevention` + `allowedPolicyMemberDomains` (an environmental constraint, not a product gap) and remain unit-test + storage-enumeration-live proven.

## 0.2.0 (2026-06-01) — `scan_cloud` `regions` teaching (paired with EE 0.17.0 + CE 0.2.0)

SKILL.md now teaches the `scan_cloud` `regions` argument: AWS region codes (e.g. `["us-east-1","eu-west-1"]`) or `["all"]`, with the divergent default (omit = the single server-configured `AWS_REGION`; omitting does NOT fan out). **Region-scope discipline — validated via live Claude Desktop runs + a RED→GREEN→REFACTOR subagent harness on a lighter model tier:** (1) **Default = single region** for any plain "audit my AWS account" / "quick check" / no-region request — do NOT fan out or batch; (2) **Honest scope reporting** — report the regions you actually PASSED, never claim "all regions / every region / across N regions" off GuardDuty's or Inspector's INTERNAL per-region enumeration, and never escalate a single-region or "quick" request into a multi-region scan; (3) **Full all-region coverage via discover-then-batch** (ONLY on an explicit all/every/whole-account/full-coverage request) — a single `["all"]` call usually exceeds the host's MCP tool-call timeout (e.g. Claude Desktop's ~60s) and returns nothing, so discover the enabled regions via a default scan then audit the remainder in small region-group batches until complete, counting the regions covered, and never report a timed-out or partial scan as full coverage. Paired with the EE 0.17.0 `--aws-region` feature + CE 0.2.0. Plugin count UNCHANGED (28); all six matrices UNCHANGED.

## 0.1.66 (2026-05-31) — Paired-release pin for EE 0.16.7 + CE 0.1.98 — EE CloudTrail (plugin 1040) multi-region hotfix: per-region DescribeTrails client now carries a short connect/request timeout + low maxAttempts (a dead/unreachable region fails in ~2s instead of hanging ~30s; region concurrency 6→12), and an errored region is recorded as an evidence-gap (regionsWithError) instead of throwing out of the whole enumeration → single-region fallback. Live: 233.7s → 14.2s, full multi-region, no fallback. Internal EE plugin change; no tool surface or agent-behavior change. Plugin count UNCHANGED (28); all six matrices UNCHANGED. Full regression 6814/6818 GREEN. SKILL.md/references unchanged.

## 0.1.65 (2026-05-31) — Paired-release pin for EE 0.16.6 + CE 0.1.97 — EE false-clean regression hotfix + two over-reporting folds (CloudTrail soft budget = 0.8×min(PLUGIN_TIMEOUT_MS, CLOUD_PLUGIN_TIMEOUT_MS) so it stays below the manager wall on BOTH the CLI and MCP scan paths — closes the 0.16.5 hard-cancel regression the published-build re-smoke caught; plugin 1110 no longer flags KMS grant-decrypt Pacu P-16 stealth paths on AWS-managed CMKs; compliance-engine PASS-tier substrate-evidence no longer counted as a violation). Internal EE engine/plugin change; no tool surface or agent-behavior change. Plugin count UNCHANGED (28); all six matrices UNCHANGED. Full regression 6808/6812 GREEN (zero new failures, zero verdict shifts). SKILL.md/references unchanged.

## 0.1.64 (2026-05-31) — Paired-release pin for EE 0.16.5 + CE 0.1.96 — EE compliance-mapping false-clean fixes (perimeter exposures route cross-framework to PCI/ISO/NIST; CloudTrail fails-closed on abort; GCP Cloud Storage emits an evidence-gap on enumeration failure; internal review-process markers + repo paths scrubbed from the shipped framework JSONs). Internal EE engine/JSON change; no tool surface or agent-behavior change. Plugin count UNCHANGED (28); all six matrices UNCHANGED. SKILL.md/references unchanged.

## 0.1.63 (2026-05-30) — Paired-release pin for EE 0.16.4 + CE 0.1.95 — MCP `scan_cloud` now surfaces cloud findings reliably (CE-led false-clean fix: builds `findingsSummary` directly from the scan results instead of the network-host concluder, which silently dropped cloud findings). Internal CE engine change; no tool surface or behavior change for the agent. Plugin count UNCHANGED (28); all six matrices UNCHANGED. SKILL.md/references unchanged.

## 0.1.62 (2026-05-30) — Paired-release pin for EE 0.16.3 + CE 0.1.94 — MCP `scan_cloud` now runs its cloud plugins concurrently with a per-plugin timeout (`CLOUD_SCAN_CONCURRENCY` / `CLOUD_PLUGIN_TIMEOUT_MS`), so a full AWS/GCP/Azure account audit finishes within Claude Desktop's ~60s tool-call limit. Internal CE engine change; no tool surface or behavior change for the agent. Plugin count UNCHANGED (28); all six matrices UNCHANGED. SKILL.md/references unchanged.

## 0.1.61 (2026-05-30) — **HOTFIX: SKILL.md `description` trimmed to fit the 1024-char skill-upload limit.** The frontmatter `description` had grown to 1241 chars, so Claude Desktop rejected the skill upload (`field 'description' in SKILL.md must be at most 1024 characters`). Rewrote it to 967 chars while keeping the high-value trigger keywords and adding the new cloud-audit triggers (`scan_cloud`, "audit my AWS/GCP/Azure account", "cloud compliance"). No body/content change vs 0.1.60 (still teaches `scan_cloud`); pairs the same EE 0.16.2 + CE 0.1.93.

## 0.1.60 (2026-05-30) — Paired-release for EE 0.16.2 + CE 0.1.93 — **SKILL.md updated**: teaches the NEW MCP `scan_cloud` tool (audit AWS/GCP/Azure accounts directly, no network host) — added to the Pro/Enterprise Tools table (Enterprise tier) + the "which tool to use" decision tree, plus a result-interpretation rule ("a cloud was effectively audited only if it's in `auditedProviders`; `audited:false` / `notes` / `pluginsRan:0` means NOT audited — never report a clean pass"). Feature lives in CE 0.1.93; plugin count UNCHANGED (28); all six matrices UNCHANGED.

## 0.1.59 (2026-05-30) — Paired-release pin for EE 0.16.1 + CE 0.1.92 — MCP `NSA_ENV_FILE`: the MCP server now loads a per-environment dotenv file named by `NSA_ENV_FILE` at startup (the MCP analog of the 0.16.0 CLI `--env`), so an operator points the server at a specific account/cloud by changing one path in the Claude Desktop / Claude Code config. Loaded after auth + license (scan-target vars only); fail-fast + authoritative-file ambient-cred clearing close a false-clean caught by the framework audit review. Feature lives in CE; plugin count UNCHANGED (28); all six matrices UNCHANGED. SKILL.md/references unchanged.

## 0.1.58 (2026-05-29) — Paired-release pin for EE 0.16.0 + CE 0.1.91 — CLI per-account scanning: `--env` / `--aws-profile` flags + sentinel-host plugin scoping (`--host aws|gcp|azure` + `--plugins all` runs only that cloud's plugins); EE adds a declarative `cloudProvider` field to all 27 cloud plugins. Plugin count UNCHANGED (28); all six matrices UNCHANGED. SKILL.md/references unchanged.

## 0.1.57 (2026-05-29) — Paired-release pin for EE 0.15.9 + CE 0.1.90 — hotfix: cross-cloud bleed gate moved to run(). SKILL.md/references unchanged.

## 0.1.56 (2026-05-29) — Paired-release pin for EE 0.15.8 + CE 0.1.89 — cloud-plugin scoping fixes (AWS CLOUD_PROVIDER gate + GCP evidence-gap). SKILL.md/references unchanged.

## 0.1.55 (2026-05-29) — Paired-release pin for EE 0.15.7 + CE 0.1.88 — GCP SDK refresh

Paired no-op bump (no standalone agent-skill content change; SKILL.md + `references/plugins.md` UNCHANGED). EE 0.15.7 re-applies the GCP SDK major bump (`@google-cloud/compute` ^6 / `@google-cloud/iam` ^2 / `googleapis` ^173) on the pure-ADC credential path — validated live against a test-infra GCP project (first live GCP audit: 3 CRITICAL firewall findings on compute@6) — documents the compute-client SA-impersonation gap (unsupported on compute@6; gated to plan-later), and folds the plugin-1021 project-resolution fix. No plugin count / matrix / behavior change (plugin count 28; all six matrices UNCHANGED).

## 0.1.54 (2026-05-28) — Paired-release pin for EE 0.15.6 + CE 0.1.87 — compliance-mapping correctness

Paired no-op bump (no standalone agent-skill content change; SKILL.md + `references/plugins.md` UNCHANGED). EE 0.15.6 closes two cross-framework defects in the S3 public-exposure compliance routing: a publicly-accessible bucket (public policy / bucket ACL / object ACL / non-current version) now correctly maps to NIST CSF PR.AA-05 + PR.DS-01 and PCI DSS 7.2.1 — it previously showed CLEAN on those two frameworks — and the missing-Public-Access-Block MEDIUM (a defense-in-depth guardrail gap, not a confirmed exposure) no longer false-FAILs the confidentiality-exposure controls (the `"publicly accessible"` anchor was tightened to confirmed-public-only across all six frameworks). No plugin count / matrix / behavior change (plugin count 28; all six matrices UNCHANGED).

## 0.1.53 (2026-05-28) — Paired-release pin for EE 0.15.5 + CE 0.1.86 — dependency-hygiene / institutional-trust patch

Paired no-op bump (no standalone agent-skill content change; SKILL.md + `references/plugins.md` UNCHANGED). EE 0.15.5 + CE 0.1.86 remove npm deprecation warnings + advisories institutional clients see on install: dropped unused `puppeteer`/`better-sqlite3`/`pg` (EE); replaced the abandoned `simple-wappalyzer`/`wappalyzer-core` with an in-house zero-dep tech fingerprinter (CE); bumped `@anthropic-ai/sdk` past its advisory range + `uuid`→`crypto.randomUUID()` (CE); NEW `SECURITY.md` in both. No plugin count / matrix / behavior change.

## 0.1.52 (PUBLISHED 2026-05-28) — Paired-release pin for EE 0.15.4 + CE 0.1.85 — plugin 1020 non-current-version ACL sampling + public WRITE-vs-READ differentiation

Paired-release pin for the EE 0.15.4 patch cycle: closes the two residuals the 0.15.3 spec §8 carried as deferred. NEW step 2c-v samples public ACLs on **non-current** object versions — on versioning-Enabled/Suspended buckets plugin 1020 calls `ListObjectVersions` (first-page, bounded by `AWS_S3_AUDIT_OBJECT_SAMPLE_CAP`), filters to `IsLatest !== true`, skips `DeleteMarkers`, reads each via `GetObjectAcl({Key, VersionId})`; closes the Class-B miss where a private current object retains a public-ACL overwritten version still served at `?versionId=`. Public `AllUsers`/`AuthenticatedUsers` grant → CRITICAL via the existing `"publicly accessible"` anchor; skipped on `BucketOwnerEnforced`. NEW `extractPublicWriteGroups` helper flags public WRITE/WRITE_ACP/FULL_CONTROL grants (anyone-can-overwrite) distinctly from READ-only as an enrichment line on the already-CRITICAL finding. New evidence-gaps (`ListObjectVersions AccessDenied` naming `s3:ListBucketVersions`; per-version aggregate-failure threshold; version-list truncation; a folded `GetBucketVersioning AccessDenied` gap) reuse the existing `"S3 object-ACL evidence-gap"` anchor — never a silent PASS. **Plugin count UNCHANGED at 28 (cloud-substrate 27); all six coverage matrices UNCHANGED; ZERO framework-JSON edits.** No new dependencies; EE regression 6628/6628 GREEN (+27 tests vs the 6601 baseline). No standalone agent-skill code changes — `SKILL.md` + `references/plugins.md` use generic framing (no plugin row change). _(Staged on `main`; awaiting live AWS smoke + trio publish.)_

## 0.1.51 (2026-05-28) — Paired-release pin for EE 0.15.3 + CE 0.1.84 — plugin 1020 object-level ACL enumeration + BucketOwnerEnforced short-circuit

Paired-release pin for the EE 0.15.3 patch cycle: closes the 4th and final S3 public-exposure vector (object-level ACLs) documented as a residual in the 0.15.2 closure. Plugin 1020 gains NEW step 2c sampled `GetObjectAcl` enumeration over first-page objects (`AWS_S3_AUDIT_OBJECT_SAMPLE_CAP` default 10, clamped `[1, 1000]`; `AWS_S3_AUDIT_OBJECT_RATE_MS` default 50ms throttle BEFORE each call) + NEW step 2a `GetBucketOwnershipControls` upstream short-circuit that skips both 2b (bucket-ACL) and 2c (object-ACL) on `BucketOwnerEnforced` buckets — the default on every bucket created after April 2023; saves 11+ API calls per BOE bucket on modern estates AND closes a false-positive class. **INTENTIONAL MATRIX DELTA from 0.15.2**: BOE buckets with legacy stored public bucket-ACL grants previously emitted CRITICAL via 2b; they now emit informational only (downgraded to the BOE informational) because S3 structurally ignores ACL grants under BOE — the prior CRITICAL was a false-positive class. BOE short-circuit is unconditional (no env-var override). NEW shared `extractPublicGroups` helper used by BOTH step 2b (refactored byte-identical) AND step 2c. 4 LOW evidence-gap emissions via NEW `"S3 object-ACL evidence-gap"` substring anchor on SOC 2 CC7.1 + HIPAA §164.312(b). **Plugin count UNCHANGED at 28 (cloud-substrate 27); all six coverage matrices UNCHANGED**. No new dependencies; EE regression 6601/6601 GREEN (+33 tests vs the 6568 baseline). Live AWS smoke against acct 522412052794 — all 4 spot-checks PASS (BOE detection; E1 CRITICAL en-dash byte preservation; cap clamping; objectRateMs throttling). No standalone agent-skill code changes.

## 0.1.50 (2026-05-27) — Paired-release pin for EE 0.15.2 + CE 0.1.83 — audit-accuracy calibration + CloudTrail hardening + Azure 1221/1222 folds

Paired-release pin for the EE 0.15.2 patch cycle: four real-production-account-driven folds. **Fold 1** — plugin 1020 (S3) effective-public-exposure calibration: missing/partial Public Access Block downgraded CRITICAL→MEDIUM (a guardrail gap, not a current exposure) + NEW `GetBucketAcl` check completing the ACL × bucket-policy × PAB join (a public `AllUsers`/`AuthenticatedUsers` ACL grant → CRITICAL unless neutralized by PAB `IgnorePublicAcls`) — fixes false-CRITICALs AND closes a public-via-ACL false-negative. **Fold 2** — plugin 1040 (CloudTrail) KMS-CMK calibration: trail-level "KmsKeyId not set" downgraded MEDIUM→LOW when the destination bucket has default SSE-KMS. **Fold 3** — plugin 1040 (CloudTrail) multi-region timeout hardening: an `AbortController` tied to the soft-budget deadline lets a hung disabled-region abort so the plugin finalizes PARTIAL evidence. **Fold 4** — plugin 1221 (Azure NSG) +10 restricted UDP ports (RADIUS 1812/1813/1645/1646, L2TP 1701, SIP 5060, mDNS 5353, RIP 520, XDMCP 177, chargen 19) + plugin 1222 (Azure Key Vault) F-2 custom-role resolution (via `roleDefinitions.getById` + KV-privilege inspection) + F-7.2 HSM dim (software-vs-HSM `key.kty` LOW hardening rec). **Plugin count UNCHANGED at 28 (cloud-substrate 26); all six coverage matrices UNCHANGED.** No new dependencies; EE regression 6568/6568 GREEN (+42 tests vs the 6526 baseline). No standalone agent-skill code changes.

## 0.1.49 (PUBLISHED 2026-05-27) — Paired-release pin for EE 0.15.1 + CE 0.1.82 — plugin 1222 hotfix (Dim-3 SDK-shape + Dim-4 inherited-admin re-tune)

Paired-release pin for the EE 0.15.1 hotfix cycle: two defects in plugin 1222 (`azure-keyvault-deep-auditor`) surfaced by the 0.15.0 published-build live smoke. **H-1** — the Dim-3 diagnostic-logging probe `for await`-ed `@azure/arm-monitor`'s `diagnosticSettings.list()`, which returns a `Promise<{value:[]}>` collection object (NOT a paged async-iterator), so the dim always threw and degraded to a non-functional evidence-gap; fixed to `await` + read `.value` (confirmed against live Azure; the unit-test mock corrected to the real `Promise<{value}>` shape — the mock-vs-real-SDK mismatch that masked the bug). **H-2** — the Dim-4 privileged-access dim flagged inherited subscription/management-group-scope Owner/Contributor as HIGH on every RBAC vault (a ubiquitous Azure control-plane reality); re-tuned so inherited Owner/User-Access-Administrator → MEDIUM, inherited Contributor → LOW, with HIGH reserved for VAULT-scoped control-plane god roles + Key Vault Administrator at any scope. **Plugin count UNCHANGED at 28 (cloud-substrate 26); all six coverage matrices UNCHANGED.** EE regression 6526/6526 GREEN. `references/plugins.md` 1222 row Dim-3/Dim-4 wording refined. No standalone agent-skill code changes.

## 0.1.48 (PUBLISHED 2026-05-27) — Paired-release pin for EE 0.15.0 + CE 0.1.81 — NEW plugin 1222 (Azure Key Vault Deep Auditor)

Paired-release pin for the EE 0.15.0 cycle (Move C-2.3): NEW **plugin 1222 `azure-keyvault-deep-auditor`** — the third dedicated Azure auditor (after 1220 storage + 1221 NSG), the KV analog of how 1221 deepens 1022's flat NSG dim — takes the EE plugin count **27 → 28** (cloud-substrate 25 → 26; ID range now 1020-1222). It enumerates each vault's keys, role assignments, and diagnostic settings across 4 dims: (1) key auto-rotation policy + (2) key expiry (epoch-s/ms/Date/string coerced) + (3) diagnostic logging → Log Analytics (`@azure/arm-monitor`) + (4) privileged-access depth (RBAC `roleAssignments` admin/data-plane/scope-aware + legacy `accessPolicies` export/wide-crypto breadth). Deliberately orthogonal to plugin 1022's vault-property dims (purge/soft-delete/network-ACL/RBAC-mode) — no double-emission. Secret/cert expiry is a deliberate data-plane scope boundary. Findings route across all six frameworks (SOC 2 CC6.3/C1.1/CC6.1/CC7.2 / HIPAA §164.312(a)(2)(iv)/(b)/(a)(1) / NIST CSF PR.DS-01/DE.CM-09/PR.AA-05 / PCI DSS 3.5.1/10.2.1/7.2.1 / ISO 27001 A.8.24/A.8.15/A.5.15+A.8.2 / CIS v8 3.11/8.2/5.4) — all six coverage matrices UNCHANGED. SKILL.md + README + `references/plugins.md` updated to the full 28-plugin catalog (1020-1222; 26 cloud-substrate auditors). No standalone agent-skill code changes.

## 0.1.47 (PUBLISHED 2026-05-27) — Paired-release pin for EE 0.14.1 + CE 0.1.80 — plugin 1221 UDP restricted-port lane

Paired-release pin for the EE 0.14.1 cycle: plugin 1221 (the Azure NSG perimeter auditor) gains a **UDP restricted-port lane** (Dim 2u/3u) — tiering UDP management/amplification services (SNMP 161 / CLDAP 389 / NTP 123 / rpcbind 111 / IPMI 623 / IKE 500 / Memcached 11211, etc.) in parallel with the existing TCP lane, attachment-aware (attached → CRITICAL effective; orphaned → MEDIUM latent) with per-transport priority/deny-override resolution — closing the false negative where a public UDP service was silently treated as benign non-restricted "web tier" INFO. Dim-4 made protocol-aware. The six framework titlePatterns for 1221 were generalized `permits TCP inbound …` → `permits (?:TCP|UDP) inbound …` so UDP findings route to the same CC6.6/perimeter controls. **Plugin count UNCHANGED at 27 (cloud-substrate 25); all six coverage matrices UNCHANGED.** `references/plugins.md` 1221 row updated to the UDP lane. No standalone agent-skill code changes.

## 0.1.46 (PUBLISHED 2026-05-26) — Paired-release pin for EE 0.14.0 + CE 0.1.79 — NEW plugin 1221 (Azure NSG Perimeter Auditor)

Paired-release pin for the EE 0.14.0 cycle (Move C-2.2): NEW **plugin 1221 `azure-nsg-perimeter-auditor`** — the Azure analog of AWS plugin 1170 — takes the EE plugin count **26 → 27** (cloud-substrate 24 → 25). A CC6.6 network-segmentation perimeter auditor for Azure Network Security Groups that evaluates each NSG's inbound rules in Azure priority order (first match wins; DenyAllInbound default) across all-protocol public Allow + public-source (`*`/`0.0.0.0/0`/`Internet`) to a restricted management/data-tier port + `::/0` IPv6-wildcard (the dimension the multi-purpose 1022 scanner's flat per-rule NSG lint misses) + public→non-restricted INFO + PASS substrate, with attachment-aware severity (attached → CRITICAL effective; orphaned → MEDIUM latent), effective priority/deny-override resolution, and `0.0.0.0/1` split-range coverage. Non-overlapping-by-depth with 1022's coarse NSG dim. Findings route across all six frameworks (SOC 2 CC6.6 / HIPAA / NIST CSF / PCI DSS / ISO 27001 / CIS v8) — all coverage matrices UNCHANGED. SKILL.md + README + `references/plugins.md` updated to the full 27-plugin catalog (1020-1221; 25 cloud-substrate auditors). No standalone agent-skill code changes.

## 0.1.45 (PUBLISHED 2026-05-26) — Paired-release pin for EE 0.13.3 + CE 0.1.78 — plugin 1220 deepening (blob-recoverability + per-container public-access dims)

Paired-release pin for the EE 0.13.3 cycle (Move C-2.1): plugin 1220 gains two new secondary-resource-path data-protection dims — blob recoverability (soft-delete + versioning via `blobServices.getServiceProperties`) + per-container anonymous public access (account-toggle-aware via `blobContainers.list`). Plugin count UNCHANGED at 26 (deepening, not a new plugin); all six coverage matrices UNCHANGED. `references/plugins.md` 1220 row updated to the 7-dim surface. No standalone agent-skill code changes.

## 0.1.44 (PUBLISHED 2026-05-26) — Paired-release pin for EE 0.13.2 + CE 0.1.77 — NEW plugin 1220 (Azure Storage Account Data-Protection Auditor)

Paired-release pin for the EE 0.13.2 cycle (Move C-2): NEW **plugin 1220 `azure-storage-hardening-auditor`** — the first dedicated Azure auditor beyond the multi-purpose 1022 scanner — takes the EE plugin count **25 → 26** (cloud-substrate 23 → 24). It audits the Azure Storage Account encryption-at-rest / in-transit / authorization-mode surface (HTTPS-only + minimum TLS + Shared Key authorization + infrastructure double encryption + customer-managed-key reachability + rotation), non-overlapping with the 1022 scanner's network-exposure dims. Findings route across all six frameworks — all coverage matrices UNCHANGED. SKILL.md + README + `references/plugins.md` updated to the full 26-plugin catalog (1020-1220; 24 cloud-substrate auditors). No standalone agent-skill code changes.

## 0.1.43 (PUBLISHED 2026-05-25) — Paired-release pin for EE 0.13.1 + CE 0.1.76 — CIS-Hardened-Image LIVE detection + plugin 1210

Paired-release pin for the EE 0.13.1 cycle: CIS-Hardened-Image detection goes LIVE, NEW **plugin 1210 `aws-ec2-instance-auditor`** (AWS EC2 instance-level audit + Hardened-Image producer) takes the EE plugin count **24 → 25**, Azure (1022) + GCP (1021) gain `cisImageInventory` capture (multi-cloud detection end-to-end), the CIS Controls v8 matrix grows 17/21/115 → **17/22/114** (Safeguard 9.5 DMARC OOS→partial), and all four ISO 0.12.1 deferrals close. SKILL.md + README + `references/plugins.md` updated to the full 25-plugin catalog (1020-1210). No standalone agent-skill code changes.

## 0.1.42 (PUBLISHED 2026-05-24) — Paired-release pin for EE 0.13.0 + CE 0.1.75 — CIS Critical Security Controls v8 sixth-framework introduction

**Cycle hook**: EE 0.13.0 ships CIS Critical Security Controls v8 (Center for Internet Security, May 2021; v8.1 errata June 2024) as the sixth Track 3 framework — **17 covered + 21 partial + 115 OOS across 153 Safeguards / 18 Controls / 3 cumulative Implementation Groups** (engine substrate IG1 23-of-56 / IG2-cumulative 36-of-130 / IG3-cumulative 38-of-153). Implementation Group cumulative discipline (IG1=56 cyber-insurance baseline / IG2 cumulative=130 / IG3 cumulative=153; smallest-IG-membership tagging) + no-certification-body attestation discipline (CSAT / CIS-CAT Pro self-attestation, never "CIS certified") + Cloud Companion Guide v8 shared-responsibility + CIS-Hardened-Image substrate-evidence credit (4.1/4.2/4.6) + 5 Security Functions NOT 6 (no Govern) + 6 Asset Types + MS-ISAC/EI-ISAC/H-ISAC sector baselines + v7.1-to-v8 cross-reference. a dedicated framework audit review authored 2026-05-24 via /skill-creator (833 lines / 5 files) per the institutional Per-Framework Adversarial-Audit Skill Pairing pattern. **`compliance_check` SKILL.md row updated FIVE → SIX shipped frameworks** with CIS Safeguard examples + IG-cumulative + no-cert-body attestation framing. No other agent-skill code changes — paired-publish for trio-publish discipline + customer discoverability. *(WITHDRAWN at 0.2.34 — the tool named here does not exist; this line is the historical record of what the package said at the time.)*

**Plugin catalog**: UNCHANGED at 24 plugins; MCP tool signatures unchanged; schemas unchanged; workflows unchanged. **SOC 2 + HIPAA + NIST CSF + PCI DSS + ISO 27001 matrices ALL UNCHANGED**; **CIS Controls v8 matrix NEW at 17/21/115 across 153 Safeguards**.

**THIRTY-SECOND consecutive trio-publish** institutionalized 0.4.5–0.13.0.

---

## 0.1.41 (PUBLISHED 2026-05-24) — Paired-release pin for EE 0.12.0 + CE 0.1.74 — ISO/IEC 27001:2022 fifth-framework introduction

**Cycle hook**: EE 0.12.0 ships ISO/IEC 27001:2022 as the fifth Track 3 framework — 17 covered + 14 partial + 62 OOS across 93 Annex A controls (the complete Annex A universe across 4 themes). Statement of Applicability per Clause 6.1.3.d discipline + ISMS Clauses 4-10 OOS-by-design framing + 11 NEW 2022 controls + 5-attribute taxonomy + 2013-to-2022 transition discipline. a dedicated framework audit review authored 2026-05-24 via /skill-creator (705 lines / 5 files) per the institutional Per-Framework Adversarial-Audit Skill Pairing pattern. No agent-skill code changes — paired-publish for trio-publish discipline + customer discoverability.

**Plugin catalog**: UNCHANGED at 24 plugins; MCP tool signatures unchanged; schemas unchanged; workflows unchanged. **SOC 2 + HIPAA + NIST CSF + PCI DSS matrices ALL UNCHANGED**; **ISO/IEC 27001:2022 matrix NEW at 17/14/62 across 93 Annex A controls**.

**THIRTY-FIRST consecutive trio-publish** institutionalized 0.4.5–0.12.0.

---

## 0.1.40 (PUBLISHED 2026-05-23 to npm as `latest`) — Paired-release pin for EE 0.11.1 + CE 0.1.73 — PCI DSS v4.0.1 patch cycle (CAO authorship + 4 folds + `license --reset` subcommand)

**Cycle hook**: EE 0.11.1 ships the PCI DSS v4.0.1 patch cycle — the 4 authoring folds deferred from the EE 0.11.0 reviewer pass (CDE-scope badge + Req 12.8.5 TPSP matrix renderer + QSA enforcement-priority ranked view + CAO authorship for all 26 customized-eligible sub-requirements per Appendix D) PLUS the operator-discovered `nsauditor-ai license --reset` subcommand on the CE side. No agent-skill code changes — paired-publish for trio-publish discipline + customer discoverability.

**Plugin catalog**: UNCHANGED at 24 plugins; MCP tool signatures unchanged; schemas unchanged; workflows unchanged. **Coverage matrices ALL UNCHANGED** (SOC 2 10/4/33 + HIPAA 7/3/45 + NIST CSF 2.0 13/10/83 + PCI DSS 20/8/39 MVP-67 — pure patch cycle, no framework expansion).

**THIRTIETH consecutive trio-publish** institutionalized 0.4.5–0.11.1.

---

## 0.1.39 (PUBLISHED 2026-05-23) — Paired-release pin for EE 0.11.0 + CE 0.1.72 — PCI DSS v4.0.1 Track 3 fourth-framework cycle

**Cycle hook**: EE 0.11.0 introduces PCI DSS v4.0.1 (PCI SSC, June 2024 errata; supersedes v4.0 March 2022; v3.2.1 retired March 31, 2024) as the fourth compliance framework alongside SOC 2 (AICPA TSC 2017), HIPAA Security Rule §164.312, and NIST Cybersecurity Framework 2.0. The agent-skill catalog updates accordingly:

- `compliance_check` MCP tool description widened from "SOC 2 + HIPAA + NIST CSF 2.0" to "SOC 2 + HIPAA + NIST CSF 2.0 + PCI DSS v4.0.1" with the matching `--compliance soc2,hipaa,nist-csf,pci-dss` CSV invocation hint. PCI DSS sub-requirement examples baked into tool description: `Req 1.2.1` NSC config standards, `Req 8.4.1` MFA on non-console admin, `Req 10.2.1` audit logs enabled, `Req 11.3.1` quarterly internal vuln scans. Defined-vs-Customized Approach discipline per PCI DSS v4.0.1 Appendix E (15 Defined-only sub-requirements enforced at schema layer) + CHD Scope operator-attested via CDE Data Flow Diagram per Req 1.2.4 + card-brand AOC enforcement view (Visa CISP / Mastercard SDP / Amex DSOP / Discover DISC). *(WITHDRAWN at 0.2.34 — the tool named here does not exist; this line is the historical record of what the package said at the time.)*
- `SKILL.md` framework-coverage table extended with PCI DSS v4.0.1 sub-requirement-level matrix (**20 covered / 8 partial / 39 OOS across 67 of ~250 sub-requirements at MVP-67 density**).
- `references/plugins.md` framework-bullet extended from "three compliance frameworks" to "four compliance frameworks" with PCI DSS v4.0.1 sub-requirement examples + Req 12 OOS-by-design entirely framing + Req 5 + Req 9 OOS-entirely framing + Drata PCI / Vanta PCI / AuditBoard PCI / OneTrust GRC pairing-platform names.

**Plugin catalog**: UNCHANGED at 24 plugins; MCP tool signatures unchanged; schemas unchanged; workflows unchanged. **Twenty-ninth consecutive trio-publish** institutionalized 0.4.5–0.11.0.

---

## 0.1.38 (PUBLISHED 2026-05-22) — Paired-release pin for EE 0.10.0 + CE 0.1.71 — NIST CSF 2.0 Track 3 third-framework cycle

**Cycle hook**: EE 0.10.0 introduces NIST Cybersecurity Framework 2.0 (NIST CSWP 29, February 2024) as the third compliance framework alongside SOC 2 (AICPA TSC 2017) and HIPAA Security Rule §164.312. The agent-skill catalog updates accordingly:

- `compliance_check` MCP tool description widened from "SOC 2 + HIPAA" to "SOC 2 + HIPAA + NIST CSF 2.0" with the matching `--compliance soc2,hipaa,nist-csf` CSV invocation hint. *(WITHDRAWN at 0.2.34 — the tool named here does not exist; this line is the historical record of what the package said at the time.)*
- `SKILL.md` framework-coverage table extended with NIST CSF 2.0 Subcategory-level matrix (13 covered / 10 partial / 83 OOS across 106 of CSF 2.0's 107 Subcategories).
- `references/plugins.md` framework-bullet extended from "two compliance frameworks" to "three compliance frameworks" with NIST CSF 2.0 control-ID examples (PR.AA-01, DE.CM-01, RC.RP-03) + Implementation Tiers OOS disclaimer explanation + Tugboat Logic / Drata / Vanta / AuditBoard pairing-platform names.

**Plugin catalog**: UNCHANGED at 24 plugins; MCP tool signatures unchanged; schemas unchanged; workflows unchanged. **Twenty-eighth consecutive trio-publish** institutionalized 0.4.5–0.10.0.

**Why an agent-skill 0.1.38 release**: institutional pair-versioning. Every EE release gets a paired agent-skill version bump so operators using `npm view nsauditor-ai-agent-skill version` against an EE version can confirm the catalog targets the same trio. SKILL.md "post-EE 0.X.Y" version pointer updated to 0.10.0.

**EE 0.10.0 + CE 0.1.71 paired-release highlights** (full detail in respective CHANGELOGs):
- NEW `data/compliance/nist-csf.json` — auditor-canonical Subcategory-level mapping. 23 declared Subcategories + 6 OOS groups + schema-additive `function` / `categoryCode` / `subcategory` / `outcomeText` / `informativeReferences` fields. Inheritance contract: every titlePattern inherits from soc2.json's grep-verified pattern set, defended by 27-test anchor-drift suite.
- EXTENDED EE `utils/soc2_renderer.mjs` — `'nist-csf'` slot table in `frameworkControlCitation` with 8 slots incl. NEW `implementation-tiers` disclaimer. `isNistCsfReport` flag detection. Implementation Tiers OOS disclaimer section in BOTH markdown AND HTML render paths (reviewer fold from 2nd reviewer pass — markdown-only was the pre-fold state).
- Schema-additive fields propagation to controlEntries — closes ghost-schema gap for `function`/`categoryCode`/`subcategory`/`outcomeText`/`informativeReferences` (NIST CSF) AND `requiredOrAddressable`/`standardOrSpec`/`ruleText` (HIPAA, EE 0.9.0 inherited gap) AND `manualProcedure` (SOC 2 + HIPAA, EE 0.9.3 + 0.9.4 inherited gap). reviewer fold from 2nd reviewer pass.
- 91 net new tests across 3 new test files (27 anchor-drift + 39 mapping + 25 renderer) + 1 fold-driven SOC 2→NIST cross-framework leak test (from 2nd reviewer pass)
- 560-line `docs/nist-csf-coverage.md`
- 2 reviewer passes (single-agent A combined NIST/code lens + parallel-reviewer B security/air-gap/citation-leak lens); 5 same-session folds total

**Reviewer pass discipline**: 2-reviewer parallel pass per the EE 0.9.0 institutional template. Reviewer A verdict "ship with 4 small folds — cycle is structurally clean"; Reviewer B verdict "ship with 2 small folds beyond Reviewer A's findings — 2 genuinely new + 3 polish". 5 of 10 findings applied same-session (3 from Reviewer B + 2 from Reviewer A); 5 deferred as defer-acceptable polish.

**Regression**: EE 6104/6104 across 983 suites (+92 vs 0.9.4 baseline — 91 cycle-new tests + 1 fold-driven cross-framework leak test). 75-session 100% green streak preserved. **Plugin count UNCHANGED at 24**; **SOC 2 + HIPAA coverage matrices UNCHANGED at 10/4/33 + 7/3/45**; **NIST CSF 2.0 coverage matrix introduced at 13/10/83**.

No breaking changes — additive only.

---

## 0.1.37 (PUBLISHED 2026-05-22 to npm as `latest`, superseded by 0.1.38 on trio-publish) — Paired-release pin for EE 0.9.1 + CE 0.1.70 — External-audit-findings ship-blocker patch (no catalog change; institutional pair-version)

**Cycle hook**: External adversarial-audit-skill cycle (2026-05-22) identified 10 ship-blockers in pre-existing EE 0.9.0 + CE 0.1.69 code; closed in <24h. All audit findings are against EE-side correctness paths (NVD offline feed importer + plugin 1110 KMS layer + plugin 1030 PRIVESC_ACTIONS) and CE-side license verifier (replay defense + signed revocation blocklist + monotonic-clock anchor). **No agent-skill catalog change is needed** — plugin catalog stays at 24 plugins; MCP tools unchanged; schemas unchanged; workflows unchanged. **Twenty-seventh consecutive trio-publish** institutionalized 0.4.5–0.9.1.

**Why an agent-skill 0.1.37 release**: institutional pair-versioning. Every EE release gets a paired agent-skill version bump so operators using `npm view nsauditor-ai-agent-skill version` against an EE version can confirm the catalog targets the same trio. SKILL.md "post-EE 0.X.Y" version pointer updated to 0.9.1.

**EE 0.9.1 + CE 0.1.70 paired-release highlights** (full detail in respective CHANGELOGs):
- **A-CRIT-1**: `feeds/nvd_feed_processor.mjs` real NVD JSON 2.0 importer (replaces 20-line stub; closes the air-gap claim). NDJSON persistence + atomic write + gzip-bomb cap. +37 new tests.
- **B-CRIT-1/2 + B-LABEL**: plugin 1110 KMS-grant + key-policy cross-reference. HIGH→INFO downgrade when no key trusts the principal; new `kms-grant-decrypt-no-identity-grant` MEDIUM emission (Pacu P-16 closure). Finding text preserves load-bearing prefix for soc2.json + hipaa.json titlePattern integrity. +22 new tests.
- **C-CRIT-1..4**: plugin 1030 PRIVESC_ACTIONS additions (9 canonical Pacu paths). +21 new tests.
- **D-HIGH-1/2/3**: CE-side license verifier hardening (replay + revocation + clock anchor). +33 new CE tests.

**Reviewer pass**: 2 general-purpose agents in parallel; 10 same-session folds.

**Regression**: EE 5970/5970 across 951 suites (+80 vs 0.9.0); CE 968 tests (+33 vs 0.1.69). 70-session 100% green streak preserved. **Plugin count UNCHANGED at 24**; **SOC 2 + HIPAA coverage matrices UNCHANGED**.

No breaking changes — additive only.

---

## 0.1.36 — Catalog refresh: EE 0.9.0 HIPAA FRAMEWORK CYCLE (first 0.9.x release; HIPAA Security Rule §164.312 Technical Safeguards ships as second supported compliance framework alongside SOC 2; HIPAA coverage matrix 7 covered + 3 partial + 45 OOS; HHS Required/Addressable discipline per control; §164.312(c)(1) ransomware-defense substrate via Logically Air-Gapped Backup Vault cross-verification; per-framework SLA-citation map closes cross-framework citation leak class; 6 same-session reviewer folds; +85 new tests across 3 new suites; plugin count UNCHANGED at 24; SOC 2 coverage matrix UNCHANGED at 10/4/33; EE regression 5890/5890 across 928 suites; 69-session 100% green streak preserved; twenty-sixth consecutive trio-publish; no breaking changes — additive only; agent-skill catalog refresh: SKILL.md HIPAA framework coverage block added, README "Plugin awareness" + "Compliance frameworks" capability rows updated, references/plugins.md Enterprise Plugins header corrected 18 → 24 with HIPAA framework mention)

**Trio-publish institutionalization continued.** Paired with EE 0.9.0 + CE 0.1.69 — **twenty-sixth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.9.0).

### Headline — EE 0.9.0 HIPAA framework cycle (first 0.9.x release)

HIPAA Security Rule §164.312 Technical Safeguards ships as the second supported compliance framework alongside SOC 2. Closes the long-standing "planned" gap in EE's `docs/architecture.md` for the highest-demand next framework after SOC 2.

**New deliverables in EE 0.9.0:**

- `data/compliance/hipaa.json` — 175 mappings across 10 §164.312 controls (7 covered + 3 partial) + 45 explicit OOS specs. Patterns inherited from soc2.json's grep-verified pattern set with HIPAA-grounded rationales. Schema-additive HHS-discipline fields: `requiredOrAddressable: 'R'|'A'` + `standardOrSpec: 'standard'|'implementation-specification'` + `ruleText: <HHS rule text>` per control.
- `docs/hipaa-coverage.md` (~440 lines) — mirror of `docs/soc2-coverage.md` shape; auditor-grade per-sub-criterion coverage doc with explicit §164.308 + §164.310 OOS framing.
- Per-framework SLA-citation map in `utils/soc2_renderer.mjs` — new `frameworkControlCitation(framework, slot)` helper threaded through markdown + HTML renderers. HIPAA reports cite `§164.312(b) audit-controls cadence` (SLA), `§164.308 administrative-safeguards governance — OOS for §164.312 Technical-Safeguards report` (governance sentinel), `§164.312(d) Person or Entity Authentication` (identity). SOC 2 reports remain byte-identical.

### HIPAA coverage matrix (7 covered + 3 partial + 45 OOS)

Within §164.312 Technical Safeguards:
- **Covered (7)**: §164.312(a)(1) Access Control, (a)(2)(i) Unique User ID, (a)(2)(iv) Encryption-at-rest, (b) Audit Controls, (d) Person/Entity Auth, (e)(1) Transmission Security, (e)(2)(ii) Transmission Encryption
- **Partial (3)**: §164.312(c)(1) Integrity (ransomware-defense substrate), (c)(2) ePHI integrity verification, (e)(2)(i) Transmission Integrity Controls
- **OOS within §164.312 (2)**: §164.312(a)(2)(ii) Emergency Access Procedure (procedural break-glass), (a)(2)(iii) Automatic Logoff (application-tier)

Plus:
- **§164.308 Administrative Safeguards entire (31 specs)** — workforce training, sanction policies, BAAs, contingency planning, incident procedures. Pair with HIPAA-focused GRC platforms (Drata HIPAA, Vanta HIPAA, Compliancy Group, Tugboat Logic).
- **§164.310 Physical Safeguards entire (12 specs)** — facility access, workstation security, device/media disposal. Pair with facilities-management + endpoint-management + asset-disposal vendors.

### §164.312(c)(1) Integrity ransomware-defense substrate (HHS-OCR 2024 enforcement-relevant)

EE's `aws-backup-auditor` Logically Air-Gapped Backup Vault cross-verification (KMS policy + Grants + replicas + VPC-endpoint composite attestation) produces the strongest substrate evidence available on the AWS layer. A composite-attestation PASS evidences that ePHI backups would survive a full source-account compromise — exactly the §164.312(c)(1) integrity-preservation posture HHS-OCR has highlighted in 2024 enforcement actions.

### Zero engine / CLI changes required

EE's `loadFrameworkMap` was already framework-agnostic (reads `data/compliance/{framework}.json` by parameter); CE's `--compliance` flag already accepts CSV (wired since EE 0.3.0). Multi-framework workflow shipping today: `nsauditor-ai scan --host aws --plugins all --compliance soc2,hipaa --out evidence/` produces separate `scan_compliance_soc2.{md,html,json}` AND `scan_compliance_hipaa.{md,html,json}` artifact sets in one scan.

### Zero BAA required (HIPAA §160.103)

Zero Data Exfiltration architecture means ePHI never leaves customer infrastructure. Nsasoft does not see, store, or process customer ePHI under any condition — no Business Associate Agreement needed. This is a self-hosted scanner, not a SaaS service.

### 6 same-session reviewer folds applied (2 + 2 + 1 + 1 docstring; 0 )

Two parallel reviewers (HIPAA Security Officer perspective + senior code reviewer perspective). Confirmed: §164.312 sub-criteria routing clean (no CloudTrail in (a)(1), no MFA in (a)(1), no TLS in (a)(2)(iv)); HHS R/A classification correct per control; §164.308 + §164.310 OOS enumerations complete against 45 CFR; rationale spot-check zero cross-framework citation leak.

### +85 new tests across 3 new test suites

- `tests/hipaa_mapping_anchor_drift.test.mjs` (32) — load-bearing anchor-drift defense via INHERITANCE CONTRACT (every hipaa.json (source, titlePattern) pair MUST exist in soc2.json, which has its own plugin-side anchor-drift defenses).
- `tests/hipaa_mapping.test.mjs` (36) — engine-end-to-end fixture tests across all 7 covered + 3 partial §164.312 controls + sub-criteria discrimination tests + OOS-routing assertions.
- `tests/hipaa_renderer.test.mjs` (17) — per-framework citation correctness + SOC 2 regression-protection + helper API ergonomics (case-insensitivity, defensive type guard, sentinel-on-unknown-slot).

### AWS-dogfood verified — 2026-05-21 smoke scan

Against operator's test AWS account: 207 findings analyzed, all routed to correct §164.312 sub-criteria; per-framework citation map confirmed firing in production reports; ransomware-defense substrate §164.312(c)(1) surfaces correctly with 12 violations (S3 versioning disabled, Object Lock not configured, RDS BackupRetentionPeriod below baseline, single-AZ). Zero regression on SOC 2 path (same 207 findings → 9 FAIL + 4 PASS + 1 partial + 33 OOS matching 10/4/33 exactly).

### Agent-skill catalog refresh (this release — 0.1.36)

- `SKILL.md` — "EE SOC 2 substrate-evidence coverage" block updated to "post-EE 0.9.0" + SOC 2 matrix UNCHANGED note + NEW "EE HIPAA §164.312 Technical Safeguards substrate-evidence coverage" block enumerating 7+3+45 + R/A discipline + ransomware-substrate angle + Zero-BAA framing. `compliance_check` tool description updated to surface both SOC 2 AND HIPAA as actively shipped frameworks (previously listed alongside planned-only NIST/HIPAA/GDPR/PCI-DSS).
- `README.md` — "Plugin awareness" capability row updated 44+ → 50 (17 core + 6 discovery + 3 pro + 24 enterprise; corrects pre-existing stale 18-enterprise claim from when EE had 18 plugins); NEW "Compliance frameworks" capability row enumerating SOC 2 + HIPAA + multi-framework dual-publish + Zero-BAA. `references/plugins.md` reference description updated 44+ → 50.
- `references/plugins.md` — "Enterprise Plugins (18)" header corrected to "Enterprise Plugins (24)" (pre-existing stale count; EE has had 24 plugins since EE 0.7.0). Plugin-catalog intro extended to mention dual-framework SOC 2 + HIPAA support + multi-framework `--compliance soc2,hipaa` CSV workflow + Zero-BAA architecture for HIPAA.

### No breaking changes — additive only

The 0.8.0 customer migration carryover (suppressions targeting `match.source: 'azure-cloud-scanner'` silently no-op post-0.8.0) remains as-is. HIPAA framework cycle is opt-in via `--compliance hipaa` or `--compliance soc2,hipaa`.

**Plugin count UNCHANGED at 24**. **SOC 2 coverage matrix UNCHANGED at 10/4/33** (additive-only cycle; no SOC 2 mappings changed). **HIPAA coverage matrix introduced at 7/3/45**.

---

## 0.1.35 — Catalog refresh: EE 0.8.0 MINOR VERSION MILESTONE ( Move B plugin 1022 per-dim source-attribution refactor + Engine `details.category` projection contract + Key Vault soc2.json gap closure +13 mappings; 7 same-session reviewer folds; +23 new tests / +6 new suites; plugin count UNCHANGED at 24; coverage matrix UNCHANGED at 10/4/33; EE regression 5805/5805 across 907 suites; 68-session 100% green streak preserved; twenty-fifth consecutive trio-publish; ⚠️ customer migration: `match.source: 'azure-cloud-scanner'` suppressions silently no-op post-0.8.0)

**Trio-publish institutionalization continued.** Paired with EE 0.8.0 + CE 0.1.68 — **twenty-fifth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.8.0).

### Headline — MINOR VERSION MILESTONE: Move B plugin 1022 Azure scanner per-dim source-attribution refactor

EE 0.8.0 closes the long-standing blocker (originally flagged in EE 0.6.9 -1) for routing Azure storage findings into Appendix A "Cloud Bucket Exposure Attestation" without commingling NSG / RBAC / Key Vault. Plugin 1022 refactored so each of the 4 helpers (`auditNsgRules` / `auditRbac` / `auditStorageAccounts` / `auditKeyVaults`) attaches its own per-dim `source` field on every emission:

- `azure-nsg-auditor`
- `azure-rbac-auditor`
- `azure-storage-auditor`
- `azure-keyvault-auditor`

PLUGIN_ID stays `"1022"`; `--plugins 1022` continues to work. The umbrella `azure-cloud-scanner` source stays in `CLOUD_PLUGIN_SOURCE_MAP` as defense-in-depth fallback only (no soc2.json mappings).

### Engine `details.category` projection contract — minor-bump justification

EE 0.8.0's `normalizeFindings` + `analyseAgainstFramework` violation surface now carry `category` (additive, backward-compat via raw escape hatch). This is the institutional rationale for the **0.7.x → 0.8.0 MINOR bump** — touches the engine-side projection that every framework consumer reads. Future plugins (plugin 1024 GCS, plugin 1025 GCP IAM, and beyond) gain `v.category` as a first-class violation field for dim-discriminator use cases without the untyped `v.raw.details` escape hatch.

### Key Vault soc2.json gap closure — 13 new mappings

Pre-0.8.0 the Key Vault dim emitted 10 distinct `details.category` values but had ZERO soc2.json mapping coverage — latent silent false-clean class on CC6.1 / CC6.3 / C1.1 / A1.2 substrate evidence. Post-0.8.0:

- **CC6.1**: 3 entries (network-acl-allow, network-acl-absent, PASS attestation)
- **CC6.3**: 3 entries (legacy-access-policies, rbac-authorization-unknown, PASS attestation)
- **C1.1**: 3 entries (purge-protection-disabled, purge-protection-unknown, PASS attestation)
- **A1.2**: 4 entries (soft-delete-below-floor, soft-delete-below-institutional, soft-delete-unknown, PASS attestation)

All 10 KV anchor regexes use `^Key Vault '[^']+' <distinguishing-clause>` shape (literal-space anchors per `[[soc2_titlepattern_anchor_drift]]` discipline).

### 7 same-session reviewer folds applied (2 + 3 + 2 ; 0 )

- **F1 **: anchor-drift defense test now loads patterns from shipped soc2.json directly (single source of truth — closes test/production-regex drift structurally; pre-fold the test regex array was MORE permissive than the production regex —-class-recurrence INSIDE the defense test).
- **F2 **: `computeBucketStats` dedup key provider-qualified `${source}::${resource}` (closes cross-cloud bucket-name collision for multi-cloud customers using shared naming conventions).
- **F3 **: empty-string `details.category` projects null (consistency with harvester source-preservation `length > 0` guard).
- **F4 **: SDK-error path coverage tests (KV throw + Storage throw — verifies soft-degrade doesn't accidentally emit findings with wrong source).
- **F5 **: partial-failure backward-compat test (RBAC helper throws; NSG/Storage/KV findings still surface with correct per-dim sources).
- **F6 **: JSDoc documents `category` field on `analyseAgainstFramework` return shape.
- **F7 **: NSG soc2.json regex tightened from `~/^NSG rule.* allows inbound/` to `~/^NSG rule "[^"]+" allows inbound/` (rule-name closure anchor; preemptive cross-mapping defense).

### ⚠️ Customer migration required

Any suppression file with `match.source: 'azure-cloud-scanner'` will silently no-op post-0.8.0. Split into per-dim entries — see CHANGELOG.md migration snippet.

### Regression preserved

EE full regression: **5805/5805 across 907 suites** (was 5782/900 at 0.7.3; +23 tests / +7 suites). **68-session 100% green streak preserved.** Plugin count UNCHANGED at 24. Coverage matrix UNCHANGED at 10/4/33 (pure substrate-evidence depth uplift on already-covered controls — but KV gap closure was a silent false-clean class).

---

## 0.1.34 — Catalog refresh: EE 0.7.3 hotfix closing 2 production bugs surfaced by EE 0.7.2 dogfood scan against operator's GCP test infra (cross-version google-auth-library fragmentation broke SA impersonation chains [ — 100% false-clean impact on free-trial/gmail GCP customers + business GCP customers with no-long-lived-SA-keys policy]; GOOGLE_CLOUD_PROJECT_ID env-var alias silently skipped []; +14 new tests across 2 new suites incl. regression pin replicating gax 5.x grpc adapter idiom; plugin count UNCHANGED at 24; coverage matrix UNCHANGED at 10/4/33; EE regression 5782/5782 across 900 suites; 67-session 100% green streak preserved; twenty-fourth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.7.3 + CE 0.1.67 — **twenty-fourth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.7.3).

### Headline — hotfix surfaced by EE 0.7.2 dogfood scan within 30 minutes of the 0.7.2 trio publish

EE 0.7.3 closes 2 production bugs that shipped silently in EE 0.7.0–0.7.2. Both bugs surfaced when running `nsauditor-ai scan --plugins 1025 --compliance soc2` against operator's GCP test infra immediately after the 0.7.2 trio publish.

**Gap #2 **: cross-version `google-auth-library` fragmentation. EE's `utils/gcp_auth.mjs` resolved `9.15.1` at the top level (hoisted via `googleapis@^144`); `@google-cloud/resource-manager@^6` bundles nested `10.6.2` + `google-gax@5.x` whose grpc adapter calls `headers.forEach((value, key) =>...)` expecting WHATWG Headers instance. 9.x returns plain object → `.forEach` undefined → TypeError → `2 UNKNOWN: Getting metadata from plugin failed with error: headers.forEach is not a function`. Plugin 1025's conservative classifier emitted `gcp-iam-project-unreadable` LOW + walkthroughRequired, masking the fact that ALL 7 dims silently skipped. Production false-clean impact: ~100% on any impersonation-using deployment in EE v0.7.0–0.7.2.

**Fix**: NEW `_wrapAuthClientHeadersShim` in `utils/gcp_auth.mjs` monkey-patches the Impersonated instance's `getRequestHeaders` to coerce 9.x's plain-object return into a Headers instance via `new Headers(plainObject)`. 10.x returns pass through unchanged. Version-agnostic, future-proof. +8 new tests including a regression pin that exactly replicates the gax 5.x grpc adapter idiom — catches any future shim regression at unit-test time.

**Customer-segment impact:**
- **GCP free-trial / gmail customers** — impersonation is the ONLY working credential model when `iam.disableServiceAccountKeyCreation` is enforced (Google's "Secure by default"). Pre-0.7.3 100% false-clean. **Post-0.7.3 audit works end-to-end.**
- **Business GCP customers with no-long-lived-SA-keys security policy** — many enterprise security teams mandate impersonation as their auth model. Same impact. **Post-0.7.3 audit works.**
- **Business GCP customers using JSON keyfiles or pure ADC** — unaffected ( specific to impersonation injection; pure-ADC + keyfile paths use the nested 10.x auth chain entirely).

**Gap #1 **: operators following the `gcloud auth application-default login` setup convention (which writes `GOOGLE_CLOUD_PROJECT_ID` with `_ID` suffix) saw silent skip with `[plugin 1025] No GCP_PROJECT_ID configured`. Extended `loadConfig` + `preflight` from 2-way OR to 3-way OR: `opts.projectId > GCP_PROJECT_ID > GOOGLE_CLOUD_PROJECT > GOOGLE_CLOUD_PROJECT_ID`. +6 new tests covering all precedence paths + preflight failure-reason enumeration + end-to-end run with env-only resolution.

### Dogfood validation post-fix

Re-ran the scan with both fixes applied. **8 findings emitted** (was 1 false-clean LOW pre-fix): 5 PASS + 2 MEDIUM + 1 LOW. All 7 dims exercise via the impersonated `nsauditor-readonly` audit SA. `accessDeniedByApi.listPolicies: 1` confirms the 0.7.2 counter wiring works end-to-end against real GCP.

### Regression preserved

EE full regression: **5782/5782 across 900 suites** (was 5768/5768 across 898 suites at 0.7.2; +14 tests / +2 suites). **67-session 100% green streak preserved.** Plugin count UNCHANGED at 24. Coverage matrix UNCHANGED at 10/4/33.

---

## 0.1.33 — Catalog refresh: EE 0.7.2 Move B pure-test functional patch closing 5 deferred 0.7.1 reviewer-pass coverage gaps (+50 new tests across 6 new suites; no production code changes; no plugin emissions changed; no soc2.json changes; no new SDK deps; plugin count UNCHANGED at 24; coverage matrix UNCHANGED at 10/4/33; EE regression 5768/5768 across 898 suites; 66-session 100% green streak preserved; twenty-third consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.7.2 + CE 0.1.66 — **twenty-third consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.7.2).

### Headline — pure-test functional patch (no plugin/soc2.json/SDK changes)

EE 0.7.2 is a pure-test functional patch closing the 5 test-coverage gaps deferred at 0.7.1's reviewer pass — bundled with the staged `peerDependencies.nsauditor-ai` bump (`^0.1.40` → `^0.1.65`) queued at 0.7.1 post-publish per the npm tarball-immutability constraint discipline. Plugin 1025 GCP IAM Project-Level Auditor's 7-dim coverage shipped in EE 0.7.1; this cycle backfills the test surface around it without altering production behavior.

### Test additions — 50 new tests across 6 new suites

- **BFS edge cases (+17)** — `_detectGcpImpersonationPaths` exercised against multiple disjoint cycles (Island A doesn't bleed into Island B), disconnected subgraphs, terminate-at-first-admin (multi-admin chain), parallel branches to distinct admins, depthCap exact-match + one-short + =1 boundaries, per-PATH visited Set semantics, malformed edges (null / missing-to / non-string-to), nonexistent edge targets, cycle through admin, self-loop on start, edge label fallback chain (label → displayName → key), fractional depthCap, parallel edges to same admin with different `via`.
- **counter wiring (+15 parameterized)** — 5 v2 apiName strings × 3 counter classes: `projects.roles.list` + `projects.serviceAccounts.list` + `projects.serviceAccounts.keys.list` + `projects.serviceAccounts.getIamPolicy` + `listPolicies` × throttle-retry + access-denied + wall-budget-exhausted. Closes the institutional contract "every API surface increments the right counter key" — prior cycle tested v1's `getIamPolicy` directly but only indirect coverage of v2 apiNames via run integration.
- **-16/17 helper edges (+10)** — `_saEmailFromName`: trailing slash → `""`, leading slash → segment-after, only-slash → `""`, multiple slashes (lastIndexOf semantics), control-char strip BEFORE slash detection. `_parseIso8601ToMs`: positive `+HH:MM` offset (yields earlier UTC ms), negative `-HH:MM` offset (yields later UTC ms), date-only string (UTC midnight), fractional-seconds + Z, finite-return for well-formed-with-offset.
- **SDK loader graceful-degradation contract (+8)** — direct unit tests for `_loadGoogleApisIamAdminSdk` + `_loadOrgPolicySdk` missing-dep error branches. Both SDKs are in optionalDependencies and NOT installed in the EE working tree by default. The institutional contract: loader throws with dep-name + `Cannot find package` cause; run's catch handler converts to single-warning skip of the affected dim cohort.
- **buildGcpAuthOptions real-SDK fallback (+3)** — exercises the `deps._googleAuthLibrarySdk || await _loadGoogleAuthLibrarySdk` fallback path that all other buildGcpAuthOptions tests bypass via dep injection. Uses `crypto.generateKeyPairSync` to write a valid PKCS#8 SA JSON keyfile to tmpdir, then verifies the real google-auth-library returns a real `Impersonated` instance with documented `targetPrincipal` + `lifetime` shape.

### Regression preserved

EE full regression: **5768/5768 across 898 suites** (was 5715/5715 across 892 suites at 0.7.1; +53 tests / +6 suites). **66-session 100% green streak preserved.** Plugin count UNCHANGED at 24. Coverage matrix UNCHANGED at 10/4/33.

---

## 0.1.32 — Catalog refresh: plugin 1025 GCP IAM Project-Level Auditor EXTENDED to v2 (3 dims → 7 dims) — paired with EE 0.7.1 trio-publish (v2 R2 expansion closing all 4 v1-deferred dims; +4 new dims: custom-role permission audit + SA key custody + SA impersonation graph BFS + Organization Policy constraint enumeration; NEW `utils/gcp_auth.mjs` helper honors `GOOGLE_IMPERSONATE_SERVICE_ACCOUNT`; **17 same-session reviewer folds = NEW HIGH-WATER MARK** vs 0.7.0's 12 (1 class recurrence catch + 7 + 8 + 1 (+1 grouped)); plugin count UNCHANGED at 24; +22 new soc2.json mappings; new SDK deps `googleapis` + `@google-cloud/org-policy` in optionalDependencies; twenty-second consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.7.1 + CE 0.1.65 — **twenty-second consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.7.1).

### Headline —, v2 plugin 1025 R2 expansion

Plugin 1025 GCP IAM Project-Level Auditor extended from 3 audit dimensions to **7** via in-place R2 expansion (closes all 4 v1-deferred dims from the EE 0.7.0 cycle). Plugin count UNCHANGED at 24 (v2 = in-place expansion, not new plugin). Coverage matrix UNCHANGED at 10/4/33 — pure substrate-evidence depth uplift on already-covered CC6.1 / CC6.6 / C1.1 controls.

The 4 new dimensions: **Dim 4 custom-role permission audit** (CC6.1; admin-equivalent permission allowlist), **Dim 5 SA key custody** (CC6.1 + C1.1; user-managed long-lived keys = HIGH), **Dim 6 SA impersonation graph BFS** (CC6.1 flagship dim; mirrors plugin 1030 shadow-admin BFS adapted to GCP), **Dim 7 Organization Policy constraint enumeration** (CC6.6 + C1.1; 4 sensitive constraints).

NEW `utils/gcp_auth.mjs` helper honors `GOOGLE_IMPERSONATE_SERVICE_ACCOUNT` env var — closes the gap where GCP client libraries do NOT honor gcloud CLI's `auth/impersonate_service_account` config.

### Reviewer fold high-water mark — 17 same-session folds

NEW HIGH-WATER MARK vs 0.7.0's 12 folds. Distribution: 1 + 7 + 8 + 1 (+1 grouped). The review fold was an class recurrence — soc2.json PASS-tier SA-key patterns silently failed to match when plugin emitted `(display: 'X')` between email and `has` clause. Production false-clean impact would have been ~100% on real GCP fixtures. Patterns rewritten to `'[^']+'.*has`.

### Cross-repo privacy scrub (parallel non-functional work)

Operator-flagged CRITICAL privacy class at 0.7.1 review: shipped npm files MUST NOT contain operator-private references. Substitutions applied across all 3 repos for personal emails / internal repo paths / real account IDs. The package-privacy rule is now enforced. Force-push history rewrite applied to CE + agent-skill public repos to scrub identifiers from all historical commits.

---

## 0.1.31 — Catalog refresh: NEW, v1 plugin 1025 GCP IAM Project-Level Auditor — paired with EE 0.7.0 trio-publish (MINOR-VERSION MILESTONE opening the v0.7.x cross-cloud-parity line; first plugin in the GCP-IAM-deep-audit cohort; 3 audit dimensions across CC6.1 + CC6.6; 12 R1 reviewer folds (0 + 2 + 5 + 5 ); plugin count 23 → 24; 11 new soc2.json mappings; new SDK dep `@google-cloud/resource-manager`; twenty-first consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.7.0 + CE 0.1.64 — **twenty-first consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.7.0).

### Changes

- **`references/plugins.md`** — added plugin 1025 row in sort order; demoted plugin 1024 (NEW EE 0.6.8) to non-NEW.
- **`SKILL.md`** — "post-EE 0.6.9" → "post-EE 0.7.0".

---

## 0.1.30 — Catalog refresh:, v2 R2 cleanup for plugin 1024 GCP Cloud Storage Auditor — paired with EE 0.6.9 trio-publish (patch-level R2 reviewer-deferred-items cleanup: Appendix A multi-cloud renderer extension + evidence-gap soc2.json mappings; 5 R1 reviewer folds (0 + 1 + 1 + 3 ); plugin count UNCHANGED at 23; 3 new soc2.json mappings; NEW pre-publish doc-consistency gate; twentieth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.9 + CE 0.1.63 — **twentieth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.9).

### What changed

- **`references/plugins.md`** — no plugin catalog changes this cycle (plugin count unchanged at 23). Plugin 1024 row from 0.1.29 preserved.
- **`SKILL.md`** — "post-EE 0.6.8" → "post-EE 0.6.9".
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Reviewer-fold highlights (all closed same-session)

- **(mappings)** — Missing C1.1 dual-mapping for `_CAT_METADATA_UNREADABLE` (rationale prose vs JSON-structure drift). Added the parallel C1.1 entry; cross-cloud parity with plugin 1020 S3 precedent restored.
- **(renderer)** — Strengthened Azure-exclusion comment to cite the engine-projection constraint in addition to plugin-1022 commingling.
- **(renderer + mappings)** — Cross-control uniqueBuckets dedup test + combined metadata+IAM-failure regression test.
- **(renderer)** — Narrative phrasing tweak ("AWS S3 / GCS" → "AWS S3 or GCS" for disambiguation).

### NEW institutional discipline introduced this cycle

**Pre-publish doc-consistency gate** codified in EE's `tasks/CLAUDE.md` after the 0.6.8 → user-caught doc drift (6 stale "22 plugin" claims hid across 4 docs in 2 repos). 22 doc-surface audit checklist + auto-grep + SOC 2 matrix invariant check. Saved as the pre-publish doc-consistency gate auto-memory for cross-session persistence.

### Tests + regression

- **EE full regression: 5423/5423 across 851 suites** (was 5415/5415 at 0.6.8 publish; +8 tests, suite count unchanged). **61-session 100% green streak preserved.**

---

## 0.1.29 — Catalog refresh: NEW plugin 1024 GCP Cloud Storage Auditor — paired with EE 0.6.8 trio-publish (first multi-cloud parity plugin in 6 months; mirrors plugin 1020 AWS S3 Auditor with 6 GCS-specific dimensions; 4 R1 reviewer folds (0 + 0 + 3 + 1 — clean review pass); plugin count 22 → 23; 20 new soc2.json mappings; nineteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.8 + CE 0.1.62 — **nineteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.8).

### What changed

- **`references/plugins.md`** — new plugin 1024 row added (alphanumerically sorted between 1023 zero-trust-checker and 1030 IAM Deep Auditor):
  - **Plugin 1024 — GCP Cloud Storage Auditor** (NEW EE 0.6.8): multi-cloud parity sister of plugin 1020 AWS S3 Auditor. 6 dimensions: bucket-level IAM public bindings (CC6.6 — allUsers = CRITICAL, allAuthenticatedUsers = HIGH), Uniform Bucket-Level Access enforcement (CC6.6 + C1.1 dual-mapped — closes legacy bucket-ACL false-PASS class), Object Versioning (C1.1 + A1.2 dual-mapped), Bucket Lock retention policy (C1.1 + C1.2 dual-mapped; SEC 17a-4 / FINRA 4511 WORM-alignment), Customer-Managed Encryption Keys via Cloud KMS (CC6.1 four-tier custody ladder mirroring plugin 1140 v2 RDS), bucket-level access logging (CC7.1). NEW SDK dep `@google-cloud/storage` in optionalDependencies.
- **`SKILL.md`** — "post-EE 0.6.7" → "post-EE 0.6.8"; plugin 1024 highlights surfaced; plugin count enumeration 22 → 23.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Reviewer-fold highlights (all closed same-session)

- **-1** — Severity-ladder co-existence: when both `allUsers` and `allAuthenticatedUsers` are present in different bindings, CRITICAL finding surfaces the HIGH evidence in details + narrative.
- **-2** — Per-bucket runtime exception severity: run-level catch INFO → LOW for consistency with `_auditBucket` metadata-error pattern.
- **(mappings)** — Cross-cloud parity dual-mappings: 5 soc2.json entries dual-mapped to C1.2 + A1.2 matching AWS S3 precedents.
- **-1** — CMEK regex tightened from substring to full-format 6-segment match.

### Tests + regression

- **EE full regression: 5415/5415 across 851 suites** (was 5314/5314 at 0.6.7 publish; +101 tests / +17 suites — all attributable to the new plugin file). **60-session 100% green streak preserved.**

---

## 0.1.28 — Catalog refresh: plugin 1170 v3.1 SG-reference-graph edge dedup + plugin 1200 v6.1 CloudWatch Logs probe retry-on-empty parity — paired with EE 0.6.7 trio-publish (patch-level R2 reviewer-deferred-items cleanup cycle: closes both R2 items from 0.6.6 reviewer pass; 4 R1 reviewer folds (0 + 0 + 1 + 3 — clean review pass) + 1 unanticipated `_retryOnNotFound` two-phase restructure (caught by test interaction); plugin count UNCHANGED at 22; soc2.json UNCHANGED; eighteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.7 + CE 0.1.61 — **eighteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.7).

### What changed

- **`references/plugins.md`** — two plugin rows updated:
 - **Plugin 1170 v3.1** — extended row with edge-dedup discipline in `_buildSgReferenceGraph`: edges deduped by `(sourceGroupId, targetGroupId)` with `ports` aggregated as array of `{protocol, fromPort, toPort}`. Pre-fold a real-world ALB-fronting-app SG with 3 ingress perms on different ports (80/443/8080) referencing the same source SG emitted 3 distinct edges A→B; the BFS treated each as a separate chain, inflating `chainCount` 2-5× and exhausting per-target chain caps on noise. Post-fold the BFS sees exactly 1 chain per distinct (source, target) pair. `isCrossVpc` aggregation is AND-semantic — if ANY contributing pair is same-VPC, the merged edge is same-VPC (per the conservative-classifier principle). Classifier `_classifyTransitiveReachability` port-render accepts both v3.1 array shape and v3 single-object shape (back-compat preserved).
  - **Plugin 1200 v6.1** — extended row with CloudWatch Logs probe retry-on-empty parity. Pre-fold the CWL Logs probe was asymmetric: `DescribeLogGroups` returns `logGroups: []` (NOT a thrown exception) on missing groups, so the shared `_retryOnNotFound` helper's thrown-NotFound retry path never fired. A freshly-created CWL log group probed within seconds of creation could false-DEAD. Post-fold `_retryOnNotFound` accepts an optional retry-on-result predicate; the CWL call site passes a predicate that fires retry when the response carries no exact-name match (covers both empty and prefix-only-sibling responses). Eventual-consistency parity now uniform across IAM / Lambda / SNS / SQS / EventBridge API destination / CloudWatch Logs.
  - **Two-phase restructure of `_retryOnNotFound`** — initially the result-based retry was added inside the existing try block, but a compound-path test interaction (transient empty → second-call throws `ResourceNotFoundException`) caused 3 total network calls. Restructured to two mutually-exclusive phases — Phase 1 = initial call + thrown-NotFound retry; Phase 2 = result-based retry — capping total calls at 2 on all compound paths. The per-call-site outer catch routes a second-call thrown error (NotFound → DEAD; AccessDenied → UNVERIFIABLE).
 - **4 R1 reviewer folds applied** (0 + 0 + 1 + 3 — clean review pass): arrival-order-independent AND-aggregation (locked with 2 regression fixtures + JSDoc tightening) + partial-render contract on malformed port specs (locked with 2 regression fixtures) + `_portKeys` scratch-lifetime documented at function-signature comment + compound-path coverage (transient empty → second-call AccessDenied → UNVERIFIABLE / transient empty → second-call thrown RNF → DEAD; drives the two-phase restructure decision).
- **`SKILL.md`** — "post-EE 0.6.6" → "post-EE 0.6.7"; plugin 1170 v3.1 + plugin 1200 v6.1 highlights surfaced in plugin narratives; plugin count enumeration stays at 22.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### R2 reviewer-deferred (queued for 0.6.8+)

- **R-NIT (plugin 1200 v6.1)** — `retryOnResultPredicate` could be renamed to `shouldRetryOnResult` for question-form consistency with other EE predicates. Pure naming preference.
- **R-NIT (plugin 1200 v6.1)** — symmetry of comments between Phase 1 retry and Phase 2 retry blocks. Pure readability.
- **R-NIT (plugin 1170 — pre-existing)** — `// out-of-scope for v3 v1` typo at the cross-VPC BFS branch (pre-existing from 0.6.6).
- **Cross-plugin extraction candidate** — the `(source, target)` dedup pattern with aggregated-attribute array transfers to IAM trust-policy graphs, VPC peering graphs, KMS principal-reference graphs. Lift to `_lib/graph_edge_dedup.mjs` when the next plugin adopts it.

### Tests + regression

- **EE full regression: 5314/5314 across 834 suites** (was 5304/5304 at 0.6.6 publish; +10 tests, suite count unchanged). **59-session 100% green streak preserved.**

---

## 0.1.27 — Catalog refresh: plugin 1170 v3 SG→SG transitive reachability + plugin 1200 v6 dead-target probe warm-up — paired with EE 0.6.6 trio-publish (minor cycle:, v3 transitive chain reachability +, v6 IAM/API-destination/CW-Logs target probes; 5 R1 reviewer folds (1 + 2 + 2 ; 0 — clean review pass); plugin count UNCHANGED at 22; seventeenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.6 + CE 0.1.60 — **seventeenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.6).

### What changed

- **`references/plugins.md`** — two plugin rows updated:
  - **Plugin 1170 v3** — extended row with SG→SG transitive chain reachability dimension: BFS from public-CIDR roots through `UserIdGroupPairs` SG-references; 2-hop emits HIGH, 3+ hop emits CRITICAL (operator-blindness principle); cycle defense + depth cap (default 5, max 20) + per-target chain cap (default 10, max 100); cross-VPC edges skipped as INFO trailer; per-hop port-flow tracked but NOT intersected (v3 v1 simplification — walkthroughRequired=true). New operator opts: `skipTransitiveReachability` / `transitiveChainDepthCap` / `transitiveChainsPerTargetCap` / `transitiveChainSamplesPerFindingCap`. 3 new soc2.json mappings under CC6.6 (transitive-public HIGH + CRITICAL + INFO truncation).
  - **Plugin 1200 v6** — extended row with three new dead-target probe branches: IAM role (`iam:GetRole` on path-stripped role NAME) + EventBridge API destination (`events:DescribeApiDestination` reuses `_EventBridgeSdk`) + CloudWatch Logs (`logs:DescribeLogGroups` with `logGroupNamePrefix` filter + exact-name disambiguation guard). New SDK deps `@aws-sdk/client-iam` + `@aws-sdk/client-cloudwatch-logs` (both in optionalDependencies). Companion-LOW emission contract unchanged (existing CC7.1 titlePattern target-type-agnostic). **Operator note**: `iam:GetRole` is a global API resolving per-partition — orchestrators wiring `opts._iamClient` must construct a single global IAM client per-partition.
 - **5 v6 R1 reviewer folds applied** (0 — clean review pass; 1 + 2 + 2 ): (plugin 1170 v3) BFS short-circuits enqueue past per-target cap (closes path-enumeration explosion on hub-and-spoke topologies — pre-fold the BFS marked the target truncated but kept cloning `path` and `visited` Sets and walking past the cap) + (plugin 1200 v6) IAM `NoSuchEntityException` / `NoSuchEntity` lifted into `_DEAD_TARGET_NOTFOUND_ERROR_NAMES` Set (bare disjunction collapsed; eventual-consistency retry restored for IAM — the canonical worst case for AWS eventual consistency, with IAM lag 10-30s documented; **9th cumulative recurrence** of the the emit-literal/set-drift class class across the EE codebase) + (plugin 1200 v6) IAM partition-routing contract documented at `_loadIamSdk` (orchestrator must construct global IAM client per-partition; doc-only fold) + (plugin 1170 v3) depth-cap-hit surfaced separately from per-target-cap (closes silent-deep-truncation false-CLEAN class — pre-fold a graph deeper than `transitiveChainDepthCap` silently truncated without operator-visible signal) + (plugin 1200 v6) API destination ARN regex future-proofed against alias-only ARN shapes.
- **`SKILL.md`** — "post-EE 0.6.5" → "post-EE 0.6.6"; plugin 1170 v3 + plugin 1200 v6 highlights surfaced in plugin-1200 narrative; plugin count enumeration stays at 22.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### R2 reviewer-deferred (queued for 0.6.7)

- **(plugin 1200 v6)**: CloudWatch Logs probe doesn't retry on empty result (logs:DescribeLogGroups returns `logGroups: []` not an exception, so `_retryOnNotFound` doesn't apply). Lower priority than IAM since CWL eventual-consistency is much narrower.
- **(plugin 1170 v3)**: Edge dedup absent in `_buildSgReferenceGraph` — multi-rule references to the same SG (e.g., one perm per port) inflate chain counts 2-5×. Defer until operator feedback on chain-count noise.
- **R-NIT** documentation folds.

### Tests + regression

- **EE full regression: 5304/5304 across 834 suites** (was 5261/5261 across 825 at 0.6.5 publish; +43 tests, +9 suites — most are pre-fold v3/v6 base fixtures; 5 are fold-regression pins: hub-and-spoke per-target-cap + depthCapHit-true + depthCapHit-false + IAM transient-retry-succeeds + IAM lowercase-name-retry-then-DEAD). **58-session 100% green streak preserved.**

---

## 0.1.26 — Catalog refresh: plugin 1200 v5 v4-reviewer-cleanup cycle — paired with EE 0.6.5 trio-publish (patch-level cycle: R-NIT named-constants + sentinel observability + sessionToken cross-plugin sweep + dead-target companion-LOW; 5 R1 reviewer folds; plugin count UNCHANGED at 22; sixteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.5 + CE 0.1.59 — **sixteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.5).

### What changed

- **`references/plugins.md`** — plugin 1200 row updated with v5 dim list:
  - **Dead-target companion-LOW (item)** — per-target liveness probes for Lambda + SNS + SQS via new `_probeTargetLiveness` helper (parallel via Promise.all + 2s default timeout). New MEDIUM verdict `*-alerting-destination-dead-targets` emitted as companion alongside PASS when targets point to deleted resources. New operator opts: `skipTargetLivenessProbe: true` + `deadTargetProbeTimeoutMs`. IAM role + API destination + CloudWatch Logs target probes deferred to 0.6.6.
  - **Sentinel observability** — `targetVerificationReason` enum (AccessDenied / SdkUnavailable / BeyondCap / SkippedByOpts) on rule shape; classifier surfaces `targetVerificationReasonBreakdown` in finding details.
 - **R-NIT named-constants** — `SH_HUB_NOT_ENABLED_ERROR_NAMES` frozen Set replaces 2 bare-string sites in SecurityHub helpers per the emit-literal/set-drift class.
 - **5 R1 reviewer folds applied** (0 — clean review pass; 3 + 1 + 1 consolidated /R-NIT): case-insensitive NotFound matching + one-retry on NotFound (eventual-consistency defense) + Lambda probe passes FULL ARN (alias-correctness server-side) + (Explore) parallel probes with per-target timeout + SQS partition-aware via `GetQueueUrl` (closes false-DEAD on aws-cn / aws-us-gov / aws-iso partitions).
- **Cross-plugin sessionToken sweep** — note added to the EE plugin catalog narrative: 18 EE AWS plugins (1020-1200) now thread `sessionToken` through their AWS-SDK credentials block. AssumeRole-style auditor credentials work uniformly across the entire EE catalog.
- **`SKILL.md`** — "post-EE 0.6.4" → "post-EE 0.6.5"; plugin count enumeration stays at 22.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why the catalog refresh matters

AI coding agents using this skill now know that plugin 1200:

- **Verifies per-target liveness** for Lambda / SNS / SQS targets via probes — a verified rule with a Target.Arn pointing to a deleted resource emits a companion LOW alongside the PASS verdict (not just a count-based PASS).
- Distinguishes **eventual-consistency NotFound from real DEAD** via a one-retry with 750ms backoff (defends against false-DEAD on freshly-created resources).
- Calls `events:ListTargetsByRule` with **full qualified Lambda ARNs** to verify alias/version correctness server-side (alias `PROD` pointing to a deleted version surfaces as DEAD).
- Supports **GovCloud / aws-cn / aws-iso SQS targets** via `GetQueueUrl` (partition-aware) instead of synthesized commercial-AWS URL.
- Surfaces unverifiable rules with **explicit failure-mode taxonomy** (AccessDenied / SdkUnavailable / BeyondCap / SkippedByOpts) so auditors can drill down.

AI coding agents using this skill also now know that **all 18 EE AWS plugins** support AssumeRole-style auditor credentials uniformly — auditors no longer need to inject ambient credentials separately.

### Compatibility

No agent-skill API surface changes; pure documentation refresh. AI agents using earlier agent-skill versions against EE 0.6.5 still work, they just lack the v5 dim awareness.

**Customer install (paired):**

```bash
npm install -g nsauditor-ai@0.1.59 @nsasoft/nsauditor-ai-ee@0.6.5
npm install nsauditor-ai-agent-skill@0.1.26
```

---

## 0.1.25 — Catalog refresh: plugin 1200 v4 reviewer-cleanup cycle — paired with EE 0.6.4 trio-publish (patch-level cycle: EventBridge target verification + multi-failedAccount surface + trigger uniformity; 5 R1 reviewer folds incl. cap-skew classifier closure; plugin count UNCHANGED at 22; fifteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.4 + CE 0.1.58 — **fifteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.4).

### What changed

- **`references/plugins.md`** — plugin 1200 row updated with v4 dim list. **EventBridge target verification (item)**: new `_listEventBridgeRuleTargets` helper with defensive pagination; `events:ListTargetsByRule` per matched rule (cap default 10 via `opts.targetVerificationRuleCap`; opt-out via `opts.skipEventBridgeTargetVerification`); new MEDIUM verdict `*-alerting-destination-targetless` for sink-less rules. **multi-failedAccount surface**: Inspector2 helper return-shape `{accountStatus, accessDenied, failedAccounts: array}` (renamed plural; capped at AWS-documented 100); caller emits one LOW per failed account with per-region emission cap 10 + rollup LOW per region. **trigger uniformity**: GuardDuty alerting-destination trigger gates on `detector.Status === ENABLED` (symmetric with Inspector2). **5 R1 reviewer folds applied** (0 — clean review pass): cap-skew classifier branch (LOW UNVERIFIABLE not MEDIUM TARGETLESS when cap-exceeded rules could be the actual sink) + consolidated pagination + JSDoc clarity + multi-failedAccount per-region emission cap (10 + rollup) + boundary tests + dead-target documented-limitation note.
- **`SKILL.md`** — "post-EE 0.6.3" → "post-EE 0.6.4"; plugin count enumeration stays at 22.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why the catalog refresh matters

AI coding agents using this skill now know that plugin 1200:

- **Verifies EventBridge target presence per matched rule** — a rule with zero `Targets` (or just `ENABLED` state but no targets configured) routes to MEDIUM TARGETLESS instead of PASS. Closes the substrate-without-sink false-PASS class at the rule level.
- **Emits one LOW per failed Inspector2 account** for delegated-admin scans — was first-failedAccount-only pre-fold; rest were silently dropped. Per-region emission cap of 10 + rollup LOW per region bounds finding pollution.
- Exposes new operator opts: `skipEventBridgeTargetVerification: true` (cost-sensitive opt-out OR no IAM grant) + `targetVerificationRuleCap: 1..100` (per-rule verification cap; default 10).
- **Distinguishes cap-skew unverifiable from sink-less rules** — when target-less rules exist AND others are beyond the verification cap (could be the real sink), emits LOW UNVERIFIABLE with `capExceeded: true` per the conservative-classifier principle rather than overclaiming MEDIUM TARGETLESS.

### Documented limitation queued for 0.6.5

The target COUNT is verified but per-target LIVENESS is not (Target.Arn could point to deleted Lambda / detached SNS topic). The soc2.json PASS rationale now calls this out explicitly; a companion-LOW finding for dead-target ARNs is queued for the 0.6.5 cycle (would require ~6 new IAM grants on Lambda / SNS / SQS / etc.).

### Compatibility

No agent-skill API surface changes; pure documentation refresh. AI agents using earlier agent-skill versions against EE 0.6.4 still work, they just lack the v4 dim awareness.

**Customer install (paired):**

```bash
npm install -g nsauditor-ai@0.1.58 @nsasoft/nsauditor-ai-ee@0.6.4
npm install nsauditor-ai-agent-skill@0.1.25
```

---

## 0.1.24 — Catalog refresh: plugin 1200 v3 alerting-destination dim — paired with EE 0.6.3 trio-publish (patch-level extension: substrate-without-sink false-PASS closure via EventBridge rule + SecurityHub product subscription detection; Inspector Classic ARN-collision fold; SH-only MEDIUM tier; plugin count UNCHANGED at 22; fourteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.3 + CE 0.1.57 — **fourteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.3).

### What changed

- **`references/plugins.md`** — plugin 1200 row updated with v3 dim list. NEW alerting-destination dim (item c) verifies EventBridge rule + SecurityHub product subscription per service per region. New SDK deps `@aws-sdk/client-eventbridge` + `@aws-sdk/client-securityhub` (optionalDependencies). 4 same-session R1 reviewer folds applied: SH product ARN substring collision closure (Inspector Classic vs Inspector2; boundary-anchored helper) + SH-only PASS narrative split (SH-only is MEDIUM aggregation-only; auditor walkthrough required for SH → downstream paging) + EventBridge content-filter grammar (`{prefix}` / `{wildcard}` matchers; regex-meta escape for operator IaC defense) + source case normalization. Also surfaces (Inspector2 helper return-shape `{accountStatus, accessDenied, failedAccount}`) + item (d) BatchGetAccountStatus contract verification with `failedAccounts[]` per-account error channel surfaced via new `_CAT_INS_FAILED_ACCOUNT` LOW.
- **`SKILL.md`** — "post-EE 0.6.2" → "post-EE 0.6.3"; plugin count enumeration stays at 22 (existing plugin grew in scope).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why the catalog refresh matters

AI coding agents using this skill now know that plugin 1200:

- Audits **alerting-destination presence** per service per region (closing the substrate-without-sink false-PASS class) — operators wiring GuardDuty / Inspector2 without an EventBridge rule or SecurityHub integration get a HIGH finding rather than a misleading PASS.
- Distinguishes **PASS** (EventBridge rule present), **MEDIUM SH-only** (SecurityHub aggregates but no proactive paging), **HIGH missing** (no path), and **LOW unverifiable** (AccessDenied / SDK unavailable).
- Supports **EventBridge content-filter grammar** — `{prefix: "aws."}` catch-all rules and `{wildcard: "aws.guard*"}` glob rules both match correctly.
- Exposes new operator opt: `skipAlertingDestination: true` for cost-sensitive runs.
- Distinguishes a **true AccessDenied** from an **empty-body response** (close-out) — `_getInspector2AccountStatus` no longer conflates the two cases.
- Surfaces the **AWS-published `failedAccounts[]` per-account error channel** with `errorCode + errorMessage` via new `_CAT_INS_FAILED_ACCOUNT` LOW (item d close-out).

### closure (worth a callout)

The pre-fold substring check `:product/aws/inspector` would have matched BOTH Inspector Classic (deprecated 2024) and Inspector2 ARNs — a substrate-without-sink false-PASS where a stale Classic subscription emitting zero findings would have satisfied the Inspector2 dim. The review fold uses boundary-anchored substring matching + the strict `/aws/inspector2` constant, and pins the regression with a dedicated test that asserts the Classic ARN does NOT match the Inspector2 dim.

### Compatibility

No agent-skill API surface changes; pure documentation refresh. AI agents using earlier agent-skill versions against EE 0.6.3 still work, they just lack the v3 dim awareness.

**Customer install (paired):**

```bash
npm install -g nsauditor-ai@0.1.57 @nsasoft/nsauditor-ai-ee@0.6.3
npm install nsauditor-ai-agent-skill@0.1.24
```

---

## 0.1.23 — Catalog refresh: plugin 1200 v2 evidence-acquisition extension — paired with EE 0.6.2 trio-publish (patch-level extension: multi-region GuardDuty + Inspector2 enumeration + GovCloud / ISO region support + `FindingPublishingFrequency` check + Inspector2 baseline expansion; plugin count UNCHANGED at 22; thirteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.2 + CE 0.1.56 — **thirteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.2).

### What changed

- **`references/plugins.md`** — plugin 1200 row updated with v2 dim list. Multi-region enumeration (item a) replaces single-region scope; `FindingPublishingFrequency` check (item b) added as CC7.1 detection-latency dimension; Inspector2 baseline expansion (item e) grows scan-target baseline from {ec2, ecr, lambda} → {ec2, ecr, lambda, lambdaCode, codeRepository}. 4 same-session R1 reviewer folds applied (0 clean review pass): region regex GovCloud + ISO support (closes FedRAMP / StateRAMP / IL5+ false-PASS class) + frequency ordering not equality + region cap defensibility + EC2 client instrumentation parity.
- **`SKILL.md`** — "post-EE 0.6.1" → "post-EE 0.6.2"; plugin count enumeration stays at 22 (existing plugin grew in scope).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why the catalog refresh matters

AI coding agents using this skill now know that plugin 1200:

- Audits GuardDuty and Inspector2 across **all opted-in regions** by default (not just the client's configured region).
- Supports **GovCloud (`us-gov-*`) and ISO (`us-iso*-*`) regions** — operators on those substrates were silently skipped pre-0.6.2.
- Classifies the GuardDuty `FindingPublishingFrequency` against an institutional baseline of 15 minutes (operator-tunable).
- Treats Inspector2 Lambda code scanning and code-repository scanning as part of the institutional baseline (Inspector2 GA 2024+ scan-target additions).
- Exposes operator opts: `regions: string[]` / `skipMultiRegion: true` / `regionListCap: 1..256` / `gdFrequencyPassFrequency: FIFTEEN_MINUTES | ONE_HOUR | SIX_HOURS`.

### Compatibility

No agent-skill API surface changes; pure documentation refresh. AI agents using earlier agent-skill versions against EE 0.6.2 still work, they just lack the v2 dim awareness.

**Customer install (paired):**

```bash
npm install -g nsauditor-ai@0.1.56 @nsasoft/nsauditor-ai-ee@0.6.2
npm install nsauditor-ai-agent-skill@0.1.23
```

---

## 0.1.22 — Catalog refresh: NEW plugin 1200 AWS Inspector2 / GuardDuty Enablement Auditor — paired with EE 0.6.1 trio-publish (patch-level new-plugin extension — first AWS-managed-threat-detection substrate audit; plugin count 21 → 22)

**Trio-publish institutionalization continued.** Paired with EE 0.6.1 + CE 0.1.55 — **twelfth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.1).

### What changed

- **`references/plugins.md`** — **NEW plugin 1200 row** added: 4 active SOC 2 dimensions (GuardDuty Detector enablement per region CC7.1, GuardDuty protection-feature coverage CC7.1 — institutional baseline S3_DATA_EVENTS / EKS_AUDIT_LOGS / EBS_MALWARE_PROTECTION / RDS_LOGIN_EVENTS / LAMBDA_NETWORK_LOGS / RUNTIME_MONITORING, Inspector2 enablement CC7.1+CC7.2, Inspector2 scan-target coverage CC7.1 zero / CC7.2 partial). First AWS-managed-threat-detection substrate audit. HIGH on `gd-not-enabled` silent-blind class; HIGH on `inspector2-disabled` / SUSPENDED silent-blind class for CVE coverage on EC2/ECR/Lambda; HIGH on `inspector2-coverage-zero` (enabled overall but zero scan targets active); MEDIUM on partial coverage with explicit `disabledResources`. **6 same-session R1 reviewer folds applied** including soc2.json titlePattern misalignment closure (4 patterns; would have silently failed CC7.1/CC7.2 compliance routing) + AccessDenied distinct findings + legacy DataSources case normalization + SUSPENDED/DISABLED Detector silent-blind closure + -3/4 dead-code drift closures.
- **`SKILL.md`** — plugin count enumeration 21 → 22; "post-EE 0.6.0" → "post-EE 0.6.1".
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.22
# (paired with EE 0.6.1 + CE 0.1.55; AI-coding-agent users only)
```

---

## 0.1.21 — Catalog refresh: NEW plugin 1160 AWS VPC Endpoints / PrivateLink Auditor — paired with EE 0.6.0 trio-publish (minor-version milestone — first new plugin since EE 0.4.7; plugin count 20 → 21)

**Trio-publish institutionalization continued.** Paired with EE 0.6.0 + CE 0.1.54 — **eleventh consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.0). Opens the v0.6.x line with new plugin breadth.

### What changed

- **`references/plugins.md`** — **NEW plugin 1160 row** added: 4 SOC 2 dimensions (endpoint policy permissive principals CC6.6, PrivateDNS enabled CC6.6, endpoint state A1.2+CC7.2, type substrate Privacy+CC6.6). First plugin to specifically audit the PrivateLink isolation boundary. CRITICAL on unconditional wildcard breaking isolation; MEDIUM on PrivateDNS-disabled silent-bypass; HIGH on `failed` state silent-failure.
- **`SKILL.md`** — plugin count enumeration 20 → 21; "post-EE 0.5.4" → "post-EE 0.6.0".
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.21
# (paired with EE 0.6.0 + CE 0.1.54; AI-coding-agent users only)
```

---

## 0.1.20 — Catalog refresh: cross-plugin Thread H sweep — §7.5 `_promote*FromKms` signature hardening (plugin 1140 v2 + 1180 v2) + §8 operator-config DoS caps (plugin 1170 v2) — paired with EE 0.5.4 trio-publish

**Trio-publish institutionalization continued.** Paired with EE 0.5.4 + CE 0.1.53 — **tenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.5.4). Final v0.5.x close-out cycle.

### What changed

- **`references/plugins.md`** — cross-plugin notes added: plugins 1140 v2 + 1180 v2 `_promote*FromKms` accept BOTH legacy `keyManager` string OR new `keyManagerByArn: Map<arn, keyManager>` form (Map looks up by `finding.details.kmsKeyArn` — single source of truth; closes parallel-threading false-CLEAN class). Plugin 1170 v2 adds `_OPERATOR_CONFIG_MAX_ENTRIES = 1000` constant + operator-tunable caps via `opts.additionalRestrictedPortsCap` / `opts.additionalSystemManagedSgNamePrefixesCap`.
- **`SKILL.md`** — "post-EE 0.5.3" → "post-EE 0.5.4". EE plugin count UNCHANGED at 20.

### Notes

- Pure catalog refresh; no SKILL contract changes.
- v0.5.x close-out summary: 5 ship cycles (0.5.0–0.5.4). Ready for 0.6.0 milestone.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.20
# (paired with EE 0.5.4 + CE 0.1.53; AI-coding-agent users only)
```

---

## 0.1.19 — Catalog refresh: plugin 1190 AWS SES Email Integrity Auditor v3 extension (Part A DKIM public-key fingerprint capture/pin + Part B in-band DMARC alignment classifier; 5 same-session reviewer folds incl. 1 false-CLEAN closure on truncated DKIM keys) — EE 0.5.3; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.5.3 + CE 0.1.52 — **ninth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8/0.4.9/0.5.0/0.5.1/0.5.2). The 0.1.19 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1190 row** updated v2.1 → v3: 2 NEW evidence dimensions (Part A DKIM public-key fingerprint capture/pin + Part B in-band DMARC alignment classifier). NEW emission categories: `ses-dkim-fingerprint-verified` (PASS) / `ses-dkim-fingerprint-mismatch` (HIGH — operator-supplied pin store enables unauthorized rotation / key substitution attack detection) / `ses-dkim-fingerprint-unverifiable` (LOW + evidenceGap) + `ses-dmarc-alignment-strict-met` (PASS) / `ses-dmarc-alignment-relaxed` (INFO) / `ses-dmarc-alignment-dkim-strict-impossible` (HIGH — adkim=s + DKIM disabled) / `ses-dmarc-alignment-spf-strict-impossible` (HIGH — aspf=s + no custom MailFrom) / `ses-dmarc-alignment-unverifiable` (LOW). NEW kill-switches `_skipDkimFingerprintCapture` + `_skipDmarcAlignmentCheck`. closure (discovered via test): `_stripControlChars` 256-char truncation corrupted long DKIM keys → new `_stripControlCharsNoTruncate` helper.
- **`SKILL.md`** — plugin 1190 v3 narrative added; "post-EE 0.5.2" → "post-EE 0.5.3". EE plugin count UNCHANGED at 20.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.19
# (paired with EE 0.5.3 + CE 0.1.52; AI-coding-agent users only)
```

### Notes

- No SKILL contract changes; pure catalog refresh.
- Ninth consecutive trio-publish institutionalizes the discipline across 9 ship cycles.

---

## 0.1.18 — Catalog refresh: plugin 1190 AWS SES Email Integrity Auditor v2.1 deferred-items sweep (7 deferred reviewer-fold items closed from 0.5.0 cycle + 6 same-session reviewer folds incl. 1 CRITICAL soc2 mapping closure + silent-loss-class closure on SES classic API quota exhaustion) — EE 0.5.2; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.5.2 + CE 0.1.51 — **eighth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8/0.4.9/0.5.0/0.5.1). The 0.1.18 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin consolidation.

### What changed

- **`references/plugins.md`** — **plugin 1190 row** updated v2 → v2.1: 7 deferred reviewer-fold items closed. NEW emission category `ses-dkim-dns-partial-with-transients` MEDIUM (matched>0 + transient on remainder — preserves partial-match evidence rather than collapsing to LOW). NEW named Sets `_DNS_TRANSIENT_ERROR_CODES` + `_SES_CLASSIC_NOT_FOUND_ERROR_NAMES` + `_SES_CLASSIC_QUOTA_ERROR_NAMES` per the emit-literal/set-drift class discipline. NEW module-load-time disjointness IIFE `_assertDnsErrorCodeSetsDisjoint` promotes invariant from test-time to Node startup. producer→consumer identityType normalization at both promoter sites.
- **`SKILL.md`** — plugin 1190 v2.1 narrative added; "post-EE 0.5.1" → "post-EE 0.5.2". EE plugin count UNCHANGED at 20.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why

The agent-skill catalog must stay current with EE plugin consolidation cycles so that AI coding agents (Claude Code / Cursor / Windsurf / VS Code Copilot) querying the skill for plugin-1190 capabilities get accurate guidance on the v2.1 emission categories (especially the new `ses-dkim-dns-partial-with-transients` MEDIUM and the `cause: "classic-sdk-quota-exhausted"` LOW + evidenceGap) — without the catalog refresh, agents would incorrectly tell users that plugin 1190 only emits 4 DKIM-DNS categories and 3 classic-policy categories.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.18
# (paired with EE 0.5.2 + CE 0.1.51; AI-coding-agent users only)
```

### Notes

- No SKILL contract changes; pure catalog refresh.
- `references/schemas.md` + `references/workflows.md` unchanged (no plugin-schema or workflow changes in EE 0.5.2; plugin 1190 v2.1 consolidation uses the same `cloudScanners` capability + same `run` envelope established in).
- Eighth consecutive trio-publish institutionalizes the discipline across 8 ship cycles.

---

## 0.1.17 — Catalog refresh: plugin 1150 AWS SQS/SNS Auditor v2 extension (5 → 7 dimensions: CloudWatch alarm coverage on SQS ApproximateAgeOfOldestMessage + SNS NumberOfNotificationsFailed; first plugin-1150 dim to cross an SDK boundary — SQS+SNS → CloudWatch) — EE 0.5.1; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.5.1 + CE 0.1.50 — **seventh consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8/0.4.9/0.5.0). The 0.1.17 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1150 row** updated v1 → v2: 5 → 7 dimensions. v1 dims preserved (encryption + transit-policy + topic-policy + DLQ). v2 NEW dims: **dim 6 SQS ApproximateAgeOfOldestMessage CloudWatch alarm coverage** (CC7.2 + A1.2 dual-mapped) — per-queue PASS / MEDIUM (silent backlog growth) / LOW (actions-disabled OR empty AlarmActions) / LOW + evidenceGap (CW SDK unavailable / AccessDenied / name un-extractable / truncated); **dim 7 SNS NumberOfNotificationsFailed CloudWatch alarm coverage** (CC7.2 + A1.2 dual-mapped) — per-topic analogue with same severity ladder. v2 single-fetch budget via `_enumerateMetricAlarms` + `_buildAlarmIndex` (mirrors plugin 1040's `_auditAlarmCoverage` scaffold). Soft-degrade contract: CW SDK load failure routes per-resource to LOW + evidenceGap rather than blocking primary substrate audit. ** v2 fold (false-CLEAN closure)**: `actionable` requires BOTH `ActionsEnabled=true` AND non-empty `AlarmActions[]` (CloudWatch fires NO operator paging when AlarmActions=[] even with ActionsEnabled=true). ** v2 fold**: soc2.json PASS-tier titlePatterns narrowed to anchor on namespace:metric clauses.
- **`SKILL.md`** — plugin 1150 v2 narrative added to enumeration; "post-EE 0.5.0" → "post-EE 0.5.1". EE plugin count UNCHANGED at 20 (no new plugin in 0.5.1; existing plugin 1150 grew in scope across new dims 6 + 7).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why

The agent-skill catalog must stay current with EE plugin extensions so that AI coding agents (Claude Code / Cursor / Windsurf / VS Code Copilot) querying the skill for plugin-1150 capabilities get accurate guidance on the v2 alarm-coverage dimensions — without the catalog refresh, agents would incorrectly tell users that plugin 1150 only has 5 dimensions and miss the CC7.2 + A1.2 alarm-coverage outcomes.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.17
# (paired with EE 0.5.1 + CE 0.1.50; AI-coding-agent users only)
```

### Notes

- No SKILL contract changes; pure catalog refresh.
- `references/schemas.md` + `references/workflows.md` unchanged (no plugin-schema or workflow changes in EE 0.5.1; plugin 1150 v2 extension uses the same `cloudScanners` capability + same `run` envelope established in).
- Seventh consecutive trio-publish institutionalizes the discipline across 7 ship cycles (0.4.5/0.4.6/0.4.7/0.4.8/0.4.9/0.5.0/0.5.1).

---

## 0.1.16 — Catalog refresh: plugin 1190 AWS SES Email Integrity Auditor v2 extension (DKIM CNAME DNS resolution + DMARC TXT record parser + SES classic API parity; first plugin in EE to depend on node:dns/promises for live DNS cross-reference) — EE 0.5.0; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.5.0 + CE 0.1.49 — **sixth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8/0.4.9). The 0.1.16 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1190 row** updated v1 → v2: dim 1 DKIM now includes CNAME DNS resolution (each `<token>._domainkey.<domain>` resolved + matched against `<token>.dkim.amazonses.com`; four outcomes including HIGH `ses-dkim-dns-missing` false-CLEAN closure); dim 2 MailFrom now includes DMARC TXT record parser + MailFrom promotion (RFC 7489 §6.4 tag-list parser; five outcomes including HIGH `ses-dmarc-missing` + HIGH `ses-dmarc-policy-none`); dim 4 sending-auth policies now includes SES classic GetIdentityPolicies cross-API parity (HIGH `ses-classic-policy-discrepancy` on classic-only policies — canonical false-NEGATIVE class). v1 base preserved (TLS + dedicated IP + suppression list dimensions).
- **`SKILL.md`** — plugin 1190 v2 narrative added to enumeration; "post-EE 0.4.9" → "post-EE 0.5.0". EE plugin count UNCHANGED at 20 (no new plugin in 0.5.0; existing plugin 1190 grew in scope across dims 1 + 2 + 4).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### EE 0.5.0 paired-release context

- **EE plugin count UNCHANGED at 20** — the 0.5.0 minor-version milestone bump is a single-plugin EXTENSION (fourth extension cycle after, v2 in 0.4.6 +, v3 in 0.4.8 +, v2 in 0.4.9). Plugin 1190 v2 closes the canonical false-CLEAN window where SES `Status=SUCCESS` substrate alone could not rule out post-verification DNS drift.
- **Part A — DKIM CNAME DNS resolution promotion** (dim 1) — `_resolveDkimCnames` + `_promoteDkimFromDns`. Each `<token>._domainkey.<identityDomain>` CNAME resolved via node:dns/promises + matched against `<token>.dkim.amazonses.com` (case-insensitive per RFC 1035 §2.3.3). Four outcomes: PASS `ses-dkim-dns-verified` / MEDIUM `ses-dkim-dns-partial` / HIGH `ses-dkim-dns-missing` (production false-CLEAN closure) / LOW + evidenceGap `ses-dkim-dns-unverifiable`.
- **Part B — DMARC TXT record parser + MailFrom promotion** (dim 2) — RFC 7489 §6.4 tag-list parser + `_dmarc.<identityDomain>` TXT lookup. Five outcomes. **same-session fold (false-CLEAN closure)**: `pct=0` on `p=reject`/`p=quarantine` functionally equivalent to `p=none`; now routes to HIGH `ses-dmarc-policy-none`. **same-session fold (subdomain-takeover false-NEGATIVE closure)**: `sp` subdomain-policy override now evaluated — `p=reject; sp=none` downgrades to HIGH.
- **Part C — SES classic GetIdentityPolicies parity** (dim 4) — `_loadSesClassicSdk` restored (was removed in v1 reviewer-fold MEDIUM as dead-code load-check). Cross-API discrepancy detection emits HIGH `ses-classic-policy-discrepancy` on classic-only policies (canonical false-NEGATIVE class). Conservative on classic SDK unavailable / AccessDenied → LOW + evidenceGap `ses-classic-policy-unverifiable`.
- **8 same-session reviewer folds across the cycle** (1 CRITICAL + 3 HIGH + 2 MEDIUM + 2 LOW); 6 queued in Pick-up Block.
- **First plugin in EE to depend on `node:dns/promises`** — first ship to add NETWORK-LAYER cross-reference to AWS-SDK-substrate evidence baseline; structurally distinct evidence-acquisition surface from prior 0.4.x cycles.
- **Real-DNS smoke validation END-TO-END** against production DNS resolvers — `_dmarc.nsasoft.us` parsed correctly: `p=reject, sp=reject (default), pct=100`; forward-compat `fo=1` tag preserved in `rawTags`. Empty-account SESv2 enumeration baseline succeeded end-to-end against <operator-test-account>.
- **EE full regression: 4787/4787** (was 4696 at EE 0.4.9 publish; +91 tests cumulative across the v2 cycle). 46-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate evidence depth growth on already-covered CC6.1 + CC6.6 via 11 new aws-ses-auditor mapping rules. The 0.5.0 bump (vs the natural 0.4.10) is an institutional milestone marker — first non-0.4.x release in the 0.4.5–0.5.0 trio-publish series + first ship to add NETWORK-LAYER cross-reference.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.16` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.49 @nsasoft/nsauditor-ai-ee@0.5.0`).

---

## 0.1.15 — Catalog refresh: plugin 1180 AWS ElastiCache Redis Auditor v2 extension (kms:DescribeKey promotion + subnet route-table verifier; closes both v1 deferred items) — EE 0.4.9; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.4.9 + CE 0.1.48 — **fifth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8). The 0.1.15 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1180 row** updated v1 → v2: dim 2 at-rest+KMS now includes kms:DescribeKey cross-reference promotion (mirrors plugin 1140 v2 pattern: UNVERIFIABLE `:key/UUID` → PASS/MEDIUM via KeyMetadata.KeyManager); dim 6 subnet placement now includes ec2:DescribeRouteTables verifier (HIGH on IGW-routed subnets with per-subnet `igwDestinationsBySubnet` evidence; PASS on all-verified-private; LOW + evidenceGap on main-RT-inheritance per a review fold false-NEGATIVE closure; LOW + evidenceGap on AccessDenied). Cross-plugin sister of plugin 1170 SG perimeter (layer-3 subnet→IGW vs layer-4 SG ingress). Per-resource caching (kmsKeyManagerCache + subnetGroupCache + subnetSetRoutingCache).
- **`SKILL.md`** — plugin 1180 v2 narrative added to enumeration; "post-EE 0.4.8" → "post-EE 0.4.9". EE plugin count UNCHANGED at 20 (no new plugin in 0.4.9; existing plugin 1180 grew in scope).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### EE 0.4.9 paired-release context

- **EE plugin count UNCHANGED at 20** — seventh-ship-cycle in the 0.4.x stream is another single-plugin EXTENSION (third extension cycle after, v2 in 0.4.6 +, v3 in 0.4.8). Plugin 1180 v2 closes **both** v1 deferred items (KMS-DescribeKey promotion + subnet route-table cross-reference).
- **Part A — kms:DescribeKey cross-reference promotion** (dim 2 at-rest encryption; mirrors plugin 1140 v2 pattern). UNVERIFIABLE `:key/UUID` ARN shapes promoted via `KeyMetadata.KeyManager` to deterministic PASS (CUSTOMER) / MEDIUM (AWS). Conservative on AccessDenied / NotFound / unknown KeyManager.
- **Part B — Subnet route-table verifier** (dim 6 subnet placement; closes v1 -2). `elasticache:DescribeCacheSubnetGroups` + `ec2:DescribeRouteTables` walk. Per-subnet IGW-route detection via `/^igw-[a-f0-9]+$/i` (correctly excludes egress-only `eigw-`). HIGH on IGW-routed subnet(s) (with per-subnet `igwDestinationsBySubnet` evidence per review fold) / PASS on all-verified-private / **LOW + evidenceGap on main-RT-inheritance per reviewer fold false-NEGATIVE closure** (default-VPC main-RT typically routes `0.0.0.0/0 → igw-*`).
- **7 same-session reviewer folds across the cycle** (independent `general-purpose-agent` review yielded 12 findings; 7 folded same-session, 1 deferred to cross-plugin Thread H sweep, 4 withdrawn after verification).
- **No new SDK dependencies** — `@aws-sdk/client-kms` + `@aws-sdk/client-ec2` already declared in optionalDependencies since EE 0.4.5.
- **Real-AWS smoke validation END-TO-END**: smoke against `<operator-test-account>` (no fixture changes needed). `redis-leaky-cache` → dim 6 LOW `elasticache-subnet-main-rt-inheritance` (the review fold escalation demonstrably firing against the real default-VPC main-RT-inheritance pattern); `findingsBySeverity: { pass:1, medium:3, high:5, low:2, info:1 }`; durationMs=1428. KMS promotion path NOT exercised against real AWS (existing fixtures use alias-form CMK keys; unit tests + plugin 1140 v2 real-AWS validation cover the promotion path).
- **EE full regression: 4696/4696** (was 4642 at EE 0.4.8 publish; +54 tests). 45-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate evidence depth growth on already-covered CC6.6 + C1.1 via 5 new aws-elasticache-redis-auditor mapping rules.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.15` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.48 @nsasoft/nsauditor-ai-ee@0.4.9`).

---

## 0.1.14 — Catalog refresh: plugin 1140 AWS RDS Auditor v3 extension (7 → 10 dimensions; +database audit-logging) — EE 0.4.8; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.4.8 + CE 0.1.47 — **fourth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5 institutionalized the pattern, 0.4.6 confirmed it as institutional discipline, 0.4.7 ratified the cadence). The 0.1.14 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1140 row** updated to reflect v3 extension (7 → 10 dimensions; +database audit-logging triad: pgAudit / CloudWatch Logs exports / CloudWatch Logs retention; aurora-aware log-path detection per reviewer fold). Notes the false-PASS closure on `rds-pgaudit-misconfigured` (Postgres silently ignores pgaudit.log when shared_preload_libraries omits pgaudit per reviewer fold). Engine-dispatched essential/optional CloudWatch log type policy via `_RDS_ENGINE_CWL_NAMES` covering mysql/mariadb/aurora-mysql/postgres/aurora-postgresql/oracle-*/sqlserver-* variants.
- **`SKILL.md`** — plugin 1140 v3 enumeration line updated with v3 narrative; "post-EE 0.4.7" → "post-EE 0.4.8". EE plugin count UNCHANGED at 20 (no new plugin in 0.4.8; existing plugin 1140 grew in scope).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40` (EE 0.4.0-cohort paired-release floor).

### EE 0.4.8 paired-release context

- **EE plugin count UNCHANGED at 20** — sixth-ship-cycle in the 0.4.x stream is a single-plugin EXTENSION rather than NEW plugin. Plugin 1140 `aws-rds-auditor` grew from 7 → 10 dimensions via **, v3** — first 0.4.x extension cycle of an existing plugin since, v2 (plugin 1170 RESTRICTED_PORTS extension in 0.4.6).
- Closes the "database activity logs" SOC 2 dimension per `tasks/things-to-check.md` §4 audit-canonical checklist (CC7.2 + CC7.3 continuous monitoring + event evaluation).
- **9 same-session reviewer folds across the cycle** (independent `general-purpose-agent` review yielded 12 findings; 9 folded same-session, 3 deferred to v3.1 / cross-plugin sweep).
- **HIGH-1 closure** — Aurora cluster log-path detection (pre-fold whole Aurora fleet returned false-INFO MEDIUM on dim 10 because helper hard-coded `/aws/rds/instance/<id>/` even for aurora-* engines that publish to `/aws/rds/cluster/<DBClusterIdentifier>/`).
- **MEDIUM-2 closure** — pgAudit + shared_preload_libraries cross-check (Postgres silently ignores `pgaudit.log` when SPL omits pgaudit = false-PASS class).
- **MEDIUM-3/4/5 closures** — cwl-opt-out + retentionDistribution + non-AccessDenied transient errors all surfaced as distinct categories for auditor evidence-pack legibility.
- **Real-AWS smoke validation END-TO-END**: in-place modification of `rds-compliant-cluster` fixture (cost $0; brief Multi-AZ failover during apply-immediately reboot) validated ALL 3 v3 PASS-path classifiers; unmodified `rds-violator-db` validated HIGH path. **First 0.4.x extension cycle to validate BOTH PASS-path AND HIGH-path classifiers** against real AWS in the same smoke run.
- **EE full regression: 4642/4642** (was 4574 at EE 0.4.7 publish; +68 tests). 44-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate evidence depth growth on already-covered CC7.2 + CC7.3 via 7 new aws-rds-auditor mapping rules.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.14` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.47 @nsasoft/nsauditor-ai-ee@0.4.8`).

---

## 0.1.13 — Catalog refresh: EE plugin count 19 → 20 (plugin 1190 AWS SES Email Integrity Auditor — NEW EE 0.4.7; first plugin in the 1190-1199 ID range)

**Trio-publish institutionalization continued.** Paired with EE 0.4.7 + CE 0.1.46 — **third consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5 institutionalized the pattern and 0.4.6 confirmed it as institutional discipline). The 0.1.13 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin growth.

### What changed

- **`references/plugins.md`** — added **plugin 1190 row** (AWS SES Email Integrity Auditor; 6 dimensions: DKIM enablement + signing status / custom MailFrom domain alignment / configuration set TLS enforcement / identity sending authorization policy permissive principals / dedicated IP pool sending posture / suppression list state; CC6.1 / CC6.6 / C1.1 / CC7.1-substrate / Privacy-substrate). Notes the **multi-class wildcard detector** (bare `"*"` / `{AWS:*}` / `{Service:*}` / `{Federated:*}` / `{CanonicalUser:*}` / array forms per reviewer fold) + **distinct HIGH `ses-sending-auth-notprincipal-allow` category** per reviewer fold catching the NotPrincipal+Effect=Allow wildcard-EQUIVALENT class (matches plugins 1070 + 1150 NotPrincipal+Allow discipline) + **LOW + evidenceGap `ses-sending-auth-malformed-statement`** per reviewer fold for Effect-missing send-action statements + **ZDE invariant** at run envelope boundary (NEVER reads suppressed-destination email addresses).
- **`SKILL.md`** — added plugin 1190 to the EE plugin enumeration; updated "post-EE 0.4.6" → "post-EE 0.4.7"; bumped EE plugin count 19 → 20 and ID range 1020-1180 → 1020-1190 in the Editions table.
- **`README.md`** — bumped EE plugin count 19 → 20 and ID range 1020-1180 → 1020-1190 in the Editions table.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40` (EE 0.4.0-cohort paired-release floor).

### EE 0.4.7 paired-release context

- **EE plugin count: 19 → 20** — fifth plugin-count growth in the 0.4.x cycle. NEW plugin **1190 AWS SES Email Integrity Auditor** (v1) covers 6 SOC 2 evidence dimensions spanning confidentiality + email-integrity. Closes the next-highest-priority gap from `tasks/things-to-check.md` AWS SOC 2 audit-canonical compliance checklist after Redis closed in 0.4.6. Dual API surface discipline: v1 uses SESv2 only (canonical modern API surface covers all 6 dimensions); `@aws-sdk/client-ses` declared in optionalDependencies for v2+ cross-API parity.
- **11 same-session reviewer folds across the cycle** — **ties the single-cycle reviewer-fold record** for security-classifier-correctness-surface plugins (independent `general-purpose-agent` review yielded 12 findings; 11 folded same-session, 1 deferred to cross-plugin Thread H sweep).
- **CRITICAL-1 closure** — NotPrincipal+Effect=Allow distinct HIGH category (pre-fold silently classified as bounded = false-CLEAN class).
- **HIGH-4 closure** — `_isWildcardPrincipal` walks every Principal class value (pre-fold only `principal.AWS` was inspected, leaking `{Service:"*"}` + `{Federated:"*"}` as silent CLEAN).
- **HIGH-2 closure** — missing-Effect on send-action statement now surfaces LOW + evidenceGap `ses-sending-auth-malformed-statement` (was silent-dropped pre-fold).
- **Fourth EE plugin to ship without smoke-time SDK hotfix** — preemptive `@aws-sdk/client-ses` + `@aws-sdk/client-sesv2` addition.
- **EE full regression: 4574/4574** (was 4458 at EE 0.4.6 publish; +116 tests across the cycle: 94, v1 unit-test suite + 22 reviewer-fold pin tests). 43-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate-evidence depth growth on already-covered CC6.1 / CC6.6 / C1.1 via 8 new aws-ses-auditor mapping rules.
- **No real-AWS smoke against violation-tier fixtures** — operator's internal test infrastructure has NO SES paired fixtures yet (full-stack fixtures deferred to, v2 alongside DKIM CNAME DNS resolution + DMARC TXT record parsing). Empty-account smoke baseline against <operator-test-account> DID succeed end-to-end (plugin loads via CE→EE binding, all 4 SESv2 API enumerations succeed, baseline 2 INFO findings emit correctly, durationMs=842, ZDE invariant preserved).
- **Memory tag closures:** `aws_string_case_normalization` at **20×** with explicit SPLIT-SURFACE callout (DKIM/Tls/MailFromStatus enums upcased / IAM Action/Effect lowercased); `conservative_classifier_principle` reinforced in 5 new fold sites; `emit_literal_set_drift` extended with `_DKIM_STATUS_VALID` + `_MAILFROM_STATUS_SUCCESS` + `_TLS_POLICY_VALID` named-constant discipline.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.13` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.46 @nsasoft/nsauditor-ai-ee@0.4.7`).

---

## 0.1.12 — Catalog refresh: EE plugin count 18 → 19 (plugin 1180 AWS ElastiCache Redis Auditor; plugin 1170 v2 RESTRICTED_PORTS 13 → 23 ports per CIS AWS Foundations v3.0)

**Trio-publish institutionalization.** Paired with EE 0.4.6 + CE 0.1.45 — second trio-publish across EE + CE + agent-skill in a single session, institutionalizing the pattern that started with the 0.4.5 cycle (closing 14 months of stale catalog drift). The 0.1.12 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin growth.

### What changed

- **`references/plugins.md`** — added **plugin 1180 row** (AWS ElastiCache Redis Auditor; 6 dimensions: transit + at-rest+KMS / AUTH / Multi-AZ / SnapshotRetention / subnet; CC6.1 / CC6.2 / CC6.6 / A1.2 / C1.1). Updated plugin **1170 row** to reflect v2 RESTRICTED_PORTS extension (13 → 23 ports per CIS AWS Foundations v3.0; adds Redshift, K8s API, etcd, Kibana, InfluxDB, Kafka, Consul, ZooKeeper, Vault) + new `opts.additionalRestrictedPorts` operator-config knob + per-SG cardinality cap + system-managed-SG name-prefix exclusion list.
- **`SKILL.md`** — added plugin 1180 to the EE plugin enumeration; updated "post-EE 0.4.5" → "post-EE 0.4.6"; bumped EE plugin count 18 → 19 and ID range 1020-1170 → 1020-1180 in the Editions table.
- **`README.md`** — bumped EE plugin count 18 → 19 and ID range 1020-1170 → 1020-1180 in the Editions table.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40` (EE 0.4.0-cohort paired-release floor).

### EE 0.4.6 paired-release context

- **EE plugin count: 18 → 19** — fourth plugin-count growth in the 0.4.x cycle. NEW plugin **1180 AWS ElastiCache Redis Auditor** (v1) covers 6 SOC 2 substrate-evidence dimensions spanning confidentiality + availability + segmentation. Dual API enumeration (DescribeReplicationGroups + DescribeCacheClusters) with inter-API dedup; Memcached out-of-scope by design.
- **Plus, v2** — plugin 1170 RESTRICTED_PORTS grown 13 → 23 ports per CIS AWS Foundations v3.0 + operator-config + per-SG cardinality cap with rollup trailer + system-managed-SG name-prefix exclusion list.
- **10 same-session reviewer folds across the cycle** (7, v2 incl. 2 CONVERGENT-CRITICAL findings + 3, v1) — most-folds-in-a-single-cycle for 0.4.x to date.
- **Third EE plugin to ship without smoke-time SDK hotfix** — preemptive `@aws-sdk/client-elasticache` addition.
- **EE full regression: 4458/4458** (was 4361 at EE 0.4.5 publish; +97 tests). 42-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate-evidence depth growth on already-covered CC6.1 / CC6.2 / CC6.6 / A1.2 / C1.1.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.12` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.45 @nsasoft/nsauditor-ai-ee@0.4.6`).

---

## 0.1.11 — Catalog refresh: EE plugin count 4 → 18; ID-range renumbered 020s → 1020s; SOC 2 evidence taxonomy added

**Major catalog overhaul.** The agent-skill was last published in April 2024 (version 0.1.10) and had not tracked the EE 0.3.x / 0.4.x evolution. This release brings the Enterprise plugin catalog current to **EE 0.4.5** (paired with CE 0.1.44).

### What changed

- **EE plugin count: 4 → 18.** Added 14 new Enterprise plugins to `references/plugins.md`: 1030 IAM Deep Auditor, 1040 CloudTrail Operational Integrity, 1050 API Gateway Assurance, 1060 DynamoDB Audit Integrity, 1070 KMS Auditor, 1080 Lambda Security Auditor, 1090 Secrets Manager + SSM Parameter Store, 1100 CodePipeline + CodeBuild, 1110 IAM Effective Decrypt-Path, 1120 S3 Lifecycle + Cross-Region Replication, 1130 Backup Auditor (headline 12-dimension air-gapped vault attestation arc), 1140 RDS Auditor v2 (7 dims + kms:DescribeKey cross-reference), 1150 SQS/SNS Auditor, 1170 EC2 SG Perimeter Auditor.
- **EE plugin IDs renumbered 020s → 1020s.** All EE plugins moved to the disjoint 1000+ ID range at EE 0.3.9 (2026-05-12) to avoid CE collision. Previously the agent-skill advertised plugin `020 AWS Cloud Scanner` which AI coding agents would have suggested for users to run — but that ID no longer exists in EE. The corrected ID is `1020`.
- **SOC 2 substrate-evidence taxonomy added.** Every Enterprise plugin row now lists the SOC 2 Trust Services Criteria controls it produces evidence under. Aggregate coverage: 10 covered controls (CC6.1 / CC6.2 / CC6.6 / CC6.7 / CC6.8 / CC7.1 / CC7.2 / CC7.3 / C1.1 / C1.2) + 4 partial (CC6.3 / CC8.1 / A1.2 / PI1.5) + 33 OOS for static substrate scanning. Coverage matrix is institutionally honest: substrate-evidence depth grows release-over-release without the matrix being shifted (matrix-shift requires net-new control coverage, not just deeper evidence on already-covered controls).
- **`SKILL.md` plugin summary updated:** "44+ Scanners" (was "27+"). Enterprise (18) line lists all plugins by ID. Editions table updated with accurate edition-feature deltas.
- **`README.md` updated:** plugin awareness "44+ scanner plugins (23 CE + 3 Pro + 18 Enterprise)" (was "30+"). Editions table now reflects correct per-edition feature deltas.
- **`peerDependencies` floor bumped:** `nsauditor-ai >=0.1.10` → `>=0.1.40`. CE 0.1.40 (published 2026-05-13) is the EE 0.4.0-cohort paired-release floor — the EE plugin ID range only makes sense against CE 0.1.40+.
- **CHANGELOG.md added** to track future release history; included in `files` array.

### What did NOT change

- **CE Pro plugin section (040 / 050 / 060) is still accurate.** The 040 TLS Certificate & Cipher Auditor, 050 TRIBE v2 Probe, 060 DNS Security Auditor are CE-Pro-tier plugins (not EE) and did NOT move with the EE renumbering. The agent-skill's documentation of these is correct.
- **Core (17) + Discovery (6) plugin sections** — unchanged; no renumbering at CE side.
- **MCP tool surface, schemas, workflows** — unchanged; this release is a catalog refresh, not an MCP API change.

### Recommended pairing

`npm install nsauditor-ai-agent-skill@0.1.11 nsauditor-ai@0.1.44` (CE pairing).

For Enterprise users running EE plugins: pair `nsauditor-ai@0.1.44` + `@nsasoft/nsauditor-ai-ee@0.4.5`.

---

## 0.1.10 — Initial release (April 2024)

First publication. Established the SKILL.md / references/ / examples/ structure. Documented:

- 17 Core + 6 Discovery scanners (CE-tier).
- 3 Pro plugins (040 TLS / 050 TRIBE / 060 DNS).
- 4 Enterprise plugins by pre-renumber IDs (020 AWS / 021 GCP / 022 Azure / 023 Zero Trust).
- MCP tool reference for `scan_host` / `list_plugins` / `probe_service` / `get_vulnerabilities`.
- Multi-step workflow recipes.

**Note:** the EE plugin IDs documented in 0.1.10 (020/021/022/023) were renumbered to 1020/1021/1022/1023 at EE 0.3.9 (2026-05-12). Refresh to 0.1.11+ for the corrected catalog.
