import { z } from "zod"

import { reasoningEffortsSchema, verbosityLevelsSchema, modelInfoSchema } from "./model.js"
import { codebaseIndexProviderSchema } from "./codebase-index.js"

// Extended schema that includes "minimal" for GPT-5 models
export const extendedReasoningEffortsSchema = z.union([reasoningEffortsSchema, z.literal("minimal")])

export type ReasoningEffortWithMinimal = z.infer<typeof extendedReasoningEffortsSchema>

/**
 * ProviderName
 */

export const providerNames = [
	"anthropic",
	"claude-code",
	"gemini",
	"openai",
	"openai-native",
	"human-relay",
	"fake-ai",
] as const

export const providerNamesSchema = z.enum(providerNames)

export type ProviderName = z.infer<typeof providerNamesSchema>

/**
 * ProviderSettingsEntry
 */

export const providerSettingsEntrySchema = z.object({
	id: z.string(),
	name: z.string(),
	apiProvider: providerNamesSchema.optional(),
})

export type ProviderSettingsEntry = z.infer<typeof providerSettingsEntrySchema>

/**
 * ProviderSettings
 */

/**
 * Default value for consecutive mistake limit
 */
export const DEFAULT_CONSECUTIVE_MISTAKE_LIMIT = 3

const baseProviderSettingsSchema = z.object({
	includeMaxTokens: z.boolean().optional(),
	diffEnabled: z.boolean().optional(),
	todoListEnabled: z.boolean().optional(),
	fuzzyMatchThreshold: z.number().optional(),
	modelTemperature: z.number().nullish(),
	rateLimitSeconds: z.number().optional(),
	consecutiveMistakeLimit: z.number().min(0).optional(),

	// Model reasoning.
	enableReasoningEffort: z.boolean().optional(),
	reasoningEffort: extendedReasoningEffortsSchema.optional(),
	modelMaxTokens: z.number().optional(),
	modelMaxThinkingTokens: z.number().optional(),

	// Model verbosity.
	verbosity: verbosityLevelsSchema.optional(),
})

// Several of the providers share common model config properties.
const apiModelIdProviderModelSchema = baseProviderSettingsSchema.extend({
	apiModelId: z.string().optional(),
})

const anthropicSchema = apiModelIdProviderModelSchema.extend({
	apiKey: z.string().optional(),
	anthropicBaseUrl: z.string().optional(),
	anthropicUseAuthToken: z.boolean().optional(),
	anthropicBeta1MContext: z.boolean().optional(), // Enable 'context-1m-2025-08-07' beta for 1M context window
})

const claudeCodeSchema = apiModelIdProviderModelSchema.extend({
	claudeCodePath: z.string().optional(),
	claudeCodeMaxOutputTokens: z.number().int().min(1).max(200000).optional(),
})

const openAiSchema = baseProviderSettingsSchema.extend({
	openAiBaseUrl: z.string().optional(),
	openAiApiKey: z.string().optional(),
	openAiLegacyFormat: z.boolean().optional(),
	openAiR1FormatEnabled: z.boolean().optional(),
	openAiModelId: z.string().optional(),
	openAiCustomModelInfo: modelInfoSchema.nullish(),
	openAiUseAzure: z.boolean().optional(),
	azureApiVersion: z.string().optional(),
	openAiStreamingEnabled: z.boolean().optional(),
	openAiHostHeader: z.string().optional(), // Keep temporarily for backward compatibility during migration.
	openAiHeaders: z.record(z.string(), z.string()).optional(),
})

const geminiSchema = apiModelIdProviderModelSchema.extend({
	geminiApiKey: z.string().optional(),
	googleGeminiBaseUrl: z.string().optional(),
	enableUrlContext: z.boolean().optional(),
	enableGrounding: z.boolean().optional(),
})

const openAiNativeSchema = apiModelIdProviderModelSchema.extend({
	openAiNativeApiKey: z.string().optional(),
	openAiNativeBaseUrl: z.string().optional(),
})

const humanRelaySchema = baseProviderSettingsSchema

const fakeAiSchema = baseProviderSettingsSchema.extend({
	fakeAi: z.unknown().optional(),
})

const defaultSchema = z.object({
	apiProvider: z.undefined(),
})

export const providerSettingsSchemaDiscriminated = z.discriminatedUnion("apiProvider", [
	anthropicSchema.merge(z.object({ apiProvider: z.literal("anthropic") })),
	claudeCodeSchema.merge(z.object({ apiProvider: z.literal("claude-code") })),
	geminiSchema.merge(z.object({ apiProvider: z.literal("gemini") })),
	openAiSchema.merge(z.object({ apiProvider: z.literal("openai") })),
	openAiNativeSchema.merge(z.object({ apiProvider: z.literal("openai-native") })),
	humanRelaySchema.merge(z.object({ apiProvider: z.literal("human-relay") })),
	fakeAiSchema.merge(z.object({ apiProvider: z.literal("fake-ai") })),
	defaultSchema,
])

export const providerSettingsSchema = z.object({
	apiProvider: providerNamesSchema.optional(),
	...anthropicSchema.shape,
	...claudeCodeSchema.shape,
	...geminiSchema.shape,
	...openAiSchema.shape,
	...openAiNativeSchema.shape,
	...humanRelaySchema.shape,
	...fakeAiSchema.shape,
	...codebaseIndexProviderSchema.shape,
})

export type ProviderSettings = z.infer<typeof providerSettingsSchema>

export const providerSettingsWithIdSchema = providerSettingsSchema.extend({ id: z.string().optional() })
export const discriminatedProviderSettingsWithIdSchema = providerSettingsSchemaDiscriminated.and(
	z.object({ id: z.string().optional() }),
)
export type ProviderSettingsWithId = z.infer<typeof providerSettingsWithIdSchema>

export const PROVIDER_SETTINGS_KEYS = providerSettingsSchema.keyof().options

export const MODEL_ID_KEYS: Partial<keyof ProviderSettings>[] = ["apiModelId", "openAiModelId"]

export const getModelId = (settings: ProviderSettings): string | undefined => {
	const modelIdKey = MODEL_ID_KEYS.find((key) => settings[key])
	return modelIdKey ? (settings[modelIdKey] as string) : undefined
}

// Providers that use Anthropic-style API protocol
export const ANTHROPIC_STYLE_PROVIDERS: ProviderName[] = ["anthropic", "claude-code"]

// Helper function to determine API protocol for a provider and model
export const getApiProtocol = (provider: ProviderName | undefined, _modelId?: string): "anthropic" | "openai" => {
	// First check if the provider is an Anthropic-style provider
	if (provider && ANTHROPIC_STYLE_PROVIDERS.includes(provider)) {
		return "anthropic"
	}

	// Default to OpenAI protocol
	return "openai"
}
