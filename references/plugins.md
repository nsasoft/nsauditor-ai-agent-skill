# NSAuditor AI — Plugin Catalog

Complete reference of all scanner plugins, organized by category.

---

## Core Scanners (17)

| ID | Name | Protocols | Ports | Priority | Requirements |
|----|------|-----------|-------|----------|-------------|
| 001 | Ping Checker | ICMP/ARP | — | 100 | — |
| 002 | SSH Scanner | TCP | 22 | 200 | host: up, tcp_open: [22] |
| 003 | Port Scanner | TCP/UDP | ~1000 ports | 150 | host: up |
| 004 | FTP Banner Check | TCP | 21 | 200 | host: up, tcp_open: [21] |
| 005 | Host Up Check | TCP/UDP | multi-probe | 110 | — |
| 006 | HTTP Probe | TCP | 80, 443 | 300 | host: up |
| 007 | SNMP Scanner | UDP | 161 | 300 | host: up |
| 008 | Result Concluder | Meta | — | 100000 | — (always runs last) |
| 009 | DNS Scanner | TCP/UDP | 53 | 300 | host: up |
| 010 | Webapp Detector | HTTP | 80, 443 | 400 | host: up |
| 011 | TLS Scanner | TCP | 443, 465, 563, 993, 995 | 350 | host: up, tcp_open |
| 012 | OpenSearch Scanner | HTTP | 9200 | 400 | host: up |
| 013 | OS Detector | Meta | — | 99000 | — (runs near-last) |
| 014 | NetBIOS/SMB Scanner | UDP/TCP | 137, 445 | 300 | host: up |
| 015 | SUN RPC Scanner | TCP/UDP | 111 | 300 | host: up |
| 016 | WS-Discovery | UDP | 3702 | 300 | host: up |
| 024 | TCP SYN Scanner | TCP (Nmap) | configurable | 140 | nmap installed, root/sudo |

### Plugin Details

**001 — Ping Checker:** ICMP echo with ARP fallback. Extracts TTL-based OS hints
(TTL 64 = Linux, 128 = Windows, 255 = network device). Falls back to TCP SYN on
port 80/443 if ICMP is blocked (`PING_FALLBACK=true`).

**002 — SSH Scanner:** Parses SSH protocol banner to extract program + version.
Detects weak key exchange algorithms (`diffie-hellman-group1-sha1`) and weak ciphers
(`aes128-cbc`, `3des-cbc`). Reports `weakAlgorithms[]` and `weakCiphers[]`.

**003 — Port Scanner:** Bulk TCP connect scan (~1000 common ports) with optional
UDP probing. Banner sniffing on open ports. Results feed into port-gated plugins.

**004 — FTP Banner Check:** FTP daemon enumeration. Detects anonymous login,
extracts program/version from FTP banner (220 response).

**005 — Host Up Check:** Multi-probe reachability: ICMP echo → TCP SYN (80, 443) →
UDP (53, 161). More thorough than Ping Checker for firewalled hosts.

**006 — HTTP Probe:** Extracts HTTP response headers (`Server`, `X-Powered-By`),
detects redirects, extracts server tokens for vendor/program identification.

**007 — SNMP Scanner:** Queries sysDescr, sysObjectID, sysName via `public` community.
Extracts hardware model, firmware version, and OS details from OID responses.

**008 — Result Concluder:** Meta-plugin that fuses ALL plugin outputs into a single
normalized `conclusion` object with `host{}`, `services[]`, and `evidence[]`. Always
runs last (priority 100000). Resolves conflicts via `authoritative` flag.

**009 — DNS Scanner:** Sends `version.bind` CHAOS TXT query to extract DNS server
version (ISC BIND, PowerDNS, etc.). Also performs A/AAAA record lookups.

**010 — Webapp Detector:** Uses Wappalyzer fingerprinting engine to identify web
technologies: CMS (WordPress, Drupal), frameworks (React, Angular), servers (Apache,
nginx), CDNs, analytics, and more.

**011 — TLS Scanner:** Probes for supported TLS protocol versions (SSLv3, TLSv1.0,
TLSv1.1, TLSv1.2, TLSv1.3) and cipher suites. Flags deprecated protocols and weak
ciphers. Timeout configurable via `TLS_SCANNER_TIMEOUT_MS`.

**012 — OpenSearch Scanner:** Detects Elasticsearch/OpenSearch instances. Extracts
cluster name, version, and underlying OS/Java info from the `GET /` endpoint.

**013 — OS Detector:** Meta-plugin that derives the most likely OS from ALL collected
evidence: TTL hints, SSH banners, HTTP headers, SNMP sysDescr, NetBIOS, MAC vendor
OUI lookup. Runs at priority 99000 (after all probes, before Concluder).

**014 — NetBIOS/SMB Scanner:** NetBIOS name service enumeration (UDP 137) and SMB2
detection (TCP 445). Optionally attempts null session (`SMB_NULL_SESSION=true`) to
enumerate shares and domain info.

**015 — SUN RPC Scanner:** Queries RPC portmapper (port 111) to enumerate registered
RPC services. Detects NFS, mountd, and other RPC-based services.

**016 — WS-Discovery:** Web Services Discovery protocol scanner. Sends WS-Discovery
probe messages to detect SOAP/WS-enabled devices on the network.

**024 — TCP SYN Scanner:** Nmap wrapper for half-open (SYN) scanning. Requires Nmap
installed and root/sudo privileges. Enable with `ENABLE_SYN_SCAN=true`. Faster and
stealthier than the TCP connect scanner (003).

---

## Discovery Plugins (6)

| ID | Name | Protocol | Purpose |
|----|------|----------|---------|
| 025 | DB Scanner | TCP | Database service detection (MySQL, PostgreSQL, Redis, MongoDB, etc.) |
| 026 | ARP Scanner | ARP | Layer 2 MAC resolution, OUI vendor lookup, OS hints from vendor |
| 027 | mDNS/Bonjour Scanner | mDNS | Local Bonjour/mDNS service discovery, friendly device names |
| 028 | UPnP/SSDP Scanner | SSDP | UPnP device discovery via SSDP, description XML parsing |
| 029 | DNS-SD Scanner | DNS-SD | DNS-based Service Discovery announcements |
| 030 | LLMNR Scanner | LLMNR | Link-local Multicast Name Resolution (Windows networks) |

### Discovery Plugin Details

**025 — DB Scanner:** Connects to common database ports and fingerprints the service
from handshake responses. Detects MySQL (3306), PostgreSQL (5432), Redis (6379),
MongoDB (27017), and others.

**026 — ARP Scanner:** Resolves IP to MAC via ARP request. Performs OUI vendor lookup
to identify device manufacturer. Vendor name feeds into OS Detector for OS hints
(e.g., "Apple" → macOS, "Ubiquiti" → Linux).

**027 — mDNS/Bonjour Scanner:** Multicast DNS query for `.local` service announcements.
Discovers friendly device names, service types (e.g., `_http._tcp`, `_ssh._tcp`),
and IoT devices broadcasting on the LAN.

**028 — UPnP/SSDP Scanner:** Sends M-SEARCH multicast to discover UPnP devices.
Parses device description XML for manufacturer, model, firmware version.

**029 — DNS-SD Scanner:** DNS-based Service Discovery. Enumerates `_services._dns-sd._udp`
zone to find advertised services.

**030 — LLMNR Scanner:** Link-Local Multicast Name Resolution. Detects Windows hosts
responding to LLMNR queries (useful for Windows network enumeration and detecting
LLMNR poisoning risk).

---

## Pro Plugins (3)

| ID | Name | Ports | Purpose |
|----|------|-------|---------|
| 040 | TLS Certificate & Cipher Auditor | 443, 465, 993, 995, 8443 | Deep TLS audit: cert chain, expiry, weak ciphers, HSTS |
| 050 | TRIBE v2 Probe | 80, 443 | Detect debug info leaks, stack traces, verbose errors, CORS misconfig |
| 060 | DNS Security Auditor | 53 | SPF/DKIM/DMARC validation, DNSSEC, zone transfer, MX security, CAA |

### Pro Plugin Details

**040 — TLS Certificate & Cipher Auditor:** Goes beyond the basic TLS Scanner (011)
with full certificate chain validation, expiration warnings, certificate transparency
log checks, HSTS header verification, and a comprehensive weak cipher inventory.
Generates findings for: expired certs, self-signed certs, missing HSTS, weak key
sizes (<2048-bit RSA), and deprecated cipher suites.

**050 — TRIBE v2 Probe:** Targeted Reconnaissance for Information and Bug Enumeration.
Sends crafted requests to detect: stack traces in error responses, debug mode
indicators (`X-Debug`, `X-Powered-By` with version), CORS misconfiguration (wildcard
origins, credential leaking), verbose error messages, exposed admin panels, directory
listings, and default pages.

**060 — DNS Security Auditor:** Comprehensive DNS security assessment:
- **SPF:** Validates Sender Policy Framework record syntax and coverage
- **DKIM:** Checks for DKIM selector records
- **DMARC:** Validates DMARC policy (reject/quarantine/none)
- **DNSSEC:** Checks for DNSSEC signing and validation chain
- **Zone Transfer (AXFR):** Tests if zone transfer is allowed (security risk)
- **MX Security:** Validates mail exchange records and TLS support
- **CAA Records:** Checks Certificate Authority Authorization records

---

## Enterprise Plugins (4)

| ID | Name | Tier | Purpose |
|----|------|------|---------|
| 020 | AWS Cloud Scanner | Enterprise | Security group analysis, IAM policy review, S3 bucket checks |
| 021 | GCP Cloud Scanner | Enterprise | Firewall rule audit, IAM bindings, project-level security |
| 022 | Azure Cloud Scanner | Enterprise | NSG rule analysis, RBAC review, resource exposure |
| 023 | Zero Trust Checker | Enterprise | Network segmentation, encryption posture, identity verification scoring |

---

## Execution Order

Plugins run in strict priority order (lower number = runs first):

```
1. Ping Checker (100)           → Establish basic reachability
   Host Up Check (110)          → Multi-probe reachability confirmation
                                          ↓
2. TCP SYN Scanner (140)        → Half-open port discovery (if Nmap available)
   Port Scanner (150)           → TCP connect + UDP bulk scan
                                          ↓
3. SSH Scanner (200)            → SSH banner + weak algorithms
   FTP Banner (200)             → FTP daemon + anonymous login
                                          ↓
4. HTTP Probe (300)             → Web server headers + tokens
   SNMP Scanner (300)           → sysDescr + device info
   DNS Scanner (300)            → version.bind + records
   NetBIOS/SMB (300)            → NetBIOS names + SMB2 detection
   SUN RPC (300)                → RPC portmapper enumeration
   WS-Discovery (300)           → SOAP/WS device discovery
   TLS Scanner (350)            → TLS versions + cipher suites
                                          ↓
5. Webapp Detector (400)        → Technology fingerprinting (Wappalyzer)
   OpenSearch Scanner (400)     → Elasticsearch/OpenSearch detection
                                          ↓
6. OS Detector (99000)          → Fuse all evidence into OS determination
                                          ↓
7. Result Concluder (100000)    → Merge all results into final conclusion
```

**Auto-skip rules:** Plugins with unmet `requirements` are automatically skipped. For
example, SSH Scanner (requires `tcp_open: [22]`) skips if the Port Scanner didn't find
port 22 open. This avoids wasted probes and reduces scan time.
