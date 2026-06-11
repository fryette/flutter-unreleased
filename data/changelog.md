# Changelog — between refresh runs

> What changed in the unreleased pipeline from one refresh to the next. Newest first.
> Each entry covers the `main` slice mined since the previous run's checkpoint:
> what was **added**, what was **removed** (reverted / dropped), and any **version** moves.

## 2026-06-11 — main HEAD `c0a1129` → `b79192e`
6 commits in the slice; 4 were noise (1 autoroll, 2 docs, 1 test-only) and dropped.

- **Added** — Framework/widgets: stylus button support relanded (`8db3a26`, #187629); `ShapeDecoration.lerp` gradient↔color crash fix (`b79192e`, #187368).
- **Removed** — none (no reverts of listed items this slice).
- **Version moves** — none (stable 3.44.1 / next 3.45 / 3.46-bound; no Dart roll).

## 2026-06-10 — baseline
`main` HEAD `c0a1129` · stable 3.44.1 (Dart 3.12.1) · next 3.45 (beta) / 3.46-bound (main)

- **Baseline snapshot.** First full mine of everything on `main` after the **3.44 branch cut (2026-04-10)**.
- 6 headline themes, 10 categories captured (Flutter GPU, Impeller-everywhere, wide gamut, iOS-in-Swift, desktop multi-window, Android AGP 9 / API 37).
- Dropped the reverted **"Dart 3.13 incoming"** item (SDK-constraint bump was reverted on `main`).
- Future runs append a dated entry above this one, mined incrementally from the recorded `main` HEAD.
