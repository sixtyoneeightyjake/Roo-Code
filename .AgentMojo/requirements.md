# Project Requirements

## User Stories

- US-001: As a VS Code extension user, I want all telemetry (e.g., PostHog and similar) removed so that my usage data is not collected or transmitted.
- US-002: As an extension user, I want the sidebar icons to load correctly so that I can easily access extension features.
- US-003: As an extension developer, I want a freshly built VSIX package after these changes so that I can distribute the updated, telemetry-free extension.

## Acceptance Criteria

- AC-US-001.01 (Given/When/Then):
    - **Given** the extension source code,
    - **When** the build process is completed,
    - **Then** no references to PostHog or any other telemetry libraries remain and no runtime network requests are made for telemetry.
- AC-US-002.01:
    - **Given** VS Code with the updated extension installed,
    - **When** VS Code loads the sidebar,
    - **Then** all extension icons appear correctly without broken image placeholders.
- AC-US-003.01:
    - **Given** the updated source code,
    - **When** the build script is executed,
    - **Then** a new VSIX file is produced that installs successfully and meets AC-US-001.01 and AC-US-002.01.

## Out of Scope

- Introducing new functionality unrelated to telemetry removal or icon fixes.
- Supporting additional providers beyond openai-native, openai, anthropic, and gemini.

## Assumptions

- A-01: Only provider integrations for openai-native, openai, anthropic, and gemini are required; all others can be safely removed.
- A-02: Telemetry code is isolated to packages such as `packages/telemetry` and any PostHog initialization logic.
- A-03: Icon assets already exist in the repository; the issue is related to build/config paths rather than missing files.
