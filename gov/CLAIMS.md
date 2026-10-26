# Metari Government (/gov): factual-claims checklist

Prepared 25 Oct 2026 for Steven's review of PR #21. Covers `/gov/index.html`, `gov/gov-data.js`, the Brain scenes in `gov/gov-brain.js`, and the capability brief PDF.

## Status claims (all stated as planned or in development)

| Claim on the page | Basis | Status |
|---|---|---|
| Campus 01 is planned, not operating | Company status, matches homepage footer | OK |
| Command Center is a prototype; example records simulated | Matches homepage "Where Metari is today" | OK |
| Government program offering is in development | New vertical, no programs exist | OK |
| Delivery availability is contingent on agreed launch requirements | Brief §5.I | OK |
| Metari is a member of NVIDIA Inception (official badge, not redrawn) | Accepted 7 Oct 2026; same SVG as homepage | OK. Badge used as membership only, with "not an endorsement, investment or government approval" |
| No security authorizations, certifications, clearances, registrations or contract vehicles held | Brief §5.I | OK. No FedRAMP, CMMC, NIST accreditation, Section 508, clearance, ITAR, SAM, CAGE or vehicle is named or implied |

## Things the page deliberately does not say

- No agency, prime, laboratory or manufacturer is named as a customer, partner or participant.
- The 1X LOI is not mentioned anywhere on /gov or in the PDF.
- No pilot, free trial, complimentary collection, trial duration, delivery date, reserved capacity or rate.
- No fundraising amount, investor information or legal entity name.
- No real solicitation number is used. Example records are GOV-DEMO-001 to 003, all labelled illustrative.
- No result is shown as measured. Results read "Not measured"; reviewer disposition reads "Not reviewed"; artifacts read "Not produced".
- No "Live" camera labels. Brain scene cards read "Concept · ceiling camera" / "Concept · wall camera" and carry a "Synthetic" tag.
- No universal readiness score.
- The ERDC/CERL 30 Oct 2026 deadline is not on the site or in the PDF.
- NSF X-Labs (R6) and NIST response-robot methods (R7) are not on the page; they stay in the private research context.

## Research context sources (checked 25 Oct 2026)

| Card | What the page says | Verified against |
|---|---|---|
| NIST Humanoid Robot Baseline Performance Benchmark, updated May 15, 2026 | Proposed locomotion and manipulation tasks with measurable metrics; NIST has asked interested parties about serving as participating test facilities | NIST page, fetched 25 Oct 2026 |
| Related: NIST Physical AI and Data Generation for Robotics, updated April 24, 2026 | Listed as related only | Date from the build brief; page not fetched (site allowlist). Re-check before external use |
| ERDC/CERL Commercial Solutions Opening, solicitation file dated Dec 19, 2025 | Lists robotics for engineering operations and infrastructure inspection systems among its areas of interest; competitive route, not a standing purchase; broad areas generally carry no specific funding | Third-party summary of the CSO (bwcoconsulting.com) and the build brief. The erdcwerx.org page itself could not be fetched from this session; re-check the live solicitation |
| DOE, Oct 8, 2026: four laboratory-led selections (Argonne MAESTRO, Brookhaven DART, Oak Ridge TRACE, SLAC SPIRE) | Selected for award negotiation; program calls for industry participation tied to laboratory-science missions | energy.gov article fetched 25 Oct 2026 (negotiation status confirmed). Industry-participation wording from the brief's LAB 26-3601 summary |

Qualifier shown under the cards: "Public sources informing our proposed approach. No affiliation, endorsement, award, or customer relationship is implied."

## Imagery

- All new images are generated concept visualizations (Higgsfield, gpt_image_2_5), labelled "Concept visualization. Proposed environment." in the hero and "Concept images" under the environment cards.
- Hero, facility operations and logistics images (and the matching Brain photos) show the Metari-style concept humanoid, generated with the site's existing humanoid as reference (Steven's decision, 25 Oct). Maintenance and inspection keep a robotic arm and a tracked inspection platform. No manufacturer logos. Captions and alt text match what each image shows: operator lifting a tote, humanoid in a taped zone, evaluator with tablet behind a barrier, fixed cameras on tripods and trusses.
- No third-party facility photographs, agency seals, flags or weapons.

## Items for Steven to confirm

1. "We reply to qualified inquiries about paid data production, evaluation and teaming" (contact lead). Fine to state that work is paid?
2. Form uses the homepage Web3Forms key. Delivery to steve@metari.io is still unconfirmed from earlier work. No test submission was sent.
3. "Programs are designed with partners" (readiness card). Accurate today?
4. "Consent for every expert and participant" listed as a requirement to agree per program.

## Flagged on other pages (not changed)

- `/health` Brain cards say "Live · wall camera" / "Live · corner wall camera". Same issue as the homepage Brain cards (already raised 25 Oct).
- `/health` uses absolutes the gov brief avoids: "The data does not exist." and "Live hospitals are closed to collection."
- Homepage still uses "pilot" in the Command Center tour ("scope an evidence-led pilot"), the configurations note ("supervised pilots"), the Deployment section ("Pilot floor") and the cycle overlay ("Supervised pilots and feedback").
- Homepage references `assets/story/hero-clean-1280.webp`, `hero-clean-2560.webp` and `hero-clean-portrait.webp`, which are not in the repository (404 locally). Check whether the live hero image loads.

## Changed on other pages (needed for the Government link)

- Homepage nav: "Government" link after "Health"; nav now collapses to the menu button at 1240px and below (it already overflowed at 1024px).
- Health nav: "Government" link before "Metari"; nav collapses at 1180px and below.
