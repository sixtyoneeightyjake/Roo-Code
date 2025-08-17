import * as path from "path"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

// Mock dependencies
vi.mock("fs", () => ({
	existsSync: vi.fn(),
	readFileSync: vi.fn(),
}))

vi.mock("os", () => ({
	platform: vi.fn(),
}))

// Cloud functionality removed

vi.mock("vscode", () => ({
	workspace: {
		getConfiguration: vi.fn(),
	},
	ConfigurationTarget: {
		Global: 1,
	},
}))

vi.mock("../../../shared/package", () => ({
	Package: {
		publisher: "Mojo-code",
		name: "Mojo-cline",
		version: "1.0.0",
		outputChannel: "Mojo-Code",
		sha: undefined,
	},
}))

vi.mock("../../../i18n", () => ({
	t: vi.fn((key: string) => {
		const translations: Record<string, string> = {
			"mdm.errors.cloud_auth_required":
				"Your organization requires Mojo Code Cloud authentication. Please sign in to continue.",
			"mdm.errors.organization_mismatch":
				"You must be authenticated with your organization's Mojo Code Cloud account.",
			"mdm.errors.verification_failed": "Unable to verify organization authentication.",
		}
		return translations[key] || key
	}),
}))

import * as fs from "fs"
import * as os from "os"
import * as vscode from "vscode"
import { MdmService } from "../MdmService"
// Cloud functionality removed

const mockFs = fs as any
const mockOs = os as any
const mockVscode = vscode as any

describe("MdmService", () => {
	let originalPlatform: string

	beforeEach(() => {
		// Reset singleton
		MdmService.resetInstance()

		// Store original platform
		originalPlatform = process.platform

		// Set default platform for tests
		mockOs.platform.mockReturnValue("darwin")

		// Setup VSCode mocks
		const mockConfig = {
			get: vi.fn().mockReturnValue(false),
			update: vi.fn().mockResolvedValue(undefined),
		}
		mockVscode.workspace.getConfiguration.mockReturnValue(mockConfig)

		// Reset mocks
		vi.clearAllMocks()
	})

	afterEach(() => {
		// Restore original platform
		Object.defineProperty(process, "platform", {
			value: originalPlatform,
		})
	})

	describe("initialization", () => {
		it("should create instance successfully", async () => {
			mockFs.existsSync.mockReturnValue(false)

			const service = await MdmService.createInstance()
			expect(service).toBeInstanceOf(MdmService)
		})

		it("should load MDM config if file exists", async () => {
			const mockConfig = {
				requireCloudAuth: true,
				organizationId: "test-org-123",
			}

			mockFs.existsSync.mockReturnValue(true)
			mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig))

			const service = await MdmService.createInstance()

			expect(service.requiresCloudAuth()).toBe(true)
			expect(service.getRequiredOrganizationId()).toBe("test-org-123")
		})

		it("should handle missing MDM config file gracefully", async () => {
			mockFs.existsSync.mockReturnValue(false)

			const service = await MdmService.createInstance()

			expect(service.requiresCloudAuth()).toBe(false)
			expect(service.getRequiredOrganizationId()).toBeUndefined()
		})

		it("should handle invalid JSON gracefully", async () => {
			mockFs.existsSync.mockReturnValue(true)
			mockFs.readFileSync.mockReturnValue("invalid json")

			const service = await MdmService.createInstance()

			expect(service.requiresCloudAuth()).toBe(false)
		})
	})

	describe("platform-specific config paths", () => {
		let originalNodeEnv: string | undefined

		beforeEach(() => {
			originalNodeEnv = process.env.NODE_ENV
		})

		afterEach(() => {
			if (originalNodeEnv !== undefined) {
				process.env.NODE_ENV = originalNodeEnv
			} else {
				delete process.env.NODE_ENV
			}
		})

// Cloud-related path tests removed
	})

	// Cloud functionality removed - compliance checks no longer needed

	describe("singleton pattern", () => {
		it("should throw error when accessing instance before creation", () => {
			expect(() => MdmService.getInstance()).toThrow("MdmService not initialized")
		})

		it("should throw error when creating instance twice", async () => {
			mockFs.existsSync.mockReturnValue(false)

			await MdmService.createInstance()

			await expect(MdmService.createInstance()).rejects.toThrow("instance already exists")
		})

		it("should return same instance", async () => {
			mockFs.existsSync.mockReturnValue(false)

			const service1 = await MdmService.createInstance()
			const service2 = MdmService.getInstance()

			expect(service1).toBe(service2)
		})
	})
})
