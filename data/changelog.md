# Changelog — between refresh runs

> What changed in the unreleased pipeline from one refresh to the next. Newest first.
> Each entry covers the `main` slice mined since the previous run's checkpoint:
> what was **added**, what was **removed** (reverted / dropped), and any **version** moves.

## 2026-06-15 — main HEAD `b79192e` → `4a60eb69`
60 commits in the slice; 38 were noise (autorolls, docs, test-only, CI) and dropped. 22 meaningful.

- **Added** — Flutter GPU: `ShaderLibrary.fromAsset` async (`ee89c037`, #187716), surface API for framework presentation (`cc6d7326`, #187358), ASTC HDR texture formats (`68733b52`, #187715), blit operations (`bb5ef596`, #187289). Desktop: corrupted window-size fix on Win32 (`6ca03c62`, #187954), sized-to-content dialog windows (`64146039`, #186829), remove no-op transparent-background flag (`27226d4d`, #187848). Impeller: dirty-range race in DeviceBufferGLES fixed (`08ae8c67`, #187932), mip-level texture sampling (`59ab469f`, #187729), Windows switches to OpenGLESSDF (`24e321d4`, #187877). Android: doctor warns on multiple adb installs (`e1e42652`, #186031), JNI OOB fix (`b4bfa3e7`, #187218), KGP + AGP API migration (`dd2d0ff6`, #182788). iOS/a11y: UIScene event filter (`25339374`, #187987), header trait from heading level (`8c17c5e0`, #186916). Dart/tooling: version-cache git-fallback perf fix (`16b4d6b2`, #187400), gen_l10n inherited-key exclusion (`3cce25a9`, #187950), widget-inspector overlay scoped to modal route (`d3bf7f7a`, #186784). Web: remove dynamic module loading from engine (`b419e1e2`, #187777). Framework: shape border lerp symmetric (`8bdce07b`, #187282).
- **Removed** — `[a11y] Map framework semantics roles to Android classes` (`bb5cc622`, #185217) — landed and immediately reverted (`c12a5525`, #188008) in the same slice; excluded from pipeline.
- **Version moves** — stable confirmed 3.44.0 (docs) / 3.44.1 (tag); Dart 3.13.0 unreleased on main (primary constructors, `List.unmodifiableOf`, `Future.pause`, new lints).

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
