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

## Enterprise Plugins (18)

> **EE plugin ID range.** As of EE 0.3.9 (2026-05-12), all EE plugins use the disjoint **1000+ ID range** to avoid CE collision. The earlier 020/021/022/023/030/040/050/060 IDs were renumbered to 1020/1021/1022/1023/1030/1040/1050/1060. CE reserves 001-099. EE plugins audit AWS / GCP / Azure cloud substrate end-to-end against the AICPA Trust Services Criteria 2017 (SOC 2) framework; every plugin is enterprise-gated by the `cloudScanners` capability and runs against customer-supplied cloud credentials.

| ID | Name | Tier | Purpose | SOC 2 Controls |
|----|------|------|---------|----------------|
| 1020 | AWS Cloud Scanner | Enterprise | S3 bucket hardening (PAB, encryption, versioning, Object Lock, MFA Delete, logging) | C1.1 / C1.2 / CC7.1 |
| 1021 | GCP Cloud Scanner | Enterprise | Firewall rule audit + IAM bindings + Storage bucket public-access | CC6.1 / CC6.6 / C1.1 |
| 1022 | Azure Cloud Scanner | Enterprise | NSG rule analysis + RBAC role assignments + Storage account hardening | CC6.1 / CC6.6 / C1.1 |
| 1023 | Zero Trust Checker | Enterprise | Segmentation + encryption + identity + lateral movement scoring (reads OBSERVED open ports) | CC6.6 |
| 1030 | AWS IAM Deep Auditor | Enterprise | Shadow-admin path detection via BFS over PassRole / AssumeRole / federated trust; restrictive-Condition allowlist (Auth0 / Okta / Cognito) | CC6.1 |
| 1040 | AWS CloudTrail Operational Integrity | Enterprise | Trail health + log-file validation + KMS-CMK; CloudWatch alarm coverage vs CIS AWS Foundations Benchmark v1.5 §3.1–3.14; cross-account S3 trail-destination WORM verification (SEC 17a-4 / FINRA 4511) | CC7.2 / CC7.3 |
| 1050 | AWS API Gateway Assurance | Enterprise | Per-method/route authorization classifier; custom-domain TLS policy; stage-level access logging / throttling / WAF; public-endpoint exposure; Lambda authorizer cross-reference via lambda:GetFunction | CC6.1 / CC6.6 / CC6.7 / CC7.1 / A1.2 |
| 1060 | AWS DynamoDB Audit Integrity | Enterprise | Per-table PITR + deletion protection + KMS-CMK; resource-policy presence; CloudTrail DynamoDB data-event coverage cross-reference (first PI1.5 evidence) | CC6.6 / CC7.1 / C1.1 / PI1.5 |
| 1070 | AWS KMS Auditor | Enterprise | Per-key rotation status; 5-tier wildcard-principal classifier (CRITICAL/HIGH/INFO/PASS) across Principal.AWS / Federated / Service / CanonicalUser; NotPrincipal-Allow + NotAction-Allow + glob-action support | CC6.3 / C1.1 |
| 1080 | AWS Lambda Security Auditor | Enterprise | Runtime EOL detection (case-normalized); public function-URL exposure; resource-policy permissive principals; env-var secret-suggestive name detection (ZDE-safe — names only, never values); VPC config; KMS-CMK; DLQ + reserved concurrency | CC6.1 / CC6.6 / CC7.1 / C1.1 |
| 1090 | AWS Secrets Manager + SSM Parameter Store Auditor | Enterprise | ListSecrets + DescribeSecret (rotation cadence, KMS-CMK, prod-tier tagging) + SSM DescribeParameters (String/SecureString + secret-suggestive name detection). ZDE-critical: NEVER calls GetSecretValue / GetParameter — only metadata APIs | CC6.1 / CC6.6 / C1.1 |
| 1100 | AWS CodePipeline + CodeBuild Operational Integrity | Enterprise | Pipeline source-stage encryption; CodeBuild `privilegedMode` detection; buildspec inlined-vs-S3 drift; secrets via env vars vs Secrets Manager; IAM role wildcard-Action; S3 artifact-store encryption; stale-execution detection | CC6.1 / CC7.1 / CC8.1 / C1.1 |
| 1110 | AWS IAM Effective Decrypt-Path Auditor | Enterprise | Cross-plugin reconciler: walks IAM policies for kms:Decrypt / kms:ReEncrypt / kms:GenerateDataKey grants and cross-references against destination KMS key policies (plugin 1070) to compute effective decrypt path; closes NotAction-implicit-decrypt false-PASS class | CC6.1 / CC6.6 / C1.1 / C1.2 |
| 1120 | AWS S3 Lifecycle + Cross-Region Replication Auditor | Enterprise | S3 lifecycle policy enumeration (CC7.1 retention-cadence) + cross-region replication topology (A1.2 DR substrate); destination-bucket reachability verification closes silent-PASS class where replication source FAILED but emitted clean | C1.1 / C1.2 / A1.2 |
| 1130 | AWS Backup Auditor — headline thread | Enterprise | The largest single-plugin institutional-hardening arc in the EE codebase (~7800 lines, 545 tests). Audits Plans + Vaults + Recovery Points + Selections + Frameworks + Restore Testing + ReportPlans + Legal Holds + VaultType + Vault Tags + Vault Access Policy. **12-dimension air-gapped vault attestation arc** for LogicallyAirGappedBackupVault: 6 cryptographic-isolation mechanisms (vault TYPE + ARN account-segment-separation + destination KMS key-policy clean + destination KMS Grants clean + MRK-replica topology clean + source-account VPC-endpoint policy clean) + 6 substrate dimensions (PITR/retention/encryption/RestoreTesting/Legal Holds/vault Access Policy) | CC6.3 / CC6.6 / CC7.1 / CC8.1 / C1.1 / C1.2 / A1.2 |
| 1140 | AWS RDS Auditor (v2 — extended in EE 0.4.5) | Enterprise | 7 SOC 2 substrate-evidence dimensions: Multi-AZ (A1.2) + storage encryption at rest with KMS-key custody classification + **kms:DescribeKey cross-reference promotes UNVERIFIABLE `:key/UUID` ARN shapes to deterministic PASS/MEDIUM** + parameter-group SSL enforcement (postgres rds.force_ssl + mysql require_secure_transport) + BackupRetentionPeriod (7-day baseline) + PubliclyAccessible + IAMDatabaseAuthenticationEnabled + snapshot encryption | A1.2 / CC6.1 / CC6.6 / C1.1 |
| 1150 | AWS SQS/SNS Auditor (NEW EE 0.4.4) | Enterprise | First multi-service plugin in EE codebase. 5 dimensions: SQS encryption at rest (SqsManagedSseEnabled OR KmsMasterKeyId; four-tier classification) + SQS transit-encryption policy (aws:SecureTransport Deny statement) + SNS topic encryption at rest + SNS topic-policy permissive-Principal (full NotAction-Allow + NotPrincipal-Allow + Resource-scope filtering per plugin 1070 + 1110 precedent) + SQS dead-letter queue presence (dual-mapped A1.2 + CC7.1) | C1.1 / CC6.6 / A1.2 / CC7.1 |
| 1170 | AWS EC2 SG Perimeter Auditor (v2 — extended in EE 0.4.6) | Enterprise | Orthogonal evidence to plugin 1023 zero-trust-checker (1023 reads OBSERVED open ports; 1170 reads DECLARED SG policy via DescribeSecurityGroups). 6 dimensions: IPv4 0.0.0.0/0 ingress to **RESTRICTED_PORTS (v2: 23 ports per CIS AWS Foundations v3.0)** — SSH/RDP/MS SQL/MySQL/Postgres/Redshift/Redis/Memcached/MongoDB/Elasticsearch/CouchDB/Docker/Kubelet/K8s-API/etcd/Kibana/InfluxDB/Kafka/Consul/ZooKeeper/Vault CRITICAL + IPv6 ::/0 sibling CRITICAL + all-protocol (-1) wildcard CRITICAL + public ingress to non-restricted ports INFO + egress 0.0.0.0/0 INFO + orphan SG (no attached ENI) LOW governance. **v2: `opts.additionalRestrictedPorts` operator-config knob** + **per-SG cardinality cap with rollup trailer** (defends against finding-size DoS on 1000+ SG accounts) + **system-managed-SG name-prefix exclusion list** (ElasticMapReduce- / eks-cluster-sg- / AWSServiceRole / awseb- prefixes excluded from orphan-detection). UserIdGroupPairs rules surfaced as INFO + evidenceGap; transitive SG→SG chain analysis deferred to v3 | CC6.6 / CC6.2 |
| 1180 | AWS ElastiCache Redis Auditor (EE 0.4.6) | Enterprise | First plugin in 1170-1180 ID range. 6 SOC 2 substrate-evidence dimensions: **transit encryption** (TransitEncryptionEnabled wraps RESP in TLS; HIGH on disabled) + **at-rest encryption with KMS key custody** (four-tier ladder: HIGH disabled → MEDIUM AWS-owned-default → MEDIUM alias/aws/elasticache → PASS customer-managed CMK + LOW+evidenceGap on `:key/UUID` per conservative-classifier-principle) + **Redis AUTH / IAM-auth user groups** (PASS on UserGroupIds; MEDIUM no-authentication — cluster relies solely on SG perimeter) + **Multi-AZ deployment** (HIGH disabled / INFO standalone-not-applicable / INFO + evidenceGap on transient enabling/disabling states) + **SnapshotRetentionLimit cadence** (HIGH=0 / MEDIUM 1-6 / PASS ≥7; operator-tunable `opts.snapshotRetentionPassMinDays`) + **subnet placement** (INFO + walkthroughRequired on `default` subnet group). Dual API enumeration (DescribeReplicationGroups + DescribeCacheClusters) with inter-API dedup. Memcached out-of-scope by design (no native AUTH; no transit encryption substrate). UserGroupIds cardinality cap (10 + "...and N more" overflow) | CC6.1 / CC6.2 / CC6.6 / A1.2 / C1.1 |
| 1190 | AWS SES Email Integrity Auditor (NEW EE 0.4.7) | Enterprise | First plugin in 1190-1199 ID range. Closes the next-highest-priority gap from `tasks/things-to-check.md` AWS SOC 2 audit-canonical compliance checklist after Redis closed in 0.4.6. **6 audit dimensions:** **DKIM enablement + signing status** (CC6.1 / Privacy — HIGH on `SigningEnabled=false`; transient PENDING/TEMPORARY_FAILURE/NOT_STARTED INFO + walkthroughRequired; FAILED MEDIUM on DNS drift; unknown enum LOW + evidenceGap per conservative-classifier-principle) + **custom MailFrom domain alignment** (Privacy substrate — INFO + walkthroughRequired on default amazonses.com / PASS on custom + Status=SUCCESS) + **configuration set TLS enforcement** (C1.1 — REQUIRE PASS / OPTIONAL HIGH SMTP-downgrade-attack window / non-string-but-truthy distinct LOW with `tlsPolicyType` evidence per R-MEDIUM-7 fold) + **identity sending authorization policy permissive principals** (CC6.6 — multi-class wildcard detector covering bare `"*"` / `{AWS:"*"}` / `{Service:"*"}` / `{Federated:"*"}` / `{CanonicalUser:"*"}` / array-form `[*]` per R-HIGH-4 fold + distinct HIGH `ses-sending-auth-notprincipal-allow` per R-CRITICAL-1 fold catching NotPrincipal+Allow wildcard-EQUIVALENT class + LOW + evidenceGap `ses-sending-auth-malformed-statement` per R-HIGH-2 fold) + **dedicated IP pool sending posture** (CC7.1 substrate, account-level — INFO + walkthroughRequired on configured pools / INFO on shared-pool default) + **suppression list state** (CC7.1 deliverability substrate — **ZDE invariant: NEVER reads suppressed-destination email addresses**; count + reason only; verified at run() envelope boundary via sentinel-string assertion per R-LOW-8 fold). Dual API surface discipline: v1 uses SESv2 only (canonical modern API); `@aws-sdk/client-ses` declared in optionalDependencies for v2+ cross-API parity. **11 same-session reviewer folds** — ties single-cycle reviewer-fold record. **CRITICAL-1 closure**: NotPrincipal+Allow false-CLEAN class (matches plugins 1070 + 1150 discipline). **HIGH-4 closure**: `_isWildcardPrincipal` walks every Principal class value (pre-fold only `principal.AWS` inspected, leaking `{Service:"*"}` + `{Federated:"*"}` as silent CLEAN). **No real-AWS smoke against violation-tier fixtures** — <operator-internal-test-infra-repo> has NO SES paired fixtures yet (full-stack fixtures deferred to v2 alongside DKIM CNAME DNS resolution + DMARC TXT record parsing); empty-account smoke baseline against <operator-test-account> DID succeed end-to-end. | CC6.1 / CC6.6 / C1.1 / CC7.1 (substrate) / Privacy (substrate) |

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
