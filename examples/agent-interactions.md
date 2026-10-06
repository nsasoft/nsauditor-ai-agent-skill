# NSAuditor AI — Example Agent Interactions

Reasoning chains showing how an AI agent should use NSAuditor AI tools.

---

## Example 1: "Scan my router for vulnerabilities"

**Agent reasoning:** User wants a vulnerability check. `scan_host` finds the services and the service checks' flags;
it does NOT look up CVEs, so follow with `get_vulnerabilities` for each service whose `cpe` names a version.
192.168.1.1 is private: `scan_host` refuses it unless the MCP server's environment sets `NSA_ALLOW_ALL_HOSTS=1`.

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
   service-check findings the shared table grades, one per item — anonymous FTP login, zone transfer and the SMB null
   session (each only when its check is enabled), SNMP default community, weak SSH algorithms, weak TLS protocols /
   ciphers, dangerous HTTP methods, a self-signed or expired certificate, the MCP server flags and the 040 / 050 / 060
   audit entries. It holds no CVE lookup and no analysis-agent finding. A null `anonymousLogin` or `axfrAllowed` means
   the check was NOT TESTED (`anonymousLoginTested` / `axfrTested` say why — `opt-in-off` without FTP_CHECK_ANON /
   DNS_CHECK_AXFR), not that it passed.

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
   (`NSA_ALLOW_ALL_HOSTS=1 nsauditor-ai scan --host 192.168.1.1`, Enterprise package + Pro/Enterprise licence).
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
   • 003 Port Scanner — TCP connect + UDP probe of the default port set (config/services.json; --ports adds more)
   [... full list ...]

   Discovery (6):
   • 025 DB Scanner — MySQL/MariaDB, MSSQL, PostgreSQL, Oracle TNS, MongoDB handshakes (no Redis probe)
   [... etc ...]
```

---

## Example 3: "Check if port 443 on example.com has weak TLS"

**Agent reasoning:** Targeted TLS probe — `probe_service` (Pro) with the TLS Scanner. It returns 011's raw result;
`weakProtocols` / `weakCiphers` are computed only when a scan concludes and sit on its service records
(`scan_host`), so read the negotiated versions and ciphers here.

```
1. probe_service({ host: "example.com", pluginName: "011", port: 443 })
   → { id: "011", name: "TLS Scanner", result: {
         up: true, program: "TLS", version: null,
         data: [
           { probe_port: 443, probe_service: "https", probe_info: "TLS: TLSv1.2, TLSv1.3", …,
             tlsEvidence: { tls: true, supportedVersions: ["TLSv1.2", "TLSv1.3"],
               ciphers: { "TLSv1.2": "ECDHE-RSA-AES256-GCM-SHA384", "TLSv1.3": "TLS_AES_256_GCM_SHA384" },
               certExpiry: "…", certSelfSigned: false } },
           …  one row per port of TLS_SCANNER_PORTS (default 443, 465, 563, 993, 995): 011 ignores the port argument
         ] } }
   A result of { up: false, timedOut: true, … } means 011 ran out of the MCP server's PLUGIN_TIMEOUT_MS (default 30000)
   before finishing its ports: no result, not "no TLS". TLS_SCANNER_PORTS=443 in the server env limits it to 443.

2. Analysis: no deprecated version negotiated (no TLSv1 / TLSv1.1 in supportedVersions; SSLv3 is not probed);
   cipher acceptance was not enumerated (one negotiated cipher per version), so this is not a statement that no
   weak cipher is accepted.
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

Run it with NSA_ALLOW_ALL_HOSTS=1 (the range is private) and your own public webhook URL: the CLI exits 2 at
start-up if the URL does not resolve or resolves to a private, loopback or link-local address.
  NSA_ALLOW_ALL_HOSTS=1 nsauditor-ai scan --host 192.168.1.0/24 --plugins all \
    --watch --interval 15 \
    --webhook-url https://your-webhook.example.com/alerts \
    --alert-severity high

This rescans every 15 minutes; a [ScanHistory] line per host compares its scan with the previous one (counts of
new, removed and changed services; the findings delta; each service-check finding that appeared, cleared or could
not be compared). The webhook alerts a host whose scan changed since the previous cycle and that carries a finding
at or above --alert-severity — one detail per finding, each with its own grade; the first cycle sets the baseline and
alerts nobody, and --alert-every-cycle alerts every such host on every cycle. At high that is anonymous FTP login or a
DNS zone transfer (both off unless FTP_CHECK_ANON=true / DNS_CHECK_AXFR=true + DNS_AXFR_DOMAIN are set), an MCP
server finding, an SNMP default community, an expired certificate, an SMB null session (off unless
SMB_NULL_SESSION=true) or a HIGH entry of the 040 / 050 / 060 audits; Enterprise's CVE and analysis-agent findings
never trigger it.

Each scan appends one line per host to scan_history.jsonl in the output directory (--out, default out/)."
```

---

## Example 6: "Audit DNS security for example.com" — `probe_service` (Pro) with plugin 060 (`scan_host` on the domain returns 060's findings too, as `dnsSecurity`)

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
   → isError reply: {"error":"Scanning loopback, link-local, or metadata addresses is not allowed via MCP"}

2. Agent response:
   "NSAuditor AI's MCP server refuses loopback, link-local and cloud-metadata addresses in any spelling — written
   as the target, or returned for a host name, where every answer is checked — with or without NSA_ALLOW_ALL_HOSTS
   in its environment; that variable admits private ranges only. That limits what an agent can reach when the
   scanner is exposed as an MCP tool.

   To scan your own machine, use the CLI with the guard lifted (without the variable the CLI refuses it too:
   'Scanning blocked address range is not allowed: 127.0.0.1'):
     NSA_ALLOW_ALL_HOSTS=1 nsauditor-ai scan --host 127.0.0.1

   Only set it for legitimate local auditing."
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

**Agent reasoning:** User wants a comprehensive security assessment with AI analysis. 192.168.1.1 is private:
`scan_host` refuses it unless the MCP server's environment sets `NSA_ALLOW_ALL_HOSTS=1`; the CLI commands below
carry it.

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

   Scope: scan_host's service checks — the TLS-certificate, DNS-security and debug-endpoint audits and the HTTP
   methods included, where those plugins ran — plus an NVD lookup per service whose cpe names a version. No analysis
   agents, no exploit intelligence — for those, run `NSA_ALLOW_ALL_HOSTS=1 nsauditor-ai scan --host 192.168.1.1` with
   the Enterprise package and a Pro/Enterprise licence. Anonymous FTP, zone transfer and the SMB null session were not
   tested (FTP_CHECK_ANON / DNS_CHECK_AXFR / SMB_NULL_SESSION were not set).

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
     AI_ENABLED=true AI_PROVIDER=ollama NSA_ALLOW_ALL_HOSTS=1 nsauditor-ai scan --host 192.168.1.1
```
