# Technical Design

## Overview

This document describes the technical approach to:

1. Remove all telemetry (PostHog) from the Roo-Code VS Code extension and supporting packages.
2. Resolve missing sidebar icon issues in the VS Code extension.
3. Produce a new VSIX package after the above changes.

The solution focuses on minimal surface-area changes while maintaining existing architecture and coding conventions.

## System Architecture

### Current State

- Roo-Code is a monorepo managed by PNPM with workspace packages (`apps`, `packages`, `src`, etc.).
- The VS Code extension (`src/extension.ts`, `src/activate/`, `src/api/`, etc.) depends on an internal `packages/telemetry` module that wraps PostHog analytics.
- Icons used in the sidebar are expected under `src/assets/icons/` and referenced in `package.json` contribution points.
- VSIX generation is handled via `pnpm package` (esbuild) and VSCE.

### Target State

- No direct or indirect telemetry calls remain; PostHog dependency is removed from both runtime and build.
- Only provider integrations (`openai-native`, `openai`, `anthropic`, `gemini`) are referenced.
- Sidebar icons load correctly from the extension bundle.
- A fresh VSIX is built and ready for distribution.

## Components

| ID    | Component          | Description                                                                                                                                                                                                  |
| ----- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D-001 | Telemetry Removal  | Delete `packages/telemetry`, strip imports (`@roo/telemetry`), remove PostHog npm deps, and delete related env vars/config.                                                                                  |
| D-002 | Provider Whitelist | Grep-remove references to unsupported providers (e.g., Azure OpenAI, Bedrock) and ensure feature flags or config defaults to the allowed list.                                                               |
| D-003 | Icon Path Fix      | Verify actual SVG/PNG assets exist, update `src/package.json` `contributes.viewsContainers` and `contributes.views` icon paths to bundlable `dist` locations, adjust `.vscodeignore` to include icon assets. |
| D-004 | VSIX Packaging     | Update build script to exclude telemetry code, include icons, run `pnpm run package` to generate new `.vsix`.                                                                                                |

## Data Schema / API Contracts

No database or API schema changes. Only internal TypeScript interfaces are affected when telemetry types are removed.

## Testing Strategy

- **Unit Tests**: Existing Vitest suites run via `pnpm test`. Remove/adjust tests relying on telemetry mocks.
- **Integration Smoke Test**: Launch extension via `pnpm run dev` and inspect console for missing module errors, ensure commands execute without telemetry.
- **UI Verification**: Manually open VS Code, confirm sidebar icons render at different resolutions and themes.
- **Packaging Test**: Install generated VSIX in fresh VS Code instance and run basic scenarios (command palette, sidebar view, provider calls).

## Implementation Phases

1. **Codebase Cleanup (D-001, D-002)**
    - Remove `packages/telemetry` folder & references.
    - Delete PostHog npm package from root `package.json` and workspaces.
    - Update import paths and guard code.
2. **Asset & Contribution Fix (D-003)**
    - Verify icons in `src/assets/icons/` or `assets/images/`.
    - Update paths in `src/package.json` contribution points.
    - Adjust `.vscodeignore` / packaging scripts to whitelist icon assets.
3. **Build & Test**
    - Run `pnpm install`, `pnpm test`, `pnpm run compile`.
    - Fix any compile/test issues.
4. **VSIX Creation (D-004)**
    - Execute `pnpm run package` producing `roo-code-x.y.z.vsix`.
    - Manual verification in VS Code.
5. **Documentation & Release**
    - Update `CHANGELOG.md`.
    - Offer git commit & tag.

---

Ready for review. Please **APPROVE DESIGN** or request changes.
