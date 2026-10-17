# Intro animation analysis

## Reference access and confidence

The reference URL `https://demo.codeandchill.store/portfolio/` was requested from the web inspection tool, which reported that the URL is inaccessible. No reference intro recording or timestamped intro frames were supplied with this request. Therefore the reference's exact timings, easing, transforms, typography during transition, breakpoints, and hover states could not be verified. No reference measurements are claimed below.

The specification below describes the current implementation. Its timings are derived from the GSAP labels and durations in `script.js`; positions and appearance are derived from the current CSS and JavaScript. They are source facts, not measured observations of the reference or a fresh browser recording.

## Current implementation timeline

| Time (s) | Element / state | Start → end | Opacity / scale / rotation / blur | Transform origin | Easing, duration, overlap |
|---|---|---|---|---|---|
| 0.00–0.24 | Dot appears at viewport center | scale `.2` → `1` | opacity `0` → `1`; no rotation or blur tween | Center of dot | `power2.out`, 0.24s; followed by a 0.42s hold |
| 0.66–1.24 | Dot forms an I | 36–52px dot → 8×104px rounded vertical glyph | I text opacity `0` → `1` from 0.92–1.24s; dot background fades 1.08–1.24s | Center of dot and I | Dot `power2.inOut`, 0.34s; I `power2.out`, 0.32s; they overlap |
| 1.54–1.92 | I shoots and light trail moves | center → `39vw` horizontal offset | dot fades out; trail opacity rises to `.92` and fades; no blur tween | No custom origin; CSS/element center | `power3.in`, 0.38s; trail fade begins at 1.68s for 0.24s |
| 1.62–2.86 | `SUSATWIK MANURI` assembles | Glyphs begin distributed across ±45vw and settle to measured positions; initial Y offsets up to 42px | opacity `0` → `1`; scale `.68`–`.92` → `1`; rotation up to 50° → `0`; no blur tween | Default center per glyph | `power2.out`, 0.78s per glyph, 0.035s stagger; begins 0.08s after shot start |
| 2.92–3.96 | Name changes into `PORTFOLIO` | Name glyphs scatter; nine title glyphs converge on measured positions | source opacity fades; target opacity `0` → `1`, scale `.88` → `1`; source rotation varies; no blur tween | Default center per glyph | Source scatter `power2.in`, 0.62s; matched glyphs `power2.inOut`, 0.68s; target glyphs `power2.out`, 0.42s with 0.035s stagger. Paths overlap |
| 4.10–4.72 | Title descends | center position → computed hero-bottom position | no opacity, scale, rotation, or blur change | Word center | `power2.inOut`, 0.62s |
| 4.82–6.37 | Particle portrait forms | Canvas in lower centered portrait frame; particles progress 0 → 1 | canvas fades in over 0.22s; no title color/opacity change is intended | Particles use canvas draw coordinates | Particle progress is linear over 1.55s; overlaps canvas fade |
| 6.40–6.88 | Website handoff | Header, main content, and footer become visible; intro fades away | page opacity 0 → 1; intro opacity 1 → 0 | Default element origins | page `power1.out`, 0.42s; intro `power1.inOut`, 0.48s; concurrent |

### Timeline dependencies

- The single GSAP timeline uses labels `dot`, `transformToI`, `shootName`, `assembleName`, `shuffleToPortfolio`, `moveTitleDown`, `revealPortrait`, and `revealWebsite`.
- Final glyph order is checked against the literal `PORTFOLIO` before the portrait and website handoff.
- Current mobile styles resize and reposition the composition; the authored timeline durations are shared with desktop. No separate measured mobile timing profile is available.
- After the intro, pointer movement deforms the portrait particles and scrolling adjusts the portrait/title composition. These are interaction/scroll-driven, not part of the intro timeline.

## Reference analysis table

| Timestamp | Element | Position / opacity / scale / rotation / blur | Easing / duration / overlap |
|---|---|---|---|
| All requested frames (0ms through settled hero) | Reference intro | Not verifiable: the reference page and a reference recording were unavailable | Not measured |
| Desktop, tablet, mobile | Reference responsive behavior | Not verifiable from the supplied materials | Not measured |

## Existing project constraints observed in source

- The current HTML has five project cards in a responsive grid, not a seven-card fixed-viewport deck.
- No audio or chime implementation is present in the current HTML/CSS/JavaScript.
- The existing skip button, Escape handling, `?intro=1`, session-based skip, reduced-motion path, portrait interactions, and project section were left unchanged in this update.

## Changes in this update

- Centralized current intro durations, easing curves, and label offsets in `INTRO_TIMING` and `INTRO_EASING` in `script.js`, preserving the authored values.
- Added a one-time initialization guard so the intro timeline cannot be started twice by a repeated caller.
- Added comments at the dependent dot-to-I, trail/name, glyph-shuffle, title-drop, and portrait-reveal timeline stages.
- Did not change `index.html`, `styles.css`, portrait assets, or project content.

## Verification and unresolved differences

- `node --check script.js` is the available code-level syntax check.
- Browser playback, reference comparison, viewport recordings, skip/reload checks, console inspection, and screenshot capture were not performed in this update. The reference URL could not be opened by the inspection tool, so exact visual or timing parity remains unverified.
