import type { ProviderName, ModelInfo } from "@Mojo-code/types"

export const filterProviders = (
	providers: Array<{ value: string; label: string }>,
	organizationAllowList?: any,
): Array<{ value: string; label: string }> => {
	// No organization filtering - return all providers
	return providers
}

export const filterModels = (
	models: Record<string, ModelInfo> | null,
	providerId?: ProviderName,
	organizationAllowList?: any,
): Record<string, ModelInfo> | null => {
	// No organization filtering - return all models
	return models
}
