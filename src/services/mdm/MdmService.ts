import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import * as vscode from "vscode"
import { z } from "zod"

// Cloud imports removed - cloud functionality has been removed
import { Package } from "../../shared/package"
import { t } from "../../i18n"

// MDM Configuration Schema
const mdmConfigSchema = z.object({
	requireCloudAuth: z.boolean(),
	organizationId: z.string().optional(),
})

export type MdmConfig = z.infer<typeof mdmConfigSchema>

export type ComplianceResult = { compliant: true } | { compliant: false; reason: string }

export class MdmService {
	private static _instance: MdmService | null = null
	private mdmConfig: MdmConfig | null = null
	private log: (...args: unknown[]) => void

	private constructor(log?: (...args: unknown[]) => void) {
		this.log = log || console.log
	}

	/**
	 * Initialize the MDM service by loading configuration
	 */
	public async initialize(): Promise<void> {
		try {
			this.mdmConfig = await this.loadMdmConfig()
			if (this.mdmConfig) {
				this.log("[MDM] Loaded MDM configuration:", this.mdmConfig)
			} else {
				this.log("[MDM] No MDM configuration found")
			}
		} catch (error) {
			this.log("[MDM] Error loading MDM configuration:", error)
			// Don't throw - extension should work without MDM config
		}
	}

	/**
	 * Check if cloud authentication is required by MDM policy
	 */
	public requiresCloudAuth(): boolean {
		return this.mdmConfig?.requireCloudAuth ?? false
	}

	/**
	 * Get the required organization ID from MDM policy
	 */
	public getRequiredOrganizationId(): string | undefined {
		return this.mdmConfig?.organizationId
	}

	/**
	 * Check if the current state is compliant with MDM policy
	 * Note: Cloud authentication functionality has been removed
	 */
	public isCompliant(): ComplianceResult {
		// Cloud service integration has been removed
		// MDM policies requiring cloud authentication are no longer supported
		return { compliant: true }
	}

	/**
	 * Load MDM configuration from system location
	 */
	private async loadMdmConfig(): Promise<MdmConfig | null> {
		const configPath = this.getMdmConfigPath()

		try {
			// Check if file exists
			if (!fs.existsSync(configPath)) {
				return null
			}

			// Read and parse the configuration file
			const configContent = fs.readFileSync(configPath, "utf-8")
			const parsedConfig = JSON.parse(configContent)

			// Validate against schema
			return mdmConfigSchema.parse(parsedConfig)
		} catch (error) {
			this.log(`[MDM] Error reading MDM config from ${configPath}:`, error)
			return null
		}
	}

	/**
	 * Get the platform-specific MDM configuration file path
	 */
	private getMdmConfigPath(): string {
		const platform = os.platform()
		// Cloud service integration removed - defaulting to development config
		const configFileName = "mdm.dev.json"

		switch (platform) {
			case "win32": {
				// Windows: %ProgramData%\MojoCode\mdm.json or mdm.dev.json
				const programData = process.env.PROGRAMDATA || "C:\\ProgramData"
				return path.join(programData, "MojoCode", configFileName)
			}

			case "darwin":
				// macOS: /Library/Application Support/MojoCode/mdm.json or mdm.dev.json
				return `/Library/Application Support/MojoCode/${configFileName}`

			case "linux":
			default:
				// Linux: /etc/Mojo-code/mdm.json or mdm.dev.json
				return `/etc/Mojo-code/${configFileName}`
		}
	}

	/**
	 * Get the singleton instance
	 */
	public static getInstance(): MdmService {
		if (!this._instance) {
			throw new Error("MdmService not initialized. Call createInstance() first.")
		}
		return this._instance
	}

	/**
	 * Create and initialize the singleton instance
	 */
	public static async createInstance(log?: (...args: unknown[]) => void): Promise<MdmService> {
		if (this._instance) {
			throw new Error("MdmService instance already exists")
		}

		this._instance = new MdmService(log)
		await this._instance.initialize()
		return this._instance
	}

	/**
	 * Check if instance exists
	 */
	public static hasInstance(): boolean {
		return this._instance !== null
	}

	/**
	 * Reset the instance (for testing)
	 */
	public static resetInstance(): void {
		this._instance = null
	}
}
