// Stub replacement for the removed `posthog-js` package.
// Provides minimal no-op implementations used by TelemetryClient.

function noop(..._args: unknown[]): void {}

const posthog = {
	init: noop,
	capture: noop,
	reset: noop,
	identify: noop,
}

export default posthog
