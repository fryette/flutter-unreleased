# Flutter — branch/channel structure & 3.44.1 anatomy (reference)

## Channels (the prerelease pipeline)

A commit flows **`main` → `beta` (candidate cut) → `stable`**.

| Branch | State (2026-06-10) | Role |
|---|---|---|
| **`main`** (= `master`, same HEAD) | `c0a1129`, 2026-06-10 | Dev tip — every merged PR + autorolls; **3.46+** accumulates here |
| **`beta`** | `flutter-3.45-candidate.0` | Next stable, **3.45**, baking now (builds tagged `3.45.0-x.y.pre`) |
| **`stable`** | **3.44.1** | Production |

- `main` and `master` resolve to the **same commit** — `main` is canonical, `master` is a back-compat alias.
- Next-version detection: `bin/internal/release-candidate-branch.version` on `beta` = `flutter-3.45-candidate.0`.
- Other branches are NOT channels: `flutter-X.Y-candidate.Z` (release trains, frozen for hotfixing), `cp_*`/`cherrypicks-*` (hotfix staging), personal/`copilot/`/`dependabot/` branches.
- Legacy `dev` branch exists but is a deprecated channel.

## How a release is built

The release branch `flutter-3.44-candidate.0` was **cut at code-freeze (2026-04-10)** —
commits `a7884d5` "Update to the beta dart version for 3.44 branch cut" + `4f3679c` "Add release branch version for 3.44".
After the cut, ONLY cherry-picks + dependency rolls land on it. Tags are placed on that branch.

## Anatomy of 3.44.1

- Tag **`3.44.1`** → commit `924134a` ("Update CHANGELOG with Flutter 3.44 changes" #187258).
- It is a **tool-only hotfix** over 3.44.0, containing exactly:
  - `c8b7441` **[CP-stable] Tool robustness** (#187118) — `flutter` tool no longer crashes when the analysis
    server exits unexpectedly [flutter/186962] or when it fails to connect to Chrome on Windows [flutter/186963].
  - `c416acf` Dart DEPS roll → **Dart 3.12.1** (was 3.12.0).
  - `4421940` engine.version sync; `924134a` CHANGELOG.

## Cross-repo references

- **Dart SDK** (`dart-lang/sdk`): the real external roll. `c416acf` pins Dart hash `fc3da898` = "Version 3.12.1".
- **"engine"**: NOT a separate repo anymore. After the monorepo merge, `engine.version` pins the engine build to a
  commit **inside `flutter/flutter`** (e.g. the sync target `c416acf` is itself a flutter/flutter commit). The engine
  tracks the monorepo; only external upstreams (Dart, Skia, SwiftShader, vulkan-deps) still roll in via
  `engine-flutter-autoroll` — e.g. the current `main` HEAD is a Skia autoroll.

## 3.44.0 feature highlights (the pre-freeze content, shipped)

SwiftPM default for iOS/macOS · agentic hot reload (MCP) · HCPP on Android (opt-in) · experimental desktop windowing
(tooltip/popup/dialog windows) · Material & Cupertino frozen in-tree ahead of package split · Canonical = Desktop steward ·
`SensitiveContent` widget · `RoundedSuperellipseInputBorder` · infinite `CarouselView` · `CupertinoSheetRoute` ·
iOS inline predictive text · DevTools compiled to WASM by default · Rosetta-free Apple-Silicon CLI · Dart baseline bump.
Breaking: `CupertinoSheetRoute.builder`→`scrollableBuilder`, `ReorderableListView.onReorder`→`onReorderItem`,
`ExtendSelectionByPageIntent` removed, AGP-9/built-in-Kotlin plugins must declare min Flutter 3.44.

## Roadmap (officially aspirational, not a guarantee)
Material/Cupertino split into standalone pub packages · finish Android Impeller migration (drop Skia on Android 10+) ·
WASM becomes default web output · multi-window improvements (Canonical) · Dart Primary Constructors + Augmentations ·
day-zero iOS / Android 17 · Gemini CLI / Antigravity / Dart MCP · ≥4 stable + ~12 beta releases in 2026.
