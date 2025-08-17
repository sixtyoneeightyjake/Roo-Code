# Implementation Tasks

> Legend: `[ ]` To Do, `[~]` In Progress, `[x]` Done

| ID    | Description                                                                                                          | Linked Docs                     | State | Deliverable                       | DoD                                                                             |
| ----- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----- | --------------------------------- | ------------------------------------------------------------------------------- |
| T-001 | Remove `packages/telemetry` module and PostHog dependencies from root/workspace `package.json`.                      | Req: US-001 \| Des: D-001       | [x]   | Deleted folder, updated manifests | • Folder removed<br>• `pnpm install` succeeds without PostHog                   |
| T-002 | Strip all PostHog/telemetry imports and code paths throughout codebase.                                              | Req: US-001 \| Des: D-001       | [ ]   | Clean compile                     | • `rg "posthog"` returns 0 results<br>• `pnpm run compile` passes               |
| T-003 | Remove references to unsupported providers, enforce allowed list (`openai-native`, `openai`, `anthropic`, `gemini`). | Req: US-002 \| Des: D-002       | [ ]   | Updated provider logic            | • No imports of disallowed providers<br>• Unit tests updated & green            |
| T-004 | Verify sidebar icon assets exist; move/copy if needed.                                                               | Req: US-003 \| Des: D-003       | [ ]   | Assets in correct path            | • Icons load when running extension in dev                                      |
| T-005 | Update `src/package.json` contribution icon paths to bundlable locations.                                            | Req: US-003 \| Des: D-003       | [ ]   | Updated paths                     | • `vsce ls` shows icons bundled                                                 |
| T-006 | Adjust `.vscodeignore` and build scripts to include icon assets, exclude telemetry.                                  | Req: US-003 \| Des: D-003/D-004 | [ ]   | Build config diff                 | • Icons included, telemetry excluded in vsix content                            |
| T-007 | Run full test suite and fix compile/test errors arising from previous tasks.                                         | Req: All \| Des: D-001..D-004   | [ ]   | Passing tests                     | • `pnpm test` 100% pass rate                                                    |
| T-008 | Build new VSIX package and smoke-test in fresh VS Code instance.                                                     | Req: US-004 \| Des: D-004       | [ ]   | `roo-code-x.y.z.vsix`             | • Install works<br>• Sidebar icons visible<br>• Commands execute without errors |
| T-009 | Update `CHANGELOG.md` documenting telemetry removal & VSIX build.                                                    | Req: US-004                     | [ ]   | Changelog entry                   | • Entry added under upcoming release section                                    |

---

Proceed through tasks sequentially, marking each as `[~]` during work and `[x]` once completed.
