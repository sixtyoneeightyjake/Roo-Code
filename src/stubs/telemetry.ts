/*
 * Stub implementation replacing @Mojo-code/telemetry after PostHog removal.
 * Provides no-op versions of TelemetryService and PostHogTelemetryClient so existing
 * imports compile while stripping all telemetry behaviour.
 */

export class TelemetryService {
	private static _instance: TelemetryService | null = new TelemetryService()

	// Provide singleton accessor consistent with original API
	static get instance(): TelemetryService {
		// Return always-available singleton to avoid hasInstance checks failing
		return this._instance ?? (this._instance = new TelemetryService())
	}

	// Keep original helper for defensive checks
	static hasInstance(): boolean {
		return true
	}

	/**
	 * createInstance originally configured clients; now returns the singleton.
	 * Accepts any args for compatibility.
	 */
	static createInstance(..._args: unknown[]): TelemetryService {
		return this.instance
	}

	// General no-op placeholder for original register(client)
	register(_client: unknown): void {}

	// Specific method stubs for known usage
	setProvider(_provider: unknown): void {}
	shutdown(): void {}
	captureTitleButtonClicked(_button: unknown): void {}

	// Dynamically swallow any method name to preserve API surface at runtime
	[key: string]: unknown
}

// Legacy client reference now inert
export class PostHogTelemetryClient {
	constructor(..._args: unknown[]) {}
}

// Default export kept for compatibility (if code used default)
export default {
	TelemetryService,
	PostHogTelemetryClient,
}
