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

## Finding Schema

Structured finding format used across all tiers:

```json
{
  "id": "F-<uuid-v4>",
  "category": "AUTH | CRYPTO | CONFIG | SERVICE | EXPOSURE | CVE",
  "severity": "CRITICAL | HIGH | MEDIUM | LOW | INFO",
  "status": "UNVERIFIED | VERIFIED | POTENTIAL | FALSE_POSITIVE",
  "title": "Short descriptive title",
  "description": "Detailed explanation of the finding",
  "target": {
    "host": "192.168.1.1",
    "port": 22,
    "protocol": "tcp"
  },
  "evidence": {
    "banner": "OpenSSH_7.4",
    "version": "7.4p1 Debian",
    "detectionMethod": "SSH banner grabbing",
    "verification": {
      "probeType": "safe-connect",
      "timestamp": "2026-04-11T12:00:00Z",
      "result": "confirmed"
    }
  },
  "remediation": {
    "action": "Upgrade OpenSSH to 9.x+",
    "priority": "HIGH",
    "timeline": "Immediate"
  },
  "cwe": "CWE-326",
  "mitre_attack": ["T1021.004"],
  "cves": ["CVE-2023-38408"],
  "verified": false,
  "confidence": "high | medium | low"
}
```

### Finding Categories

| Category | Description | Examples |
|----------|-------------|---------|
| `AUTH` | Authentication weaknesses | Default credentials, anonymous login, weak auth |
| `CRYPTO` | Encryption / TLS issues | Weak ciphers, deprecated TLS, expired certificates |
| `CONFIG` | Misconfigurations | Debug mode, dangerous HTTP methods, CORS misconfig |
| `SERVICE` | Service-level risks | Exposed management ports, known CVEs |
| `EXPOSURE` | Network exposure | Internet-facing services, broadcast protocols |
| `CVE` | Known CVE matches | NVD-confirmed vulnerabilities |

### Finding Statuses

| Status | Meaning |
|--------|---------|
| `UNVERIFIED` | Detected by a scanner. **This is the status every finding carries today** — see the WITHDRAWN note below. |
| `VERIFIED` | Reserved for the planned Verification Engine. No shipped code sets it. |
| `POTENTIAL` | Reserved for the planned Verification Engine. No shipped code sets it. |
| `FALSE_POSITIVE` | Set by an operator suppression, not by a probe. |

> **The Verification Engine is planned, not shipped** (withdrawn as a capability claim at EE
> 0.32.7). The status field and its risk-weighting scaffolding exist — which is why the enum
> is documented here — but the probe machinery that would populate `VERIFIED` / `POTENTIAL`
> is WITHDRAWN and does not ship. Read `UNVERIFIED` as "this is what the scanner detected", never as
> "this was tried and could not be confirmed".

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

Each line in `.scan_history/` is one scan record:

```jsonl
{"timestamp":"2026-04-11T12:00:00Z","host":"192.168.1.1","pluginsRan":25,"services":8,"findings":3,"conclusion":{...}}
{"timestamp":"2026-04-11T13:00:00Z","host":"192.168.1.1","pluginsRan":25,"services":8,"findings":2,"conclusion":{...}}
```

Used for CTEM delta/trend analysis. CE retains 7 days; Pro/Enterprise configurable.
