import {
	type ProviderName,
	type ModelInfo,
	anthropicModels,
	geminiModels,
	openAiNativeModels,
} from "@Mojo-code/types"

export const MODELS_BY_PROVIDER: Partial<Record<ProviderName, Record<string, ModelInfo>>> = {
	anthropic: anthropicModels,
	gemini: geminiModels,
	"openai-native": openAiNativeModels,
}

export const PROVIDERS = [
	{ value: "anthropic", label: "Anthropic" },
	{ value: "gemini", label: "Google Gemini" },
	{ value: "openai-native", label: "OpenAI" },
].sort((a, b) => a.label.localeCompare(b.label))
