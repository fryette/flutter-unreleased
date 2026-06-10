# Flutter — Unreleased `main` pipeline

> Generated: 2026-06-10 · Baseline: everything on `main` after the **3.44 branch cut (2026-04-10)** ·
> Destined for **3.45 (beta)** and **3.46 (main)**. Raw merged commits — NOT official release notes.
> Autorolls / CI / test-refactor churn filtered out.

## Headline themes

**1. Flutter GPU — biggest new investment.** A full experimental low-level GPU API, none of it in stable:
- Instanced draws, explicit draw counts, customizable vertex layouts (`12d86bc`, `8a4cca4`, `d0d06b2`)
- Block-compressed texture formats — BC/ETC2/ASTC (`56720cf`, `fe96572`)
- Multi-mip textures + per-(mip,slice) attachment (`7571305`, `00cf901`)
- Shader-bundle hot reload, in-place `ShaderLibrary` reload (`5de7570`, `53bed8d`), per-backend defines, `r32Float`

**2. Impeller becomes the everywhere-default.** **Impeller now on by default on macOS** (`543b75f`); Linux Impeller
flag + SDF + glyph gamma (`dcae056`/`a760f44`/`e70534d`); Windows OpenGL-fallback black-screen fix (`dda3f94`);
**instanced rendering across all backends** (`1d9d637`); texture-coord Y-flip workaround removed (`2e8d57a`).

**3. Wide gamut goes broad.** All macOS opted into wide-gamut (`9d1cfb9`); dynamic `FLTEnableWideGamut` from the Dart bundle (`3f22e03`).

**4. iOS embedder rewritten in Swift.** `VSyncClient`+`DisplayLinkManager` → Swift (`5bcd096`), `FlutterTracing` (`cc4c998`),
Swift Testing framework (`d822fe8`), retain-cycle fixes, **min iOS version bump** (`ab1032d`). Groundwork for Dart↔Swift interop.

**5. Desktop multi-window matures.** Popup windows for **Win32** (`db976c1`) and **Linux** (`02a06a8`); sized-to-content +
dialog window types; platform-handle exposure (`5463d9c`). Breaking: removed `decorated` flag (`09380fe`).

**6. Android: AGP 9 + Android 17 readiness.** Templates/test apps → AGP 9 (`ff31522`/`4a41b27`); **API 37** build tools (`0a1f556`);
edge-to-edge fixes; MediaTek visual-corruption fix (`53a82b6`).

**7. Dart 3.13 incoming.** SDK constraint bumped to `^3.13.0` (`df8cb09`) then reverted (`b2e3cc4`) — the usual "next release moves off 3.12" signal.

## Grouped detail

### Framework / widgets
- `@awaitNotRequired` annotation added to SDK (`678679b`)
- `AnimatedCrossFade.clipBehavior` (`8303a35`); new `AnimationStyle` methods (`a6e5716`)
- `ImageStreamListener.reportErrors` callback (`0254afb`); `ImageIcon.useOriginalColors` (`238d79a`)
- Hidden `IndexedStack` children no longer take focus (`3955e2b`)
- Spell-check disabled on obscured fields (`1d139c1`); better `Navigator.pop` type-mismatch error (`40135be`)
- Leak/crash fixes: `InteractiveViewer` `CurvedAnimation` leak (`86b9723`), `OverlayPortal`-in-`Table` crash (`f9af233`), hit-test vs traversal-tree mismatches (`c7f49fe`)

### Accessibility
- Android high-contrast + color-inversion (`8bd5cd5`), `CONTENT_CHANGE_TYPE_EXPANDED` (`1b3faac`), sibling-node semantics merging (`b8ed448`), a11y block also blocks keyboard focus (`146e6ae`)

### Cupertino / iOS
- Swift migration of vsync stack (`5bcd096`), `FlutterTracing` (`cc4c998`), Swift Testing (`d822fe8`), min-iOS bump (`ab1032d`)
- SwiftPM: stop prefetching packages on `pub get` (`1750f1a`), concurrent FS-creation crash fix (`9716071`), warnings shown just before build (`927c1a6`)
- Platform-view hitTest reland (`7266dd5`); period chars allowed in framework names (`0ebbc3f`)

### Android
- AGP 9 templates/test apps (`ff31522`,`4a41b27`); API 37 tools (`0a1f556`); MediaTek corruption fix (`53a82b6`)
- Edge-to-edge system-UI flag reset (`f84bd03`); `AccessibilityBridge` startup-crash fix (`8ad7de9`); cacheable deep-link Gradle task (`770e338`); `--enable-flutter-gpu` Intent extra (`adcd006`)

### Web / WASM
- Skwasm text/path-decode optimization, no dynamic boxing under Wasm (`eb9b7d0`); heap alloc for stack-busting buffers (`c2890cc`)
- Font-fallback service (`6ce6e7a`) + bundled local Roboto for no-CDN builds (`a12f361`); image-decode throttling (`a05715c`/`a05715c`)
- Cross-Origin Storage initial support (`ff066f0`); `canvaskit_chromium` size reduction (`3b97cd4`); `WebParagraph` cutoff fix (`491c3ac`)
- Web hot reload treated as hot restart (`735966b`); shader recompile + unified asset processing (`21c6566`, after a revert)

### Desktop
- Win32 (`db976c1`) + Linux (`02a06a8`) popup windows; sized-to-content/dialog windows, `decorated` flag removed (`09380fe`); platform handles exposed (`5463d9c`)
- macOS text-stroke weight fix via light/dark atlas (`3da669f`); Windows Korean IME caret fix (`2fc403d`); GTK draw-time destroy crash fix (`becb399`); VS 2026 build support (`f9a4e80`)

### Engine / Impeller
- Impeller default on macOS (`543b75f`); instanced rendering everywhere (`1d9d637`); block-compressed textures (`fe96572`); SDF disable per-paint (`021d999`)
- Shadow-mask positioning fix (`308ba65`); animated-PNG overflow hardening (`9cf97ce`); UberSDF complex-RSE handling (`c7b914a`); Y-flip workaround removed (`2e8d57a`)
- Fixed-rate texture compression now retries uncompressed when the budget is exhausted (`5177105`, #187586)

### Flutter GPU (experimental)
- Instanced draws (`8a4cca4`), explicit draw counts (`d0d06b2`), vertex layout (`12d86bc`)
- Block-compressed formats (`56720cf`), multi-mip + slice attach (`7571305`/`00cf901`), shader-bundle hot reload (`5de7570`/`53bed8d`), `r32Float` (`4aedd37`)

### Dart / tooling / DevTools
- **Hot restart 2× slowdown fixed** (`1e492c7`); widget-preview zoom slider (`3ca99c3`), DTD-failure handling (`610419e`), scaffold moved into pub workspace (`26fb075`)
- Security: reject path-escaping archive entries (`3af9fcb`), fix version-cache poisoning via git env (`3ac51d8`)
- `flutter clean --include-example` (`6defbc6`); faster monorepo `pub get` via shared `PackageGraph` (`2e3b7c0`); glob workspace patterns (`4d019c4`)
- `flutter create` crash fixed when SDK packages live in `bin/cache/pkg` (`945a9db`, #187653); Dart embedding API `Dart_LoadELF2` renamed back to `Dart_LoadELF` (`4578896`, #187677)

### Deprecations / breaking / in-flux
- Windowing: `decorated` flag removed, replaced by sized-to-content window types (`09380fe`)
- Dart `^3.13.0` constraint bump **reverted** (`df8cb09`→`b2e3cc4`); web shader-recompile, `VSyncClient` Obj-C/Swift moves, and stylus-button support each reverted/relanded at least once

## Caveats
- Not version-pinned. 3.45 is already cut to `beta`, so the April–May items are likely in 3.45 and the June items in 3.46 — but confirming needs the 3.45 branch-cut SHA.
- Raw merged commits; reverts happen. Treat as a directional preview, not a guarantee.
