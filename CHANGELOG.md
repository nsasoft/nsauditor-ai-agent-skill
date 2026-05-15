# Changelog

Release notes for **`nsauditor-ai-agent-skill`** — installable knowledge package that teaches AI coding agents how to use NSAuditor AI's MCP tools, schemas, plugins, and security audit workflows.

---

## 0.1.11 — Catalog refresh: EE plugin count 4 → 18; ID-range renumbered 020s → 1020s; SOC 2 evidence taxonomy added

**Major catalog overhaul.** The agent-skill was last published in April 2024 (version 0.1.10) and had not tracked the EE 0.3.x / 0.4.x evolution. This release brings the Enterprise plugin catalog current to **EE 0.4.5** (paired with CE 0.1.44).

### What changed

- **EE plugin count: 4 → 18.** Added 14 new Enterprise plugins to `references/plugins.md`: 1030 IAM Deep Auditor, 1040 CloudTrail Operational Integrity, 1050 API Gateway Assurance, 1060 DynamoDB Audit Integrity, 1070 KMS Auditor, 1080 Lambda Security Auditor, 1090 Secrets Manager + SSM Parameter Store, 1100 CodePipeline + CodeBuild, 1110 IAM Effective Decrypt-Path, 1120 S3 Lifecycle + Cross-Region Replication, 1130 Backup Auditor (headline 12-dimension air-gapped vault attestation arc), 1140 RDS Auditor v2 (7 dims + kms:DescribeKey cross-reference), 1150 SQS/SNS Auditor, 1170 EC2 SG Perimeter Auditor.
- **EE plugin IDs renumbered 020s → 1020s.** All EE plugins moved to the disjoint 1000+ ID range at EE 0.3.9 (2026-05-12) to avoid CE collision. Previously the agent-skill advertised plugin `020 AWS Cloud Scanner` which AI coding agents would have suggested for users to run — but that ID no longer exists in EE. The corrected ID is `1020`.
- **SOC 2 substrate-evidence taxonomy added.** Every Enterprise plugin row now lists the SOC 2 Trust Services Criteria controls it produces evidence under. Aggregate coverage: 10 covered controls (CC6.1 / CC6.2 / CC6.6 / CC6.7 / CC6.8 / CC7.1 / CC7.2 / CC7.3 / C1.1 / C1.2) + 4 partial (CC6.3 / CC8.1 / A1.2 / PI1.5) + 33 OOS for static substrate scanning. Coverage matrix is institutionally honest: substrate-evidence depth grows release-over-release without the matrix being shifted (matrix-shift requires net-new control coverage, not just deeper evidence on already-covered controls).
- **`SKILL.md` plugin summary updated:** "44+ Scanners" (was "27+"). Enterprise (18) line lists all plugins by ID. Editions table updated with accurate edition-feature deltas.
- **`README.md` updated:** plugin awareness "44+ scanner plugins (23 CE + 3 Pro + 18 Enterprise)" (was "30+"). Editions table now reflects correct per-edition feature deltas.
- **`peerDependencies` floor bumped:** `nsauditor-ai >=0.1.10` → `>=0.1.40`. CE 0.1.40 (published 2026-05-13) is the EE 0.4.0-cohort paired-release floor — the EE plugin ID range only makes sense against CE 0.1.40+.
- **CHANGELOG.md added** to track future release history; included in `files` array.

### What did NOT change

- **CE Pro plugin section (040 / 050 / 060) is still accurate.** The 040 TLS Certificate & Cipher Auditor, 050 TRIBE v2 Probe, 060 DNS Security Auditor are CE-Pro-tier plugins (not EE) and did NOT move with the EE renumbering. The agent-skill's documentation of these is correct.
- **Core (17) + Discovery (6) plugin sections** — unchanged; no renumbering at CE side.
- **MCP tool surface, schemas, workflows** — unchanged; this release is a catalog refresh, not an MCP API change.

### Recommended pairing

`npm install nsauditor-ai-agent-skill@0.1.11 nsauditor-ai@0.1.44` (CE pairing).

For Enterprise users running EE plugins: pair `nsauditor-ai@0.1.44` + `@nsasoft/nsauditor-ai-ee@0.4.5`.

---

## 0.1.10 — Initial release (April 2024)

First publication. Established the SKILL.md / references/ / examples/ structure. Documented:

- 17 Core + 6 Discovery scanners (CE-tier).
- 3 Pro plugins (040 TLS / 050 TRIBE / 060 DNS).
- 4 Enterprise plugins by pre-renumber IDs (020 AWS / 021 GCP / 022 Azure / 023 Zero Trust).
- MCP tool reference for `scan_host` / `list_plugins` / `probe_service` / `get_vulnerabilities`.
- Multi-step workflow recipes.

**Note:** the EE plugin IDs documented in 0.1.10 (020/021/022/023) were renumbered to 1020/1021/1022/1023 at EE 0.3.9 (2026-05-12). Refresh to 0.1.11+ for the corrected catalog.
