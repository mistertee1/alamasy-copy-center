# Operating systems and production rules — الاماسي

Select by real touchpoint, not a generic brand-book index. A customer-ordered product (mug, roll-up, banner) is **not** itself a reason to create الاماسي-branded merchandise, expo stands or a fleet livery.

| System | Concrete decisions | Do / Don't |
|---|---|---|
| Naming | Owner spelling, descriptor, branch/location hierarchy, legal-name boundary, bilingual variant sign-off | Do foreground `الاماسي`; don't make the mall name the brand |
| Logo | Master vector, clearspace tied to final mark geometry, compact/stacked/horizontal, reversed/mono, min print/screen size | Do use approved SVG/PDF; don't present Lucide printer glyph as final |
| Color | Semantic roles for brand, neutrals, actions, WhatsApp, status and focus; contrast matrix and vendor swatches | Do use a tested blue+white pair; don't set tiny white text on amber/green without checking |
| Type | Cairo primary, Tajawal fallback, 400/600/700/800 weights, scale, line heights, mixed Arabic/numerals, tabular prices | Do isolate order ID with `dir=ltr`; don't reverse digits in Arabic paragraphs |
| Layout | 4px rhythm, maximum content width, responsive columns, control targets, component radii | Do test 320px mobile and long Arabic copy; don't create page-specific spacing variants |
| Icons / illustrations | Consistent Lucide stroke/size, accessible labels, factual mini-diagrams for file preparation | Do pair icon with status words; don't use color as the only meaning |
| Motion | State-tied transitions and reduced-motion override | Do animate a real upload state; don't simulate completed processing |
| Photography | Authenticated store/staff/press photos, consent, rights, alt text, approved crop | Do label generative image a concept; don't caption it as an actual branch photo |
| Catalog / campaigns | Separate student, corporate print, advertising, gifts and transaction help; pricing conditions, offer expiry | Do specify service and CTA; don't promise all services are certified or instant |
| File intake | Type/size/page-count/paper/finishing controls, errors/retry, proof-approval and estimate/quote distinction | Do state a WhatsApp draft was opened; don't call it an accepted order |
| Tracking / receipt | Exact status keys from `ordersStore.ts`, textual badges, reference ID, pickup instructions, verified amounts | Do label `قيد المراجعة`; don't equate demo timer with real readiness |
| Government-paper assistance | Private-service disclaimer, fee transparency, document privacy, permissions for seals/logos | Do say `نساعد في تجهيز المعاملة`; don't claim ministry endorsement |
| Support / WhatsApp | Inquiry, quotation, proof approval, accepted order, delay, pickup, cancellation templates with distinct states | Do track customer consent; don't promise delivered messages without proof |
| Store / counter | Facade hierarchy, wayfinding, price board, service zones, privacy area, sample wall, pickups | Do show clear mezzanine directions; don't invent permit/dimension approvals |
| Branded collateral | Receipt, quote, proof slip, order label, sample booklet, protective sleeve/bag and optional staff badge | Do brand the sleeve; don't watermark a customer's scanned document |
| Social / ads | Campaign grid, channel-safe logo size, genuine samples and permissions, disclaimers and CTA destination | Do date a limited offer; don't misrepresent stock as completed work |
| Governance | Approval owners, art masters, media rights, printer proof, versioning, component QA, change request | Do block a release on missing master; don't call speculative assets final |

## Quantitative starting rules (override only by documented decision)

- Digital: 320–639px mobile, 640–1023px tablet, desktop from 1024px; max content width 1280px; 16/24/32px horizontal gutters. Use CSS logical properties for RTL.
- Body text: minimum 14px, preferred 16px, line-height 1.6; headings 24/32/40px; 12px only for supplementary legible captions; actionable touch areas at least 44×44px.
- Icons: 24px default, 2px stroke; logo clearspace must derive from actual logo geometry, not a guessed pixel size.
- Motion: 150ms hover/focus and up to 250ms dialog transitions; `prefers-reduced-motion: reduce` removes nonessential motion.
- Digital exports: master SVG logo, sRGB images, transparent PNG variants at tested 1×/2× sizes, never upscale low-resolution art.
- Branded print: vector/PDF masters, 300ppi raster at actual print size; 3mm bleed if content reaches trim, >=3mm safety for small pieces and preferably 5mm+ on larger pieces, unless vendor die-line requires more; embed/outline legally usable fonts and approve proofs.
- Use vendor/substrate-specific CMYK ICC or approved spot ink where appropriate; never infer a universal CMYK recipe directly from a HEX without proof.
- Media aspect ratios and platform safe areas are verified at production time (platform specifications can change). Include editable layout templates and crop guides.

## Omit unless new evidence activates it

Fleet graphics, franchise standards, exhibition stands, own retail product lines, mass-production merchandise and branch-wide uniforms. A confirmed touchpoint, owner and supplier/specification are required before creating a new system.
