# Flutter — Unreleased SDK Tracker

> **Snapshot**
> - **Last refreshed:** 2026-06-16
> - **Latest stable:** 3.44.2 (Dart 3.12.2)
> - **Next stable (on `beta`):** 3.45 — branch `flutter-3.45-candidate.0`
> - **Bleeding edge (`main` = `master`):** 3.46-bound; `main` HEAD `b38cbdd0` (2026-06-16)
> - **Dart on `main`:** 3.13.0 (unreleased — primary constructors, new core APIs, lint rules)
> - **3.44 release-branch cut:** 2026-04-10 — everything on `main` after this date is the "unreleased" set.

This folder tracks what has landed on `flutter/flutter` **`main`** but has **not shipped in a stable release**. Re-run the prompt below any time to regenerate the data files with fresh results.

---

## ▶️ RE-RUNNABLE PROMPT (copy-paste into Claude Code from this folder)

```
Refresh the Flutter unreleased-SDK bundle in this folder. Research everything merged to
flutter/flutter `main` that has NOT yet shipped in a stable release, then overwrite the
result files here.

Steps:
1. Latest STABLE: DO NOT use `releases/latest` (returns pre-release tags). Instead:
   a) Run `gh api "repos/flutter/flutter/commits?sha=stable&per_page=3" --jq '.[].commit.message | split("\n")[0]'`
      and look for a line like "Update `engine.version` for X.Y.Z stable release" — that X.Y.Z is current stable.
   b) Confirm the bundled Dart version: run
      `gh api "repos/flutter/flutter/commits?sha=stable&per_page=5" --jq '[.[].commit.message | split("\n")[0]] | map(select(test("Dart")))'`
      — look for "Update Flutter DEPS to Dart <sha>"; then find the matching Dart tag via
      `gh api "repos/dart-lang/sdk/git/refs/tags" --jq '.[].ref' | grep -E "^refs/tags/[0-9]" | grep -v dev | tail -5`
      and pick the highest non-dev tag that matches the major.minor of the current Dart-on-stable.
   If stable is unchanged from the Snapshot, skip and move on.
2. Next versions: read `bin/internal/release-candidate-branch.version` on the `beta` branch
   -> `flutter-X.Y-candidate.0` = the next stable (e.g. 3.45) baking on beta. ALSO track the
   version after it (e.g. 3.46), which is what `main` is currently bound to. Flutter sometimes
   SKIPS a version, so always reason about BOTH the beta-bound and the main-bound version and
   record both in the Snapshot. Pin the next-version branch-cut SHA if you want a clean
   "in <next> (beta)" vs "<next+1>-only (still on main)" split.
3. Branch-cut point: on branch `flutter-<latest-stable-minor>-candidate.0`, walk back to the
   commits "Add release branch version for <ver>" and "Update to the beta dart version for
   <ver> branch cut"; record that date. Everything on `main` AFTER it is unreleased.
4. INCREMENTAL MINE (don't re-fetch the whole history each run): start from the **last
   processed `main` HEAD** recorded in the Snapshot block (`main HEAD <sha>`). Fetch only the
   commits on `main` SINCE that SHA up to the current HEAD — that's the new slice to fold in.
   Only on a first run (no recorded HEAD) fall back to mining from the branch-cut date. For
   large slices, use cheap subagents (model: sonnet) split by date window. Each:
     - calls mcp__github__list_commits owner=flutter repo=flutter sha=main
       since=<start> until=<end> perPage=100, paginating until a page has <100 commits
       (large results auto-save to a file);
     - jq-filters the saved JSON to DROP autorolls (authors engine-flutter-autoroll,
       flutter-pub-roller-bot) and dependency rolls (subjects matching ^Roll ,
       "Update Flutter DEPS to Dart", "Sync engine.version", "Roll pub packages",
       ^Reverts "Roll), plus CI/test-only/refactor/dot-shorthand/localization churn;
     - returns a <=350-word grouped digest (one line per item, short SHA + PR #).
5. REVERTS — if a commit in the new slice reverts something already listed in
   `data/unreleased-pipeline.md` (subject `Revert "<X>"` or `Reverts <sha>`), DELETE the
   reverted item from the digest entirely. Do not keep "reverted / in-flux" lines — the digest
   should reflect only what is currently live on `main`.
6. DART CHANGELOG — if the new slice contains Dart-facing changes (a Dart SDK version/minor
   roll, or commits touching the Dart embedding/SDK constraint), also fetch the matching entries
   from https://raw.githubusercontent.com/dart-lang/sdk/main/CHANGELOG.md (the unreleased /
   next-version section) and add a short **Dart SDK** subsection summarizing them.
7. Synthesize/merge into the existing file: headline themes first, then grouped detail:
   Framework/widgets, Material, Cupertino/iOS, Android, Web/WASM, Desktop, Engine/Impeller,
   Flutter GPU, Dart/tooling (+ Dart SDK when present), Deprecations/breaking. MERGE the new
   slice into the existing groups rather than rewriting from scratch. State plainly that these
   are raw merged commits, NOT official release notes (Flutter only writes those at stable).
8. CHANGELOG between runs — PREPEND a new dated entry to the top of `data/changelog.md` (newest
   first, directly under the intro blockquote, above the previous entry). The entry header is
   `## <YYYY-MM-DD> — main HEAD `<old sha>` → `<new sha>`` and lists, as short bullets:
   **Added** (notable new items folded in this run, short SHA + PR #), **Removed** (items deleted
   because they were reverted/dropped — name them so the diff is auditable), and **Version moves**
   (stable / next / main-bound / Dart version changes since last run). If the new slice was empty,
   still add an entry saying "no new unreleased changes since `<old sha>`". Keep each entry concise
   (<=120 words). Never rewrite or delete older entries — the changelog is append-only history.
9. Write + CHECKPOINT: overwrite `data/unreleased-pipeline.md` with the merged digest, prepend the
   changelog entry (step 8), and update the Snapshot block at the top of `README.md` (Last refreshed /
   Latest stable / Next stable / main-bound version / **main HEAD = the new HEAD you just processed** /
   branch-cut date). That recorded HEAD is the checkpoint the NEXT run resumes from — commit it so
   progress is saved and the next run only fetches forward from there. The SPA reads these files
   live, so pushing updates the published site.

Tools: prefer the GitHub MCP tools (mcp__github__*) and WebFetch. Keep autoroll noise out.
```

---

## Files in this bundle

| File | Contents |
|---|---|
| `data/unreleased-pipeline.md` | The grouped digest of unreleased `main` work (regenerated by the prompt). |
| `data/changelog.md` | Append-only log of what each refresh added/dropped/re-versioned since the previous run. |
| `data/release-structure.md` | How Flutter's branches/channels work + anatomy of the 3.44.1 release (reference; stable per release). |
| `index.html` + `assets/` | The published single-page app (GitHub Pages) that renders the data above. |
| `README.md` | This file — the prompt + snapshot header + index. |

## Live site

The data is published as a single-page app via **GitHub Pages**:
**https://fryette.github.io/flutter-unreleased/**

## Notes / caveats
- Items are **raw merged commits on `main`**, not curated release notes. Some get reverted.
- The split between "next stable (beta)" and "the one after (main-only)" needs the next
  version's branch-cut SHA — ask the prompt to pin it if you want that breakdown.
- "Unreleased" = after the latest stable's branch cut. As stable advances, re-run to re-baseline.
