# NSAuditor AI — Workflow Recipes

Multi-step patterns for common security audit scenarios.

---

## 1. Full Security Audit

The most common MCP workflow: a scan followed by a CVE lookup per service. It is NOT the CLI's full analysis: the
Enterprise analysis agents and exploit intelligence run only in `nsauditor-ai scan --host <target>` (Enterprise package +
Pro/Enterprise licence). `scan_host` does return the 040 / 050 / 060 audits (`certAudit`, `tribeHealth`, `dnsSecurity`).

```
Step 1: list_plugins()
        → Understand available scanners, confirm what will run

Step 2: scan_host({ host: "<target>" })
        → Returns the run: conclusion.result (summary, host, services[]) and manifest[]
        → A `timeout` or `error` in manifest[] means that surface was NOT measured

Step 3: For each service with a `cpe` naming a concrete version (or a program + version to build one from):
        → Use its `cpe` as returned, or construct: cpe:2.3:a:<vendor>:<product>:<version>:<update>:*:*:*:*:*:*
          (a suffixed version splits into version and update: OpenSSH 8.9p1 → 8.9:p1; otherwise update is *)
        → A service with a version but `cpe: null` is outside the scanner's CPE table: construct one, or report
          its CVE coverage as unknown — never as clean
        → get_vulnerabilities({ cpe: "<constructed_cpe>" })
        → An EMPTY result is not a clean service. A returned `cpe` can spell the vendor differently from the guide
          below (the scanner's table has nginx as `nginx:nginx`, the guide `f5:nginx`): retry with the guide's
          spelling, and report what came back as "no CVEs returned for <cpe>", never as clean

Step 4: Correlate CVEs with the services they were built from
        → Present prioritized list: Critical → High → Medium → Low
        → Include remediation guidance for each finding
```

### CPE Construction Guide

Map detected program names to CPE vendor:product notation:

| Detected Program | Detected Version | CPE String |
|------------------|------------------|------------|
| OpenSSH | 8.9p1 | `cpe:2.3:a:openbsd:openssh:8.9:p1:*:*:*:*:*:*` (the suffix is the `update` field) |
| Apache httpd | 2.4.54 | `cpe:2.3:a:apache:http_server:2.4.54:*:*:*:*:*:*:*` |
| nginx | 1.24.0 | `cpe:2.3:a:f5:nginx:1.24.0:*:*:*:*:*:*:*` |
| OpenSSL | 3.0.8 | `cpe:2.3:a:openssl:openssl:3.0.8:*:*:*:*:*:*:*` |
| ISC BIND | 9.18.12 | `cpe:2.3:a:isc:bind:9.18.12:*:*:*:*:*:*:*` |
| vsftpd | 3.0.5 | `cpe:2.3:a:beasts:vsftpd:3.0.5:*:*:*:*:*:*:*` |
| ProFTPD | 1.3.8 | `cpe:2.3:a:proftpd:proftpd:1.3.8:*:*:*:*:*:*:*` |
| Samba | 4.17.5 | `cpe:2.3:a:samba:samba:4.17.5:*:*:*:*:*:*:*` |
| MySQL | 8.0.32 | `cpe:2.3:a:oracle:mysql:8.0.32:*:*:*:*:*:*:*` |
| PostgreSQL | 15.2 | `cpe:2.3:a:postgresql:postgresql:15.2:*:*:*:*:*:*:*` |
| Redis | 7.0.8 | `cpe:2.3:a:redis:redis:7.0.8:*:*:*:*:*:*:*` |
| MongoDB | 6.0.4 | `cpe:2.3:a:mongodb:mongodb:6.0.4:*:*:*:*:*:*:*` |
| Elasticsearch | 8.7.0 | `cpe:2.3:a:elastic:elasticsearch:8.7.0:*:*:*:*:*:*:*` |
| Log4j | 2.14.1 | `cpe:2.3:a:apache:log4j:2.14.1:*:*:*:*:*:*:*` |

**Tips:**
- If vendor is ambiguous, try NVD search with just the product name first
- Use `a` (application) for software, `o` (OS) for operating systems, `h` (hardware) for devices
- Strip Debian/Ubuntu suffixes from versions (e.g., `8.9p1` not `8.9p1 Ubuntu-3ubuntu0.4`)

---

## 2. Targeted Service Investigation (Pro)

Deep-dive into a single service when you know the target port.

```
Step 1: probe_service({ host: "<target>", pluginName: "<id>", port: <port> })
        → Raw plugin output with full evidence

Step 2: From the probe result, extract program + version
        → get_vulnerabilities({ cpe: "<constructed_cpe>" })

Step 3: Analyze evidence for specific weaknesses:
        - SSH: weak algorithms (weakAlgorithms[])
        - TLS (011): data[].tlsEvidence — supportedVersions and the ciphers map (one negotiated cipher per version;
          weakProtocols / weakCiphers are computed only when a scan concludes, onto its service records)
        - FTP: anonymous login (anonymousLogin — tested only with FTP_CHECK_ANON=true on the server)
        - SNMP: default community strings (community)
        - HTTP: dangerous methods (dangerousMethods[])
```

### Plugin Selection for Targeted Probes

| Plugin ID | Name | Best For |
|-----------|------|----------|
| 002 | SSH Scanner | SSH banner, version, key exchange, weak algorithms |
| 004 | FTP Banner | FTP daemon identification, anonymous login check (only with `FTP_CHECK_ANON=true`) |
| 006 | HTTP Probe | Web server headers, tokens, redirects |
| 007 | SNMP Scanner | Device info, hardware, firmware via SNMP |
| 009 | DNS Scanner | DNS server version (CHAOS query) |
| 010 | Webapp Detector | Technology stack fingerprinting |
| 011 | TLS Scanner | TLS versions, the cipher negotiated per version |
| 012 | OpenSearch Scanner | Elasticsearch/OpenSearch detection |
| 014 | NetBIOS Scanner | SMB/NetBIOS enumeration |
| 015 | SUN RPC Scanner | NFS, portmapper services |
| 040 | TLS Cert & Cipher Auditor | Full certificate chain audit |
| 050 | TRIBE v2 Neural API Security Probe | Debug leaks, CORS misconfig on a TRIBE v2 API |
| 060 | DNS Security Auditor | SPF/DKIM/DMARC, DNSSEC |

---

## 3. Subnet Discovery

Map an entire network segment.

```bash
# CLI (recommended for subnet scanning). A private address (RFC 1918, CGNAT, link-local, loopback) is refused
# ("Scanning blocked address range is not allowed") unless NSA_ALLOW_ALL_HOSTS=1 is set:
NSA_ALLOW_ALL_HOSTS=1 nsauditor-ai scan --host 192.168.1.0/24 --plugins all --parallel 10

# Via MCP: iterate individual IPs (MCP doesn't support CIDR directly). scan_host refuses RFC 1918 addresses
# too, unless NSA_ALLOW_ALL_HOSTS=1 is in the MCP server's environment.
for each IP in range:
  scan_host({ host: "<ip>" })
```

**Note:** For large subnets, use the CLI with `--parallel` to limit concurrent scans
and avoid network congestion. The MCP server processes one scan at a time.

---

## 4. CI/CD Pipeline Integration

`--fail-on <severity>` reads every finding the shared service-check table grades — one per item (a method, an
algorithm, a protocol, a cipher, an audit entry), the same findings at the same grades that the Markdown report, the
SARIF file and the CSV count. It is **not computed from the SARIF file**, but the two read one table, so they cannot
grade a finding differently:

| Finding in the scan's conclusion | `--fail-on` grade | SARIF level |
|---|---|---|
| anonymous FTP login · DNS zone transfer — tested only with `FTP_CHECK_ANON=true` / `DNS_CHECK_AXFR=true` + `DNS_AXFR_DOMAIN`, both off by default | critical | error |
| MCP server reachable without authentication · MCP server lists its tools without authentication | critical | error |
| MCP server over cleartext HTTP · MCP server on a deprecated protocol version | high | error |
| SNMP default community (`public` / `private`) | high | error |
| SMB null session — tested only with `SMB_NULL_SESSION=true`; graded high provisionally | high | error |
| expired certificate, on a port the TLS-certificate auditor (040) did not audit | high | error |
| weak SSH algorithms · weak TLS protocols · weak TLS ciphers, one per item | medium | warning |
| dangerous HTTP methods, one per method — only where an Allow header was read | medium | warning |
| self-signed certificate, on a port 040 did not audit · MCP Inspector exposed | medium | warning |
| each actionable entry of the TLS-certificate, debug-endpoint and DNS-security audits (040 / 050 / 060) | the auditor's own grade | by that grade |
| any concluded scan; an open service is inventory | info — so `--fail-on info` fails every scan that concludes | `note`, one per service |

So a default scan can exit 1 at `--fail-on high` — an SNMP default community, an MCP server finding, an expired
certificate or a HIGH audit entry is enough — and a pipeline that passed on an earlier Community may fail on findings
that were always there. One expired certificate is graded once: High where only the TLS scanner (011) saw it,
Critical where 040 audited it. The gate does not read Enterprise's CVE rows or analysis-agent findings. Exit 0 is NOT a
clean host.

```bash
# Scan with SARIF output and severity gating. --fail-on high exits 1 on any graded finding at high or above (table
# above); anonymous FTP and zone transfer are graded only with FTP_CHECK_ANON=true / DNS_CHECK_AXFR=true + DNS_AXFR_DOMAIN.
nsauditor-ai scan --host $TARGET \
  --plugins all \
  --output-format sarif \
  --fail-on high \
  --out ./nsauditor-out

# Exit codes:
#   0 = no graded finding at or above the threshold — NOT a clean host
#   1 = a graded finding at or above the threshold
#   2 = unknown severity, or no scan produced a conclusion
```

The SARIF file is written into the output directory as `scan_results.sarif.json` (`scan_<host>.sarif.json` per host
when several hosts are scanned). Standard output carries the run's log, not SARIF, so redirecting it does not produce a
SARIF file.

### GitHub Actions Example

```yaml
- name: Security Scan
  env:   # both checks are off by default; without these --fail-on high never sees anonymous FTP or a zone transfer
    FTP_CHECK_ANON: "true"
    DNS_CHECK_AXFR: "true"
    DNS_AXFR_DOMAIN: example.com   # the zone to try transferring
  run: |
    npx nsauditor-ai scan --host ${{ env.TARGET_HOST }} \
      --output-format sarif \
      --fail-on high \
      --out nsauditor-out

- name: Upload SARIF
  if: always()   # the scan step exits 1 when the gate fires; upload the SARIF anyway
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: nsauditor-out/scan_results.sarif.json
```

---

## 5. Continuous Monitoring (CTEM)

Watch mode: every host is re-scanned on an interval and each scan is compared with that host's previous one. Its
webhook alerts a host whose scan changed and that carries a finding at or above `--alert-severity` — read what
triggers it before offering it.

```bash
# NSA_ALLOW_ALL_HOSTS=1 because the range is private (§3). Replace the webhook URL with your own PUBLIC one: the
# CLI checks it at start-up and exits 2 if it is not http(s), does not resolve, or resolves to a private, loopback
# or link-local address.
NSA_ALLOW_ALL_HOSTS=1 nsauditor-ai scan --host 192.168.1.0/24 --plugins all \
  --watch \
  --interval 15 \
  --webhook-url https://hooks.example.com/security \
  --alert-severity high
```

**Features:**
- Rescans on configurable interval (minutes; default 60); the first cycle runs at once
- Each host's scan is compared with that host's previous line in `scan_history.jsonl` and printed as a
  `[ScanHistory]` line: new, removed and changed services, the findings delta, and each service-check finding that
  appeared, cleared, was first observed or could not be compared (with the reason)
- Scan history appended to `scan_history.jsonl` in the output directory (`--out`, default `out/`), one line per host
- CE: 7-day retention; Pro/Enterprise: every line kept (neither is configurable)

**What triggers the webhook:**
- A host alerts when its scan CHANGED since the previous cycle — a service appeared, went or changed, its finding
  count moved, a service check alone changed, or the comparison could not be made — AND it carries at least one
  finding at or above `--alert-severity` (default `high`). The first cycle sets the baseline and alerts nobody;
  `--alert-every-cycle` alerts every host carrying such a finding on every cycle, the first included. Stdout prints
  each host's change under `=== Delta Report ===`, and `No significant changes detected.` only when no host changed.
- The findings are the service-check findings `--fail-on` and the reports grade (§4): anonymous FTP login or a DNS
  zone transfer (critical; both off unless `FTP_CHECK_ANON=true` / `DNS_CHECK_AXFR=true` + `DNS_AXFR_DOMAIN` are
  set), the MCP server checks, an SNMP default community, an expired certificate, an SMB null session (off unless
  `SMB_NULL_SESSION=true`), weak SSH algorithms and weak TLS protocols / ciphers, dangerous HTTP methods where an Allow
  header was read, a self-signed certificate, and each 040 / 050 / 060 audit entry at its own grade. Enterprise's CVE
  rows and analysis-agent findings are not among them, so they never trigger an alert.
- A host whose scan failed, or whose summary is missing on either side, is reported not comparable on stdout — never
  "No changes", never "removed" — and does not alert in this release.
- Watch mode scans each distinct host once per cycle: a repeated `--host` entry, or one also inside a listed CIDR, is
  dropped, and the banner says how many.
- The payload is not redacted: the host and its findings go in the clear to the URL you supply.

**Webhook Payload** (the change itself is NOT in it: `details` carries one entry per finding at or above
`--alert-severity` — `description` is the finding's title and `severity` its own grade, lower-case; a finding with no
port, such as a domain's DNS-security entry that landed in the conclusion's evidence, carries `port` and `protocol`
null. The top-level `severity` is the `--alert-severity` value):

```json
{
  "timestamp": "2026-04-11T12:00:00.000Z",
  "host": "192.168.1.20",
  "severity": "high",
  "findingsCount": 1,
  "summary": "1 finding(s) detected on 192.168.1.20 at severity high or above",
  "details": [{ "port": 21, "protocol": "tcp", "service": "ftp", "description": "FTP anonymous login enabled", "severity": "critical" }]
}
```

---

## 6. AI-Powered Vulnerability Report

Combine scan results with AI analysis using your own API keys. Both examples scan a private address, hence
`NSA_ALLOW_ALL_HOSTS=1` (§3); a public target does not need it.

### Local-Only Analysis (Ollama)

```bash
# With OLLAMA_BASE_URL unset, the AI call goes to http://localhost:11434/v1 and stays on this host. Scan-derived
# data can still reach a third party: at Pro and above, CVE matching queries NIST's NVD with the CPE of each
# detected service that local NVD data does not already answer, unless NSAUDITOR_OFFLINE_ONLY=1 (SKILL.md, ZDE).
AI_ENABLED=true AI_PROVIDER=ollama OLLAMA_MODEL=llama3 NSA_ALLOW_ALL_HOSTS=1 \
  nsauditor-ai scan --host 192.168.1.1 --plugins all
```

### Cloud AI Analysis (OpenAI / Claude)

```bash
# OPENAI_REDACT=true (default) masks the payload's host, IPv4 addresses, colon-form MACs and serials; emails, internal
# hostnames, SNMP community strings, Bearer tokens, AWS keys, file paths and other evidence text go as they are.
AI_ENABLED=true AI_PROVIDER=openai OPENAI_API_KEY=sk-... OPENAI_REDACT=true NSA_ALLOW_ALL_HOSTS=1 \
  nsauditor-ai scan --host 192.168.1.1 --plugins all
```

### Output Files Generated

| File | Purpose |
|------|---------|
| `scan_conclusion_raw.json` | Full unredacted data (admin reference) |
| `scan_conclusion_raw.html` | Admin HTML dashboard with filters |
| `scan_response_ai_payload.json` | Redacted payload sent to AI |
| `scan_response_ai.html` | Styled HTML report with CVE links, severity badges |
| `scan_response_ai.txt` | AI vulnerability assessment in markdown |
| `scan_run_<runId>.json` | **Per-run scan record** — written at the ROOT of `--out` (one level above the per-host folders) at run start, appended per host, finalized at the end. It is what `report` is built from, and what lets a report cover STATE its coverage (hosts requested / written / reachable) instead of implying it. On the free tier these are pruned after a retention window. |

### AI Prompt Modes

| Mode | Env Var | Behavior |
|------|---------|----------|
| `basic` | `OPENAI_PROMPT_MODE=basic` | Simple summary with next-action suggestions |
| `pro` | `OPENAI_PROMPT_MODE=pro` | Evidence-based analysis: Confirmed Vulns + Leads tables |
| `optimized` | `OPENAI_PROMPT_MODE=optimized` | Full reasoning framework with quality checks |

**Pro mode rules:**
- Only map CVEs when BOTH product AND version are in evidence
- Never speculate — quote exact banner lines as proof
- Preserve `[REDACTED_HIDDEN]` placeholders in output
- Treat Webapp Detector results as leads unless version confirmed

---

## 7. Comparing Scans (Pro)

Track security posture changes over time.

```
Step 1: CLI, the baseline run (sealed run record):
        nsauditor-ai scan --host <target> --out <dir>
Step 2: (time passes, changes made)
Step 3: CLI, the follow-up run, same --out:
        nsauditor-ai scan --host <target> --out <dir>
Step 4: CLI  nsauditor-ai report --from <dir> --format executive --since prior
        → new · resolved · changed · NOT COMPARABLE, each not-comparable row with its reason

There is no compare TOOL on the MCP surface, and the comparison is NEVER done by hand: a by-hand diff of
two outputs reads a finding that vanished for any reason other than a fix — a host or the finding's own plugin not run, a
port or probe not measured, a CVE lookup that failed, an agent that did not run, the vulnerability data
changing under the same program and version — as RESOLVED. `report --since` reads each of those as
NOT COMPARABLE with its reason, refuses the comparison outright when either run's chain is altered or cannot be
measured (naming which side), and says what it did not evaluate.
A finding on a port, region or producer a scan did not measure is not counted as fixed, and with SLA tracking on the control it failed is held FAILED — including the prior CVE rows on a service whose lookup failed, the CVE mapper's and the service agent's rows on a TCP port whose service the scan could not identify, and an analysis agent's or the CVE mapper's rows when a plugin they read was left out of the scan or did not complete. Two measured limits: a scan made before EE 1.3.0 could not record a plugin left out of it, so in a comparison with one, an agent's row that scan lacks is not refused — the report's Basis cell says so on the row; and a scan that discovered ports with the Nmap plugin (024) alone records no port oracle, so an analysis agent's or the CVE mapper's row on a port it did not measure can read RESOLVED and count as closed in MTTR, and the control it failed can read PASS — include the port scanner (003).

Read from its output:
  - New findings (unexpected exposure) — it compares FINDINGS, not services: a newly exposed service appears only if
    a check or agent recorded a finding on it
  - Resolved findings — only what it counts as resolved, each with its basis
  - The NOT-COMPARABLE list, before telling anyone what got fixed
```

---

## Decision Tree: Which Tool to Use

```
User wants to...
├── Scan a host comprehensively         → scan_host (services + service checks; NO CVE lookup —
│                                         follow with get_vulnerabilities (Pro) per service `cpe`, or the CLI scan)
├── Check a specific service/port       → probe_service (Pro)
├── Look up CVEs for software version   → get_vulnerabilities (Pro)
├── See available plugins               → list_plugins
├── Audit TLS certificates              → probe_service (Pro) with plugin 040, one port — or scan_host:
│                                         `certAudit` on each port 040 audited
├── Check DNS security (SPF/DKIM/DMARC) → probe_service (Pro) with plugin 060 — or scan_host on the domain name:
│                                         `dnsSecurity` (on the 53/udp record, else in the conclusion's evidence)
├── Detect debug leaks / CORS issues    → probe_service (Pro) with plugin 050 — or scan_host: `tribeHealth`,
│                                         only when TCP 8080 is open
├── Scan a subnet                       → CLI: --host CIDR --parallel N
│                                         (a private range needs NSA_ALLOW_ALL_HOSTS=1 — §3)
├── Set up continuous monitoring         → CLI: --watch --interval N
│                                         (its webhook alerts a changed host carrying a finding at or above
│                                         --alert-severity; never on the first cycle — §5)
├── Compare two scans                   → CLI (Pro): nsauditor-ai report --from <dir> --format executive --since prior
│                                         (not MCP; NEVER by hand)
├── State framework COVERAGE            → compliance_matrix (any tier)
├── Produce a compliance EVIDENCE PACK  → CLI: --compliance <fw> --out <dir> (not MCP)
├── Generate a formatted report         → CLI: --output-format sarif|csv|md (not MCP)
└── Produce a CLIENT-FACING report      → CLI (Pro): nsauditor-ai report --from <dir>
                                          --format executive  → self-contained print-ready HTML
                                                                (+ --brand <brand.json> for a branded cover)
                                          --format jira       → Jira-importer CSV
                                          --run <id> | --out <path> | --allow-partial
                                          exit 0 rendered · 1 fix the RUN · 2 fix the REQUEST
                                          ⚠️ TELL THE USER: the Jira import mapping is done in
                                          Jira and has NOT been verified against a live Jira
                                          instance, and the emitted CSV does not carry that
                                          caveat — you must hand it over with the file.
                                          ⚠️ --brand with --format jira is REFUSED, not ignored.
```

---

## Troubleshooting Workflows

### "scan_host returns no services"

1. Check host reachability: is the target online?
2. Is `NSA_ALLOW_ALL_HOSTS=1` set for private IP ranges?
3. Firewall may block all probes — try increasing timeout
4. Run with `NSA_VERBOSE=true` to see per-plugin output
5. Try targeted probe: `probe_service` on a known-open port

### "get_vulnerabilities returns empty"

1. Verify CPE format: `cpe:2.3:a:vendor:product:version:*:*:*:*:*:*:*`
2. Check vendor spelling matches NVD — also in a `cpe` scan_host returned: the scanner's table has nginx as
   `nginx:nginx`, the guide above `f5:nginx`; retry with the other spelling
3. NVD API rate limits apply — wait and retry if rate-limited
4. Not all software has NVD entries; absence ≠ safety

### "A CLI cloud scan says coverage UNVERIFIED and suggests checking credentials"

1. Read `pluginStatus` in `scan_conclusion_raw.json` before the summary. If every cloud plugin there is `"status": "skipped"` with `"reason": "missing capabilities: cloudScanners"`, the cause is the licence tier: the cloud plugins require an Enterprise licence, and a Community or Pro install skips all of them.
2. In that case the summary's advice ("Verify cloud credentials are configured and the CE platform is ≥ 0.1.30") names the wrong cause. This is a known limit of this release; the per-plugin skip reason is the true one. Do not tell the user to fix credentials.
3. The run is still correctly NOT a clean verdict: nothing was measured.
4. MCP `scan_cloud` does not reach this path; below Enterprise it refuses before scanning, with an upgrade message.

### "License gate (🔒) error"

1. `probe_service` and `get_vulnerabilities` require Pro license
2. Set `NSAUDITOR_LICENSE_KEY` environment variable
3. CE alternative: use `scan_host` (always available) + manual CVE research
4. Pro/Enterprise pricing: https://www.nsauditor.com/ai/pricing/
