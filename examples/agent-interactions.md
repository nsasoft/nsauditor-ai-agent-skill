# NSAuditor AI — Example Agent Interactions

Reasoning chains showing how an AI agent should use NSAuditor AI tools.

---

## Example 1: "Scan my router for vulnerabilities"

**Agent reasoning:** User wants a vulnerability check. `scan_host` finds the services and the service checks' flags;
it does NOT look up CVEs, so follow with `get_vulnerabilities` for each service whose `cpe` names a version.

```
1. scan_host({ host: "192.168.1.1" })
   → { host, conclusion: { result: {
         summary: "Host is UP — OS: Linux — Open: ssh/22, dns/53, snmp/161 (+1 more open)",
         host: { up: true, os: "Linux" },
         services: [
           { port: 22, protocol: "tcp", service: "ssh", program: "OpenSSH", version: "8.9p1", cpe: "cpe:2.3:a:openbsd:openssh:8.9:p1:*:*:*:*:*:*" },
           { port: 53, protocol: "udp", service: "dns", program: "dnsmasq", version: "2.89", cpe: "cpe:2.3:a:thekelleys:dnsmasq:2.89:*:*:*:*:*:*:*" },
           { port: 161, protocol: "udp", service: "snmp", program: "Unknown", version: "Unknown", cpe: null, community: "public" },
           { port: 443, protocol: "tcp", service: "https", program: "lighttpd", version: "1.4.69", cpe: "cpe:2.3:a:lighttpd:lighttpd:1.4.69:*:*:*:*:*:*:*" }
         ] } },
       manifest: [ … ], pluginsRan: …, markdown: "… **Security findings:** 1 (High: 1) …" }
   There is no findings array: the SNMP flag is `community` on the service record, and the markdown's count is the
   flags it counts — anonymous FTP login, zone transfer, SNMP default community, weak TLS protocols / ciphers, weak SSH
   algorithms. It does NOT count the MCP server flags (read `mcp*` off the service records yourself), and it holds no CVE
   lookup, no analysis-agent finding and no 006 / 014 / 040 / 050 / 060 result. No `anonymousLogin` on a service and a
   null `axfrAllowed` mean those checks were NOT RUN (they need FTP_CHECK_ANON / DNS_CHECK_AXFR), not that they passed.

2. get_vulnerabilities({ cpe: "cpe:2.3:a:openbsd:openssh:8.9:p1:*:*:*:*:*:*" })
   → CVE-2023-38408 (CRITICAL 9.8), CVE-2023-48795 (MEDIUM 5.9)

3. get_vulnerabilities({ cpe: "cpe:2.3:a:thekelleys:dnsmasq:2.89:*:*:*:*:*:*:*" })
   → CVE-2023-50387 (HIGH 7.5) — KeyTrap DNS vulnerability

4. get_vulnerabilities({ cpe: "cpe:2.3:a:lighttpd:lighttpd:1.4.69:*:*:*:*:*:*:*" })
   → No known CVEs

5. Present findings sorted by severity, and state the limit:
   CRITICAL: CVE-2023-38408 — OpenSSH ssh-agent RCE (upgrade to 9.3p2+)
   HIGH: CVE-2023-50387 — dnsmasq KeyTrap DoS (upgrade to 2.90+)
   HIGH: SNMP default community string 'public' (change the community string)
   MEDIUM: CVE-2023-48795 — SSH Terrapin attack (upgrade OpenSSH)
   INFO: SNMP on port 161 has no version — manual investigation recommended
   Scope: scan_host's service checks plus an NVD lookup per service whose cpe names a version. Anonymous FTP and zone
   transfer were not tested; the analysis agents and exploit intelligence run only in the CLI scan
   (`nsauditor-ai scan --host 192.168.1.1`, Enterprise package + Pro/Enterprise licence).
```

---

## Example 2: "What plugins does NSAuditor have?"

**Agent reasoning:** Simple metadata query — use `list_plugins`.

```
1. list_plugins()
   → Return formatted list grouped by category:

   Core Scanners (17):
   • 001 Ping Checker — ICMP/ARP reachability + TTL OS hints
   • 002 SSH Scanner — SSH banner, version, weak algorithms
   • 003 Port Scanner — TCP/UDP bulk scan (~1000 ports)
   [... full list ...]

   Discovery (6):
   • 025 DB Scanner — MySQL, PostgreSQL, Redis detection
   [... etc ...]
```

---

## Example 3: "Check if port 443 on example.com has weak TLS"

**Agent reasoning:** Targeted single-service probe — use `probe_service` with TLS scanner.

```
1. probe_service({ host: "example.com", pluginName: "011", port: 443 })
   → Result: {
       program: "nginx",
       version: "1.24.0",
       data: [{
         probe_info: "TLS handshake",
         tls_versions: ["TLSv1.2", "TLSv1.3"],
         ciphers: ["TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256"],
         weakProtocols: [],
         weakCiphers: []
       }]
     }

2. Analysis: No deprecated TLS versions found. TLSv1.0 and TLSv1.1 are NOT
   supported. All cipher suites are strong (AES-256-GCM, ChaCha20).
   Verdict: TLS configuration is secure.
```

---

## Example 4: "Is Log4j 2.14.1 vulnerable?"

**Agent reasoning:** Direct CVE lookup — no scan needed. Construct CPE and query.

```
1. get_vulnerabilities({
     cpe: "cpe:2.3:a:apache:log4j:2.14.1:*:*:*:*:*:*:*",
     maxResults: 10
   })
   → [
       CVE-2021-44228 (Log4Shell) — CRITICAL 10.0 — RCE via JNDI injection
       CVE-2021-45046 — CRITICAL 9.0 — Incomplete fix for Log4Shell
       CVE-2021-45105 — HIGH 7.5 — DoS via crafted lookup
       CVE-2021-44832 — MEDIUM 6.6 — RCE via JDBC appender
     ]

2. Present with urgency: "Log4j 2.14.1 is critically vulnerable to Log4Shell
   (CVE-2021-44228, CVSS 10.0) which enables remote code execution. Upgrade
   immediately to Log4j 2.17.1+ or migrate to a maintained logging framework."
```

---

## Example 5: "Set up continuous monitoring for my subnet"

**Agent reasoning:** CTEM is a CLI feature, not available via MCP. Advise with the
correct CLI command.

```
Agent response:
"Continuous monitoring uses the CLI's watch mode (not available via MCP tools).

Run:
  nsauditor-ai scan --host 192.168.1.0/24 --plugins all \
    --watch --interval 15 \
    --webhook-url https://your-webhook.example.com/alerts \
    --alert-severity high

This rescans every 15 minutes, detects changes (new/removed services, version
changes, new findings), and sends webhook alerts for high+ severity changes.

Each scan appends one line per host to scan_history.jsonl in the output directory (--out, default out/)."
```

---

## Example 6: "Audit DNS security for example.com" — `probe_service` (Pro) with plugin 060 (`scan_host` runs 060 but does not return its findings)

**Agent reasoning:** Use the DNS Security Auditor plugin for comprehensive DNS assessment.

```
1. probe_service({ host: "example.com", pluginName: "060", port: 53 })
   → Result (060's shape: per-area arrays of { severity, check, detail }, plus the records it read):
     {
       audit_type: "dns_security", overallSeverity: "medium",
       findings: {
         spf:    [{ severity: "pass",   check: "spf_hardfail",        detail: "SPF uses \"-all\" (hardfail) — good policy" }],
         dmarc:  [{ severity: "pass",   check: "dmarc_policy_reject", detail: "DMARC policy is \"reject\" — strongest enforcement" }],
         dkim:   [],
         dnssec: [{ severity: "medium", check: "no_dnssec",           detail: "No DNSSEC deployment detected (no DNSKEY or DS records) — …" }],
         axfr: [], mx: [], caa: [], ns: [], wildcard: [], cname: []
       },
       details: { spfRecord: "v=spf1 include:_spf.google.com -all", dmarcRecord: "v=DMARC1; p=reject; …",
                  dkimSelectors: ["google"], nameservers: [ … ], mxRecords: [ … ], dnssec: { hasDNSKEY: false, hasDS: false } },
       summary: { totalChecks: …, actionable: 1, high: 0, medium: 1, pass: 2, … }
     }

2. Present findings:
   ✅ SPF ends in -all (hardfail)
   ✅ DKIM selector found (google)
   ✅ DMARC policy set to 'reject' (strongest setting)
   ⚠  DNSSEC not enabled (recommended for integrity)
   ✅ Zone transfer not reported open (060 tries AXFR only against the domain's nameservers)
   Note: 060's MX checks flag a missing MX, a null MX, and an MX that is a CNAME or an IP address — it does not test
   STARTTLS / TLS on the mail servers.
```

---

## Example 7: Error Handling — SSRF Block

**Agent reasoning:** User asked to scan localhost, which triggers SSRF protection.

```
1. scan_host({ host: "127.0.0.1" })
   → Error: "SSRF protection: loopback addresses are blocked"

2. Agent response:
   "NSAuditor AI blocks scanning of loopback addresses (127.x.x.x) as a security
   measure. This prevents SSRF attacks when the scanner is exposed as an MCP tool.

   If you need to scan your local machine, you have two options:
   1. Use the CLI directly: nsauditor-ai scan --host 127.0.0.1
   2. Set NSA_ALLOW_ALL_HOSTS=1 in the MCP server's environment

   Note: Only enable this for legitimate local auditing, never in production
   MCP deployments."
```

---

## Example 8: Error Handling — License Gate

**Agent reasoning:** User requested a Pro feature on Community Edition.

```
1. User: "Check vulnerabilities for OpenSSH 8.9"

2. get_vulnerabilities({ cpe: "cpe:2.3:a:openbsd:openssh:8.9:p1:*:*:*:*:*:*" })
   → Error: "🔒 get_vulnerabilities requires a Pro license"

3. Agent response:
   "CVE lookup via NSAuditor requires a Pro license. Here are your options:

   1. View Pro/Enterprise pricing: https://www.nsauditor.com/ai/pricing/
   2. Set NSAUDITOR_LICENSE_KEY in your MCP server environment
   3. Manual lookup: search nvd.nist.gov for 'openssh 8.9' directly

   Meanwhile, I can still run scan_host (available in Community Edition) to
   detect the service and identify potential risks from the scan evidence."
```

---

## Example 9: Host audit over MCP, then the CLI for the agents and the CVE mapper

**Agent reasoning:** User wants a comprehensive security assessment with AI analysis.

```
1. Confirm: "I'll scan 192.168.1.1. Do you have authorization to audit this host?"
   → User confirms

2. scan_host({ host: "192.168.1.1" })
   → 4 services detected, 2 findings

3. get_vulnerabilities for each versioned service
   → 5 CVEs found across 2 services

4. Present consolidated report:

   ═══════════════════════════════════════
   Security Audit Report: 192.168.1.1
   ═══════════════════════════════════════

   Scope: scan_host's service checks + an NVD lookup per service whose cpe names a version. No analysis agents, no
   exploit intelligence — for those, run `nsauditor-ai scan --host 192.168.1.1` with the Enterprise package and a
   Pro/Enterprise licence. No TLS-certificate / DNS-security / debug-endpoint / HTTP-method results — for those, run
   probe_service (Pro) with 040 / 060 / 050 / 006; the CLI scan's reports do not carry them either (only its raw
   per-plugin results in scan_conclusion_raw.json do). Anonymous FTP and
   zone transfer were not tested (FTP_CHECK_ANON / DNS_CHECK_AXFR were not set).

   Host: Linux (Ubuntu 22.04)
   Services: 4 (SSH, DNS, HTTPS, SNMP)
   Findings: 7 total (1 Critical, 1 High, 3 Medium, 2 Info)

   CRITICAL FINDINGS:
   • CVE-2023-38408 (CVSS 9.8) — OpenSSH ssh-agent RCE
     → Upgrade OpenSSH from 8.9p1 to 9.3p2+

   HIGH FINDINGS:
   • CVE-2023-50387 (CVSS 7.5) — dnsmasq KeyTrap DoS
     → Upgrade dnsmasq from 2.89 to 2.90+

   [... continued ...]

   For AI-enhanced analysis with remediation priorities, enable AI:
     AI_ENABLED=true AI_PROVIDER=ollama nsauditor-ai scan --host 192.168.1.1
```
