# /micro1 partnership concept

Proposed Metari x micro1 domain-specialist physical data and evaluation partnership. **Browser simulation only.** No micro1 integration, partnership, facility, capacity, pricing or model result is represented.

## Routes
- `/micro1/` partnership narrative with an embedded, working order console.
- `/micro1/command-center/` fuller workspace (overview, data orders, environments, human operations, capture & evidence, QA & delivery, evaluation feedback, operational trace).

Both routes use the same model (`js/model.js`) and the same compact state string (`?s=`, mirrored to sessionStorage), so moving between them keeps the chosen order and its progress.

## Files
| Path | Purpose |
|---|---|
| `js/model.js` | Order state machine, deterministic attempt sequence, counts, trace, manifest, URL encoding, timer controller. No DOM rendering, no network except loading the fixtures. |
| `js/views.js` | Shared HTML renderers (metrics, trace, room card, evidence, coverage matrix). |
| `js/architecture.js` | WebGL 2 renderer extracted from `Metari_Command_Center_v10.html`. Local changes listed in its header comment. |
| `js/plans.js` | v10 environment blueprints (camera mounts, paths), design assumptions only. |
| `js/scene.js` | Mounts the renderer; accessible 2D plan fallback (no WebGL 2, `?scene=2d`, or the 2D toggle). |
| `js/app.js`, `js/planner.js` | Partnership page controller and pilot brief builder (local .md/.json export). |
| `js/workspace.js` | Command Center controller. |
| `data/demo-order.json`, `data/demo-episodes.json` | Fictional fixtures, unchanged from the handoff (sha256 in the PR). |
| `data/source-claims.json` | Published-fact namespace: sourced micro1 claims and known unknowns. |
| `img/evidence/*` | Crops of existing Metari concept renderings used as labelled stand-ins for camera views. |

## Accounting
1,320 captured = 1,200 accepted + 72 held for review + 48 rejected. Every one of 48 variants reaches 25 accepted. Each rejected attempt is followed by a recapture (a new attempt ID; the original is kept). Camera streams (3 per episode) never add to episode counts.

## Checks
```
python3 tools/validate_micro1_fixtures.py
node tools/test_micro1_model.js
python3 -m http.server 8000   # then open /micro1/ and /micro1/command-center/
```

## Not access control
Pages are `noindex` and disallowed in robots.txt. That is not protection. Use Vercel deployment protection or server-side auth if confidentiality is required.
