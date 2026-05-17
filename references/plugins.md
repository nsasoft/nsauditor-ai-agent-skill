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
| 1140 | AWS RDS Auditor (v3 — extended in EE 0.4.8) | Enterprise | **10 SOC 2 substrate-evidence dimensions** (v1=3 + v2=4 + v3=3). **v1+v2 (preserved):** Multi-AZ (A1.2) + storage encryption at rest with KMS-key custody classification + **kms:DescribeKey cross-reference promotes UNVERIFIABLE `:key/UUID` ARN shapes to deterministic PASS/MEDIUM** + parameter-group SSL enforcement (postgres rds.force_ssl + mysql require_secure_transport) + BackupRetentionPeriod (7-day baseline) + PubliclyAccessible + IAMDatabaseAuthenticationEnabled + snapshot encryption. **v3 NEW (database audit-logging, EE 0.4.8 EE-RT.14 v3):** **dim 8 pgAudit enabled** (postgres-only — `DescribeDBParameters → pgaudit.log` non-empty AND `shared_preload_libraries` contains `pgaudit` token per R-MEDIUM-2 reviewer-fold **false-PASS closure** — Postgres silently ignores the GUC when SPL omits pgaudit; new MEDIUM `rds-pgaudit-misconfigured` category; non-postgres engines = INFO + engine-not-applicable) + **dim 9 CloudWatch Logs exports** (`EnabledCloudwatchLogsExports` engine-dispatched: postgres essential=`postgresql`; mysql/mariadb essential=`error`; oracle essential=`audit`+`trace`; sqlserver essential=`error`; empty=HIGH / partial=MEDIUM / complete=PASS) + **dim 10 CloudWatch Logs retention** (`logs:DescribeLogGroups` enumeration on engine-dispatched prefix per R-HIGH-1 reviewer-fold **false-INFO closure**: `/aws/rds/instance/<id>/` for non-Aurora, `/aws/rds/cluster/<DBClusterIdentifier>/` for `aurora-*` engines — pre-fold hard-coded the instance path → 0 log groups on every Aurora node = false-INFO MEDIUM across the whole Aurora fleet; 30-day institutional baseline operator-tunable via `opts.auditLogRetentionPassMinDays` clamped 1..3653). **9 same-session v3 reviewer folds** (HIGH-1 Aurora cluster log-path; MEDIUM-2 pgAudit-SPL cross-check; MEDIUM-3/4/5 cwl-opt-out + retentionDistribution + transient-error distinct categories; LOW-8/9/10 + NIT-12). **Real-AWS smoke END-TO-END against `522412052794`** (in-place modification of rds-compliant-cluster; cost $0): ALL 3 v3 PASS-path classifiers validated + unmodified rds-violator-db validates HIGH path. **First 0.4.x extension cycle to validate BOTH PASS-path AND HIGH-path classifiers** against real AWS in the same smoke run. | A1.2 / CC6.1 / CC6.6 / C1.1 / CC7.2 / CC7.3 |
| 1150 | AWS SQS/SNS Auditor (NEW EE 0.4.4 v1; **EXTENDED EE 0.5.1 v2** — 5 → 7 dimensions: CloudWatch alarm coverage on SQS ApproximateAgeOfOldestMessage + SNS NumberOfNotificationsFailed; first plugin-1150 dim to cross an SDK boundary — SQS+SNS → CloudWatch) | Enterprise | First multi-service plugin in EE codebase. **7 dimensions total** (v1: 5; v2 EE 0.5.1 added dims 6 + 7). **v1 dims preserved:** SQS encryption at rest (SqsManagedSseEnabled OR KmsMasterKeyId; four-tier classification) + SQS transit-encryption policy (aws:SecureTransport Deny statement) + SNS topic encryption at rest + SNS topic-policy permissive-Principal (full NotAction-Allow + NotPrincipal-Allow + Resource-scope filtering per plugin 1070 + 1110 precedent) + SQS dead-letter queue presence (dual-mapped A1.2 + CC7.1). **v2 EE 0.5.1 NEW dims:** **dim 6 — SQS ApproximateAgeOfOldestMessage CloudWatch alarm coverage** (CC7.2 + A1.2 dual-mapped) — per-queue classifier `_classifySqsAgeAlarmCoverage` checks for at least one `AWS/SQS:ApproximateAgeOfOldestMessage` MetricAlarm with the queue's `QueueName` dimension AND **both** `ActionsEnabled=true` AND non-empty `AlarmActions[]`. Four outcomes: PASS `sqs-age-alarm-covered` / MEDIUM `sqs-age-alarm-missing` (silent backlog growth class) / LOW `sqs-age-alarm-actions-disabled` (matching alarm with all disabled OR empty AlarmActions — informational-only) / LOW + evidenceGap `sqs-age-alarm-coverage-unverifiable` (CW SDK unavailable / DescribeAlarms AccessDenied / queue name un-extractable / pagination truncated). **dim 7 — SNS NumberOfNotificationsFailed CloudWatch alarm coverage** (CC7.2 + A1.2 dual-mapped) — per-topic analogue with `AWS/SNS:NumberOfNotificationsFailed` metric + `TopicName` dimension; same four-tier severity ladder. **v2 single-fetch budget pattern** (mirrors plugin 1040): `_enumerateMetricAlarms` paginates `cloudwatch:DescribeAlarms` ONCE per scan; `_buildAlarmIndex` builds per-resource Maps (`sqsAgeByQueueName` + `snsFailureByTopicName`) for O(1) per-resource lookup. Pagination cap default 20 pages × 100 alarms = 2000 alarm ceiling, operator-tunable via `opts.cwAlarmPageCap`. **Soft-degrade contract** — CW SDK load failure routes per-resource classifier to LOW + evidenceGap rather than blocking SQS+SNS primary substrate audit. **R-CRITICAL v2 fold (false-CLEAN closure)**: `actionable` requires BOTH `ActionsEnabled=true` AND non-empty `AlarmActions[]` array — CloudWatch fires NO operator paging when AlarmActions=[] even with ActionsEnabled=true; pre-fold an `{ActionsEnabled:true, AlarmActions:[]}` alarm passed as PASS-tier evidence on a structurally broken alarm. Discriminates "all disabled" vs "all empty actions" in remediation narrative. **R-HIGH v2 fold**: soc2.json PASS-tier titlePatterns narrowed to anchor on `AWS/SQS:ApproximateAgeOfOldestMessage` / `AWS/SNS:NumberOfNotificationsFailed` clauses. **R-MEDIUM/R-LOW v2 folds**: defensive shape guard + multi-alarm collision tests + FIFO end-to-end + corrupted-shape defensive tests. **7 same-session v2 reviewer folds** (1 CRITICAL + 1 HIGH + 2 MEDIUM + 1 LOW + 1 NIT; 6 folded same-session, 1 NIT deferred). **No new SDK dependencies** — `@aws-sdk/client-cloudwatch` already declared in optionalDependencies since EE 0.4.0 (used by plugin 1040). **23 soc2.json titlePattern entries total** (11 v1 + 12 v2: 8 CC7.2 + 4 A1.2 dual-mapped). **Synthetic-mock validation only** this cycle for v2 — real-AWS smoke deferred (no SQS/SNS paired fixtures yet in test-infra-builder; ship-without per documented gap, EE 0.5.0 SES precedent). Closes the **"messaging monitoring" SOC 2 dimension** per `tasks/things-to-check.md` §4 institutional checklist: *"Track SQS ApproximateAgeOfOldestMessage and SNS delivery failure metrics inside CloudWatch to prove operational monitoring."* | C1.1 / CC6.6 / A1.2 / CC7.1 / CC7.2 |
| 1170 | AWS EC2 SG Perimeter Auditor (v2 — extended in EE 0.4.6) | Enterprise | Orthogonal evidence to plugin 1023 zero-trust-checker (1023 reads OBSERVED open ports; 1170 reads DECLARED SG policy via DescribeSecurityGroups). 6 dimensions: IPv4 0.0.0.0/0 ingress to **RESTRICTED_PORTS (v2: 23 ports per CIS AWS Foundations v3.0)** — SSH/RDP/MS SQL/MySQL/Postgres/Redshift/Redis/Memcached/MongoDB/Elasticsearch/CouchDB/Docker/Kubelet/K8s-API/etcd/Kibana/InfluxDB/Kafka/Consul/ZooKeeper/Vault CRITICAL + IPv6 ::/0 sibling CRITICAL + all-protocol (-1) wildcard CRITICAL + public ingress to non-restricted ports INFO + egress 0.0.0.0/0 INFO + orphan SG (no attached ENI) LOW governance. **v2: `opts.additionalRestrictedPorts` operator-config knob** + **per-SG cardinality cap with rollup trailer** (defends against finding-size DoS on 1000+ SG accounts) + **system-managed-SG name-prefix exclusion list** (ElasticMapReduce- / eks-cluster-sg- / AWSServiceRole / awseb- prefixes excluded from orphan-detection). UserIdGroupPairs rules surfaced as INFO + evidenceGap; transitive SG→SG chain analysis deferred to v3 | CC6.6 / CC6.2 |
| 1180 | AWS ElastiCache Redis Auditor (v2 — extended in EE 0.4.9) | Enterprise | First plugin in 1170-1180 ID range. **6 SOC 2 substrate-evidence dimensions** (v1 unchanged in count; v2 grew dims 2 + 6 in scope). **v1 dims preserved:** transit encryption (TransitEncryptionEnabled wraps RESP in TLS; HIGH on disabled) + Redis AUTH/IAM-auth user groups (PASS on UserGroupIds; MEDIUM no-authentication) + Multi-AZ deployment (HIGH disabled / INFO standalone-not-applicable / INFO+evidenceGap on transient enabling/disabling states) + SnapshotRetentionLimit cadence (HIGH=0 / MEDIUM 1-6 / PASS ≥7; operator-tunable `opts.snapshotRetentionPassMinDays`). Dual API enumeration (DescribeReplicationGroups + DescribeCacheClusters) with inter-API dedup. **v2 GROWN dims (EE 0.4.9 EE-RT.17 v2):** **dim 2 at-rest encryption + KMS key custody** — original four-tier ladder (HIGH disabled → MEDIUM AWS-owned-default → MEDIUM `alias/aws/elasticache` → PASS customer-managed CMK + LOW+evidenceGap on `:key/UUID` per conservative-classifier-principle) **PLUS v2 kms:DescribeKey cross-reference promotion** (mirrors plugin 1140 v2): UNVERIFIABLE `:key/UUID` ARN shapes promoted via KeyMetadata.KeyManager to deterministic PASS `elasticache-at-rest-customer-managed-kms-promoted` (CUSTOMER) / MEDIUM `elasticache-at-rest-aws-managed-kms-promoted` (AWS); conservative on AccessDenied/NotFound/unknown KeyManager. **dim 6 subnet routing** — v1 INFO substrate (`elasticache-subnet-group-substrate`) plus **v2 ec2:DescribeRouteTables verifier** that walks the cache subnet group's subnets via elasticache:DescribeCacheSubnetGroups + filtered ec2:DescribeRouteTables, classifying each subnet on Internet Gateway route presence via /^igw-[a-f0-9]+$/i (correctly excludes egress-only eigw-): HIGH `elasticache-subnet-public-route-detected` (with per-subnet `igwDestinationsBySubnet` evidence per R-HIGH-1 fold) / PASS `elasticache-subnet-private-verified` (all subnets verified IGW-free) / LOW + evidenceGap `elasticache-subnet-main-rt-inheritance` per R-MEDIUM-2 false-NEGATIVE closure (default-VPC main-RT typically routes `0.0.0.0/0 → igw-*`) / LOW + evidenceGap `elasticache-subnet-verification-unverifiable` on AccessDenied. **Cross-plugin sister of plugin 1170 SG perimeter** (layer-3 subnet→IGW vs layer-4 SG ingress policy). **7 same-session v2 reviewer folds** (HIGH-1 IGW destination evidence; MEDIUM-2 main-RT-inheritance false-NEGATIVE closure; MEDIUM-3 cache-key naming; LOW-6/7/9/10/11 + NIT-12). **Per-resource caching** prevents N×M API explosion (kmsKeyManagerCache + subnetGroupCache + subnetSetRoutingCache). **No new SDK deps** — @aws-sdk/client-kms + @aws-sdk/client-ec2 reused from EE 0.4.5. **Real-AWS smoke END-TO-END against 522412052794**: R-MEDIUM-2 fold escalation demonstrably firing in production (`redis-leaky-cache` → dim 6 LOW main-RT-inheritance). | CC6.1 / CC6.2 / CC6.6 / A1.2 / C1.1 |
| 1190 | AWS SES Email Integrity Auditor (NEW EE 0.4.7; **EXTENDED EE 0.5.0 v2** — dims 1 + 2 + 4 grown in scope: DKIM CNAME DNS resolution + DMARC TXT record parser + SES classic API parity) | Enterprise | **v2 EE 0.5.0 GROWN dims:** **dim 1 DKIM** — original substrate **PLUS v2 DKIM CNAME DNS resolution promotion**: each `<token>._domainkey.<domain>` CNAME resolved via node:dns/promises + matched against `<token>.dkim.amazonses.com` (case-insensitive per RFC 1035 §2.3.3); four outcomes PASS `ses-dkim-dns-verified` / MEDIUM `ses-dkim-dns-partial` / **HIGH `ses-dkim-dns-missing` (false-CLEAN closure: SES Status=SUCCESS but DNS removed)** / LOW + evidenceGap `ses-dkim-dns-unverifiable`. **dim 2 MailFrom** — original substrate **PLUS v2 DMARC TXT record parser + MailFrom promotion**: RFC 7489 §6.4 tag-list parser + `_dmarc.<identityDomain>` TXT lookup; five outcomes PASS `ses-dmarc-policy-reject` / MEDIUM `ses-dmarc-policy-quarantine` / HIGH `ses-dmarc-policy-none` / HIGH `ses-dmarc-missing` / LOW + evidenceGap `ses-dmarc-unverifiable`. **R-CRITICAL-1 fold (false-CLEAN closure)**: `pct=0` on `p=reject`/`p=quarantine` functionally equivalent to `p=none`; now routes to HIGH `ses-dmarc-policy-none`. **R-HIGH-1 fold (subdomain-takeover false-NEGATIVE closure)**: `sp` subdomain-policy override now evaluated — `p=reject; sp=none` downgrades to HIGH with `dmarcSpWeakens` (subdomain phishing wide open while apex protected). **dim 4 sending-auth policies** — original IAM-policy classifier **PLUS v2 SES classic GetIdentityPolicies parity**: `_loadSesClassicSdk` restored; cross-API discrepancy emits HIGH `ses-classic-policy-discrepancy` (classic-only — canonical false-NEGATIVE class) / MEDIUM (`_canonicalSort` JSON deep-equal ignores whitespace + key-order drift) / INFO (v2-only benign). Conservative on classic SDK unavailable / AccessDenied → LOW + evidenceGap. **v1 dims preserved unchanged:** TLS enforcement (dim 3) + dedicated IP pool (dim 5) + suppression list (dim 6 ZDE — count + reason only). **v2 promoter pattern**: sync v1 classifiers unchanged; async promoters walk collected findings post-classification. **R-HIGH-2 fold**: brittle `inTestMode = !!opts._client` coupling replaced with explicit `_skipV2Promotion` master switch + 3 orthogonal kill-switches. **First plugin in EE to depend on node:dns/promises** for live DNS cross-reference. **8 same-session v2 reviewer folds** (1 CRITICAL + 3 HIGH + 2 MEDIUM + 2 LOW); 6 queued in Pick-up Block. **Real-DNS smoke validation END-TO-END** against production resolvers (`_dmarc.nsasoft.us` parsed correctly: `p=reject, sp=reject, pct=100`; forward-compat `fo=1` tag preserved). Empty-account SESv2 enumeration baseline succeeded end-to-end against 522412052794. **v1 base (preserved):** First plugin in 1190-1199 ID range. Closes the next-highest-priority gap from `tasks/things-to-check.md` AWS SOC 2 audit-canonical compliance checklist after Redis closed in 0.4.6. **6 audit dimensions:** **DKIM enablement + signing status** (CC6.1 / Privacy — HIGH on `SigningEnabled=false`; transient PENDING/TEMPORARY_FAILURE/NOT_STARTED INFO + walkthroughRequired; FAILED MEDIUM on DNS drift; unknown enum LOW + evidenceGap per conservative-classifier-principle) + **custom MailFrom domain alignment** (Privacy substrate — INFO + walkthroughRequired on default amazonses.com / PASS on custom + Status=SUCCESS) + **configuration set TLS enforcement** (C1.1 — REQUIRE PASS / OPTIONAL HIGH SMTP-downgrade-attack window / non-string-but-truthy distinct LOW with `tlsPolicyType` evidence per R-MEDIUM-7 fold) + **identity sending authorization policy permissive principals** (CC6.6 — multi-class wildcard detector covering bare `"*"` / `{AWS:"*"}` / `{Service:"*"}` / `{Federated:"*"}` / `{CanonicalUser:"*"}` / array-form `[*]` per R-HIGH-4 fold + distinct HIGH `ses-sending-auth-notprincipal-allow` per R-CRITICAL-1 fold catching NotPrincipal+Allow wildcard-EQUIVALENT class + LOW + evidenceGap `ses-sending-auth-malformed-statement` per R-HIGH-2 fold) + **dedicated IP pool sending posture** (CC7.1 substrate, account-level — INFO + walkthroughRequired on configured pools / INFO on shared-pool default) + **suppression list state** (CC7.1 deliverability substrate — **ZDE invariant: NEVER reads suppressed-destination email addresses**; count + reason only; verified at run() envelope boundary via sentinel-string assertion per R-LOW-8 fold). Dual API surface discipline: v1 uses SESv2 only (canonical modern API); `@aws-sdk/client-ses` declared in optionalDependencies for v2+ cross-API parity. **11 same-session reviewer folds** — ties single-cycle reviewer-fold record. **CRITICAL-1 closure**: NotPrincipal+Allow false-CLEAN class (matches plugins 1070 + 1150 discipline). **HIGH-4 closure**: `_isWildcardPrincipal` walks every Principal class value (pre-fold only `principal.AWS` inspected, leaking `{Service:"*"}` + `{Federated:"*"}` as silent CLEAN). **No real-AWS smoke against violation-tier fixtures** — test-infra-builder has NO SES paired fixtures yet (full-stack fixtures deferred to v2 alongside DKIM CNAME DNS resolution + DMARC TXT record parsing); empty-account smoke baseline against 522412052794 DID succeed end-to-end. | CC6.1 / CC6.6 / C1.1 / CC7.1 (substrate) / Privacy (substrate) |

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
