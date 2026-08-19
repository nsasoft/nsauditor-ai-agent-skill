---
name: nsauditor-ai
description: >
  Use this skill whenever the user wants network security scanning, auditing, vulnerability
  assessment, host reconnaissance, or cloud-account security/compliance auditing with NSAuditor
  AI (via the nsauditor-ai MCP server: scan_host, scan_cloud, get_findings, probe_service, get_vulnerabilities,
  list_plugins). Triggers include 'scan', 'audit', 'vulnerability', 'CVE', 'network security',
  'port scan', 'service detection', 'OS fingerprinting', 'penetration test', 'TLS/cipher audit',
  'certificate check', 'DNS security', 'SPF/DKIM/DMARC/DNSSEC', 'SNMP/SMB/NetBIOS', 'CTEM',
  'continuous monitoring', or 'audit my AWS/GCP/Azure account' / 'cloud compliance'. Also use it
  when the user asks to check if a host is up, enumerate services, find open ports, look up CVEs
  for a version, audit DNS records, or audit a cloud account — even if they don't say NSAuditor,
  as long as the nsauditor-ai MCP tools are available. Do NOT use for general coding, web
  development, or non-security topics.
---

# NSAuditor AI — Agent Skill

> **Version:** 0.2.42 (post-EE-0.39.0 · **requires CE ≥ 0.2.43**, UNCHANGED) — the coverage-honesty release. ⚠️ **Teach `deferredScope` as a per-PLUGIN declaration, never as a provider or coverage inventory.** Every GCP and Azure plugin now declares what it does NOT evaluate (1021, 1022, 1024, 1025, 1220, 1221, 1222), joining the AWS plugins that already did — 8 to 12 static boundaries each, emitted at `run()` scope on the audited path **including over an empty estate**, because "zero findings" is otherwise indistinguishable from "assessed and clean". A declaration is a **static capability boundary**: it is NOT an evidence gap and NOT a finding, it routes to ZERO compliance controls by design, and it must be reported as "not assessed". ⚠️ **An empty or short `deferredScope` is NEVER a claim of full coverage** — not every plugin declares its boundaries, so the list bounds only what the DECLARING plugins state. Never tell a user that an empty list means everything was assessed. Two AWS declarations (1080 Lambda, 1130 Backup) are now emitted ONCE PER RUN rather than once per region, so a fleet reads nine once-per-run disclosures — a count that no longer scales with the estate. And **GCP impersonation now REFUSES rather than degrading**: an impersonated client that yields no Authorization header fails loudly by name with the target principal, surfacing as `up:false` plus a warning that fires scanner-down synthesis. ⚠️ Teach that refusal as a PASS of the fail-closed design, never as a regression — the alternative it replaced was silent anonymous requests reporting FALSE evidence gaps. Plugin catalog UNCHANGED at 28 EE / 55 overall; all seven matrices UNCHANGED.
>
> **Prior:** 0.2.41 (post-EE-0.38.0 · **requires CE ≥ 0.2.43**) — the sign-pack / verify-pack release. ⚠️ **This entry described those commands as "reachable and not yet proven" when written, and that is now STALE in the underclaim direction.** The published-bytes gate RAN against the EE 0.38.0 registry bytes on 2026-08-17 and PASSED, so the capability is PROVEN for an operator-held key over one framework's envelope and the artifacts it enumerates, never a vendor attestation. What has not changed, and never will, is that scope. `compliance sign-pack` signs a chain-of-custody envelope with an operator-held Ed25519 key; `compliance verify-pack` establishes authorship AND recomputes every enumerated artifact hash against disk. A verified signature proves the holder of a key asserted authorship of ONE framework's envelope, relative to operator key custody — never a vendor attestation, never proof the scan ran. It covers that envelope and its four artifacts, not the pack. Exit 2 means the run could not measure and is never a failure.
>
> **Prior:** 0.2.40 (post-EE-0.37.0 · **requires CE ≥ 0.2.42**) — the air-gap feed release. `feed bundle` and `feed import` let NVD feed files downloaded on a connected host be merged into one archive, hand-carried, and imported into the offline store on an isolated host — delivered as a **restricted** distribution rather than a public `npm install`, and amd64 only. ⚠️ Teach these precisely: **`feed bundle` bundles the FEEDS YOU DOWNLOADED, never "your database"** — the offline store is a lossy derivation of an NVD feed and cannot be turned back into one, so never describe this as a store export or a backup. **No KEV or EPSS data ships with the product**; `--kev` / `--epss` carry the operator's own downloads from CISA and FIRST, and `--extras-dir` places them on import and prints the environment lines to set. **A bundle is integrity-checked, NOT authenticated** — the recorded SHA-256 detects alteration in transit but cannot establish authorship, because it travels inside the archive it covers; never describe an imported bundle as trusted or verified-as-genuine. **Import skips about a quarter of a real NVD year file by design** (withdrawn CVEs, entries with no CPE match data) — that is not data loss, while malformed records are a different signal meaning re-download. The air-gap delivery claims are EARNED BACK at this release, every one of them as a **restricted** distribution and **amd64 only** — the offline installation tarball is restricted, the install script is restricted, the feed-import CLI moves the feeds you downloaded, and air-gapped deployment is restricted and amd64 only — because the artifacts exist and the delivery gate passes on the built bytes. Teach them WITH their conditions, which are part of the claim and not footnotes: the bundle is a **restricted** distribution rather than a public `npm install`, and it is **amd64** only. **arm64 images remain WITHDRAWN** — never describe an arm64 enclave as supported.
>
> **Prior:** 0.2.39 (post-EE-0.36.0 · **requires CE ≥ 0.2.40**) — the verification release. Every compliance report now cryptographically checks each suppression signature — the Ed25519 suppression-signing capability this exercises is **proven as of EE 0.36.0 and verified for approvers whose registry entry carries key material**, its verification gate having run against the published bytes and passed — and writes `report.signatureVerification`. A MISSING verdict means NOT CHECKED, never failed; `cryptoValid` is absent when unanswerable, never `false`. Verification runs for approvers whose registry entry carries key material.
>
> **Prior:** 0.2.38 (post-EE-0.35.0 · **requires CE ≥ 0.2.40**) — the approval-surface release. Four Enterprise commands are now reachable from the CLI: `compliance suppress | review | renew | keygen`. `keygen` creates an Ed25519 approval keypair for a capability that was not yet proven at that release, writes the private half `0600` and prints an identity-registry member to paste; it refuses to overwrite an existing signing key. `suppress` signs the approval it writes when `NSAUDITOR_SIGNING_KEY` names a local Ed25519 key, and a malformed key fails at the command with nothing written. `renew` warns that renewing a signed approval invalidates its signature — the expiry and the renewal record live inside the signed payload, so the record afterwards reads `signature does not match payload`, which an auditor cannot distinguish from real tampering. ⚠️ **Teach this precisely: Ed25519 suppression signing became REACHABLE at that release and was NOT YET PROVEN then. It was PROVEN at EE 0.36.0** — the verification gate ran against the published bytes and passed. Verification runs for approvers whose registry entry carries key material; for a fingerprint-only entry a report reads `not checked`, which records that no check ran and never that one failed. These commands are CLI-only — they are not MCP-reachable. Plugin catalog UNCHANGED at 28 EE / 55 overall; all seven matrices UNCHANGED.
>
> **Prior:** 0.2.37 (post-EE-0.34.0 · **requires CE ≥ 0.2.39**) — the exploit-intelligence release. Enterprise findings that carry CVEs are joined by CVE-ID against a local **CISA KEV** catalog and a local **FIRST EPSS** scores file, banded `KNOWN_EXPLOITED` / `ELEVATED` / `BASELINE`, and the finding queue is ordered exploit-first — a KEV-listed MEDIUM outranks an unexploited CRITICAL. ⚠️ Teach this accurately: **no feed data ships with the product.** Both stores are operator-populated via `NSAUDITOR_EXPLOIT_KEV_STORE` / `NSAUDITOR_EXPLOIT_EPSS_STORE`, the same rule as the offline NVD store, and both **fail closed when stale** (KEV 14-day / EPSS 10-day windows) so an out-of-date catalog never reports "not exploited". `riskScore` is UNCHANGED — `exploitPriority` is a new axis beside it, not a re-weighting. ⚠️ One correction to this package's own prose: the risk score is **CVSS weighted by verification status with an initial-access uplift**, not "severity × exploitability × impact × exposure" — that phrasing named an exploitability input that did not exist until this release. Plugin catalog UNCHANGED at 28 EE / 55 overall; all seven matrices UNCHANGED.

> **Prior:** 0.2.36 (post-EE-0.33.0 · **requires CE ≥ 0.2.37**) — a wording-only patch on top of the wiring release: the RFC 3161 row said the capability was "implemented but not yet wired to a flag", which EE 0.33.0 falsified and the live-TSA smokes then falsified twice over (npm path 2026-08-07, from inside the `:0.33.0` container image 2026-08-08). It is opt-in via `NSAUDITOR_TSA_URL`, proven on both delivery vehicles, and the only surviving caveat is version scope — retained images `:0.32.11` and earlier carry no `openssl`. **Prior:** 0.2.35 — the wiring release. Three CE entry points are new and the skill should teach them: `compliance attest` (Type II recurring-scan attestation over a directory of prior scans; exit 3 on an empty history), and `--sla-policy <file>` / `--compliance-history <dir>`, which reach the SLA/MTTR engine. A startup posture veto refuses `NSAUDITOR_OFFLINE_ONLY=1` together with a configured outbound path (exit 2). ⚠️ Two corrections to this package's own prose: the `compliance_check` disclosure now carries the WITHDRAWN marker so an instrument can tell it from a claim, and the Enterprise row no longer calls plugin 1023 a cloud auditor — it scores zero-trust posture from a NETWORK-host scan and cannot be run by selecting it with `--plugins`. Plugin catalog UNCHANGED at 28 EE / 55 overall; all seven matrices UNCHANGED.

> **Prior:** 0.2.34 (post-EE-0.32.11 — **a correction release.** The Verification Engine was WITHDRAWN at EE 0.32.7; this package went on presenting it as a shipped Phase 4, glossing `VERIFIED` as probe-confirmed, and selling "verification probes" in the pricing table. All corrected — the status enum stays, the active-probe gloss goes, and findings are stated to be emitted UNVERIFIED. Upstream: `scan_cloud` summaries now surface the INFO tier and `deferredScope` boundaries; a new `compliance_matrix` MCP tool returns the shipped coverage matrix for any of the seven frameworks, derived at call time; `pdfExport` withdrawn and every capability now ships a description. Plugin catalog UNCHANGED at 28 EE / 55 overall; all seven matrices UNCHANGED.)

> **Prior:** 0.2.33 (post-EE-0.32.10 — no knowledge change.)

> **Prior:** 0.2.32 (post-EE-0.32.9 — the skill package's own provenance sweep.)

> **Prior:** 0.2.30 (post-EE-0.32.7 — a **matrix-neutral** release that does two things. (1) **Cross-framework routing:** the network-scan analysis agents' findings now route in **all seven compliance frameworks**, not just SOC 2 — a host serving cleartext or exposing SMB previously failed the SOC 2 report and read clean in HIPAA / NIST CSF / ISO 27001 / CIS v8 / PCI / GDPR off the same scan; that gap is closed (mutation-proven guard; all seven `coverageSummary` blocks byte-identical). (2) **Capability-claim honesty pass:** several Pro/Enterprise capabilities advertised without a shipping implementation — verification engine, branded reports, usage metering, Docker per-scan isolation, and the ZDE "policy engine" / Enterprise-CTEM datastore framings — are **withdrawn**; the real cores (the code-enforced ZDE read-only guarantee, Pro-tier CTEM retention) ship and are described honestly, and the `verifiers/` stub files no longer ship. Plugin count UNCHANGED at 28; all seven coverage matrices UNCHANGED.)

NSAuditor AI is a modular, AI-assisted network security audit platform with 27+ scanner
plugins, CVE matching, MITRE ATT&CK mapping, and Zero Data Exfiltration by design. This
skill teaches you how to operate it via MCP tools and CLI.

---

## MCP Tools Reference

NSAuditor AI exposes tools via Model Context Protocol (stdio transport). Available tools
depend on the license tier (Community / Pro / Enterprise).

### Community Edition Tools (always available)

#### `scan_host`
Run a full plugin scan against a target host. Executes ALL enabled plugins in priority
order (discovery → service probes → OS detection → result fusion).

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `host` | string | ✅ | — | Target hostname or IP address |
| `timeout` | number | ❌ | 30000 | Per-plugin timeout in ms |

**Returns:** `{ summary, host, services[], findings[] }` — see `references/schemas.md`

**Example:**
```json
{ "host": "192.168.1.1", "timeout": 10000 }
```

**Important:**
- For RFC 1918 / private IPs, the MCP server must have `NSA_ALLOW_ALL_HOSTS=1` set.
- The server blocks loopback (127.x, ::1), link-local (169.254.x, fe80:), and cloud
  metadata endpoints (169.254.169.254) — this is SSRF protection, not a bug.
- Plugins with unmet requirements auto-skip (e.g., SSH scanner skips if port 22 is closed).

---

#### `compliance_matrix`
Return the SHIPPED compliance coverage matrix for a framework — how many controls are Covered, Partial and
Out of scope, with the control ids and the per-group out-of-scope reasons.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `framework` | string | ❌ | `soc2` \| `hipaa` \| `nist-csf` \| `pci-dss` \| `iso-27001` \| `cis-v8` \| `gdpr` \| `all` (default) |

**ALWAYS call this before stating or tabulating any coverage matrix, and quote what it returns.** Do NOT derive a
matrix from the plugin inventory, from a scan result, or from documentation — coverage is a property of the shipped
framework maps, not of the plugin list, and a derived matrix will disagree with the customer's own report.

⚠️ `outOfScope` is the **flattened sub-criterion count**, not the number of out-of-scope groups: SOC 2 returns 37
ids across 11 groups. Publishing the group count yields a plausible-looking 10 / 4 / 11.

It **fails closed** — if the Enterprise pack is not installed or its data is unreadable it raises rather than
returning an empty matrix, because an empty matrix is what gets filled in with a guess.

---

#### `list_plugins`
List all available scanner plugins with metadata.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| *(none)* | — | — | — |

**Returns:** Array of `{ id, name, description, priority, protocols[], ports[], requirements }`

**When to use:** Before a scan to understand available plugins, or to help the user select
specific plugins for a targeted probe.

---

#### `probe_service` *(Pro license required)*
Run a single plugin against a specific host:port for deep-dive investigation.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `host` | string | ✅ | Target hostname or IP |
| `pluginName` | string | ✅ | Plugin name or numeric ID (e.g. `"ssh_scanner"` or `"002"`) |
| `port` | number | ✅ | Target port number |

**Returns:** Raw plugin output with full evidence for that specific service.

**Common plugin IDs:**
| ID | Name | Best For |
|----|------|----------|
| 002 | SSH Scanner | Banner, version, weak algorithms/ciphers |
| 004 | FTP Banner | FTP daemon identification, anonymous login |
| 006 | HTTP Probe | Server headers, tokens, vendor hints |
| 007 | SNMP Scanner | Device info via sysDescr, hardware/firmware |
| 009 | DNS Scanner | DNS server version (CHAOS query) |
| 010 | Webapp Detector | Technology stack fingerprinting (Wappalyzer) |
| 011 | TLS Scanner | TLS versions, cipher suites, deprecation |
| 014 | NetBIOS Scanner | SMB/NetBIOS enumeration, null sessions |
| 040 | TLS Cert & Cipher Auditor | Certificate chain, expiry, weak ciphers *(Pro)* |
| 050 | TRIBE v2 Probe | Debug leaks, stack traces, CORS misconfig *(Pro)* |
| 060 | DNS Security Auditor | SPF/DKIM/DMARC, DNSSEC, zone transfer *(Pro)* |

---

#### `get_vulnerabilities` *(Pro license required)*
Look up known CVEs for a CPE string via the NVD 2.0 API.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `cpe` | string | ✅ | CPE 2.3 format (see CPE guide below) |
| `maxResults` | number | ❌ | Max CVE results to return |

**Returns:** `{ cpe, totalResults, vulnerabilities[] }` — each CVE includes ID, description,
CVSS v3.1 score, severity, vector string, publication date.

**CPE Construction Guide:**

Format: `cpe:2.3:a:<vendor>:<product>:<version>:*:*:*:*:*:*:*`

| Detected Program | Detected Version | CPE String |
|------------------|------------------|------------|
| OpenSSH | 8.9p1 | `cpe:2.3:a:openbsd:openssh:8.9p1:*:*:*:*:*:*:*` |
| Apache httpd | 2.4.54 | `cpe:2.3:a:apache:http_server:2.4.54:*:*:*:*:*:*:*` |
| nginx | 1.24.0 | `cpe:2.3:a:f5:nginx:1.24.0:*:*:*:*:*:*:*` |
| OpenSSL | 3.0.8 | `cpe:2.3:a:openssl:openssl:3.0.8:*:*:*:*:*:*:*` |
| ISC BIND | 9.18.12 | `cpe:2.3:a:isc:bind:9.18.12:*:*:*:*:*:*:*` |
| vsftpd | 3.0.5 | `cpe:2.3:a:beasts:vsftpd:3.0.5:*:*:*:*:*:*:*` |
| Samba | 4.17.5 | `cpe:2.3:a:samba:samba:4.17.5:*:*:*:*:*:*:*` |
| Log4j | 2.14.1 | `cpe:2.3:a:apache:log4j:2.14.1:*:*:*:*:*:*:*` |
| MySQL | 8.0.32 | `cpe:2.3:a:oracle:mysql:8.0.32:*:*:*:*:*:*:*` |
| PostgreSQL | 15.2 | `cpe:2.3:a:postgresql:postgresql:15.2:*:*:*:*:*:*:*` |

**Tip:** If vendor is ambiguous, search NVD with just the product name first.

---

### Pro/Enterprise Tools (license gated)

These tools return a license upgrade prompt on CE installations:

| Tool | Tier | Purpose |
|------|------|---------|
| `scan_cloud` | Enterprise | Audit one or more cloud accounts (AWS / GCP / Azure) for security & compliance posture using the server-configured credentials. No network host needed. Input: `{ providers?: ("aws"\|"gcp"\|"azure")[], regions?: string[] }` — **pass only the cloud(s) the user names** (`providers:["aws"]` for "audit my AWS account"); omit `providers` only when the user asks to audit ALL clouds. Use this (not `scan_host`) when the user asks to "audit my AWS account", "audit my AWS and Azure accounts", or "check my cloud compliance". CE/Pro callers get an upgrade message. **`regions` (AWS only)** — AWS region codes (e.g. `["us-east-1","eu-west-1"]`) or `["all"]`. **Default — single region (MOST requests):** a plain "audit my AWS account", a "quick check", or any request that names no region AND does not explicitly ask for all/every/whole-account/complete/full coverage → **OMIT `regions`** (audits ONLY the server-configured `AWS_REGION`, one region; do NOT fan out or batch). Omitting does NOT scan all regions. **Specific regions:** when the user names region(s), pass exactly those. **All regions — ONLY on an explicit "all regions / every region / whole account / full coverage" request:** use the discover-then-batch approach in the region-scope note below — do NOT pass a single `["all"]` call and rely on it (it fans every regional plugin across all enabled regions and usually EXCEEDS the host's MCP tool-call timeout, e.g. Claude Desktop's, returning nothing). Unknown region codes are rejected before the scan runs (the WHOLE call fails — fix the region and re-call; never silently drop it). |
| `get_findings` | Enterprise | Drill into the findings of the MOST RECENT `scan_cloud` scan — a per-provider, **per-session** cache (NOT live state; cleared when the MCP server restarts). Input: `{ scanId?, provider?, plugin?, severity?, category?, cursor?, limit? }`. Use it AFTER `scan_cloud` when the summary's **category rollup** shows a category you want to expand to specific resources, or when you need the FULL untruncated text of a finding. Pass the **`scanId` from the `scan_cloud` summary footer** + the `provider`; filter by `category`/`severity`/`plugin`; paginate with `cursor`/`limit` (server-capped at 20 — follow `nextCursor`). If you get a **"re-run scan_cloud"** error the cache was cleared or superseded — **re-run `scan_cloud`, do NOT retry `get_findings`**. CE/Pro callers get the same upgrade message as `scan_cloud`. |

> **Interpreting `scan_cloud` results — never report a false clean:** read **`findingsSummary`** for the findings — it maps each provider to `counts` (per-severity totals) and a `findings` list of the CRITICAL/HIGH items (`{severity, plugin, title}`); report those. A cloud was effectively audited only if it appears in `auditedProviders`. If the result has `audited: false`, any `notes` entries, or `pluginsRan: 0`, the cloud was **NOT** audited (no plugins, missing credentials, or skipped) — report the gap explicitly; an empty result is **not** a clean pass. Do not infer "clean" from an empty `findingsSummary` when the cloud is not in `auditedProviders`. **Beyond CRITICAL/HIGH, `findingsSummary[provider].rollup` groups the remaining findings by `category` with counts (count-descending) across **MEDIUM, LOW *and* INFO** — and the INFO tier is not optional reading, because that is where the evidence gaps and the deferred-scope boundaries live. ⚠️ This sentence said "MEDIUM + LOW" until EE 0.39.0, which was FALSE against the summariser's own three rollup buckets, and false in the direction that hides the tier a reader most needs. Report every tier that occurs; these are actionable too: a category like `sqs-age-alarm-missing` or `*-public` is a real gap, not noise, and reporting only CRITICAL/HIGH while the rollup is non-empty is itself a false clean. To enumerate the specific resources behind a rollup category, or to read a finding's full untruncated text, call `get_findings` with the `scanId` from the summary footer + the `category`.**

> **Reporting `scan_cloud` region scope — never overstate coverage:** Report the regions you ACTUALLY scanned, derived from the `regions` you **passed** — NOT from the findings. If you OMITTED `regions`, only the single server-default region (`AWS_REGION`) was scanned — say exactly that and add that the account's OTHER enabled regions were NOT covered (offer to re-run for all regions). **Never escalate a single-region or "quick" request into a multi-region scan.** Do NOT claim "all regions" / "every region" / "across N regions" just because GuardDuty or Inspector list per-region findings: those plugins enumerate every enabled region INTERNALLY regardless of scope, so their per-region findings are NOT evidence the other plugins ran outside the region(s) you passed.

> **Full all-region coverage — discover then batch** (use ONLY when the user explicitly asked for all/every/whole-account/complete/full region coverage; NEVER for a plain or "quick" request — those stay single-region per the `regions` default above): a single `regions:["all"]` call usually exceeds the host's MCP tool-call timeout (e.g. Claude Desktop's) and returns nothing. Reliable pattern: (1) run a default scan (omit `regions`) — its GuardDuty/Inspector findings enumerate every enabled region, giving you the full list while auditing the default region; (2) scan the REMAINING regions in small batches (3–5 region codes per `regions:[...]` call) across successive calls until every enabled region is covered; (3) merge and report the TOTAL number of regions actually covered — **count** them, don't guess. If you try `["all"]` and it times out, that result is INCOMPLETE — fall back to batching and continue until complete; never report a timed-out or partial scan as full coverage.
> **⚠️ COMPLIANCE IS A CLI SURFACE, NOT AN MCP TOOL.** `compliance_check` is WITHDRAWN — there is no such tool and there never was, and the evidence pack is produced by `nsauditor-ai scan --host <target> --compliance <fw> --out <dir>`, which runs the compliance PHASE and writes `scan_compliance_<framework>.{json,md,html}` plus its attestation and chain-of-custody sidecars. `scan_cloud` maps findings to frameworks but **never runs that phase**, so no MCP call produces a pack. Use `compliance_matrix` to state COVERAGE (what is covered / partial / out of scope); use the CLI to produce EVIDENCE.
>
> The framework detail below is accurate and worth keeping — it was attached to a tool name that does not exist:
>
> SOC 2 (AICPA TSC 2017) + HIPAA (§164.312 Technical Safeguards) + NIST CSF 2.0 Core + PCI DSS v4.0.1 (sub-requirement-level for QSA RoC; PCI SSC June 2024 errata) + ISO/IEC 27001:2022 (per-Annex-A-code-level for ISO/IEC 17021-1 certification body assessors; ISO + IEC October 2022; 2013 edition retired October 31, 2025) + **CIS Critical Security Controls v8** (per-Safeguard-level; Center for Internet Security May 2021, v8.1 errata June 2024) + **GDPR Article 32 (Security of Processing)** (sub-measure-level; Regulation (EU) 2016/679; **Art. 32 infrastructure substrate only, NOT GDPR compliance**) gap analysis — all seven shipped (SOC 2 EE 0.3.x; HIPAA EE 0.9.0; NIST CSF 2.0 EE 0.10.0; PCI DSS v4.0.1 EE 0.11.0; ISO/IEC 27001:2022 EE 0.12.0; CIS Controls v8 EE 0.13.0; **GDPR Article 32 EE 0.20.0**). Multi-framework via `--compliance all` (shorthand for all seven frameworks; EE 0.31.4) or `--compliance soc2,hipaa,nist-csf,pci-dss,iso-27001,cis-v8,gdpr` (any CSV subset; aliases `nist`/`pci`/`iso`/`cis`); an unknown token **fails fast** (no "Framework load failed" stub). The hepta-framework one-scan produces seven complete auditor-ready evidence packs. **CIS Controls v8**: 17 covered + 23 partial + 113 OOS across 153 Safeguards / 18 Controls. **Implementation Group cumulative discipline** — IG1=56 (cyber-insurance baseline; ~50-70% of mid-market policies require IG1 attestation), IG2 cumulative=130, IG3 cumulative=153; smallest-IG-membership tagging (NEVER report IG2 as 74-of-74 in isolation). **No-certification-body attestation discipline** — engine output is INPUT to CSAT / CIS-CAT Pro self-attestation OR a SOC 2 auditor cross-validating CIS scope, never "CIS certified." Cloud Companion Guide v8 shared-responsibility + CIS-Hardened-Image substrate-evidence credit (Safeguards 4.1/4.2/4.6) + 5 Security Functions (NOT 6 — no Govern) + 6 Asset Types + MS-ISAC/EI-ISAC/H-ISAC sector baselines + v7.1-to-v8 cross-reference. CIS Safeguard examples: `3.3` Data Access Control Lists, `5.4` Restrict Administrator Privileges, `6.3` MFA for Externally-Exposed Applications, `8.2` Collect Audit Logs, `11.4` Isolated Recovery Data Instance. ISO 27001 Annex A code examples: `A.5.15` Access control, `A.5.23` NEW 2022 Cloud services, `A.8.5` Secure authentication, `A.8.9` NEW 2022 Configuration management, `A.8.16` NEW 2022 Monitoring activities, `A.8.24` Use of cryptography. Statement of Applicability per Clause 6.1.3.d discipline + ISMS Clauses 4-10 OOS-by-design framing (7 Major Nonconformity classes — absence of internal audit per Clause 9.2 or management review per Clause 9.3 = auto-fail Stage 2) + 5-attribute taxonomy NEW in 2022 (controlType / informationSecurityProperties / cybersecurityConcepts [5 categories, NOT 6 like NIST CSF 2.0] / operationalCapabilities / securityDomains) + 2013-to-2022 transition discipline. Pair with ISO-aware GRC (Drata ISO 27001 / Vanta ISO 27001 / AuditBoard / OneTrust ISMS / Secureframe ISO 27001) for SoA workflow + internal audit + management review. PCI DSS sub-requirement examples: `Req 1.2.1` NSC config standards, `Req 8.4.1` MFA on non-console admin, `Req 10.2.1` audit logs enabled, `Req 11.3.1` quarterly internal vuln scans. Defined-vs-Customized Approach discipline per Appendix E (15 Defined-only sub-requirements enforced at schema layer; CHD Scope operator-attested via CDE DFD per Req 1.2.4; card-brand AOC enforcement view — Visa CISP / Mastercard SDP / Amex DSOP / Discover DISC). **GRC push (Enterprise, opt-in):** set `COMPLIANCE_GRC_PROVIDER=vanta` (or `drata` / `secureframe`) + `COMPLIANCE_GRC_TOKEN` to map the findings to the platform's evidence/test records and push them at scan time (ZDE-redacted egress; token never serialized; the Vanta·Drata·Secureframe connector trio is complete — Secureframe records model, live tenant validation in progress).

### Evidence gaps — never read one as a pass (post EE 0.32.9)

A finding whose text opens `Evidence gap (…)`, or which carries `details.evidenceGap: true`,
means **the scanner could not verify that surface** — it is NOT a clean result and must never
be summarised as one. Two shapes to recognise:

- `Evidence gap (multi-region enumeration incomplete): …` / `Evidence gap (scan time budget
  exceeded): …` — enumeration did not finish. Report what was NOT covered, not what was.
- `Evidence gap: the <source> scanner could not run (<reason>) …` — an entire cloud's
  scanner failed to start (an optional SDK absent, credentials unusable). Every in-scope
  control of that cloud is a gap. **Do not describe a multi-cloud scan as clean when one
  cloud's scanner never ran.**

If a scan predates EE 0.32.9, its gap findings lead with a retired prefix that no framework
anchor matches, so they route to no control — the engine detects this and warns. Advise a
re-scan rather than reusing the old artifact.

### Deferred scope — a declared boundary is neither a gap nor a finding (post EE 0.39.0)

`findingsSummary[provider].deferredScope` lists surface this release does **not evaluate at all**.
It is a **static capability boundary**, and all three of the following are load-bearing:

- **It is NOT an evidence gap.** A gap means the scanner tried to read something and could not
  (AccessDenied, truncated enumeration) — fixable with permissions. A deferred-scope entry means no
  code was ever written to look. Never merge the two lists, and never suggest granting permissions
  to close one.
- **It is NOT a finding.** It routes to **ZERO** compliance controls by design, carries no severity
  judgement about the estate, and must never be reported under "issues found" or counted as a
  failure. Report it as **"not assessed"**.
- **It is emitted even over an EMPTY estate**, deliberately: an account with no resources yields
  zero findings whether or not anything was examined, so the declaration is the only thing that
  tells those two apart.

⚠️ **AN EMPTY OR SHORT `deferredScope` IS NEVER A CLAIM OF FULL COVERAGE.** Not every plugin
declares its boundaries, so the list bounds only what the **declaring** plugins state — it is not a
coverage inventory. Where the list is empty or short, say plainly that boundaries are declared
per-plugin and this is not an inventory. **Never tell a user that an empty list means everything was
assessed.** State this as a per-plugin invariant, never as a provider roster: a roster sentence goes
stale on the next Enterprise release, which is exactly why the CE tool description stopped carrying
one at CE 0.2.44.

Since EE 0.39.0 all three clouds declare: AWS through nine emitters, Azure through four (1022, 1220,
1221, 1222) and GCP through three (1021, 1024, 1025). Before that release only AWS declared, and the
asymmetry was itself the hazard — **one provider disclosing is what makes another's silence read as
completeness.** The AWS declarations are also now emitted once per RUN rather than once per region,
so the count no longer scales with the estate and no entry is region-stamped.

### Cross-framework routing — cite the engine, do NOT freehand-map (post EE 0.32.7)

When a user asks which controls a finding maps to, **read it from the engine's compliance
pack (the `scan_compliance_<framework>.json` artifact the CLI writes) — do not infer
a mapping from general security knowledge.** The engine deliberately routes some findings
*narrowly*, and a plausible-looking freehand mapping will overclaim. The non-obvious
dispositions to know:

- **Missing HSTS header → SOC 2 CC6.7 ONLY.** It is deliberately **not** mapped to HIPAA
  §164.312(e)(1), ISO A.8.9, CIS 3.10, NIST CSF, PCI DSS, or GDPR. The finding fires only
  on an endpoint whose transport **is** encrypted (the header governs a *future* client's
  downgrade, not the observed session), so failing a transmission-security or
  secure-configuration control in the other six on one absent response header would
  overclaim — a Required HIPAA standard or an IG1 CIS Safeguard flipped on a single-header
  inference. (EE 0.32.7 §4B; routes to CC6.7 only, mutation-proven.)
- **Aggregate open-port count** and the **opportunistic-STARTTLS / port-inferred cleartext**
  variants also route to **SOC 2 only** — each is a breadth heuristic or a self-declared
  *unverifiable* observation, not a per-transmission determination.
- Otherwise, network-scan analysis-agent findings (`crypto_agent` / `exposure_agent`) now
  route across **all seven** frameworks where the control subject matches (EE 0.32.7): a
  **confirmed** cleartext channel fails HIPAA §164.312(e)(1), ISO A.8.24, NIST PR.DS-02,
  CIS 3.10, PCI 4.2.1 and GDPR Art. 32(1)(a) as well as SOC 2 CC6.7.

If unsure, say the pack is what decides it and offer to run the CLI — never assert a control
mapping the engine did not emit, and never claim an MCP call produced a pack.

---

### Suppressions — the workflow SHIPS, the signature does NOT (post EE 0.33.1)

An operator can mark a finding as accepted-risk or false-positive. That suppression workflow **ships and is reachable**: a suppressed finding renders with status `FALSE_POSITIVE`, set by an operator rather than by a probe, and the suppression is applied before the pack is written — so it sits **inside** the hashed artifact rather than being independently attested.

⚠️ **Ed25519 SIGNING of suppressions became reachable in EE 0.35.0 via `compliance suppress` and was PROVEN at EE 0.36.0, verified for approvers whose registry entry carries key material** — the verification gate ran against the published bytes and passed, tamper negative control included. Present a produced signature as verified evidence only **for approvers whose registry entry carries key material**; a fingerprint-only registry entry makes a report read `not checked by this report`, which records that no check ran and must never be reported as a failure. The signer backends and the frozen `algorithm` / `backend` record fields are groundwork, deliberately landed before reachability because retrofitting algorithm agility once signatures exist in customer archives would break every auditor holding one. Setting `NSAUDITOR_SIGNING_KEY` changes nothing today, because nothing calls the signer.

**Never tell an operator their suppressions are cryptographically signed** — not even in the softer form "signed once you configure a key". If asked what the SHA-256 chain-of-custody covers: it proves the pack was not altered after generation. It does **not** attest who suppressed a finding, when, or with what justification, and an assessor asking about suppressions usually wants the second thing.

⚠️ **Disambiguation:** "suppression" also appears in this package in the unrelated **AWS SES email suppression list** sense (plugin 1190). They are different subjects; check which one is being asked about.

## Five-Phase Pipeline Architecture

NSAuditor AI follows an institutional five-phase pipeline:

```
Phase 1: DISCOVERY (CE)        License → Plugin loading → PluginManager.run() → Concluder
                                Output: Fused scan with summary, OS, services[], evidence[]
                                        ↓
Phase 2: BASIC ANALYSIS (CE)   Redaction → MITRE mapping → AI analysis (any provider)
                                Output: Admin raw JSON/HTML + AI reports + scan history
                                        ↓
                                   [ License Gate: Pro required ]
                                        ↓
Phase 3: INTELLIGENCE (Pro)    CPE generation → NVD CVE lookup → Parallel verification agents:
                                  • Auth Agent (weak auth, default credentials)
                                  • Crypto Agent (TLS, ciphers, certificates)
                                  • Config Agent (misconfigs, debug exposure, CORS)
                                  • Service Agent (CVE-specific targeted probes)
                                Output: Structured finding queue
                                        ↓
Phase 4: VERIFICATION          PLANNED — NOT SHIPPED. The finding-status field and its
         (planned, not shipped) risk-weighting scaffolding exist; the active safe probes
                                do not. Every finding today is emitted UNVERIFIED.
                                        ↓
Phase 5: SCORING (Pro/Ent)     Risk scoring → Pro AI prompts → Compliance mapping
                                Output: Risk report + compliance report (Markdown, HTML, JSON)
```

> **Phase 4 is a roadmap entry, kept in the diagram so the pipeline's shape is legible.** The
> Verification Engine was withdrawn as a capability claim at EE 0.32.7. Do not describe
> findings as probe-confirmed (it is WITHDRAWN, not merely unused), and do not tell an
> operator a finding was "verified" — see
> `references/schemas.md` § Finding Statuses.

---

## Plugin Reference (55 scanners — 27 Community + 28 Enterprise)

**`references/plugins.md` is the authoritative catalog.** The counts above are derived from the
shipped plugin files; verify any of them with `nsauditor-ai license --plugins`, which prints the
live total and marks each Enterprise plugin `✓ active` or `✗ requires: <tier>`.

The Community set groups roughly as service probes, host/network discovery, and intelligence /
meta plugins; three further plugins are Pro-gated (040 TLS Certificate & Cipher Auditor, 050
TRIBE v2 Probe, 060 DNS Security Auditor).

> A per-plugin list used to be duplicated here and drifted: it claimed **18** Enterprise plugins
> while enumerating **15**, against **28** on disk. One catalog, in `references/plugins.md`.

## Workflow Recipes

See `references/workflows.md` for detailed multi-step patterns:

1. **Full Security Audit** — list_plugins → scan_host → get_vulnerabilities per service
2. **Targeted Service Investigation** — probe_service(pluginId) → get_vulnerabilities
3. **Subnet Discovery** — CLI: `nsauditor-ai scan --host <CIDR> --parallel 10`
4. **CI/CD Pipeline** — SARIF output with `--fail-on` severity gating
5. **Continuous Monitoring (CTEM)** — `--watch --interval <min> --webhook-url <url>`
6. **AI-Powered Report** — Scan with AI provider (OpenAI/Claude/Ollama) + redaction

### Decision Tree: Which Tool to Use

```
User wants to...
├── Scan a host comprehensively         → scan_host
├── Audit a cloud account (AWS/GCP/Azure) → scan_cloud (Enterprise)
├── Check a specific service/port       → probe_service (Pro)
├── Look up CVEs for software version   → get_vulnerabilities (Pro)
├── See available plugins               → list_plugins
├── Audit TLS certificates              → probe_service with plugin 040 (Pro)
├── Check DNS security (SPF/DKIM/DMARC) → probe_service with plugin 060 (Pro)
├── Detect debug leaks / CORS issues    → probe_service with plugin 050 (Pro)
├── Scan a subnet                       → CLI with --parallel (not MCP)
├── Set up continuous monitoring         → CLI with --watch (not MCP)
├── State framework COVERAGE            → compliance_matrix (any tier)
└── Produce a compliance EVIDENCE PACK  → CLI with --compliance (not MCP)
```

---

## Data Schemas

See `references/schemas.md` for complete structures:

- **Scan Result** — `{ summary, host{os,mac,vendor,names}, services[], findings[] }`
- **ServiceRecord** — `{ port, protocol, service, program, version, status, banner, evidence[] }`
- **Finding** — `{ id, category, severity, title, evidence, remediation, cwe, mitre_attack[] }`
- **CVE Response** — `{ cpe, totalResults, vulnerabilities[]{cve_id, cvss, severity} }`
- **Plugin Interface** — `{ id, name, priority, run(), conclude(), requirements }`
- **SARIF Output** — 2.1.0 format for CI/CD consumers

---

## Security Constraints

**CRITICAL — Always observe these constraints:**

1. **Zero Data Exfiltration (ZDE):** NSAuditor AI NEVER sends scan data externally unless
   the user explicitly opts in to AI analysis with their own API keys. Nsasoft infrastructure
   never sees scan data. Never suggest workflows that violate this boundary.

2. **SSRF Protection:** The MCP server blocks loopback (127.x, ::1), link-local (169.254.x,
   fe80:), and cloud metadata endpoints. Set `NSA_ALLOW_ALL_HOSTS=1` **only** for legitimate
   local network auditing. DNS rebinding is also blocked via pre-resolution.

3. **AI Redaction:** When AI analysis is enabled, the redaction pipeline scrubs:
   - Private IPv4 addresses → `[REDACTED]`
   - MAC addresses → `[MAC]`
   - Serial numbers → `[REDACTED_HIDDEN]`
   - Email addresses → `[REDACTED_EMAIL]`
   - Bearer tokens → `[REDACTED_BEARER]`
   - AWS keys → `[REDACTED_AWS_KEY]`
   - Configurable via `CONFIDENTIAL_KEYWORDS` env var

4. **Scan Authorization:** ALWAYS confirm the user has authorization to scan the target.
   Never scan hosts without explicit user instruction. Unauthorized scanning is illegal.

5. **Non-Destructive:** every scanner probe is a read-only query — NSAuditor AI never
   exploits vulnerabilities or modifies target systems. (Active *verification* probes are
   Planned — not shipped; findings are emitted UNVERIFIED.)

---

## Configuration

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `NSA_ALLOW_ALL_HOSTS` | unset | Set to `1` to scan RFC 1918 private ranges |
| `PLUGIN_TIMEOUT_MS` | 30000 | Global per-plugin timeout |
| `AI_ENABLED` | false | Enable AI analysis |
| `AI_PROVIDER` | openai | `openai` · `claude` · `ollama` |
| `OPENAI_API_KEY` | — | OpenAI API key (or `keychain:OPENAI_API_KEY`) |
| `ANTHROPIC_API_KEY` | — | Claude/Anthropic API key |
| `OPENAI_MODEL` | gpt-4o-mini | OpenAI model name |
| `ANTHROPIC_MODEL` | claude-sonnet-4-20250514 | Anthropic model name |
| `OPENAI_REDACT` | true | Redact PII before AI submission |
| `CONFIDENTIAL_KEYWORDS` | serial,password,token,secret | Comma-separated keys to scrub |
| `NSAUDITOR_LICENSE_KEY` | — | Pro/Enterprise JWT license key |
| `COMPLIANCE_GRC_PROVIDER` | — | **Enterprise** — opt-in scan-time GRC push: `vanta`, `drata`, or `secureframe`. Needs `COMPLIANCE_GRC_TOKEN`; optional `COMPLIANCE_GRC_BASE_URL` / `COMPLIANCE_GRC_CONTROL_MAP` / `COMPLIANCE_GRC_REDACTION` (`off`/`hash`/`remove`). Egress is ZDE-redacted; token never serialized. Live tenant validation in progress. |
| `SCAN_OUT_PATH` | out/ | Output directory for scan results |
| `SMB_NULL_SESSION` | false | Allow SMB null session probe |
| `ENABLE_SYN_SCAN` | false | Enable Nmap TCP SYN scanning (requires root) |

### Plugin-Specific Timeouts

| Variable | Default | Plugin |
|----------|---------|--------|
| `TLS_SCANNER_TIMEOUT_MS` | 8000 | TLS Scanner |
| `HTTP_PROBE_TIMEOUT_MS` | 6000 | HTTP Probe |
| `WEBAPP_DETECTOR_TIMEOUT_MS` | 6000 | Webapp Detector |
| `DNS_TIMEOUT_MS` | 800 | DNS Scanner |
| `OPENSEARCH_SCANNER_TIMEOUT_MS` | 6000 | OpenSearch Scanner |

---

## Installation & Setup

```bash
# Install globally
npm install -g nsauditor-ai

# Start MCP server (stdio transport)
nsauditor-ai-mcp

# Or via npx (no global install)
npx nsauditor-ai-mcp
```

### Agent Integration

**Claude Code:**
```bash
claude mcp add nsauditor-ai -- npx nsauditor-ai-mcp
```

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "nsauditor-ai": {
      "command": "npx",
      "args": ["-y", "nsauditor-ai-mcp"],
      "env": {
        "NSA_ALLOW_ALL_HOSTS": "1",
        "NSA_MCP_AUTH_KEY": "<from: nsauditor-ai mcp install-key>",
        "PLUGIN_TIMEOUT_MS": "5000"
      }
    }
  }
}
```

> ⚠️ **`NSA_MCP_AUTH_KEY` is REQUIRED — the server refuses to start without it.** Generate one with
> `nsauditor-ai mcp install-key`, then put the SAME value in the `env` block above. Without it the MCP
> server exits at startup and the client shows the tools as unavailable. (`NSA_MCP_AUTH_DISABLE=1`
> exists as an escape hatch and warns on stderr; it is not the recommended path.)

**Cursor / Windsurf / VS Code:**
Add to your MCP configuration with the same command/args pattern.

---

## Editions & Licensing

| Edition | Price | Key Features |
|---------|-------|-------------|
| **Community** | Free / MIT | 27 plugins (service probes + host/network discovery + intelligence/meta), basic AI, CTEM, SARIF, scan history |
| **Pro** | $49/mo | + CVE matching, risk scoring, analysis agents, Pro plugins (040 TLS / 050 TRIBE / 060 DNS) |
| **Enterprise** | $2k+/yr | + 28 enterprise plugins (1020-1222 range) — 27 cloud-substrate auditors covering AWS / GCP / Azure plus `1023 Zero Trust Assessment` (which declares no cloud provider and scores zero-trust posture from a NETWORK-host scan — it never runs on a cloud pass, and selecting it by id on its own does not run it either) — against seven frameworks (SOC 2 10 covered + 4 partial; HIPAA; NIST CSF 2.0; PCI DSS v4.0.1; ISO/IEC 27001:2022; CIS Controls v8; GDPR Art. 32 infrastructure substrate); SOC 2 evidence-pack generation; SHA-256 chain-of-custody attestations (RFC 3161 timestamping is opt-in via the `NSAUDITOR_TSA_URL` environment variable — there is no CLI flag and no default, it makes an outbound call to the Time-Stamp Authority you name, and it was exercised against a live Time-Stamp Authority on BOTH delivery vehicles — the npm path and, from inside the pushed `:0.33.0` Marketplace image, on 2026-08-08; retained images `:0.32.11` and earlier carry no `openssl`); air-gapped operation (offline licensing + offline CVE matching under `NSAUDITOR_OFFLINE_ONLY=1`) |

→ [Pricing](https://www.nsauditor.com/ai/pricing/)

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|-----------|
| SSRF block | Target is loopback/metadata/private | Set `NSA_ALLOW_ALL_HOSTS=1` for local scanning |
| License gate (`🔒`) | Pro/Enterprise tool on CE | Upgrade license or use CE alternative |
| Plugin timeout | Network unreachable / slow target | Increase `timeout` param or `PLUGIN_TIMEOUT_MS` |
| No DNS banner | Provider blocks CHAOS/TXT queries | Expected; not all DNS servers expose version |
| CPE format error | Malformed CPE string | Use `cpe:2.3:a:vendor:product:version:*:*:*:*:*:*:*` |
| No services found | Host down or heavily firewalled | Try `NSA_VERBOSE=true` to debug; check connectivity |
| AI analysis failed | Bad API key or provider down | Check `AI_PROVIDER` and API key env vars |

---

## MITRE ATT&CK Mapping

Findings are auto-tagged with MITRE techniques:

| Finding Type | Technique | ID |
|-------------|-----------|-----|
| SSH vulnerability | Remote Services: SSH | T1021.004 |
| SMB vulnerability | Remote Services: SMB | T1021.002 |
| FTP anonymous login | Valid Accounts | T1078 |
| DNS zone transfer | Gather Victim Network Info | T1590.002 |
| SNMP default community | Network Sniffing | T1040 |
| TLS weakness | Adversary-in-the-Middle | T1557 |
| Debug/stack trace exposure | Gather Victim Host Info | T1592 |
| Weak authentication | Brute Force | T1110 |

---

## Output Formats

| File | Format | Purpose |
|------|--------|---------|
| `scan_conclusion_raw.json` | JSON | Full unredacted scan data (admin) |
| `scan_conclusion_raw.html` | HTML | Admin dashboard with filters |
| `scan_response_ai_payload.json` | JSON | Redacted payload sent to AI |
| `scan_response_ai.html` | HTML | Styled report with CVE links, severity badges |
| `scan_response_ai.txt` | Markdown | AI vulnerability assessment (text) |
| SARIF | JSON | CI/CD integration (GitHub Advanced Security, Azure DevOps) |
| CSV | CSV | Tabular export of findings |
| JSONL | JSONL | Scan history for CTEM delta analysis |
