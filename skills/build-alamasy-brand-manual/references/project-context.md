# الاماسي — source evidence snapshot

Snapshot: repository `mistertee1/alamasy-copy-center`, branch `main`, commit `5570c0a68e6993e3203f017d4a1e0e97594f7500` (2026-10-21). **Reinspect current source before use.** This is evidence, not the owner's final brand approval.

| Observation | Evidence | Status and constraint |
|---|---|---|
| Owner calls project `الاماسي`; repo slug uses `alamasy` | User brief and repository URL | Arabic owner-given; Latin spelling inferred |
| Arabic-first, RTL React/Vite/Tailwind UI using Lucide icons | `src/App.tsx`, `package.json`, `index.html`, `src/components/Header.tsx` | Existing implementation |
| Printing/copying, student work, promotional print, gifts, bespoke orders, transaction help and order tracking | `src/App.tsx`, `src/data/servicesData.ts`, `src/data/kuwaitClearanceServices.ts` | Existing catalog; operational promises unverified |
| Location described as Naeem Cooperative, Souq Al Qasr, mezzanine, Jahra, Kuwait | `src/data/servicesData.ts` (`STORE_INFO`), `src/components/ContactLocation.tsx` | Claim in source; verify before printing |
| Contact, WhatsApp, working hours and rates kept in shared data | `src/data/servicesData.ts` | Dynamic facts: use live values after confirmation, not hard-coded brand rules |
| Colors blue-600, `#0F172A`, `#F1F5F9`, slate; amber attention; green WhatsApp | `src/App.tsx`, `src/components/Header.tsx`, `src/components/Hero.tsx` | Existing UI style, not a ratified palette |
| Cairo with Tajawal fallback via Google Fonts | `src/index.css`, `index.html` | Existing web type; verify rights/embedding for print |
| Header uses printer pictogram in blue rounded box and generic copy | `src/components/Header.tsx` | Placeholder, not final logo |
| Four staged/generated category images, one described as the store interior | `src/assets/images/`, `src/data/mediaData.ts` | No proof of authenticity or usage rights |
| Example/stock videos included in media gallery | `src/data/mediaData.ts` | Cannot claim they document real machines, staff or orders |
| Order states `reviewing`, `processing`, `ready_for_pickup`, `completed`, `cancelled` | `src/types.ts`, `src/utils/ordersStore.ts` | Implemented vocabulary; verify real state transitions before customer claims |
| Price calculator, file intake, receipts, custom requests and tracking | `src/components/QuickPrint.tsx`, `PricingTable.tsx`, `OrderReceiptModal.tsx`, `CustomServiceRequest.tsx`, `OrderTracking.tsx` | Distinct surfaces and states to brand |
| Some marketing copy asserts instant service/notifications and exact delivery times | `src/components/Hero.tsx`, `src/data/servicesData.ts`, `src/data/mediaData.ts` | Require evidence or qualify |

## First-release priorities

1. Replace generic header/site naming with a consistent owner-authorized naming hierarchy, preserving truthful location details.
2. Make a true vector identity; no completed logo master appeared in the inspected tree.
3. Consolidate blue/navy/neutral styles into tested semantic tokens. Treat WhatsApp green and order statuses as functional colors, not brand primaries.
4. Specify complete RTL flows for file preparation, price estimate, consent, handoff, proof approval, receipt and tracking.
5. Distinguish actual storefront/process photographs from illustrative renderings and demo videos.
6. Prioritize storefront/wayfinding, counter price cards, pickup labels, sleeves, proof slips and support messages; defer speculative fleets/expos.

Do not embed fixed phone numbers, hours, address strings or prices into the long-lived manual. Point to live data and verification ownership instead.
