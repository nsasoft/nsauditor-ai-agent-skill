# Changelog

Release notes for **`nsauditor-ai-agent-skill`** — installable knowledge package that teaches AI coding agents how to use NSAuditor AI's MCP tools, schemas, plugins, and security audit workflows.

---

## 0.1.28 — Catalog refresh: plugin 1170 v3.1 SG-reference-graph edge dedup + plugin 1200 v6.1 CloudWatch Logs probe retry-on-empty parity — paired with EE 0.6.7 trio-publish (patch-level R2 reviewer-deferred-items cleanup cycle: closes both R2 items from 0.6.6 reviewer pass; 4 R1 reviewer folds (0 R-CRITICAL + 0 R-HIGH + 1 R-MEDIUM + 3 R-LOW — clean review pass) + 1 unanticipated `_retryOnNotFound` two-phase restructure (caught by test interaction); plugin count UNCHANGED at 22; soc2.json UNCHANGED; eighteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.7 + CE 0.1.61 — **eighteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.7).

### What changed

- **`references/plugins.md`** — two plugin rows updated:
  - **Plugin 1170 v3.1** — extended row with edge-dedup discipline in `_buildSgReferenceGraph`: edges deduped by `(sourceGroupId, targetGroupId)` with `ports` aggregated as array of `{protocol, fromPort, toPort}`. Pre-fold a real-world ALB-fronting-app SG with 3 ingress perms on different ports (80/443/8080) referencing the same source SG emitted 3 distinct edges A→B; the BFS treated each as a separate chain, inflating `chainCount` 2-5× and exhausting per-target chain caps on noise. Post-fold the BFS sees exactly 1 chain per distinct (source, target) pair. `isCrossVpc` aggregation is AND-semantic — if ANY contributing pair is same-VPC, the merged edge is same-VPC (per `[[conservative_classifier_principle]]`). Classifier `_classifyTransitiveReachability` port-render accepts both v3.1 array shape and v3 single-object shape (back-compat preserved).
  - **Plugin 1200 v6.1** — extended row with CloudWatch Logs probe retry-on-empty parity. Pre-fold the CWL Logs probe was asymmetric: `DescribeLogGroups` returns `logGroups: []` (NOT a thrown exception) on missing groups, so the shared `_retryOnNotFound` helper's thrown-NotFound retry path never fired. A freshly-created CWL log group probed within seconds of creation could false-DEAD. Post-fold `_retryOnNotFound` accepts an optional retry-on-result predicate; the CWL call site passes a predicate that fires retry when the response carries no exact-name match (covers both empty and prefix-only-sibling responses). Eventual-consistency parity now uniform across IAM / Lambda / SNS / SQS / EventBridge API destination / CloudWatch Logs.
  - **Two-phase restructure of `_retryOnNotFound`** — initially the result-based retry was added inside the existing try block, but a compound-path test interaction (transient empty → second-call throws `ResourceNotFoundException`) caused 3 total network calls. Restructured to two mutually-exclusive phases — Phase 1 = initial call + thrown-NotFound retry; Phase 2 = result-based retry — capping total calls at 2 on all compound paths. The per-call-site outer catch routes a second-call thrown error (NotFound → DEAD; AccessDenied → UNVERIFIABLE).
  - **4 R1 reviewer folds applied** (0 R-CRITICAL + 0 R-HIGH + 1 R-MEDIUM + 3 R-LOW — clean review pass): R-MEDIUM-1 arrival-order-independent AND-aggregation (locked with 2 regression fixtures + JSDoc tightening) + R-LOW-1 partial-render contract on malformed port specs (locked with 2 regression fixtures) + R-LOW-2 `_portKeys` scratch-lifetime documented at function-signature comment + R-LOW-1 compound-path coverage (transient empty → second-call AccessDenied → UNVERIFIABLE / transient empty → second-call thrown RNF → DEAD; drives the two-phase restructure decision).
- **`SKILL.md`** — "post-EE 0.6.6" → "post-EE 0.6.7"; plugin 1170 v3.1 + plugin 1200 v6.1 highlights surfaced in plugin narratives; plugin count enumeration stays at 22.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### R2 reviewer-deferred (queued for 0.6.8+)

- **R-NIT (plugin 1200 v6.1)** — `retryOnResultPredicate` could be renamed to `shouldRetryOnResult` for question-form consistency with other EE predicates. Pure naming preference.
- **R-NIT (plugin 1200 v6.1)** — symmetry of comments between Phase 1 retry and Phase 2 retry blocks. Pure readability.
- **R-NIT (plugin 1170 — pre-existing)** — `// out-of-scope for v3 v1` typo at the cross-VPC BFS branch (pre-existing from 0.6.6).
- **Cross-plugin extraction candidate** — the `(source, target)` dedup pattern with aggregated-attribute array transfers to IAM trust-policy graphs, VPC peering graphs, KMS principal-reference graphs. Lift to `_lib/graph_edge_dedup.mjs` when the next plugin adopts it.

### Tests + regression

- **EE full regression: 5314/5314 across 834 suites** (was 5304/5304 at 0.6.6 publish; +10 tests, suite count unchanged). **59-session 100% green streak preserved.**

---

## 0.1.27 — Catalog refresh: plugin 1170 v3 SG→SG transitive reachability + plugin 1200 v6 dead-target probe warm-up — paired with EE 0.6.6 trio-publish (minor cycle: EE-RT.16 v3 transitive chain reachability + EE-RT.20.5 v6 IAM/API-destination/CW-Logs target probes; 5 R1 reviewer folds (1 R-HIGH + 2 R-MEDIUM + 2 R-LOW; 0 R-CRITICAL — clean review pass); plugin count UNCHANGED at 22; seventeenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.6 + CE 0.1.60 — **seventeenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.6).

### What changed

- **`references/plugins.md`** — two plugin rows updated:
  - **Plugin 1170 v3** — extended row with SG→SG transitive chain reachability dimension: BFS from public-CIDR roots through `UserIdGroupPairs` SG-references; 2-hop emits HIGH, 3+ hop emits CRITICAL (operator-blindness principle); cycle defense + depth cap (default 5, max 20) + per-target chain cap (default 10, max 100); cross-VPC edges skipped as INFO trailer; per-hop port-flow tracked but NOT intersected (v3 v1 simplification — walkthroughRequired=true). New operator opts: `skipTransitiveReachability` / `transitiveChainDepthCap` / `transitiveChainsPerTargetCap` / `transitiveChainSamplesPerFindingCap`. 3 new soc2.json mappings under CC6.6 (transitive-public HIGH + CRITICAL + INFO truncation).
  - **Plugin 1200 v6** — extended row with three new dead-target probe branches: IAM role (`iam:GetRole` on path-stripped role NAME) + EventBridge API destination (`events:DescribeApiDestination` reuses `_EventBridgeSdk`) + CloudWatch Logs (`logs:DescribeLogGroups` with `logGroupNamePrefix` filter + exact-name disambiguation guard). New SDK deps `@aws-sdk/client-iam` + `@aws-sdk/client-cloudwatch-logs` (both in optionalDependencies). Companion-LOW emission contract unchanged (existing CC7.1 titlePattern target-type-agnostic). **Operator note**: `iam:GetRole` is a global API resolving per-partition — orchestrators wiring `opts._iamClient` must construct a single global IAM client per-partition.
  - **5 v6 R1 reviewer folds applied** (0 R-CRITICAL — clean review pass; 1 R-HIGH + 2 R-MEDIUM + 2 R-LOW): R-HIGH-1 (plugin 1170 v3) BFS short-circuits enqueue past per-target cap (closes path-enumeration explosion on hub-and-spoke topologies — pre-fold the BFS marked the target truncated but kept cloning `path` and `visited` Sets and walking past the cap) + R-MEDIUM-1 (plugin 1200 v6) IAM `NoSuchEntityException` / `NoSuchEntity` lifted into `_DEAD_TARGET_NOTFOUND_ERROR_NAMES` Set (bare disjunction collapsed; eventual-consistency retry restored for IAM — the canonical worst case for AWS eventual consistency, with IAM lag 10-30s documented; **9th cumulative recurrence** of the `[[emit_literal_set_drift]]` class across the EE codebase) + R-MEDIUM-2 (plugin 1200 v6) IAM partition-routing contract documented at `_loadIamSdk` (orchestrator must construct global IAM client per-partition; doc-only fold) + R-LOW-2 (plugin 1170 v3) depth-cap-hit surfaced separately from per-target-cap (closes silent-deep-truncation false-CLEAN class — pre-fold a graph deeper than `transitiveChainDepthCap` silently truncated without operator-visible signal) + R-LOW-2 (plugin 1200 v6) API destination ARN regex future-proofed against alias-only ARN shapes.
- **`SKILL.md`** — "post-EE 0.6.5" → "post-EE 0.6.6"; plugin 1170 v3 + plugin 1200 v6 highlights surfaced in plugin-1200 narrative; plugin count enumeration stays at 22.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### R2 reviewer-deferred (queued for 0.6.7)

- **R-LOW-1 (plugin 1200 v6)**: CloudWatch Logs probe doesn't retry on empty result (logs:DescribeLogGroups returns `logGroups: []` not an exception, so `_retryOnNotFound` doesn't apply). Lower priority than IAM since CWL eventual-consistency is much narrower.
- **R-MEDIUM-1 (plugin 1170 v3)**: Edge dedup absent in `_buildSgReferenceGraph` — multi-rule references to the same SG (e.g., one perm per port) inflate chain counts 2-5×. Defer until operator feedback on chain-count noise.
- **R-NIT** documentation folds.

### Tests + regression

- **EE full regression: 5304/5304 across 834 suites** (was 5261/5261 across 825 at 0.6.5 publish; +43 tests, +9 suites — most are pre-fold v3/v6 base fixtures; 5 are fold-regression pins: hub-and-spoke per-target-cap + depthCapHit-true + depthCapHit-false + IAM transient-retry-succeeds + IAM lowercase-name-retry-then-DEAD). **58-session 100% green streak preserved.**

---

## 0.1.26 — Catalog refresh: plugin 1200 v5 v4-reviewer-cleanup cycle — paired with EE 0.6.5 trio-publish (patch-level cycle: R-NIT named-constants + sentinel observability + sessionToken cross-plugin sweep + dead-target companion-LOW; 5 R1 reviewer folds; plugin count UNCHANGED at 22; sixteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.5 + CE 0.1.59 — **sixteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.5).

### What changed

- **`references/plugins.md`** — plugin 1200 row updated with v5 dim list:
  - **Dead-target companion-LOW (item)** — per-target liveness probes for Lambda + SNS + SQS via new `_probeTargetLiveness` helper (parallel via Promise.all + 2s default timeout). New MEDIUM verdict `*-alerting-destination-dead-targets` emitted as companion alongside PASS when targets point to deleted resources. New operator opts: `skipTargetLivenessProbe: true` + `deadTargetProbeTimeoutMs`. IAM role + API destination + CloudWatch Logs target probes deferred to 0.6.6.
  - **Sentinel observability** — `targetVerificationReason` enum (AccessDenied / SdkUnavailable / BeyondCap / SkippedByOpts) on rule shape; classifier surfaces `targetVerificationReasonBreakdown` in finding details.
  - **R-NIT named-constants** — `SH_HUB_NOT_ENABLED_ERROR_NAMES` frozen Set replaces 2 bare-string sites in SecurityHub helpers per `[[emit_literal_set_drift]]`.
  - **5 R1 reviewer folds applied** (0 R-CRITICAL — clean review pass; 3 R-HIGH + 1 R-MEDIUM + 1 consolidated R-LOW/R-NIT): R-HIGH-1 case-insensitive NotFound matching + R-HIGH-2 one-retry on NotFound (eventual-consistency defense) + R-HIGH-3 Lambda probe passes FULL ARN (alias-correctness server-side) + R-HIGH (Explore) parallel probes with per-target timeout + R-MEDIUM-1 SQS partition-aware via `GetQueueUrl` (closes false-DEAD on aws-cn / aws-us-gov / aws-iso partitions).
- **Cross-plugin sessionToken sweep** — note added to the EE plugin catalog narrative: 18 EE AWS plugins (1020-1200) now thread `sessionToken` through their AWS-SDK credentials block. AssumeRole-style auditor credentials work uniformly across the entire EE catalog.
- **`SKILL.md`** — "post-EE 0.6.4" → "post-EE 0.6.5"; plugin count enumeration stays at 22.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why the catalog refresh matters

AI coding agents using this skill now know that plugin 1200:

- **Verifies per-target liveness** for Lambda / SNS / SQS targets via probes — a verified rule with a Target.Arn pointing to a deleted resource emits a companion LOW alongside the PASS verdict (not just a count-based PASS).
- Distinguishes **eventual-consistency NotFound from real DEAD** via a one-retry with 750ms backoff (defends against false-DEAD on freshly-created resources).
- Calls `events:ListTargetsByRule` with **full qualified Lambda ARNs** to verify alias/version correctness server-side (alias `PROD` pointing to a deleted version surfaces as DEAD).
- Supports **GovCloud / aws-cn / aws-iso SQS targets** via `GetQueueUrl` (partition-aware) instead of synthesized commercial-AWS URL.
- Surfaces unverifiable rules with **explicit failure-mode taxonomy** (AccessDenied / SdkUnavailable / BeyondCap / SkippedByOpts) so auditors can drill down.

AI coding agents using this skill also now know that **all 18 EE AWS plugins** support AssumeRole-style auditor credentials uniformly — auditors no longer need to inject ambient credentials separately.

### Compatibility

No agent-skill API surface changes; pure documentation refresh. AI agents using earlier agent-skill versions against EE 0.6.5 still work, they just lack the v5 dim awareness.

**Customer install (paired):**

```bash
npm install -g nsauditor-ai@0.1.59 @nsasoft/nsauditor-ai-ee@0.6.5
npm install nsauditor-ai-agent-skill@0.1.26
```

---

## 0.1.25 — Catalog refresh: plugin 1200 v4 reviewer-cleanup cycle — paired with EE 0.6.4 trio-publish (patch-level cycle: EventBridge target verification + multi-failedAccount surface + trigger uniformity; 5 R1 reviewer folds incl. R-HIGH-1 cap-skew classifier closure; plugin count UNCHANGED at 22; fifteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.4 + CE 0.1.58 — **fifteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.4).

### What changed

- **`references/plugins.md`** — plugin 1200 row updated with v4 dim list. **R-HIGH-2 EventBridge target verification (item)**: new `_listEventBridgeRuleTargets` helper with defensive pagination; `events:ListTargetsByRule` per matched rule (cap default 10 via `opts.targetVerificationRuleCap`; opt-out via `opts.skipEventBridgeTargetVerification`); new MEDIUM verdict `*-alerting-destination-targetless` for sink-less rules. **R-MEDIUM-2 multi-failedAccount surface**: Inspector2 helper return-shape `{accountStatus, accessDenied, failedAccounts: array}` (renamed plural; capped at AWS-documented 100); caller emits one LOW per failed account with per-region emission cap 10 + rollup LOW per region. **R-LOW-2 trigger uniformity**: GuardDuty alerting-destination trigger gates on `detector.Status === ENABLED` (symmetric with Inspector2). **5 R1 reviewer folds applied** (0 R-CRITICAL — clean review pass): R-HIGH-1 cap-skew classifier branch (LOW UNVERIFIABLE not MEDIUM TARGETLESS when cap-exceeded rules could be the actual sink) + R-HIGH consolidated pagination + JSDoc clarity + R-MEDIUM-1 multi-failedAccount per-region emission cap (10 + rollup) + R-MEDIUM-4 boundary tests + R-HIGH-2 dead-target documented-limitation note.
- **`SKILL.md`** — "post-EE 0.6.3" → "post-EE 0.6.4"; plugin count enumeration stays at 22.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why the catalog refresh matters

AI coding agents using this skill now know that plugin 1200:

- **Verifies EventBridge target presence per matched rule** — a rule with zero `Targets` (or just `ENABLED` state but no targets configured) routes to MEDIUM TARGETLESS instead of PASS. Closes the substrate-without-sink false-PASS class at the rule level.
- **Emits one LOW per failed Inspector2 account** for delegated-admin scans — was first-failedAccount-only pre-fold; rest were silently dropped. Per-region emission cap of 10 + rollup LOW per region bounds finding pollution.
- Exposes new operator opts: `skipEventBridgeTargetVerification: true` (cost-sensitive opt-out OR no IAM grant) + `targetVerificationRuleCap: 1..100` (per-rule verification cap; default 10).
- **Distinguishes cap-skew unverifiable from sink-less rules** — when target-less rules exist AND others are beyond the verification cap (could be the real sink), emits LOW UNVERIFIABLE with `capExceeded: true` per `[[conservative_classifier_principle]]` rather than overclaiming MEDIUM TARGETLESS.

### Documented limitation queued for 0.6.5

The target COUNT is verified but per-target LIVENESS is not (Target.Arn could point to deleted Lambda / detached SNS topic). The soc2.json PASS rationale now calls this out explicitly; a companion-LOW finding for dead-target ARNs is queued for the 0.6.5 cycle (would require ~6 new IAM grants on Lambda / SNS / SQS / etc.).

### Compatibility

No agent-skill API surface changes; pure documentation refresh. AI agents using earlier agent-skill versions against EE 0.6.4 still work, they just lack the v4 dim awareness.

**Customer install (paired):**

```bash
npm install -g nsauditor-ai@0.1.58 @nsasoft/nsauditor-ai-ee@0.6.4
npm install nsauditor-ai-agent-skill@0.1.25
```

---

## 0.1.24 — Catalog refresh: plugin 1200 v3 alerting-destination dim — paired with EE 0.6.3 trio-publish (patch-level extension: substrate-without-sink false-PASS closure via EventBridge rule + SecurityHub product subscription detection; R-CRITICAL Inspector Classic ARN-collision fold; SH-only MEDIUM tier; plugin count UNCHANGED at 22; fourteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.3 + CE 0.1.57 — **fourteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.3).

### What changed

- **`references/plugins.md`** — plugin 1200 row updated with v3 dim list. NEW alerting-destination dim (item c) verifies EventBridge rule + SecurityHub product subscription per service per region. New SDK deps `@aws-sdk/client-eventbridge` + `@aws-sdk/client-securityhub` (optionalDependencies). 4 same-session R1 reviewer folds applied: R-CRITICAL-1 SH product ARN substring collision closure (Inspector Classic vs Inspector2; boundary-anchored helper) + R-HIGH-1 SH-only PASS narrative split (SH-only is MEDIUM aggregation-only; auditor walkthrough required for SH → downstream paging) + R-HIGH-3 EventBridge content-filter grammar (`{prefix}` / `{wildcard}` matchers; regex-meta escape for operator IaC defense) + R-LOW-1 source case normalization. Also surfaces R-MEDIUM-2 (Inspector2 helper return-shape `{accountStatus, accessDenied, failedAccount}`) + item (d) BatchGetAccountStatus contract verification with `failedAccounts[]` per-account error channel surfaced via new `_CAT_INS_FAILED_ACCOUNT` LOW.
- **`SKILL.md`** — "post-EE 0.6.2" → "post-EE 0.6.3"; plugin count enumeration stays at 22 (existing plugin grew in scope).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why the catalog refresh matters

AI coding agents using this skill now know that plugin 1200:

- Audits **alerting-destination presence** per service per region (closing the substrate-without-sink false-PASS class) — operators wiring GuardDuty / Inspector2 without an EventBridge rule or SecurityHub integration get a HIGH finding rather than a misleading PASS.
- Distinguishes **PASS** (EventBridge rule present), **MEDIUM SH-only** (SecurityHub aggregates but no proactive paging), **HIGH missing** (no path), and **LOW unverifiable** (AccessDenied / SDK unavailable).
- Supports **EventBridge content-filter grammar** — `{prefix: "aws."}` catch-all rules and `{wildcard: "aws.guard*"}` glob rules both match correctly.
- Exposes new operator opt: `skipAlertingDestination: true` for cost-sensitive runs.
- Distinguishes a **true AccessDenied** from an **empty-body response** (R-MEDIUM-2 close-out) — `_getInspector2AccountStatus` no longer conflates the two cases.
- Surfaces the **AWS-published `failedAccounts[]` per-account error channel** with `errorCode + errorMessage` via new `_CAT_INS_FAILED_ACCOUNT` LOW (item d close-out).

### R-CRITICAL-1 closure (worth a callout)

The pre-fold substring check `:product/aws/inspector` would have matched BOTH Inspector Classic (deprecated 2024) and Inspector2 ARNs — a substrate-without-sink false-PASS where a stale Classic subscription emitting zero findings would have satisfied the Inspector2 dim. The R-CRITICAL fold uses boundary-anchored substring matching + the strict `/aws/inspector2` constant, and pins the regression with a dedicated test that asserts the Classic ARN does NOT match the Inspector2 dim.

### Compatibility

No agent-skill API surface changes; pure documentation refresh. AI agents using earlier agent-skill versions against EE 0.6.3 still work, they just lack the v3 dim awareness.

**Customer install (paired):**

```bash
npm install -g nsauditor-ai@0.1.57 @nsasoft/nsauditor-ai-ee@0.6.3
npm install nsauditor-ai-agent-skill@0.1.24
```

---

## 0.1.23 — Catalog refresh: plugin 1200 v2 evidence-acquisition extension — paired with EE 0.6.2 trio-publish (patch-level extension: multi-region GuardDuty + Inspector2 enumeration + GovCloud / ISO region support + `FindingPublishingFrequency` check + Inspector2 baseline expansion; plugin count UNCHANGED at 22; thirteenth consecutive trio-publish)

**Trio-publish institutionalization continued.** Paired with EE 0.6.2 + CE 0.1.56 — **thirteenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.2).

### What changed

- **`references/plugins.md`** — plugin 1200 row updated with v2 dim list. Multi-region enumeration (item a) replaces single-region scope; `FindingPublishingFrequency` check (item b) added as CC7.1 detection-latency dimension; Inspector2 baseline expansion (item e) grows scan-target baseline from {ec2, ecr, lambda} → {ec2, ecr, lambda, lambdaCode, codeRepository}. 4 same-session R1 reviewer folds applied (0 R-CRITICAL clean review pass): R-HIGH-1 region regex GovCloud + ISO support (closes FedRAMP / StateRAMP / IL5+ false-PASS class) + R-HIGH-2 frequency ordering not equality + R-MEDIUM-1 region cap defensibility + R-LOW-1 EC2 client instrumentation parity.
- **`SKILL.md`** — "post-EE 0.6.1" → "post-EE 0.6.2"; plugin count enumeration stays at 22 (existing plugin grew in scope).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why the catalog refresh matters

AI coding agents using this skill now know that plugin 1200:

- Audits GuardDuty and Inspector2 across **all opted-in regions** by default (not just the client's configured region).
- Supports **GovCloud (`us-gov-*`) and ISO (`us-iso*-*`) regions** — operators on those substrates were silently skipped pre-0.6.2.
- Classifies the GuardDuty `FindingPublishingFrequency` against an institutional baseline of 15 minutes (operator-tunable).
- Treats Inspector2 Lambda code scanning and code-repository scanning as part of the institutional baseline (Inspector2 GA 2024+ scan-target additions).
- Exposes operator opts: `regions: string[]` / `skipMultiRegion: true` / `regionListCap: 1..256` / `gdFrequencyPassFrequency: FIFTEEN_MINUTES | ONE_HOUR | SIX_HOURS`.

### Compatibility

No agent-skill API surface changes; pure documentation refresh. AI agents using earlier agent-skill versions against EE 0.6.2 still work, they just lack the v2 dim awareness.

**Customer install (paired):**

```bash
npm install -g nsauditor-ai@0.1.56 @nsasoft/nsauditor-ai-ee@0.6.2
npm install nsauditor-ai-agent-skill@0.1.23
```

---

## 0.1.22 — Catalog refresh: NEW plugin 1200 AWS Inspector2 / GuardDuty Enablement Auditor — paired with EE 0.6.1 trio-publish (patch-level new-plugin extension — first AWS-managed-threat-detection substrate audit; plugin count 21 → 22)

**Trio-publish institutionalization continued.** Paired with EE 0.6.1 + CE 0.1.55 — **twelfth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.1).

### What changed

- **`references/plugins.md`** — **NEW plugin 1200 row** added: 4 active SOC 2 dimensions (GuardDuty Detector enablement per region CC7.1, GuardDuty protection-feature coverage CC7.1 — institutional baseline S3_DATA_EVENTS / EKS_AUDIT_LOGS / EBS_MALWARE_PROTECTION / RDS_LOGIN_EVENTS / LAMBDA_NETWORK_LOGS / RUNTIME_MONITORING, Inspector2 enablement CC7.1+CC7.2, Inspector2 scan-target coverage CC7.1 zero / CC7.2 partial). First AWS-managed-threat-detection substrate audit. HIGH on `gd-not-enabled` silent-blind class; HIGH on `inspector2-disabled` / SUSPENDED silent-blind class for CVE coverage on EC2/ECR/Lambda; HIGH on `inspector2-coverage-zero` (enabled overall but zero scan targets active); MEDIUM on partial coverage with explicit `disabledResources`. **6 same-session R1 reviewer folds applied** including R1-CRITICAL-1 soc2.json titlePattern misalignment closure (4 patterns; would have silently failed CC7.1/CC7.2 compliance routing) + R1-CRITICAL-1 AccessDenied distinct findings + R1-CRITICAL-2 legacy DataSources case normalization + R1-HIGH-2 SUSPENDED/DISABLED Detector silent-blind closure + R1-HIGH-3/4 dead-code drift closures.
- **`SKILL.md`** — plugin count enumeration 21 → 22; "post-EE 0.6.0" → "post-EE 0.6.1".
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.22
# (paired with EE 0.6.1 + CE 0.1.55; AI-coding-agent users only)
```

---

## 0.1.21 — Catalog refresh: NEW plugin 1160 AWS VPC Endpoints / PrivateLink Auditor — paired with EE 0.6.0 trio-publish (minor-version milestone — first new plugin since EE 0.4.7; plugin count 20 → 21)

**Trio-publish institutionalization continued.** Paired with EE 0.6.0 + CE 0.1.54 — **eleventh consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.6.0). Opens the v0.6.x line with new plugin breadth.

### What changed

- **`references/plugins.md`** — **NEW plugin 1160 row** added: 4 SOC 2 dimensions (endpoint policy permissive principals CC6.6, PrivateDNS enabled CC6.6, endpoint state A1.2+CC7.2, type substrate Privacy+CC6.6). First plugin to specifically audit the PrivateLink isolation boundary. CRITICAL on unconditional wildcard breaking isolation; MEDIUM on PrivateDNS-disabled silent-bypass; HIGH on `failed` state silent-failure.
- **`SKILL.md`** — plugin count enumeration 20 → 21; "post-EE 0.5.4" → "post-EE 0.6.0".
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.21
# (paired with EE 0.6.0 + CE 0.1.54; AI-coding-agent users only)
```

---

## 0.1.20 — Catalog refresh: cross-plugin Thread H sweep — §7.5 `_promote*FromKms` signature hardening (plugin 1140 v2 + 1180 v2) + §8 operator-config DoS caps (plugin 1170 v2) — paired with EE 0.5.4 trio-publish

**Trio-publish institutionalization continued.** Paired with EE 0.5.4 + CE 0.1.53 — **tenth consecutive trio-publish across EE + CE + agent-skill in a single session** (0.4.5–0.5.4). Final v0.5.x close-out cycle.

### What changed

- **`references/plugins.md`** — cross-plugin notes added: plugins 1140 v2 + 1180 v2 `_promote*FromKms` accept BOTH legacy `keyManager` string OR new `keyManagerByArn: Map<arn, keyManager>` form (Map looks up by `finding.details.kmsKeyArn` — single source of truth; closes parallel-threading false-CLEAN class). Plugin 1170 v2 adds `_OPERATOR_CONFIG_MAX_ENTRIES = 1000` constant + operator-tunable caps via `opts.additionalRestrictedPortsCap` / `opts.additionalSystemManagedSgNamePrefixesCap`.
- **`SKILL.md`** — "post-EE 0.5.3" → "post-EE 0.5.4". EE plugin count UNCHANGED at 20.

### Notes

- Pure catalog refresh; no SKILL contract changes.
- v0.5.x close-out summary: 5 ship cycles (0.5.0–0.5.4). Ready for 0.6.0 milestone.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.20
# (paired with EE 0.5.4 + CE 0.1.53; AI-coding-agent users only)
```

---

## 0.1.19 — Catalog refresh: plugin 1190 AWS SES Email Integrity Auditor v3 extension (Part A DKIM public-key fingerprint capture/pin + Part B in-band DMARC alignment classifier; 5 same-session reviewer folds incl. 1 R-CRITICAL false-CLEAN closure on truncated DKIM keys) — EE 0.5.3; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.5.3 + CE 0.1.52 — **ninth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8/0.4.9/0.5.0/0.5.1/0.5.2). The 0.1.19 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1190 row** updated v2.1 → v3: 2 NEW evidence dimensions (Part A DKIM public-key fingerprint capture/pin + Part B in-band DMARC alignment classifier). NEW emission categories: `ses-dkim-fingerprint-verified` (PASS) / `ses-dkim-fingerprint-mismatch` (HIGH — operator-supplied pin store enables unauthorized rotation / key substitution attack detection) / `ses-dkim-fingerprint-unverifiable` (LOW + evidenceGap) + `ses-dmarc-alignment-strict-met` (PASS) / `ses-dmarc-alignment-relaxed` (INFO) / `ses-dmarc-alignment-dkim-strict-impossible` (HIGH — adkim=s + DKIM disabled) / `ses-dmarc-alignment-spf-strict-impossible` (HIGH — aspf=s + no custom MailFrom) / `ses-dmarc-alignment-unverifiable` (LOW). NEW kill-switches `_skipDkimFingerprintCapture` + `_skipDmarcAlignmentCheck`. R-CRITICAL closure (discovered via test): `_stripControlChars` 256-char truncation corrupted long DKIM keys → new `_stripControlCharsNoTruncate` helper.
- **`SKILL.md`** — plugin 1190 v3 narrative added; "post-EE 0.5.2" → "post-EE 0.5.3". EE plugin count UNCHANGED at 20.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.19
# (paired with EE 0.5.3 + CE 0.1.52; AI-coding-agent users only)
```

### Notes

- No SKILL contract changes; pure catalog refresh.
- Ninth consecutive trio-publish institutionalizes the discipline across 9 ship cycles.

---

## 0.1.18 — Catalog refresh: plugin 1190 AWS SES Email Integrity Auditor v2.1 deferred-items sweep (7 deferred reviewer-fold items closed from 0.5.0 cycle + 6 same-session reviewer folds incl. 1 CRITICAL soc2 mapping closure + silent-loss-class closure on SES classic API quota exhaustion) — EE 0.5.2; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.5.2 + CE 0.1.51 — **eighth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8/0.4.9/0.5.0/0.5.1). The 0.1.18 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin consolidation.

### What changed

- **`references/plugins.md`** — **plugin 1190 row** updated v2 → v2.1: 7 deferred reviewer-fold items closed. NEW emission category `ses-dkim-dns-partial-with-transients` MEDIUM (matched>0 + transient on remainder — preserves partial-match evidence rather than collapsing to LOW). NEW named Sets `_DNS_TRANSIENT_ERROR_CODES` + `_SES_CLASSIC_NOT_FOUND_ERROR_NAMES` + `_SES_CLASSIC_QUOTA_ERROR_NAMES` per [[emit_literal_set_drift]] discipline. NEW module-load-time disjointness IIFE `_assertDnsErrorCodeSetsDisjoint()` promotes invariant from test-time to Node startup. R-LOW-6 producer→consumer identityType normalization at both promoter sites.
- **`SKILL.md`** — plugin 1190 v2.1 narrative added; "post-EE 0.5.1" → "post-EE 0.5.2". EE plugin count UNCHANGED at 20.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why

The agent-skill catalog must stay current with EE plugin consolidation cycles so that AI coding agents (Claude Code / Cursor / Windsurf / VS Code Copilot) querying the skill for plugin-1190 capabilities get accurate guidance on the v2.1 emission categories (especially the new `ses-dkim-dns-partial-with-transients` MEDIUM and the `cause: "classic-sdk-quota-exhausted"` LOW + evidenceGap) — without the catalog refresh, agents would incorrectly tell users that plugin 1190 only emits 4 DKIM-DNS categories and 3 classic-policy categories.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.18
# (paired with EE 0.5.2 + CE 0.1.51; AI-coding-agent users only)
```

### Notes

- No SKILL contract changes; pure catalog refresh.
- `references/schemas.md` + `references/workflows.md` unchanged (no plugin-schema or workflow changes in EE 0.5.2; plugin 1190 v2.1 consolidation uses the same `cloudScanners` capability + same `run()` envelope established in EE-RT.12.25).
- Eighth consecutive trio-publish institutionalizes the discipline across 8 ship cycles.

---

## 0.1.17 — Catalog refresh: plugin 1150 AWS SQS/SNS Auditor v2 extension (5 → 7 dimensions: CloudWatch alarm coverage on SQS ApproximateAgeOfOldestMessage + SNS NumberOfNotificationsFailed; first plugin-1150 dim to cross an SDK boundary — SQS+SNS → CloudWatch) — EE 0.5.1; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.5.1 + CE 0.1.50 — **seventh consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8/0.4.9/0.5.0). The 0.1.17 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1150 row** updated v1 → v2: 5 → 7 dimensions. v1 dims preserved (encryption + transit-policy + topic-policy + DLQ). v2 NEW dims: **dim 6 SQS ApproximateAgeOfOldestMessage CloudWatch alarm coverage** (CC7.2 + A1.2 dual-mapped) — per-queue PASS / MEDIUM (silent backlog growth) / LOW (actions-disabled OR empty AlarmActions) / LOW + evidenceGap (CW SDK unavailable / AccessDenied / name un-extractable / truncated); **dim 7 SNS NumberOfNotificationsFailed CloudWatch alarm coverage** (CC7.2 + A1.2 dual-mapped) — per-topic analogue with same severity ladder. v2 single-fetch budget via `_enumerateMetricAlarms` + `_buildAlarmIndex` (mirrors plugin 1040's `_auditAlarmCoverage` scaffold). Soft-degrade contract: CW SDK load failure routes per-resource to LOW + evidenceGap rather than blocking primary substrate audit. **R-CRITICAL v2 fold (false-CLEAN closure)**: `actionable` requires BOTH `ActionsEnabled=true` AND non-empty `AlarmActions[]` (CloudWatch fires NO operator paging when AlarmActions=[] even with ActionsEnabled=true). **R-HIGH v2 fold**: soc2.json PASS-tier titlePatterns narrowed to anchor on namespace:metric clauses.
- **`SKILL.md`** — plugin 1150 v2 narrative added to enumeration; "post-EE 0.5.0" → "post-EE 0.5.1". EE plugin count UNCHANGED at 20 (no new plugin in 0.5.1; existing plugin 1150 grew in scope across new dims 6 + 7).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### Why

The agent-skill catalog must stay current with EE plugin extensions so that AI coding agents (Claude Code / Cursor / Windsurf / VS Code Copilot) querying the skill for plugin-1150 capabilities get accurate guidance on the v2 alarm-coverage dimensions — without the catalog refresh, agents would incorrectly tell users that plugin 1150 only has 5 dimensions and miss the CC7.2 + A1.2 alarm-coverage outcomes.

### Recommended upgrade path

```bash
npm install nsauditor-ai-agent-skill@0.1.17
# (paired with EE 0.5.1 + CE 0.1.50; AI-coding-agent users only)
```

### Notes

- No SKILL contract changes; pure catalog refresh.
- `references/schemas.md` + `references/workflows.md` unchanged (no plugin-schema or workflow changes in EE 0.5.1; plugin 1150 v2 extension uses the same `cloudScanners` capability + same `run()` envelope established in EE-RT.12.25).
- Seventh consecutive trio-publish institutionalizes the discipline across 7 ship cycles (0.4.5/0.4.6/0.4.7/0.4.8/0.4.9/0.5.0/0.5.1).

---

## 0.1.16 — Catalog refresh: plugin 1190 AWS SES Email Integrity Auditor v2 extension (DKIM CNAME DNS resolution + DMARC TXT record parser + SES classic API parity; first plugin in EE to depend on node:dns/promises for live DNS cross-reference) — EE 0.5.0; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.5.0 + CE 0.1.49 — **sixth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8/0.4.9). The 0.1.16 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1190 row** updated v1 → v2: dim 1 DKIM now includes CNAME DNS resolution (each `<token>._domainkey.<domain>` resolved + matched against `<token>.dkim.amazonses.com`; four outcomes including HIGH `ses-dkim-dns-missing` false-CLEAN closure); dim 2 MailFrom now includes DMARC TXT record parser + MailFrom promotion (RFC 7489 §6.4 tag-list parser; five outcomes including HIGH `ses-dmarc-missing` + HIGH `ses-dmarc-policy-none`); dim 4 sending-auth policies now includes SES classic GetIdentityPolicies cross-API parity (HIGH `ses-classic-policy-discrepancy` on classic-only policies — canonical false-NEGATIVE class). v1 base preserved (TLS + dedicated IP + suppression list dimensions).
- **`SKILL.md`** — plugin 1190 v2 narrative added to enumeration; "post-EE 0.4.9" → "post-EE 0.5.0". EE plugin count UNCHANGED at 20 (no new plugin in 0.5.0; existing plugin 1190 grew in scope across dims 1 + 2 + 4).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### EE 0.5.0 paired-release context

- **EE plugin count UNCHANGED at 20** — the 0.5.0 minor-version milestone bump is a single-plugin EXTENSION (fourth extension cycle after EE-RT.16 v2 in 0.4.6 + EE-RT.14 v3 in 0.4.8 + EE-RT.17 v2 in 0.4.9). Plugin 1190 v2 closes the canonical false-CLEAN window where SES `Status=SUCCESS` substrate alone could not rule out post-verification DNS drift.
- **Part A — DKIM CNAME DNS resolution promotion** (dim 1) — `_resolveDkimCnames` + `_promoteDkimFromDns`. Each `<token>._domainkey.<identityDomain>` CNAME resolved via node:dns/promises + matched against `<token>.dkim.amazonses.com` (case-insensitive per RFC 1035 §2.3.3). Four outcomes: PASS `ses-dkim-dns-verified` / MEDIUM `ses-dkim-dns-partial` / HIGH `ses-dkim-dns-missing` (production false-CLEAN closure) / LOW + evidenceGap `ses-dkim-dns-unverifiable`.
- **Part B — DMARC TXT record parser + MailFrom promotion** (dim 2) — RFC 7489 §6.4 tag-list parser + `_dmarc.<identityDomain>` TXT lookup. Five outcomes. **R-CRITICAL-1 same-session fold (false-CLEAN closure)**: `pct=0` on `p=reject`/`p=quarantine` functionally equivalent to `p=none`; now routes to HIGH `ses-dmarc-policy-none`. **R-HIGH-1 same-session fold (subdomain-takeover false-NEGATIVE closure)**: `sp` subdomain-policy override now evaluated — `p=reject; sp=none` downgrades to HIGH.
- **Part C — SES classic GetIdentityPolicies parity** (dim 4) — `_loadSesClassicSdk` restored (was removed in v1 reviewer-fold MEDIUM as dead-code load-check). Cross-API discrepancy detection emits HIGH `ses-classic-policy-discrepancy` on classic-only policies (canonical false-NEGATIVE class). Conservative on classic SDK unavailable / AccessDenied → LOW + evidenceGap `ses-classic-policy-unverifiable`.
- **8 same-session reviewer folds across the cycle** (1 CRITICAL + 3 HIGH + 2 MEDIUM + 2 LOW); 6 queued in Pick-up Block.
- **First plugin in EE to depend on `node:dns/promises`** — first ship to add NETWORK-LAYER cross-reference to AWS-SDK-substrate evidence baseline; structurally distinct evidence-acquisition surface from prior 0.4.x cycles.
- **Real-DNS smoke validation END-TO-END** against production DNS resolvers — `_dmarc.nsasoft.us` parsed correctly: `p=reject, sp=reject (default), pct=100`; forward-compat `fo=1` tag preserved in `rawTags`. Empty-account SESv2 enumeration baseline succeeded end-to-end against <operator-test-account>.
- **EE full regression: 4787/4787** (was 4696 at EE 0.4.9 publish; +91 tests cumulative across the v2 cycle). 46-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate evidence depth growth on already-covered CC6.1 + CC6.6 via 11 new aws-ses-auditor mapping rules. The 0.5.0 bump (vs the natural 0.4.10) is an institutional milestone marker — first non-0.4.x release in the 0.4.5–0.5.0 trio-publish series + first ship to add NETWORK-LAYER cross-reference.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.16` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.49 @nsasoft/nsauditor-ai-ee@0.5.0`).

---

## 0.1.15 — Catalog refresh: plugin 1180 AWS ElastiCache Redis Auditor v2 extension (kms:DescribeKey promotion + subnet route-table verifier; closes both v1 deferred items) — EE 0.4.9; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.4.9 + CE 0.1.48 — **fifth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5/0.4.6/0.4.7/0.4.8). The 0.1.15 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1180 row** updated v1 → v2: dim 2 at-rest+KMS now includes kms:DescribeKey cross-reference promotion (mirrors plugin 1140 v2 pattern: UNVERIFIABLE `:key/UUID` → PASS/MEDIUM via KeyMetadata.KeyManager); dim 6 subnet placement now includes ec2:DescribeRouteTables verifier (HIGH on IGW-routed subnets with per-subnet `igwDestinationsBySubnet` evidence; PASS on all-verified-private; LOW + evidenceGap on main-RT-inheritance per R-MEDIUM-2 false-NEGATIVE closure; LOW + evidenceGap on AccessDenied). Cross-plugin sister of plugin 1170 SG perimeter (layer-3 subnet→IGW vs layer-4 SG ingress). Per-resource caching (kmsKeyManagerCache + subnetGroupCache + subnetSetRoutingCache).
- **`SKILL.md`** — plugin 1180 v2 narrative added to enumeration; "post-EE 0.4.8" → "post-EE 0.4.9". EE plugin count UNCHANGED at 20 (no new plugin in 0.4.9; existing plugin 1180 grew in scope).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40`.

### EE 0.4.9 paired-release context

- **EE plugin count UNCHANGED at 20** — seventh-ship-cycle in the 0.4.x stream is another single-plugin EXTENSION (third extension cycle after EE-RT.16 v2 in 0.4.6 + EE-RT.14 v3 in 0.4.8). Plugin 1180 v2 closes **both** v1 deferred items (R-MEDIUM-3 KMS-DescribeKey promotion + R-LOW-2 subnet route-table cross-reference).
- **Part A — kms:DescribeKey cross-reference promotion** (dim 2 at-rest encryption; mirrors plugin 1140 v2 pattern). UNVERIFIABLE `:key/UUID` ARN shapes promoted via `KeyMetadata.KeyManager` to deterministic PASS (CUSTOMER) / MEDIUM (AWS). Conservative on AccessDenied / NotFound / unknown KeyManager.
- **Part B — Subnet route-table verifier** (dim 6 subnet placement; closes v1 R-LOW-2). `elasticache:DescribeCacheSubnetGroups` + `ec2:DescribeRouteTables` walk. Per-subnet IGW-route detection via `/^igw-[a-f0-9]+$/i` (correctly excludes egress-only `eigw-`). HIGH on IGW-routed subnet(s) (with per-subnet `igwDestinationsBySubnet` evidence per R-HIGH-1 fold) / PASS on all-verified-private / **LOW + evidenceGap on main-RT-inheritance per R-MEDIUM-2 reviewer-fold false-NEGATIVE closure** (default-VPC main-RT typically routes `0.0.0.0/0 → igw-*`).
- **7 same-session reviewer folds across the cycle** (independent `general-purpose-agent` review yielded 12 findings; 7 folded same-session, 1 deferred to cross-plugin Thread H sweep, 4 withdrawn after verification).
- **No new SDK dependencies** — `@aws-sdk/client-kms` + `@aws-sdk/client-ec2` already declared in optionalDependencies since EE 0.4.5.
- **Real-AWS smoke validation END-TO-END**: smoke against `<operator-test-account>` (no fixture changes needed). `redis-leaky-cache` → dim 6 LOW `elasticache-subnet-main-rt-inheritance` (the R-MEDIUM-2 fold escalation demonstrably firing against the real default-VPC main-RT-inheritance pattern); `findingsBySeverity: { pass:1, medium:3, high:5, low:2, info:1 }`; durationMs=1428. KMS promotion path NOT exercised against real AWS (existing fixtures use alias-form CMK keys; unit tests + plugin 1140 v2 real-AWS validation cover the promotion path).
- **EE full regression: 4696/4696** (was 4642 at EE 0.4.8 publish; +54 tests). 45-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate evidence depth growth on already-covered CC6.6 + C1.1 via 5 new aws-elasticache-redis-auditor mapping rules.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.15` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.48 @nsasoft/nsauditor-ai-ee@0.4.9`).

---

## 0.1.14 — Catalog refresh: plugin 1140 AWS RDS Auditor v3 extension (7 → 10 dimensions; +database audit-logging) — EE 0.4.8; plugin count UNCHANGED at 20

**Trio-publish institutionalization continued.** Paired with EE 0.4.8 + CE 0.1.47 — **fourth consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5 institutionalized the pattern, 0.4.6 confirmed it as institutional discipline, 0.4.7 ratified the cadence). The 0.1.14 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin extension.

### What changed

- **`references/plugins.md`** — **plugin 1140 row** updated to reflect v3 extension (7 → 10 dimensions; +database audit-logging triad: pgAudit / CloudWatch Logs exports / CloudWatch Logs retention; aurora-aware log-path detection per R-HIGH-1 reviewer-fold). Notes the false-PASS closure on `rds-pgaudit-misconfigured` (Postgres silently ignores pgaudit.log when shared_preload_libraries omits pgaudit per R-MEDIUM-2 reviewer-fold). Engine-dispatched essential/optional CloudWatch log type policy via `_RDS_ENGINE_CWL_NAMES` covering mysql/mariadb/aurora-mysql/postgres/aurora-postgresql/oracle-*/sqlserver-* variants.
- **`SKILL.md`** — plugin 1140 v3 enumeration line updated with v3 narrative; "post-EE 0.4.7" → "post-EE 0.4.8". EE plugin count UNCHANGED at 20 (no new plugin in 0.4.8; existing plugin 1140 grew in scope).
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40` (EE 0.4.0-cohort paired-release floor).

### EE 0.4.8 paired-release context

- **EE plugin count UNCHANGED at 20** — sixth-ship-cycle in the 0.4.x stream is a single-plugin EXTENSION rather than NEW plugin. Plugin 1140 `aws-rds-auditor` grew from 7 → 10 dimensions via **EE-RT.14 v3** — first 0.4.x extension cycle of an existing plugin since EE-RT.16 v2 (plugin 1170 RESTRICTED_PORTS extension in 0.4.6).
- Closes the "database activity logs" SOC 2 dimension per `tasks/things-to-check.md` §4 audit-canonical checklist (CC7.2 + CC7.3 continuous monitoring + event evaluation).
- **9 same-session reviewer folds across the cycle** (independent `general-purpose-agent` review yielded 12 findings; 9 folded same-session, 3 deferred to v3.1 / cross-plugin sweep).
- **HIGH-1 closure** — Aurora cluster log-path detection (pre-fold whole Aurora fleet returned false-INFO MEDIUM on dim 10 because helper hard-coded `/aws/rds/instance/<id>/` even for aurora-* engines that publish to `/aws/rds/cluster/<DBClusterIdentifier>/`).
- **MEDIUM-2 closure** — pgAudit + shared_preload_libraries cross-check (Postgres silently ignores `pgaudit.log` when SPL omits pgaudit = false-PASS class).
- **MEDIUM-3/4/5 closures** — cwl-opt-out + retentionDistribution + non-AccessDenied transient errors all surfaced as distinct categories for auditor evidence-pack legibility.
- **Real-AWS smoke validation END-TO-END**: in-place modification of `rds-compliant-cluster` fixture (cost $0; brief Multi-AZ failover during apply-immediately reboot) validated ALL 3 v3 PASS-path classifiers; unmodified `rds-violator-db` validated HIGH path. **First 0.4.x extension cycle to validate BOTH PASS-path AND HIGH-path classifiers** against real AWS in the same smoke run.
- **EE full regression: 4642/4642** (was 4574 at EE 0.4.7 publish; +68 tests). 44-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate evidence depth growth on already-covered CC7.2 + CC7.3 via 7 new aws-rds-auditor mapping rules.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.14` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.47 @nsasoft/nsauditor-ai-ee@0.4.8`).

---

## 0.1.13 — Catalog refresh: EE plugin count 19 → 20 (plugin 1190 AWS SES Email Integrity Auditor — NEW EE 0.4.7; first plugin in the 1190-1199 ID range)

**Trio-publish institutionalization continued.** Paired with EE 0.4.7 + CE 0.1.46 — **third consecutive trio-publish across EE + CE + agent-skill in a single session** (after 0.4.5 institutionalized the pattern and 0.4.6 confirmed it as institutional discipline). The 0.1.13 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin growth.

### What changed

- **`references/plugins.md`** — added **plugin 1190 row** (AWS SES Email Integrity Auditor; 6 dimensions: DKIM enablement + signing status / custom MailFrom domain alignment / configuration set TLS enforcement / identity sending authorization policy permissive principals / dedicated IP pool sending posture / suppression list state; CC6.1 / CC6.6 / C1.1 / CC7.1-substrate / Privacy-substrate). Notes the **multi-class wildcard detector** (bare `"*"` / `{AWS:*}` / `{Service:*}` / `{Federated:*}` / `{CanonicalUser:*}` / array forms per R-HIGH-4 reviewer-fold) + **distinct HIGH `ses-sending-auth-notprincipal-allow` category** per R-CRITICAL-1 reviewer-fold catching the NotPrincipal+Effect=Allow wildcard-EQUIVALENT class (matches plugins 1070 + 1150 NotPrincipal+Allow discipline) + **LOW + evidenceGap `ses-sending-auth-malformed-statement`** per R-HIGH-2 reviewer-fold for Effect-missing send-action statements + **ZDE invariant** at run() envelope boundary (NEVER reads suppressed-destination email addresses).
- **`SKILL.md`** — added plugin 1190 to the EE plugin enumeration; updated "post-EE 0.4.6" → "post-EE 0.4.7"; bumped EE plugin count 19 → 20 and ID range 1020-1180 → 1020-1190 in the Editions table.
- **`README.md`** — bumped EE plugin count 19 → 20 and ID range 1020-1180 → 1020-1190 in the Editions table.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40` (EE 0.4.0-cohort paired-release floor).

### EE 0.4.7 paired-release context

- **EE plugin count: 19 → 20** — fifth plugin-count growth in the 0.4.x cycle. NEW plugin **1190 AWS SES Email Integrity Auditor** (EE-RT.18 v1) covers 6 SOC 2 evidence dimensions spanning confidentiality + email-integrity. Closes the next-highest-priority gap from `tasks/things-to-check.md` AWS SOC 2 audit-canonical compliance checklist after Redis closed in 0.4.6. Dual API surface discipline: v1 uses SESv2 only (canonical modern API surface covers all 6 dimensions); `@aws-sdk/client-ses` declared in optionalDependencies for v2+ cross-API parity.
- **11 same-session reviewer folds across the cycle** — **ties the single-cycle reviewer-fold record** for security-classifier-correctness-surface plugins (independent `general-purpose-agent` review yielded 12 findings; 11 folded same-session, 1 deferred to cross-plugin Thread H sweep).
- **CRITICAL-1 closure** — NotPrincipal+Effect=Allow distinct HIGH category (pre-fold silently classified as bounded = false-CLEAN class).
- **HIGH-4 closure** — `_isWildcardPrincipal` walks every Principal class value (pre-fold only `principal.AWS` was inspected, leaking `{Service:"*"}` + `{Federated:"*"}` as silent CLEAN).
- **HIGH-2 closure** — missing-Effect on send-action statement now surfaces LOW + evidenceGap `ses-sending-auth-malformed-statement` (was silent-dropped pre-fold).
- **Fourth EE plugin to ship without smoke-time SDK hotfix** — preemptive `@aws-sdk/client-ses` + `@aws-sdk/client-sesv2` addition.
- **EE full regression: 4574/4574** (was 4458 at EE 0.4.6 publish; +116 tests across the cycle: 94 EE-RT.18 v1 unit-test suite + 22 reviewer-fold pin tests). 43-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate-evidence depth growth on already-covered CC6.1 / CC6.6 / C1.1 via 8 new aws-ses-auditor mapping rules.
- **No real-AWS smoke against violation-tier fixtures** — <operator-internal-test-infra-repo> has NO SES paired fixtures yet (full-stack fixtures deferred to EE-RT.18 v2 alongside DKIM CNAME DNS resolution + DMARC TXT record parsing). Empty-account smoke baseline against <operator-test-account> DID succeed end-to-end (plugin loads via CE→EE binding, all 4 SESv2 API enumerations succeed, baseline 2 INFO findings emit correctly, durationMs=842, ZDE invariant preserved).
- **Memory tag closures:** `aws_string_case_normalization` at **20×** with explicit SPLIT-SURFACE callout (DKIM/Tls/MailFromStatus enums upcased / IAM Action/Effect lowercased); `conservative_classifier_principle` reinforced in 5 new fold sites; `emit_literal_set_drift` extended with `_DKIM_STATUS_VALID` + `_MAILFROM_STATUS_SUCCESS` + `_TLS_POLICY_VALID` named-constant discipline.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.13` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.46 @nsasoft/nsauditor-ai-ee@0.4.7`).

---

## 0.1.12 — Catalog refresh: EE plugin count 18 → 19 (plugin 1180 AWS ElastiCache Redis Auditor; plugin 1170 v2 RESTRICTED_PORTS 13 → 23 ports per CIS AWS Foundations v3.0)

**Trio-publish institutionalization.** Paired with EE 0.4.6 + CE 0.1.45 — second trio-publish across EE + CE + agent-skill in a single session, institutionalizing the pattern that started with the 0.4.5 cycle (closing 14 months of stale catalog drift). The 0.1.12 refresh keeps the AI-coding-agent knowledge surface current with the latest EE plugin growth.

### What changed

- **`references/plugins.md`** — added **plugin 1180 row** (AWS ElastiCache Redis Auditor; 6 dimensions: transit + at-rest+KMS / AUTH / Multi-AZ / SnapshotRetention / subnet; CC6.1 / CC6.2 / CC6.6 / A1.2 / C1.1). Updated plugin **1170 row** to reflect v2 RESTRICTED_PORTS extension (13 → 23 ports per CIS AWS Foundations v3.0; adds Redshift, K8s API, etcd, Kibana, InfluxDB, Kafka, Consul, ZooKeeper, Vault) + new `opts.additionalRestrictedPorts` operator-config knob + per-SG cardinality cap + system-managed-SG name-prefix exclusion list.
- **`SKILL.md`** — added plugin 1180 to the EE plugin enumeration; updated "post-EE 0.4.5" → "post-EE 0.4.6"; bumped EE plugin count 18 → 19 and ID range 1020-1170 → 1020-1180 in the Editions table.
- **`README.md`** — bumped EE plugin count 18 → 19 and ID range 1020-1170 → 1020-1180 in the Editions table.
- **`peerDependencies`** floor: unchanged at `nsauditor-ai >=0.1.40` (EE 0.4.0-cohort paired-release floor).

### EE 0.4.6 paired-release context

- **EE plugin count: 18 → 19** — fourth plugin-count growth in the 0.4.x cycle. NEW plugin **1180 AWS ElastiCache Redis Auditor** (EE-RT.17 v1) covers 6 SOC 2 substrate-evidence dimensions spanning confidentiality + availability + segmentation. Dual API enumeration (DescribeReplicationGroups + DescribeCacheClusters) with inter-API dedup; Memcached out-of-scope by design.
- **Plus EE-RT.16 v2** — plugin 1170 RESTRICTED_PORTS grown 13 → 23 ports per CIS AWS Foundations v3.0 + operator-config + per-SG cardinality cap with rollup trailer + system-managed-SG name-prefix exclusion list.
- **10 same-session reviewer folds across the cycle** (7 EE-RT.16 v2 incl. 2 CONVERGENT-CRITICAL findings + 3 EE-RT.17 v1) — most-folds-in-a-single-cycle for 0.4.x to date.
- **Third EE plugin to ship without smoke-time SDK hotfix** — preemptive `@aws-sdk/client-elasticache` addition.
- **EE full regression: 4458/4458** (was 4361 at EE 0.4.5 publish; +97 tests). 42-session 100% green streak preserved.
- **Coverage matrix UNCHANGED at 10/4/33** — substrate-evidence depth growth on already-covered CC6.1 / CC6.2 / CC6.6 / A1.2 / C1.1.

**Recommended install path:** `npm install nsauditor-ai-agent-skill@0.1.12` (for AI-coding-agent users; pair with `npm install -g nsauditor-ai@0.1.45 @nsasoft/nsauditor-ai-ee@0.4.6`).

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
