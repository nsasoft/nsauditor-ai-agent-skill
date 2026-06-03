# NSAuditor AI Agent Skill

**Give any AI coding agent instant fluency with NSAuditor AI.**

[![npm](https://img.shields.io/npm/v/nsauditor-ai-agent-skill.svg)](https://www.npmjs.com/package/nsauditor-ai-agent-skill)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

An installable knowledge package that teaches AI coding agents how to use NSAuditor AI's MCP tools, understand its data schemas, and orchestrate multi-step security audit workflows — without requiring manual context every conversation.

Works with **Claude Code**, **Claude Desktop**, **Cursor**, **Windsurf**, **VS Code Copilot**, and any MCP-aware agent.

## What's Inside

```
nsauditor-ai-agent-skill/
├── SKILL.md                          # Main entrypoint — triggers, tools, schemas, constraints
├── references/
│   ├── workflows.md                  # Multi-step workflow recipes (full audit, CI/CD, CTEM)
│   ├── schemas.md                    # Complete data structures (scan results, CVEs, findings)
│   └── plugins.md                    # Full plugin catalog (55 scanners with ports & protocols — 27 Community incl. 3 Pro + 28 Enterprise)
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
| **Plugin awareness** | 55 scanner plugins (27 Community incl. 3 Pro + 28 Enterprise) with protocols, ports, capabilities, and six-framework (SOC 2 · HIPAA §164.312 · NIST CSF 2.0 · PCI DSS v4.0.1 · ISO/IEC 27001:2022 · CIS Controls v8) substrate-evidence dimensions |
| **Compliance frameworks** | **Six frameworks, one scan** — SOC 2 (AICPA TSC 2017) · HIPAA Security Rule §164.312 Technical Safeguards (HHS Required/Addressable discipline per control) · NIST CSF 2.0 (Subcategory-level) · PCI DSS v4.0.1 (QSA RoC sub-requirement-level) · ISO/IEC 27001:2022 (per-Annex-A-code, SoA discipline) · CIS Controls v8 (per-Safeguard; Implementation Group IG1/IG2/IG3 cumulative discipline). Any CSV subset via `--compliance soc2,hipaa,nist-csf,pci-dss,iso-27001,cis-v8`. Zero BAA required for HIPAA — ePHI never leaves customer infrastructure. |
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
         "env": { "NSA_ALLOW_ALL_HOSTS": "1" }
       }
     }
   }
   ```

## Editions

| Edition | Price | Highlights |
|---------|-------|-----------|
| **Community** | Free / MIT | 27 plugins (service probes + host/network discovery + intelligence/meta), basic AI, SARIF, CTEM, scan history |
| **Pro** | $49/mo | + CVE matching, verification probes, risk scoring, 3 Pro plugins (040 TLS / 050 TRIBE / 060 DNS) |
| **Enterprise** | $2k+/yr | + 28 cloud-substrate auditor plugins (1020-1222 range; AWS / Azure / GCP six-framework evidence-pack — SOC 2 / HIPAA / NIST CSF 2.0 / PCI DSS v4.0.1 / ISO 27001:2022 / CIS Controls v8), Zero Trust, RFC 3161 timestamps, chain-of-custody attestations, air-gapped deployment |

→ [Pricing](https://www.nsauditor.com/ai/pricing/)

## Related

- **[nsauditor-ai](https://github.com/nsasoft/nsauditor-ai)** — The scanner (Community Edition, MIT)
- **[@nsasoft/nsauditor-ai-ee](https://www.nsauditor.com/ai/pricing)** — Pro/Enterprise features
- **[NSAuditor AI Docs](https://www.nsauditor.com/ai/)** — Full documentation

## License

MIT — © 2024-present Nsasoft US LLC
