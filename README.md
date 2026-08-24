# NSAuditor AI Agent Skill

**Give any AI coding agent instant fluency with NSAuditor AI.**

[![npm](https://img.shields.io/npm/v/nsauditor-ai-agent-skill.svg)](https://www.npmjs.com/package/nsauditor-ai-agent-skill)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An installable knowledge package that teaches AI coding agents how to use NSAuditor AI's MCP tools, understand its data schemas, and orchestrate multi-step security audit workflows — without requiring manual context every conversation.

Works with **Claude Code**, **Claude Desktop**, **Cursor**, **Windsurf**, **VS Code Copilot**, and any MCP-aware agent.

## Current release

**0.2.44** — paired with **Enterprise 0.40.2 / Community 0.2.46**. New in this release's teaching: a TSA
rejection is refused instead of being written as a signed sidecar (five named refusal codes; a missing
`.tsr` beside a `.sha256` means refused, not failed), the TSA policy-OID option works on OpenSSL ≥ 3.0
hosts, and parenthesised `(Dim N)` internal codes are out of GCP finding prose. Carried forward, the
eighth compliance framework:
**NIST SP 800-171 Rev 2**, taught as **evidence substrate for CMMC Level 2 preparation**. ⚠️ **Requires
Community >= 0.2.45** — a real floor bump: the framework stem is registered in CE, and an older CE
rejects the name outright. What the agent must refuse to say is part of the skill, not a footnote:
**never a CMMC certification, never a FedRAMP authorization, never a MET / NOT MET determination, and
never an SPRS score** — each is a C3PAO's determination. Rev 2 is pinned because CMMC assesses Rev 2 by
rule; Rev 3 is a different 97-requirement universe, and answering a Rev 3 question with Rev 2 output is
drift. CUI scope stays the operator's assertion — the scanner cannot see CUI, cannot tell FCI from CUI,
and cannot see an enclave boundary.

**Prior: 0.2.42** — paired with Enterprise 0.39.0 / Community 0.2.44. Coverage honesty: every GCP and Azure
plugin now declares what it does NOT evaluate, so `deferredScope` must be taught as a **per-plugin static
capability boundary** — not an evidence gap, not a finding, routing to zero compliance controls — and an
empty or short list is **never** a claim of full coverage.

⚠️ **Correcting this section's own prior text.** It called the sign-pack and verify-pack commands
*"reachable, not yet proven"*, which was true when written and became false on 2026-08-17, when the
published-bytes gate ran against the EE 0.38.0 registry bytes and passed. So the capability is now
PROVEN for an operator-held key over one framework's envelope and the artifacts it enumerates, never
a vendor attestation. That scope bound is permanent and did not move.

⚠️ **What the skill must teach accurately about THIS release, because it is the claim most easily
overstated:** a verified signature proves the holder of a key asserted authorship of **one
framework's** chain-of-custody envelope at a stated time, **relative to operator key custody**. It
is never a vendor attestation, never proof the scan ran, and never proof the findings are true. It
covers that envelope plus the four artifacts it enumerates — **not the directory and not the pack**;
a multi-framework pack holds ten files per framework plus the scan-level output, and no object in
it enumerates the set. `verify-pack` also
recomputes every enumerated artifact hash against disk, so an edited report fails while the
signature itself still reads VERIFIED. And exit **2** means the run could not measure — an unsigned
pack, an unsupplied key or a registry member with no key material — which an agent must never
report as a verification failure.

*(The suppression-approval material below is retained; it remains accurate.)*

⚠️ **What the skill must teach accurately about this release, because it is easy to overstate:**
`NSAUDITOR_SIGNING_KEY` is not a new variable — it existed and was inert. As of Enterprise 0.35.0
it is **CONSUMED**: `compliance suppress` signs the approval it writes when the variable names a
local Ed25519 key — reachable, and PROVEN as of EE 0.36.0 per approver holding key material.
Its verification
gate ran against the published bytes and passed, with a length-preserving tamper rendering
`signature FAILED verification` as the negative control. An agent may describe a produced signature
as verified evidence **for approvers whose registry entry carries key material** — for a
fingerprint-only entry a report reads `not checked by this report`, which records that no check ran
and never that one failed, and must not be reported as tampering. The commands are
**CLI-only**; no MCP tool reaches them, so an agent asked to record an approval must shell out
rather than look for a tool.

See [CHANGELOG.md](CHANGELOG.md) for the full history.

## What's Inside

```
nsauditor-ai-agent-skill/
├── SKILL.md                          # Main entrypoint — triggers, tools, schemas, constraints
├── references/
│   ├── workflows.md                  # Multi-step workflow recipes (full audit, CI/CD, CTEM)
│   ├── schemas.md                    # Complete data structures (scan results, CVEs, findings)
│   └── plugins.md                    # Full plugin catalog (55 scanners with ports & protocols — 27 Community + 28 Enterprise)
├── examples/
│   └── agent-interactions.md         # Example agent reasoning chains (9 scenarios)
├── package.json
├── README.md
└── LICENSE
```

## Quick Start

### Claude Code

```bash
# Option 1: Install globally and copy
npm install -g nsauditor-ai-agent-skill
cp -r $(npm root -g)/nsauditor-ai-agent-skill ~/.claude/skills/nsauditor-ai

# Option 2: Copy into your project
cp -r nsauditor-ai-agent-skill .claude/skills/nsauditor-ai
```

Claude Code auto-discovers skills in `.claude/skills/`.

### Claude Desktop

Upload `SKILL.md` as project knowledge in your Claude Desktop project settings.

### Cursor

Copy the skill directory into `.cursor/skills/` or add `SKILL.md` content to your project rules.

### Windsurf

Copy to your project's context directory, or paste `SKILL.md` into project rules.

### VS Code Copilot

Add `SKILL.md` to `.github/copilot-instructions.md` or your workspace's Copilot context.

### Generic / Custom Agents

```bash
npm install nsauditor-ai-agent-skill
# Copy into wherever your agent loads skills/context from
cp -r node_modules/nsauditor-ai-agent-skill /path/to/agent/skills/nsauditor-ai
```

## What the Agent Learns

When an AI agent loads this skill, it gains:

| Capability | Description |
|------------|-------------|
| **Tool signatures** | Exact MCP tool names, parameters, return types, and usage guidance |
| **Workflow patterns** | Multi-step chains: scan → CVE lookup → remediation report |
| **Schema knowledge** | Complete data structures for parsing and presenting results |
| **CPE construction** | How to map detected services to NVD vulnerability lookups |
| **Plugin awareness** | 55 scanner plugins (27 Community + 28 Enterprise) with protocols, ports, capabilities, and multi-framework (SOC 2 · HIPAA §164.312 · NIST CSF 2.0 · PCI DSS v4.0.1 · ISO/IEC 27001:2022 · CIS Controls v8 · GDPR Art. 32 · NIST SP 800-171 Rev 2) substrate-evidence dimensions |
| **Compliance frameworks** | **Eight frameworks, one scan** — SOC 2 (AICPA TSC 2017) · HIPAA Security Rule §164.312 Technical Safeguards (HHS Required/Addressable discipline per control) · NIST CSF 2.0 (Subcategory-level) · PCI DSS v4.0.1 (QSA RoC sub-requirement-level) · ISO/IEC 27001:2022 (per-Annex-A-code, SoA discipline) · CIS Controls v8 (per-Safeguard; Implementation Group IG1/IG2/IG3 cumulative discipline) · GDPR Article 32 (sub-measure-level; **Art. 32 infrastructure substrate only, NOT GDPR compliance**) · NIST SP 800-171 Rev 2 (requirement-level for the matrix, SP 800-171A determination-statement level for evidence; **examine-method evidence substrate for CMMC Level 2 preparation — never a CMMC certification and never a MET/NOT MET verdict**). All via `--compliance all`, or any CSV subset via `--compliance soc2,hipaa,nist-csf,pci-dss,iso-27001,cis-v8,gdpr,nist-800-171`. Zero BAA required for HIPAA — ePHI never leaves customer infrastructure. |
| **Security rules** | ZDE, SSRF protection, redaction, scan authorization requirements |
| **Error handling** | License gates, SSRF blocks, timeout resolution, CPE format errors |
| **Decision routing** | When to use scan_host vs probe_service vs CLI vs get_vulnerabilities |
| **Cloud-region scoping** | The MCP `scan_cloud` `regions` argument — pass `["all"]` (or a region-code list like `["us-east-1","eu-west-1"]`) to audit every / specific AWS regions; **omit it to scan the server-configured `AWS_REGION`** (omitting does NOT fan out — pass `["all"]` explicitly for full coverage, mindful of the Desktop tool-call timeout). Mirrors the CE CLI `--aws-region <one\|csv\|all>` flag. |

## Prerequisites

This package provides **knowledge about** NSAuditor AI. To actually **run** scans:

1. **Install NSAuditor AI:** `npm install -g nsauditor-ai`
2. **Start MCP server:** `nsauditor-ai-mcp` (or configure in your agent's MCP settings)
3. **Add MCP to your agent:**
   ```bash
   # Claude Code
   claude mcp add nsauditor-ai -- npx nsauditor-ai-mcp

   # Claude Desktop (claude_desktop_config.json)
   {
     "mcpServers": {
       "nsauditor-ai": {
         "command": "npx",
         "args": ["-y", "nsauditor-ai-mcp"],
         "env": { "NSA_ALLOW_ALL_HOSTS": "1", "NSA_MCP_AUTH_KEY": "<from: nsauditor-ai mcp install-key>" }
       }
     }
   }
   ```

> ⚠️ **`NSA_MCP_AUTH_KEY` is REQUIRED — the server refuses to start without it.** Generate one with
> `nsauditor-ai mcp install-key`, then put the SAME value in the `env` block above. Without it the MCP
> server exits at startup and the client shows the tools as unavailable. (`NSA_MCP_AUTH_DISABLE=1`
> exists as an escape hatch and warns on stderr; it is not the recommended path.)

## Editions

| Edition | Price | Highlights |
|---------|-------|-----------|
| **Community** | Free / MIT | 27 plugins (service probes + host/network discovery + intelligence/meta), basic AI, SARIF, CTEM, scan history |
| **Pro** | $49/mo | + CVE matching, risk scoring, and intelligence-enriched AI prompts (CVE + MITRE ATT&CK context injected) |
| **Enterprise** | $2k+/yr | + 28 enterprise plugins (1020-1222 range) — 27 cloud-substrate auditors across AWS / Azure / GCP plus `1023 Zero Trust Assessment`, which scores zero-trust posture from a NETWORK-host scan and does not run on a cloud pass, multi-framework evidence-pack (SOC 2 / HIPAA / NIST CSF 2.0 / PCI DSS v4.0.1 / ISO 27001:2022 / CIS Controls v8 / GDPR Art. 32 / NIST SP 800-171 Rev 2), SHA-256 chain-of-custody attestations, the suppression-approval CLI with opt-in Ed25519 signing (reachable from EE 0.35.0, proven 0.36.0, verified per approver holding key material), air-gapped operation (offline licensing + offline CVE matching) |

→ [Pricing](https://www.nsauditor.com/ai/pricing/)

## Related

- **[nsauditor-ai](https://github.com/nsasoft/nsauditor-ai)** — The scanner (Community Edition, MIT)
- **[@nsasoft/nsauditor-ai-ee](https://www.nsauditor.com/ai/pricing)** — Pro/Enterprise features
- **[NSAuditor AI Docs](https://www.nsauditor.com/ai/)** — Full documentation

## License

MIT — © 2024-present Nsasoft US LLC
