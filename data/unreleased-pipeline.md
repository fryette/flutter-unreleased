# Flutter — Unreleased `main` pipeline

> Generated: 2026-06-16 · Baseline: everything on `main` after the **3.44 branch cut (2026-04-10)** ·
> main HEAD: `b38cbdd0` (2026-06-16). Destined for **3.45 (beta)** and **3.46 (main)**. Raw merged commits — NOT official release notes.
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

## Grouped detail

### Framework / widgets
- `@awaitNotRequired` annotation added to SDK (`678679b`)
- `AnimatedCrossFade.clipBehavior` (`8303a35`); new `AnimationStyle` methods (`a6e5716`)
- `ImageStreamListener.reportErrors` callback (`0254afb`); `ImageIcon.useOriginalColors` (`238d79a`)
- Hidden `IndexedStack` children no longer take focus (`3955e2b`)
- Spell-check disabled on obscured fields (`1d139c1`); better `Navigator.pop` type-mismatch error (`40135be`)
- Stylus button support relanded (`8db3a26`, #187629)
- Leak/crash fixes: `InteractiveViewer` `CurvedAnimation` leak (`86b9723`), `OverlayPortal`-in-`Table` crash (`f9af233`), hit-test vs traversal-tree mismatches (`c7f49fe`), `ShapeDecoration.lerp` gradient↔color crash (`b79192e`, #187368)
- `ShapeBorder.lerp` made symmetric — output border type no longer depends on argument order (`8bdce07b`, #187282)
- `isModifiedAfter` comparison fixed — result was inverted, always compared against `DateTime.now()` instead of the given time (`3c38ccb4`, #187727)
- Widget inspector overlay scoped to the selected widget's modal route, preventing overlays from leaking into unrelated routes (`d3bf7f7a`, #186784)

### Accessibility
- Android high-contrast + color-inversion (`8bd5cd5`), `CONTENT_CHANGE_TYPE_EXPANDED` (`1b3faac`), sibling-node semantics merging (`b8ed448`), a11y block also blocks keyboard focus (`146e6ae`)
- iOS: header trait set based on semantic heading level (`8c17c5e0`, #186916)

### Cupertino / iOS
- Swift migration of vsync stack (`5bcd096`), `FlutterTracing` (`cc4c998`), Swift Testing (`d822fe8`), min-iOS bump (`ab1032d`)
- SwiftPM: stop prefetching packages on `pub get` (`1750f1a`), concurrent FS-creation crash fix (`9716071`), warnings shown just before build (`927c1a6`)
- Platform-view hitTest reland (`7266dd5`); period chars allowed in framework names (`0ebbc3f`)
- UIScene events filtered to only those relating to the Flutter VC scene, fixing spurious lifecycle events from multi-scene apps (`25339374`, #187987)
- Skip non-tappable web-view workaround on iOS 26.4 — avoids unnecessary input-handling bypass on newer iOS (`121dbb62`, #185424)

### Android
- AGP 9 templates/test apps (`ff31522`,`4a41b27`); API 37 tools (`0a1f556`); MediaTek corruption fix (`53a82b6`)
- Edge-to-edge system-UI flag reset (`f84bd03`); `AccessibilityBridge` startup-crash fix (`8ad7de9`); cacheable deep-link Gradle task (`770e338`); `--enable-flutter-gpu` Intent extra (`adcd006`)
- `flutter doctor` now warns when multiple `adb` installations are detected on PATH (`e1e42652`, #186031)
- Fix `std::vector` out-of-bounds access in Flutter Android JNI and Delegate (`b4bfa3e7`, #187218)
- Custom KGP task + migration to AGP API for KGP version detection — resolves Gradle compatibility issues (`dd2d0ff6`, #182788)
- Added 30-second timeouts to `adb stopApp` and `adb uninstallApp` calls to avoid indefinite hangs (`ca6bf8d3`, #187876)
- Optimize SHA hash calculation of generated APK — faster builds (`a49a6744`, #187184)
- Fail gracefully on Android AVD lock errors during `flutter` startup — prevents cryptic crash when another process holds the AVD lock (`6469c0f3`, #187200)

### Web / WASM
- Skwasm text/path-decode optimization, no dynamic boxing under Wasm (`eb9b7d0`); heap alloc for stack-busting buffers (`c2890cc`)
- Font-fallback service (`6ce6e7a`) + bundled local Roboto for no-CDN builds (`a12f361`); image-decode throttling (`a05715c`/`a05715c`)
- Cross-Origin Storage initial support (`ff066f0`); `canvaskit_chromium` size reduction (`3b97cd4`); `WebParagraph` cutoff fix (`491c3ac`)
- Web hot reload treated as hot restart (`735966b`); shader recompile + unified asset processing (`21c6566`, after a revert)
- Remove dynamic module loading code from the Flutter web engine (`b419e1e2`, #187777)
- `RenderParagraph` now marks itself as needing paint after a device-pixel-ratio change — fixes missing text repaint on DPR changes (`072b85c0`, #186968)
- `WebParagraph` configuration API changes — new knobs for paragraph measurement and layout behavior (`c28687d3`, #187188)

### Desktop
- Win32 (`db976c1`) + Linux (`02a06a8`) popup windows; sized-to-content/dialog windows, `decorated` flag removed (`09380fe`); platform handles exposed (`5463d9c`)
- macOS text-stroke weight fix via light/dark atlas (`3da669f`); Windows Korean IME caret fix (`2fc403d`); GTK draw-time destroy crash fix (`becb399`); VS 2026 build support (`f9a4e80`)
- Sized-to-content for regular and dialog windows on Win32 — `onEmptyFrameGenerated` no longer corrupts window size (`64146039`, #186829)
- Fix transposed width/height in `OnEmptyFrameGenerated` causing corrupted window size on Win32 (`6ca03c62`, #187954)
- Remove `EnableTransparentWindowBackground` — had no real effect and is unsupported on Windows 10 (`27226d4d`, #187848)
- Windows switches to OpenGLESSDF renderer path (`24e321d4`, #187877)
- Gamma correction added to Windows text rendering — improves text clarity at sub-pixel level (`02fbac5a`, #187871)

### Engine / Impeller
- Impeller default on macOS (`543b75f`); instanced rendering everywhere (`1d9d637`); block-compressed textures (`fe96572`); SDF disable per-paint (`021d999`)
- Shadow-mask positioning fix (`308ba65`); animated-PNG overflow hardening (`9cf97ce`); UberSDF complex-RSE handling (`c7b914a`); Y-flip workaround removed (`2e8d57a`)
- Fixed-rate texture compression now retries uncompressed when the budget is exhausted (`5177105`, #187586)
- Fix dirty-range race condition in `DeviceBufferGLES` uploads — prevented corrupted buffer uploads under concurrent access (`08ae8c67`, #187932)
- Allow sampling textures with manually-uploaded mip levels in Impeller (`59ab469f`, #187729)
- APNG decoder: validate chunk data length before calling `GetChunkSize` to prevent integer overflow in chunk size calculation (`24771efd`, #187949)

### Flutter GPU (experimental)
- Instanced draws (`8a4cca4`), explicit draw counts (`d0d06b2`), vertex layout (`12d86bc`)
- Block-compressed formats (`56720cf`), multi-mip + slice attach (`7571305`/`00cf901`), shader-bundle hot reload (`5de7570`/`53bed8d`), `r32Float` (`4aedd37`)
- `ShaderLibrary.fromAsset` is now asynchronous, enabling non-blocking shader loading (`ee89c037`, #187716)
- Surface API for framework presentation — allows Flutter GPU to present directly to the framework's rendering surface (`cc6d7326`, #187358)
- ASTC HDR texture formats exposed (`68733b52`, #187715)
- Blit operations added (`bb5ef596`, #187289)

### Dart / tooling / DevTools
- **Hot restart 2× slowdown fixed** (`1e492c7`); widget-preview zoom slider (`3ca99c3`), DTD-failure handling (`610419e`), scaffold moved into pub workspace (`26fb075`)
- Security: reject path-escaping archive entries (`3af9fcb`), fix version-cache poisoning via git env (`3ac51d8`)
- `flutter clean --include-example` (`6defbc6`); faster monorepo `pub get` via shared `PackageGraph` (`2e3b7c0`); glob workspace patterns (`4d019c4`)
- `flutter create` crash fixed when SDK packages live in `bin/cache/pkg` (`945a9db`, #187653); Dart embedding API `Dart_LoadELF2` renamed back to `Dart_LoadELF` (`4578896`, #187677)
- Fix `flutter` version-cache git-fallback performance regression — `git log` was invoked far too often (`16b4d6b2`, #187400)
- `gen_l10n`: exclude inherited/overridden keys from the untranslated-messages file, reducing false positives (`3cce25a9`, #187950)

#### Dart SDK (unreleased — Dart 3.13.0 on `main`)
- **Language:** Primary constructors — class header now accepts constructor params + instance-var declarations (e.g. `class Point(var int x, var int y)`)
- **`dart:async`:** `Future.pause` added as alternative to `Future.delayed`
- **`dart:core`:** `List.unmodifiableOf`, `Map.unmodifiableOf`; `int.trailingZeroBitCount` + `int.oneBitCount` bit-counting getters
- **`dart:io`:** Cookie-date parser fix; `InterfaceAddress` gains `prefixLength` field (breaking subtype change)
- **`dart:js_interop`:** `JSFunction` / `JSExportedDartFunction` now support generics
- **Analyzer:** new `no_raw_types` and `no_dynamic_casts` lint rules
- **Formatter:** improved collection splitting + extension-type formatting
- **Runtime:** built-in fallback root certificates removed; use `--root-certs-file` if needed

### Deprecations / breaking
- Windowing: `decorated` flag removed, replaced by sized-to-content window types (`09380fe`)
- Minimum iOS deployment target bumped (`ab1032d`); `ReorderableListView` / `CupertinoSheetRoute` signature changes carried over from 3.44

## Caveats
- Reverted commits are dropped from this digest — only changes currently live on `main` are listed.
- Not version-pinned. 3.45 is cut to `beta`; later items will ride **3.46** (and Flutter may skip a version, so both are tracked).
- Raw merged commits. Treat as a directional preview, not a guarantee.
