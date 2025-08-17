import i18next from "i18next"

import type { ProviderSettings } from "@Mojo-code/types"

import { isRouterName, RouterModels } from "@Mojo/api"

export function validateApiConfiguration(apiConfiguration: ProviderSettings): string | undefined {
	const keysAndIdsPresentErrorMessage = validateModelsAndKeysProvided(apiConfiguration)
	if (keysAndIdsPresentErrorMessage) {
		return keysAndIdsPresentErrorMessage
	}

	return validateModelId(apiConfiguration)
}

function validateModelsAndKeysProvided(apiConfiguration: ProviderSettings): string | undefined {
	switch (apiConfiguration.apiProvider) {
		case "anthropic":
			if (!apiConfiguration.apiKey) {
				return i18next.t("settings:validation.apiKey")
			}
			break
		case "gemini":
			if (!apiConfiguration.geminiApiKey) {
				return i18next.t("settings:validation.apiKey")
			}
			break
		case "openai-native":
			if (!apiConfiguration.openAiNativeApiKey) {
				return i18next.t("settings:validation.apiKey")
			}
			break
		case "openai":
			if (!apiConfiguration.openAiBaseUrl || !apiConfiguration.openAiApiKey || !apiConfiguration.openAiModelId) {
				return i18next.t("settings:validation.openAi")
			}
			break
	}

	return undefined
}

function getModelIdForProvider(apiConfiguration: ProviderSettings, provider: string): string | undefined {
	switch (provider) {
		case "anthropic":
			return apiConfiguration.apiModelId
		case "gemini":
			return apiConfiguration.apiModelId
		case "openai-native":
			return apiConfiguration.apiModelId
		default:
			return apiConfiguration.apiModelId
	}
}
/**
 * Validates an Amazon Bedrock ARN format and optionally checks if the region in the ARN matches the provided region
 * @param arn The ARN string to validate
 * @param region Optional region to check against the ARN's region
 * @returns An object with validation results: { isValid, arnRegion, errorMessage }
 */
export function validateBedrockArn(arn: string, region?: string) {
	// Validate ARN format
	const arnRegex = /^arn:aws:(?:bedrock|sagemaker):([^:]+):([^:]*):(?:([^/]+)\/([\w.\-:]+)|([^/]+))$/
	const match = arn.match(arnRegex)

	if (!match) {
		return {
			isValid: false,
			arnRegion: undefined,
			errorMessage: i18next.t("settings:validation.arn.invalidFormat"),
		}
	}

	// Extract region from ARN
	const arnRegion = match[1]

	// Check if region in ARN matches provided region (if specified)
	if (region && arnRegion !== region) {
		return {
			isValid: true,
			arnRegion,
			errorMessage: i18next.t("settings:validation.arn.regionMismatch", { arnRegion, region }),
		}
	}

	// ARN is valid and region matches (or no region was provided to check against)
	return { isValid: true, arnRegion, errorMessage: undefined }
}

export function validateModelId(apiConfiguration: ProviderSettings): string | undefined {
	const provider = apiConfiguration.apiProvider ?? ""

	if (!isRouterName(provider)) {
		return undefined
	}

	// For supported providers, we don't need model ID validation since they use apiModelId
	// and have their own model definitions in the types package
	return undefined
}

/**
 * Extracts model-specific validation errors from the API configuration
 * This is used to show model errors specifically in the model selector components
 */
export function getModelValidationError(
	apiConfiguration: ProviderSettings,
	_routerModels?: RouterModels,
): string | undefined {
	const modelId = getModelIdForProvider(apiConfiguration, apiConfiguration.apiProvider || "")
	const configWithModelId = {
		...apiConfiguration,
		apiModelId: modelId || "",
	}

	return validateModelId(configWithModelId)
}

/**
 * Validates API configuration but excludes model-specific errors
 * This is used for the general API error display to prevent duplication
 * when model errors are shown in the model selector
 */
export function validateApiConfigurationExcludingModelErrors(apiConfiguration: ProviderSettings): string | undefined {
	const keysAndIdsPresentErrorMessage = validateModelsAndKeysProvided(apiConfiguration)
	if (keysAndIdsPresentErrorMessage) {
		return keysAndIdsPresentErrorMessage
	}

	// skip model validation errors as they'll be shown in the model selector
	return undefined
}
