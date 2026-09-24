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
          "cpe": "cpe:2.3:a:openbsd:openssh:8.9p1:*:*:*:*:*:*:*"
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
  "pluginsRan": 55,
  "markdown": "# NSAuditor AI Scan Report …"
}
```

- `conclusion.result.summary` is a **one-line string**, not an object.
- `conclusion.result.services[]` has one record per discovered or probed service; each carries its own
  `evidence[]` and, where one could be built, a `cpe` for `get_vulnerabilities`.
- `manifest[]` is every plugin's run status: `ran`, `skipped` (with its `reason`), `timeout` or
  `error`. A `timeout` or `error` means that surface was **NOT measured** — never read it as clean.
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
  anonymousLogin?: boolean;     // FTP anonymous login detected
  axfrAllowed?: boolean;        // DNS zone transfer allowed
  community?: string;           // SNMP community string detected ("public"|"private")
  dangerousMethods?: string[];  // HTTP methods like "PUT", "DELETE", "TRACE"
  weakAlgorithms?: string[];    // SSH weak key exchange algorithms
  weakCiphers?: string[];       // TLS/SSH weak ciphers
  weakProtocols?: string[];     // Deprecated TLS versions ("TLSv1", "TLSv1.1")
  cves?: string[];              // CVEs directly detected by plugin
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
    host: "up",                        // "up" = skip if host unreachable
    tcp_open: [443],                   // Skip if any listed port is closed
    udp_open: [161],                   // UDP port requirement
    only_if_os_unknown: true           // Skip if OS already detected
  },

  // Main probe function
  async run(host, port, opts = {}) {
    // opts.context = {
    //   lookupVendor(mac),             // OUI vendor lookup helper
    //   probableOsFromVendor(vendor),  // OS hint from vendor name
    //   openTcpPorts: Set<number>,     // Ports found open by Port Scanner
    //   openUdpPorts: Set<number>,
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
| 100–110 | Discovery | Ping Checker (100), Host Up (110) |
| 140–150 | Port Scanning | TCP SYN (140), Port Scanner (150) |
| 200 | Targeted Service | SSH (200), FTP (200) |
| 300–400 | Deep Probes | HTTP (300), SNMP (300), TLS (350), Webapp (400) |
| 99000 | OS Detection | OS Detector (meta — fuses all hints) |
| 100000 | Conclusion | Result Concluder (always last — fuses all into final output) |

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

**Most rows:** `description` — the analysis agents' own findings omit it: `auth_agent` · `config_agent` · `crypto_agent` · `exposure_agent` · `service_agent`. The CVE engine's rows and every coverage-gap record carry it.

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
| `AUTH` | Authentication checks: anonymous access, default credentials, password and cleartext logins |
| `CRYPTO` | Transport-encryption checks: TLS versions, cipher suites, certificates, cleartext protocols |
| `CONFIG` | Configuration checks: version disclosure, directory listing, debug endpoints, exposed legacy services |
| `SERVICE` | End-of-life software checks |
| `EXPOSURE` | Exposure checks: database, management and lateral-movement ports |
| `CVE` | CVE matches from NVD for a detected program and version, and the engine's coverage-gap notes |

### Finding Statuses

| Status | Meaning |
|--------|---------|
| `UNVERIFIED` | Detected by a scanner. **Every row a scan writes carries this status.** |
| `VERIFIED` | Reserved for the planned Verification Engine. No shipped code sets it. |
| `POTENTIAL` | Reserved for the planned Verification Engine. No shipped code sets it. |
| `FALSE_POSITIVE` | Reserved. No shipped code sets it on a queued row. (An operator suppression marks a compliance *violation* as a false positive — a different object, in the compliance pack.) |

> **The Verification Engine is planned, not shipped** (withdrawn as a capability claim at EE
> 0.32.7). Read `UNVERIFIED` as "this is what the scanner detected", never as "this was tried and
> could not be confirmed".

---

## CVE Response Schema (`get_vulnerabilities` output)

```json
{
  "cpe": "cpe:2.3:a:openbsd:openssh:8.9p1:*:*:*:*:*:*:*",
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

```json
{
  "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
  "version": "2.1.0",
  "runs": [{
    "tool": {
      "driver": {
        "name": "nsauditor-ai",
        "version": "0.1.10",
        "rules": [
          {
            "id": "tls-deprecated-protocol",
            "shortDescription": { "text": "Deprecated TLS protocol version supported" },
            "defaultConfiguration": { "level": "error" }
          }
        ]
      }
    },
    "results": [
      {
        "ruleId": "tls-deprecated-protocol",
        "level": "error",
        "message": { "text": "Port 443 accepts TLSv1.0 connections" },
        "locations": [{
          "physicalLocation": {
            "artifactLocation": { "uri": "192.168.1.1" },
            "region": { "startLine": 443 }
          }
        }]
      }
    ]
  }]
}
```

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

When `OPENAI_REDACT=true` (default), data is sanitized before AI submission:

| Data Type | Redaction | Level |
|-----------|-----------|-------|
| Private IPv4 (10.x, 172.16-31.x, 192.168.x) | `[REDACTED]` | Standard |
| Public IPv4 | `[IP]` | Standard |
| IPv6 link-local (fe80::) | `[FE80::/64]` | Standard |
| MAC addresses | `[MAC]` | Standard |
| Email addresses | `[REDACTED_EMAIL]` | Standard |
| Internal hostnames (.local, .corp, .internal) | `[REDACTED_HOST]` | Standard |
| SNMP community strings | `[REDACTED_HIDDEN]` | Standard |
| Serial numbers | `[REDACTED_HIDDEN]` | Standard |
| Bearer tokens | `[REDACTED_BEARER]` | Strict |
| AWS access keys (AKIA/ASIA) | `[REDACTED_AWS_KEY]` | Strict |
| File paths (.conf, .pem, .key) | `[REDACTED_PATH]` | Strict |
| Keys matching CONFIDENTIAL_KEYWORDS | `[REDACTED_HIDDEN]` | Standard |

Keys dropped entirely: `IP6`, `deviceWebPage`, `hardwareVersion`, `firmwareVersion`.

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
- Retention: Community keeps **7 days** (older lines are pruned after each scan); Pro and Enterprise keep
  every line. Neither is configurable.
