# Claude Code handoff

Read and follow `AGENTS.md` before changing this repository.

This project uses direct source development in GitHub and the existing Metari Vercel project for hosting. Do not use Lovable or move this site into a new hosted builder.

Current review branch: `preview/micro1-vercel`.
Current concept route: `/micro1/` from `micro1/index.html`.

Keep the homepage, `/1x`, and current production deployment unchanged. Use a pull request and a Vercel Preview Deployment for review. Production publication requires Steven's approval.

The micro1 experience is a proposed partnership demo with simulated orders, counters, facility geometry, and operational events. No real micro1 integration, partnership, facility capacity, or model evaluation is represented. Published micro1 capability statements must be checked against current primary sources before external delivery.

For local preview from the repository root: `python -m http.server 8000`, then open `http://localhost:8000/micro1/`. No npm install or framework build is required. Reuse `/assets/logo-nav.png` and `/assets/property-heatmap.webp` from the repository.

Do not merge solely because a build succeeded. Inspect desktop/mobile rendering, check assets on the real Vercel preview, and test all controls. The three-level schematic is conceptual, not the previously designed full production Command Center.

This file prepares the repository for Claude Code. It does not mean a Claude Code session has been launched.
