# NSAuditor AI — Data Schemas

Complete data structures for all MCP tool inputs and outputs.

---

## Scan Result Schema (`scan_host` output)

`scan_host` returns the plugin run itself, with the Result Concluder's fused record inside it:

```json
{
  "host": "192.168.1.1",
  "conclusion": {
    "id": "008",
    "name": "Result Concluder",
    "result": {
      "summary": "Host is UP — OS: Linux — Open: ssh/22, http/80",
      "host": {
        "up": true,
        "os": "Linux",
        "osVersion": null,
        "name": null
      },
      "services": [
        {
          "port": 22,
          "protocol": "tcp",
          "service": "ssh",
          "program": "OpenSSH",
          "version": "8.9p1",
          "status": "open",
          "info": null,
          "banner": "SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4",
          "source": "ssh",
          "evidence": [
            {
              "probe_protocol": "tcp",
              "probe_port": 22,
              "probe_info": "banner grab",
              "response_banner": "SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.4"
            }
          ],
          "cpe": "cpe:2.3:a:openbsd:openssh:8.9:p1:*:*:*:*:*:*"
        }
      ],
      "evidence": [
        {
          "from": "Ping Checker",
          "protocol": "icmp",
          "port": 0,
          "status": null,
          "info": "Ping did not confirm host up"
        }
      ],
      "source_count": 26,
      "os_source": "013"
    }
  },
  "manifest": [
    {
      "id": "003",
      "name": "Port Scanner",
      "status": "ran",
      "reason": null,
      "duration_ms": 6016
    },
    {
      "id": "070",
      "name": "MCP Scanner",
      "status": "timeout",
      "reason": "Plugin \"MCP Scanner\" timed out after 30000ms",
      "duration_ms": 30001
    }
  ],
  "pluginsRan": 1,
  "markdown": "# NSAuditor AI Scan Report …"
}
```

- `conclusion.result.summary` is a **one-line string**, not an object.
- `conclusion.result.services[]` has one record per discovered or probed service; each carries its own
  `evidence[]` and, where one could be built, a `cpe` for `get_vulnerabilities`.
- `manifest[]` is every plugin's run status: `ran`, `skipped` (with its `reason`), `timeout` or
  `error`. A `timeout` or `error` means that surface was **NOT measured** — never read it as clean.
- `pluginsRan` is the number of `manifest[]` entries whose status is `ran` — in this example, one of the two entries
  shown. It counts plugins, never ports or results.
- There is **no `findings` array** in a `scan_host` result, and no `techniques`: the CLI adds ATT&CK
  techniques to its own report, and this tool does not.

---

## ServiceRecord Interface

Each plugin's `conclude()` method returns an array of ServiceRecord objects. The Result
Concluder merges these into the final `services[]` array.

```typescript
interface ServiceRecord {
  port: number;
  protocol: "tcp" | "udp";
  service: string;              // e.g. "ssh", "http", "dns", "snmp"
  program: string | null;       // e.g. "OpenSSH", "nginx", "BIND"
  version: string | null;       // e.g. "8.9p1", "1.24.0"
  status: "open" | "closed" | "filtered" | "unknown";
  info: string | null;          // Additional info string
  banner: string | null;        // Raw banner text
  source: string;               // Plugin name that produced this record
  evidence: Evidence[];         // Raw probe data array
  authoritative: boolean;       // Takes precedence over other sources for this port

  // Optional fields (populated by specific plugins)
  anonymousLogin?: boolean | null; // FTP anonymous login detected — tested only with FTP_CHECK_ANON=true; null = NOT TESTED
  anonymousLoginTested?: true | string | null; // true when measured, else why not: "opt-in-off" · "no-answer"
  axfrAllowed?: boolean | null; // DNS zone transfer allowed — tested only with DNS_CHECK_AXFR=true + DNS_AXFR_DOMAIN; null = NOT TESTED
  axfrTested?: true | string | null; // true when measured, else why not: "opt-in-off" · "no-domain" · "no-answer"
  community?: string | null;    // SNMP DEFAULT community accepted: "public" or "private"; a custom SNMP_COMMUNITY string is never recorded
  communityCustom?: boolean;    // true when a custom SNMP_COMMUNITY string answered — not a finding
  communitiesTried?: string[] | null; // the communities tried, as labels (a custom string reads "custom")
  dangerousMethods?: string[] | null; // HTTP probe (006): the dangerous methods an Allow header listed; null when methodsTested is false
  methodsTested?: boolean;      // 006: true only when an Allow header was read — false is NOT TESTED, never "none"
  allowedMethods?: string[] | null; // 006: every method the Allow header listed
  headers?: object;             // 006: { "strict-transport-security" } only, on the port-443 HTTPS record, only where a response arrived
  nullSessionAllowed?: boolean | null; // NetBIOS/SMB (014) — tested only with SMB_NULL_SESSION=true; null = NOT TESTED
  nullSessionTested?: true | string | null; // true when measured, else why not: "opt-in-off" · "no-answer"
  shares?: string[];            // 014: the shares a null session listed
  certAudit?: object;           // the TLS-certificate audit (040) of this port — its issues[] graded at 040's own grades
  tribeHealth?: object;         // the debug-endpoint audit (050), on the 8080 record — { state, severity, findings[] }
  dnsSecurity?: object;         // the DNS-security audit (060) of the scanned name — here on a 53/udp record, else in the conclusion's evidence[]
  weakAlgorithms?: string[];    // SSH weak key-exchange, cipher and MAC names, together in one array (002)
  weakCiphers?: string[];       // TLS weak ciphers (the negotiated cipher per version)
  certSelfSigned?: boolean;     // TLS certificate is self-signed (011)
  weakProtocols?: string[];     // Deprecated TLS versions ("TLSv1", "TLSv1.1")
  cpe: string | null;           // built from program + version — pass to get_vulnerabilities when it names a concrete version
  mcpAnonymousAccess?: boolean; // MCP server answers without auth (070)
  mcpCleartextTransport?: boolean; // MCP over HTTP, not HTTPS (070)
  mcpDeprecatedProtocol?: string;  // MCP protocol version older than current (070)
  mcpAnonymousToolList?: string[]; // tools/list answered without auth — up to 20 tool names (070)
  mcpInspectorExposed?: boolean;   // MCP Inspector reachable on a non-loopback address (070)
  // There is NO `cves` field on a service record: scan_host looks no CVEs up, and the CLI scan's CVE mapper (Enterprise
  // package + Pro licence) writes its rows to scan_finding_queue.json, never onto a service. Use get_vulnerabilities on `cpe`.
}

interface Evidence {
  probe_protocol: "tcp" | "udp" | "icmp" | "arp";
  probe_port: number;
  probe_info: string;           // e.g. "banner grab", "SYN scan"
  response_banner: string;      // Raw response from target
}
```

---

## Plugin Interface

Every scanner plugin exports a standard interface:

```javascript
export default {
  id: "0xx",                           // 3-digit string ID (unique)
  name: "Scanner Name",                // Human-readable name
  description: "What it probes",       // Short purpose description
  priority: 300,                       // Execution order (lower = first)
  protocols: ["tcp"],                  // Protocols this plugin probes
  ports: [443, 8443],                  // Default ports to check

  requirements: {                      // All optional; unmet = plugin skips
    host: "up",                        // "up" = skip unless an earlier plugin marked the host up;
                                       //   "down" = skip if one did
    tcp_open: [443],                   // Skip only if NONE of these is in context.tcpOpen; run() is then
                                       //   called once per listed port that is open
    udp_open: [161],                   // Same rule on context.udpOpen; if both are declared, each needs one open
    only_if_os_unknown: true           // Skip if OS already detected
  },

  // Main probe function
  async run(host, port, opts = {}) {
    // opts.context = {                 // in a network scan (CLI scan / scan_host); a probe_service call
    //                                  //   gets only the two helpers + effectiveTimeoutMs, so guard
    //                                  //   each read: opts.context?.tcpOpen instanceof Set
    //   lookupVendor(mac),             // OUI vendor lookup helper
    //   probableOsFromVendor(vendor),  // OS hint from vendor name
    //   host, hostUp: boolean,         // hostUp: an earlier plugin marked the host up
    //   tcpOpen: Set<number>,          // TCP ports found open by the plugins that ran before this one
    //   udpOpen: Set<number>,          // UDP ports, likewise
    //   pluginRunStatus: Map,          // id -> "ran" | "timeout" | "error" | "skipped" for each earlier plugin
    //                                  //   the scan selected — one skipped on its requirements or a missing
    //                                  //   capability reads "skipped"; no entry = the plugin was never requested
    //   effectiveTimeoutMs: number,    // the budget the manager races this run() against
    // }
    return {
      up: true,                        // Host reachability (for ping/host-up plugins)
      program: "my-service",           // Detected program name
      version: "1.0.0",               // Detected version
      os: "Linux",                     // OS hint (optional)
      type: "server",                  // Device type hint (optional)
      data: [{                         // Evidence array
        probe_protocol: "tcp",
        probe_port: 443,
        probe_info: "TLS handshake",
        response_banner: "TLSv1.3"
      }]
    };
  },

  // Adapter for Result Concluder (plugin 008)
  conclude({ result, host }) {
    // Transform raw run() output into ServiceRecord[]
    return [/* ServiceRecord[] */];
  },

  // Ports where this plugin's results take precedence
  authoritativePorts: new Set(["tcp:443", "tcp:8443"])
};
```

### Priority Ranges

| Range | Category | Examples |
|-------|----------|---------|
| 10–25 | Discovery | Ping Checker (10), TCP SYN (12), Host Up (20, only if the host is not yet up), ARP (25) |
| 30 | Port Scanning | Port Scanner (30) |
| 40–70 | Targeted Service | FTP (40), SSH (50), Webapp (55), HTTP (60), DB (62), SNMP (70), MCP (70) |
| 220–360 | Deep Probes | DNS Security (220), TRIBE (300), DNS (340), NetBIOS / mDNS (345), LLMNR / UPnP (346), DNS-SD (347), SUN RPC (350), TLS (350), OpenSearch (360) |
| 365 | OS Detection | OS Detector (reads only the outputs of plugins that ran before it) |
| 400–450 | After OS Detection | WS-Discovery (400), TLS Certificate & Cipher Auditor (450) |
| 100000 | Conclusion | Result Concluder (always last — fuses all into final output) |

These are the priorities CE's plugins export; `list_plugins` returns each plugin's live priority.

---

## Finding Schema (the Pro / Enterprise finding queue)

Pro and Enterprise write a network host's findings to `scan_finding_queue.json` in that host's scan
directory: the CVE engine's rows, the analysis agents' rows, and their coverage-gap records. Community
never writes a queue. A CVE row, which carries every field:

```json
{
  "id": "F-e36aa296-e81d-4986-a5ed-66cc36897c06",
  "category": "CVE",
  "status": "UNVERIFIED",
  "title": "CVE-2020-25681 — udp/dns",
  "description": "A flaw was found in dnsmasq before version 2.83. A heap-based buffer overflow …",
  "severity": "HIGH",
  "cvss": 8.1,
  "target": {
    "host": "192.168.1.1",
    "port": 53,
    "protocol": "udp",
    "service": "dns",
    "program": "dnsmasq",
    "version": "2.78"
  },
  "evidence": {
    "source": "intelligence_engine",
    "cve": [
      "CVE-2020-25681"
    ],
    "mitre": [
      "T1590.002 — Gather Victim Network Information: DNS"
    ],
    "raw": {
      "cpe": "cpe:2.3:a:thekelleys:dnsmasq:2.78:*:*:*:*:*:*:*",
      "cvssVector": "CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H",
      "published": "2021-01-20T17:15:00.000"
    }
  },
  "remediation": {
    "summary": "Update dnsmasq 2.78 to a patched version. See CVE-2020-25681.",
    "effort": "MEDIUM",
    "references": [
      "https://nvd.nist.gov/vuln/detail/CVE-2020-25681"
    ]
  },
  "riskScore": 0.49,
  "kev": false,
  "knownRansomwareCampaignUse": null,
  "kevMatchedCve": null,
  "kevAsOf": "2026-09-18T19:00:05.0974Z",
  "kevStoreState": "fresh",
  "epssScore": 0.81191,
  "epssPercentile": 0.99616,
  "epssMatchedCve": "CVE-2020-25681",
  "epssAsOf": "2026-09-20T12:00:23Z",
  "epssModelVersion": "v2026.06.15",
  "epssStoreState": "fresh",
  "exploitPriority": "ELEVATED",
  "exploitPriorityReason": null
}
```

**Every row:** `id` · `category` · `status` · `title` · `severity` · `cvss` · `target` · `evidence` · `remediation` · `riskScore`

**Most rows:** `description` — three analysis agents' own findings omit it: `auth_agent` · `config_agent` · `crypto_agent`. The CVE engine's rows, the exposure agent's rows (since Enterprise 1.3.0: the service its title no longer names), the service agent's rows (since Enterprise 1.3.0: the version its title no longer names) and every coverage-gap record carry it.

**CVE-bearing rows, once KEV / EPSS data is loaded:** `kev` · `knownRansomwareCampaignUse` · `kevMatchedCve` · `kevAsOf` · `kevStoreState` · `epssScore` · `epssPercentile` · `epssMatchedCve` · `epssAsOf` · `epssModelVersion` · `epssStoreState` · `exploitPriority` · `exploitPriorityReason`

- `id` is `F-<uuid-v4>`, assigned when the row is queued.
- `target` is `{ host, port, protocol, service, program, version }`; `evidence` is `{ source, cve[], mitre[], raw }`,
  where `raw` belongs to the producer (a CVE row's `cpe`, `cvssVector`, `published`; a coverage-gap row's
  `evidenceGap`, `gapClass`, …); `remediation` is `{ summary, effort, references[] }` on every row.
- `evidence.cwe[]` and `evidence.owasp[]` are accepted by the validator, but no shipped producer emits them.

**Severities:** `CRITICAL` · `HIGH` · `MEDIUM` · `LOW` · `INFO`

### Finding Categories

| Category | What produces it |
|----------|------------------|
| `AUTH` | Authentication checks: Telnet open (cleartext logins), default SNMP community (`public` / `private`); anonymous FTP only with `FTP_CHECK_ANON=true` |
| `CRYPTO` | Transport-encryption checks: TLS versions, cipher suites, certificates, cleartext protocols |
| `CONFIG` | Configuration checks: default SNMP community (`public` / `private`); RPC / NetBIOS open on a Linux host |
| `SERVICE` | End-of-life software checks |
| `EXPOSURE` | Exposure checks: database, management and lateral-movement ports |
| `CVE` | CVE matches from NVD for a detected program and version, and the engine's coverage-gap notes |

### Finding Statuses

| Status | Meaning |
|--------|---------|
| `UNVERIFIED` | **Every row of the finding queue carries this status**, `[COVERAGE GAP]` rows included, so it says nothing about a row. |
| `VERIFIED` | Reserved. No shipped code sets it; the Verification Engine that would have is WITHDRAWN and not planned. |
| `POTENTIAL` | Reserved. No shipped code sets it; the Verification Engine that would have is WITHDRAWN and not planned. |
| `FALSE_POSITIVE` | Reserved. No shipped code sets it on a queued row. (An operator suppression marks a compliance *violation* as a false positive — a different object, in the compliance pack.) |

> **The Verification Engine is WITHDRAWN and not planned** (withdrawn as a capability claim at EE
> 0.32.7; no release schedules it). Read `UNVERIFIED` as "this is what the scanner detected", never as "this was tried and
> could not be confirmed".

---

## CVE Response Schema (`get_vulnerabilities` output)

```json
{
  "cpe": "cpe:2.3:a:openbsd:openssh:8.9:p1:*:*:*:*:*:*",
  "totalResults": 1,
  "cves": [
    {
      "cveId": "CVE-2023-38408",
      "description": "PKCS#11 feature in ssh-agent allows remote code execution...",
      "cvssScore": 9.8,
      "severity": "CRITICAL",
      "vectorString": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
      "published": "2023-07-20T03:15:10.170",
      "lastModified": "2023-08-01T00:00:00.000"
    }
  ]
}
```

- The CVSS fields (`cvssScore`, `severity`, `vectorString`) are NVD's v3.1 metric, else v3.0; a CVE with
  neither carries `null` in all three.
- `totalResults` counts the CVEs **returned** — after `maxResults`, if one was passed.

---

## SARIF Output Schema (CI/CD Integration)

Captured from the Community writer (`utils/sarif.mjs`) over one open FTP service with anonymous login; the version is
the installed Community's. The file is written to the output directory as `scan_results.sarif.json`.

```json
{
  "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/main/sarif-2.1/schema/sarif-schema-2.1.0.json",
  "version": "2.1.0",
  "runs": [{
    "tool": {
      "driver": {
        "name": "nsauditor",
        "version": "<Community version>",
        "informationUri": "https://github.com/nsasoft/nsauditor-ai",
        "rules": [
          { "id": "vsftpd:3.0.5", "shortDescription": { "text": "ftp service detected" },
            "helpUri": "https://github.com/nsasoft/nsauditor-ai", "properties": { "severity": "Info" } },
          { "id": "ftp-anonymous-login", "shortDescription": { "text": "FTP anonymous login enabled" },
            "helpUri": "https://github.com/nsasoft/nsauditor-ai", "properties": { "severity": "Critical" } }
        ]
      }
    },
    "results": [
      { "ruleId": "vsftpd:3.0.5", "level": "note",
        "message": { "text": "Service ftp detected on 192.168.1.1:21/tcp. Program: vsftpd. Version: 3.0.5. Status: open" },
        "locations": [{ "physicalLocation": { "artifactLocation": { "uri": "192.168.1.1" } } }] },
      { "ruleId": "ftp-anonymous-login", "level": "error",
        "message": { "text": "FTP anonymous login enabled on 192.168.1.1:21/tcp. ftp on 192.168.1.1:21/tcp accepts anonymous authentication." },
        "locations": [{ "physicalLocation": { "artifactLocation": { "uri": "192.168.1.1" } } }] }
    ]
  }]
}
```

The file carries one `note` result per service (an open port is inventory) plus one result per graded service-check
finding — the same findings, at the same grades, that `--fail-on` and the Markdown report read
(`references/workflows.md` §4), the TLS, SNMP, MCP, certificate, SMB null-session and 040 / 050 / 060 audit results
included — and no CVE or analysis-agent results. Anonymous FTP, zone transfer and the SMB null session appear only when
`FTP_CHECK_ANON` / `DNS_CHECK_AXFR` / `SMB_NULL_SESSION` enabled those checks. The rule ids of the four flags SARIF
graded before Community 0.2.57 are unchanged.

#### SARIF Severity Mapping

| NSAuditor Severity | SARIF Level |
|-------------------|-------------|
| CRITICAL | error |
| HIGH | error |
| MEDIUM | warning |
| LOW | note |
| INFO | note |

Compatible with: GitHub Advanced Security, Azure DevOps, SonarQube, and other SARIF
2.1.0 consumers.

---

## Redaction Pipeline Schema

When `OPENAI_REDACT=true` (default), the CLI's AI stage (`AI_ENABLED=true`) redacts the scan payload it sends —
`host`, `host_os_hint`, `summary`, `services`, `evidence` — with Community's built-in redactor, at every tier
(the Pro-tier external-redactor hook is installed by neither package):

| Data | Becomes |
|------|---------|
| The scanned host (the `host` field) | `[REDACTED_HOST]` |
| Private IPv4 (10.x, 172.16-31.x, 192.168.x) in `summary` | `[REDACTED_HOST]` |
| Private IPv4 in `services` / `evidence` | `[REDACTED_IP]` |
| Any other IPv4 (public, loopback, …) | `[IP]` |
| IPv6 link-local (`fe80::…`) | `[FE80::/64]` |
| Other IPv6 — runs of three or more groups only; a short `::` form such as `2001:db8::1` passes unchanged | `[IPv6]` |
| MAC addresses written with colons (`aa:bb:cc:dd:ee:ff`); hyphen and dotted forms pass unchanged | `[MAC]` |
| Serial numbers (text `Serial:` / `Serial=`; keys `serial`, `serialNumber`, `sn`, in any case) | `[REDACTED_HIDDEN]` |
| Values under keys containing a `CONFIDENTIAL_KEYWORDS` entry (unset by default: no key scrub) | `[REDACTED_HIDDEN]` |

Keys dropped entirely: `ip6`, `deviceWebPage`, `deviceWebPageInstruction`, `hardwareVersion`, `firmwareVersion`.

⚠️ **NOT redacted in that payload:** email addresses, internal hostnames (`.local`, `.corp`, `.internal`), the SNMP
`community` field, Bearer tokens, AWS access keys and file paths — nor ports, service names, versions, or banner and
evidence prose beyond the rows above. `OPENAI_REDACT` has no strict level. `CONFIDENTIAL_KEYWORDS` works by KEY
(`community` blanks the `community` field, not the same value inside banner or evidence text). With Ollama at its
default localhost URL the payload does not leave the host.

With the Enterprise package and a Pro or Enterprise licence, a run with findings also prepends a findings block to
the prompt. That block alone is scrubbed by pattern, whatever `OPENAI_REDACT` says: emails → `[REDACTED_EMAIL]`,
`name.internal` / `.local` / `.corp` / `.lan` / `.intra` / `.priv` → `[REDACTED_HOSTNAME]`, private-address URLs →
`[REDACTED_URL]`, `community=…` → `community=[REDACTED]`, colon-form MACs → `[REDACTED_MAC]`, private and loopback
IPv4 → `[host-N]` (unless `REDACT_INTERNAL_IPS=false`), the host on each finding's Target line → `[target-N]`; with
`NSA_AI_REDACT_LEVEL=strict`, also `/dir/file` paths ending `.conf`, `.log`, `.ini`, `.cfg`, `.env`, `.key`, `.pem`
or `.crt` → `[REDACTED_PATH]`, AWS keys → `[REDACTED_AWS_KEY]` and Bearer tokens → `[REDACTED_BEARER]`.

---

## Scan History Schema (JSONL)

Every scan appends one line per host to `scan_history.jsonl` in its output directory (`--out`, default `out/`):

```jsonl
{"timestamp":"2026-09-24T01:32:08.915Z","host":"192.168.1.1","servicesCount":12,"openPorts":[21,22,53,80,443],"os":"Embedded Linux","findingsCount":64,"findingsCountBasis":"loader-shaped-v2","tier":"enterprise","cloudFindingsCount":0,"services":[{"port":22,"protocol":"tcp","service":"ssh","version":"8.2p1"}]}
{"timestamp":"2026-09-24T01:20:45.180Z","host":"aws","servicesCount":0,"openPorts":[],"os":null,"findingsCount":139,"findingsCountBasis":"loader-shaped-v2","tier":"enterprise","cloudFindingsCount":159,"services":[]}
```

- `findingsCountBasis` and `tier` say what `findingsCount` counted. The scan-to-scan diff refuses to compare
  two lines whose basis or tier differs, or whose tier is unknown, rather than reading the change as new
  or resolved findings.
- `cloudFindingsCount` is the raw number of findings the plugins returned (evidence gaps and scope
  statements included); `findingsCount` is the report loader's shaped count, so the raw figure can exceed it.
- Since Community 0.2.57 a line also carries `flagsBasis` (`"service-flags-v1"`), `hostFlags` and `hostChecks` (a
  domain's DNS-security audit), and each service entry `flags` (the comparison identity of each service-check finding,
  e.g. `"weakAlgorithms:diffie-hellman-group1-sha1"`) and `checks` (per check that applies, `true` when measured, else
  the reason it was not). The `[ScanHistory]` diff reads them: a finding gone reads CLEARED only where its check was
  measured this run, else NOT COMPARED with the reason. The two example lines above were written before them.
- Retention: Community keeps **7 days** (older lines are pruned after each scan); Pro and Enterprise keep
  every line. Neither is configurable.
