---
name: build-alamasy-brand-manual
description: Build, revise, implement, or audit the authoritative Brand Operating Manual and design system for الاماسي (Alamasy Copy Center), a Kuwait-based printing, copying, custom-products, and transaction-assistance project. Use for its logo, naming, colors, typography, site UI, order journey, WhatsApp copy, print collateral, storefront, marketing, visual assets, or brand governance, grounded in mistertee1/alamasy-copy-center.
---

# Brand Operating Manual — الاماسي

Create an **executable system**, not a conventional brand book. Default deliverable language: concise professional Arabic; retain English names for code and production specifications. The user's latest directions override this skill. Do not reuse another company's manual.

## 1. Re-establish evidence before deciding

1. Inspect `https://github.com/mistertee1/alamasy-copy-center` or the user's newer source; check the default branch, current commit, assets, copy, components, operations, and any owner-approved logos. Read [references/project-context.md](references/project-context.md) for a dated starting map, **then verify** facts against the current source. Never mistake the reference snapshot for a permanent truth.
2. Build an internal ledger: `decision/fact | source path or user instruction | existing/owner-approved/proposed | publication risk`. Explicit user decisions take precedence over prior approved assets, then implementation, then this skill's proposal.
3. Use the **exact Arabic name supplied by the owner, `الاماسي`**. The repo currently uses descriptive copy such as `مكتبة وخدمات الطباعة`; this is not evidence of a finalized trading name or logo. Treat `Alamasy` as a slug-derived English candidate, not a verified registered Latin name. Never assert government affiliation, licensure, guaranteed processing, delivery speeds, or accreditation without evidence.
4. Separate three layers: **brand identity for الاماسي**, **third-party channels** (WhatsApp, KNET, government portals), and **customers' uploaded print artwork or official papers**. Never recolor, watermark, crop, or modify the latter to enforce the brand.
5. Audit apparent placeholders: a generic printer glyph is not a logo master; generated/staged visuals and sample videos are not proof of a physical branch, staff, machines, or actual orders. Do not publish illustrative content as documentary photography.

## 2. Define the operating scope from real surfaces

Use [references/system-scope.md](references/system-scope.md) to select systems and their non-negotiable rules. For this project, cover at minimum:

- Arabic naming, descriptor, brand hierarchy, value proposition, service taxonomy, legal/claims boundaries.
- Logo construction/variants, color semantics, type and numerals, grids, spacing, shape, iconography, image provenance, illustration and motion.
- Responsive RTL website: navigation, service catalog, quick print, file-upload/preflight, pricing calculator, clearance-service request, bespoke request, order tracking, receipt, contact, WhatsApp handoff, state and error messaging.
- Brand-owned customer touchpoints: shopfront and wayfinding, in-store sample displays, desk signage, staff badges when applicable, branded sleeves/bags, order labels, receipts, estimate/quotation sheets, WhatsApp/phone scripts, social ads and promotional photography.
- Production handoff for brand-owned print pieces: spot/CMYK decisions, bleed, safe area, resolution, PDF export, proofs, legibility and supplier approval.
- Ownership, release version, approval workflow, change requests, file naming and regression tests.

Exclude vehicles, trade shows, branch franchises, unrelated packaging SKUs, uniforms or exhibition stands unless a real/committed use case warrants them. Products *offered to customers* (e.g., roll-ups and mugs) do not imply that الاماسي needs its own expo booth or mug merchandise.

## 3. Make decisions that can be implemented

1. Use [assets/alamasy.tokens.json](assets/alamasy.tokens.json) as a **source-derived proposed baseline**. Reconcile every value with current approved assets and accessibility before promoting to normative release tokens. Encode finalized tokens in CSS variables/design-token JSON and explicit Figma/component mappings if requested. Don't scatter unexplained Tailwind colors in the finished system.
2. For each selected system, provide one source-of-truth specification: `ID | rule | measurable values | positive example | prohibited example | acceptance test | owner/file`. State actual dimensions, breakpoints, color codes, contrast thresholds, type weights/sizes, assets and formats, rather than words like "modern" or "premium".
3. If the user asks for a **complete, ready-to-use manual** and no logo master exists, generate a real vector logo and its positive/reverse/one-color variants, grid, clearspace and small-size tests as part of the output. Use a vector/code-native method for precise artwork; outline or legally package licensed fonts. Do not call an emoji, Lucide printer icon, font-dependent placeholder or mockup a finished logo. If artwork cannot be completed, mark it explicitly as a release blocker—never assert total readiness.
4. Resolve proposed decisions deliberately. Existing visuals may guide continuity, but remove arbitrary accents and inconsistent typography when that improves cohesion. If a new decision changes the current app, provide a file-by-file migration map; **do not mutate live code, deploy or publish** unless the current user explicitly requests implementation.
5. Use one rule once. Reference its ID from later applications instead of repeating it. Every page must specify a change a designer, developer, marketer or print vendor can execute; delete theory, history, storytelling and padding.
6. Do/Don't examples must be **project-specific**: show a true print-order CTA versus an unverified promise, a safe customer PDF handoff versus a brand watermark on a client's government paper, an authentic branch photo versus a generated illustration labeled as the branch.

## 4. Mandatory production safeguards

- **Accessibility:** WCAG AA contrast at least 4.5:1 for normal text and 3:1 for large text and essential graphical controls; don't depend on color alone. Arabic body readable on mobile (normally >= 14 px); visible keyboard focus; logical RTL tab and reading order; explicit LTR islands for phone numbers, order IDs and file extensions.
- **Trust:** Separate customer data from sample assets; don't expose civil IDs, passports, documents or third-party logos in marketing without proper permission. Distinguish requested, estimated, reviewed and confirmed prices and timings. Do not imply official government endorsement of a private assistance service.
- **Media:** Require asset ledger with provenance, commercial license/permission, usage, alt text, crop zone and expiry. Prohibit fictional "صور الفرع" labels for illustrative media and unrelated sample videos presented as proof of work.
- **Motion:** Respect reduced-motion, keep interaction feedback short and optional; status animation/sound must not imply a real backend event unless verified.
- **Printing:** Specify sRGB digital exports separately from vendor-managed CMYK/spot workflows; prescribe print specs in [references/system-scope.md](references/system-scope.md), including proof checks. Protect original customer artwork and legal documents from automatic branding.
- **Operational copy:** State whether an action *opens WhatsApp*, *saves locally*, *sends to staff*, *confirms acceptance*, or *starts production*. Never claim one action has happened when the code only does another.

## 5. Deliverables and release protocol

For a **full build**, output, in engineering order:

1. A compact brand decision register with source/approval status and a current repository commit.
2. The operating manual with numbered rules, exact Do/Don't examples, production values, and clear references to matching implementation files.
3. Machine-readable design tokens, logo/font/media masters and export variants, when in scope; do not fabricate nonexistent assets.
4. A component and touchpoint mapping plus phased migration plan (`P0 trust/accessibility`, `P1 system consolidation`, `P2 new collateral`), each with acceptance criteria.
5. A one-page release sign-off record: tested/failed/not tested, blockers, asset licensing, responsible owner, version and date.

For an **audit**, provide a prioritized deviation table and suggested patches only. For an **implementation**, change only authorized target files, run relevant UI/build/production tests, and report diffs. For a **single-system request**, return that system and only its dependencies, not the whole manual.

Apply [references/release-checks.md](references/release-checks.md) before presenting any result as authoritative. If the requested format is DOCX, PDF, slides or spreadsheet, follow its specialist skill and render/verify the output. If a durable file is requested, persist it through the available approved storage/repository workflow.
