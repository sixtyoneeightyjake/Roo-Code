import { describe, it, expect } from "vitest"
import { getApiProtocol } from "../provider-settings.js"

describe("getApiProtocol", () => {
	describe("Anthropic provider", () => {
		it("should return 'anthropic' for anthropic provider", () => {
			expect(getApiProtocol("anthropic")).toBe("anthropic")
			expect(getApiProtocol("anthropic", "claude-3-opus")).toBe("anthropic")
		})
	})

	describe("OpenAI-style providers", () => {
		it("should return 'openai' for openai provider", () => {
			expect(getApiProtocol("openai")).toBe("openai")
			expect(getApiProtocol("openai", "gpt-4")).toBe("openai")
		})

		it("should return 'openai' for openai-native provider", () => {
			expect(getApiProtocol("openai-native")).toBe("openai")
			expect(getApiProtocol("openai-native", "gpt-4")).toBe("openai")
		})

		it("should return 'openai' for gemini provider", () => {
			expect(getApiProtocol("gemini")).toBe("openai")
			expect(getApiProtocol("gemini", "gemini-pro")).toBe("openai")
		})
	})

	describe("Edge cases", () => {
		it("should return 'openai' when provider is undefined", () => {
			expect(getApiProtocol(undefined)).toBe("openai")
			expect(getApiProtocol(undefined, "claude-3-opus")).toBe("openai")
		})

		it("should handle empty model string for supported providers", () => {
			expect(getApiProtocol("openai", "")).toBe("openai")
			expect(getApiProtocol("openai-native", "")).toBe("openai")
			expect(getApiProtocol("gemini", "")).toBe("openai")
			expect(getApiProtocol("anthropic", "")).toBe("anthropic")
		})
	})
})
