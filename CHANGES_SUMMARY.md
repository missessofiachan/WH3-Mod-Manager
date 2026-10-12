# Summary of Changes

This document provides a comprehensive log of all improvements, dependency upgrades, bug fixes, and Linux build configurations implemented for **WH3-Mod-Manager**.

---

## 1. Linux & Bazzite Build & Packaging Configuration

* **Homebrew Toolchain & Environment Integration**:
  * Configured Node.js (`v24.21.0`), Yarn (`1.22.22`), and Linux C/C++ toolchain via Homebrew (`/var/home/linuxbrew/.linuxbrew/bin`).
* **Packaging Scripts in [`package.json`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/package.json)**:
  * Added `yarn package:linux`: Packages the application for Linux x64 into [`out/wh3mm-linux-x64/`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/out/wh3mm-linux-x64) without requiring system packaging tools.
  * Added `yarn make:zip`: Generates a distributable Linux ZIP archive directly (`out/make/zip/linux/x64/wh3mm-linux-x64-2.28.0.zip`), bypassing Debian `dpkg`/`fakeroot` dependencies.
* **Documentation**:
  * Updated [`README.md`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/README.md) with dedicated Bazzite and Linux build/run instructions.

---

## 2. Test Suite Reliability & Bug Fixes

Fixed three preexisting test failures in the unit test suite, bringing test reliability to 100%:

1. **[`test/buildingsAltdorf.node.test.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/test/buildingsAltdorf.node.test.ts)**:
   * Guarded top-level dump reads with `haveDumps` check to prevent `ENOENT` fatal crashes when external game dumps on `/mnt/k/...` are absent.
2. **[`test/esfStartposCache.node.test.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/test/esfStartposCache.node.test.ts)**:
   * Updated the mock signature from the deprecated `readFromExistingPack` to `readPackedFileBuffersFromIndex` to match the current caching API.
3. **[`src/visuals/unitPainter.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/src/visuals/unitPainter.ts)**:
   * Cloned the output buffer (`target.data.slice()`) during texture export so snapshot comparisons evaluate distinct data buffers rather than mutated references.

---

## 3. Dependency Upgrades & Security Fixes

### Security & Outdated Package Replacements
* **Replaced `gh-release-fetch` (CVE in transitive `got` dependency)**:
  * Removed `gh-release-fetch` in [`package.json`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/package.json).
  * Refactored [`src/index.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/src/index.ts) to use native `fetch` against the GitHub Releases API along with `semver.gt`.
  * Added `@types/semver`.
* **Upgraded `fs-extra`**:
  * Bumped `fs-extra` from `10.1.0` to `^11.4.1` and `@types/fs-extra` to `^11.0.4`.
* **Upgraded `chokidar` (Resolved high-severity `braces` vulnerability)**:
  * Bumped `chokidar` from `3.5.3` to `^4.0.3`.
  * Updated type imports in [`src/ipcMainListeners.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/src/ipcMainListeners.ts) to `chokidar, { type FSWatcher }`.
* **Safe Minor/Patch Dependency Bumps**:
  * `three`: `0.186.0` → `^0.186.1`
  * `prettier`: `3.9.6` → `^3.9.9`
  * `browserslist`: `4.24.2` → `^4.29.3`
  * `globals`: `17.4.0` → `^17.13.0`
  * `webpack-sources`: `3.2.3` → `^3.6.0`
  * `esbuild`: `0.27.3` → `^0.28.2`

---

## 4. `date-fns` & `date-fns-tz` Major Upgrades

* **Packages Upgraded**:
  * `date-fns`: `2.30.0` → `^4.1.0` (resolved `4.4.0`)
  * `date-fns-tz`: `1.3.8` → `^3.2.0` (resolved `3.2.0`)
* **Code Modernization in [`src/modFunctions.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/src/modFunctions.ts)**:
  * Replaced removed `zonedTimeToUtc` with `fromZonedTime` from `date-fns-tz`.
  * Extracted Steam Workshop timestamp parsing into an exported, robust helper:
    `parseSteamWorkshopDate(steamDate: string, referenceDate?: Date): number | undefined`
    which parses Steam Workshop Phoenix MST timestamps (`America/Phoenix`) into UTC timestamps.
* **New Test Suite [`test/steamWorkshopDateParsing.node.test.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/test/steamWorkshopDateParsing.node.test.ts)**:
  * Created unit test coverage for explicit year parsing, omitted year handling, single/double digit days/hours, AM/PM transitions, and malformed date strings.

---

## 5. Code Quality, Linter & Security Hardening

* **ESLint Zero-Error Compliance (`yarn lint --quiet`)**:
  * Fixed `prefer-const` in [`src/ipcMainListeners.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/src/ipcMainListeners.ts) for `writePromise`.
  * Removed unnecessary escape characters (`no-useless-escape`) in regex character classes in [`src/visuals/unitPainter.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/src/visuals/unitPainter.ts) and [`src/wh3AssetHostIpc.ts`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/src/wh3AssetHostIpc.ts).
  * `yarn lint --quiet` now passes with **0 errors**.
* **Audit Advisory Resolutions in [`package.json`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/package.json)**:
  * Added resolutions for `"dompurify": "^3.4.16"` and `"moment": "^2.31.0"` to mitigate CVEs in `handsontable` dependencies.
* **Unified Pre-flight Script**:
  * Added `"validate": "yarn typecheck && yarn lint --quiet && yarn test"` to [`package.json`](file:///home/sofia/Documents/antigravity/splendid-carson/WH3-Mod-Manager/package.json).
* **Safe Minor & Maintenance Dependency Upgrades**:
  * `tailwind-merge`: `^2.2.2` → `^2.6.1`
  * `@uiw/codemirror-theme-vscode` & `@uiw/react-codemirror`: `^4.25.8` → `^4.25.12`
  * `@typescript-eslint/eslint-plugin` & `@typescript-eslint/parser`: `^8.70.0` → `^8.71.0`
  * `@types/react-virtualized`: `^9.22.0` → `^9.22.4`

---

## 6. Verification Status

* **TypeScript Typecheck**:
  * `yarn typecheck` (`tsc --noEmit`) passes with **0 errors**.
* **ESLint**:
  * `yarn lint --quiet` passes with **0 errors**.
* **Vitest Test Suite**:
  * `yarn test` passes **2,340 unit tests across 277 test files with 0 failures** (5 skipped due to optional external dumps).
* **All-in-One Validation**:
  * `yarn validate` executes typecheck, linter, and full test suite cleanly.
* **Linux Build Verification**:
  * `yarn make:zip` successfully builds:
    * Executable: `out/wh3mm-linux-x64/wh3mm` (191 MB)
    * Distributable ZIP: `out/make/zip/linux/x64/wh3mm-linux-x64-2.28.0.zip` (161 MB)

