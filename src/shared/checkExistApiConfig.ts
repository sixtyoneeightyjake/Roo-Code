import { SECRET_STATE_KEYS, ProviderSettings } from "@Mojo-code/types"

export function checkExistKey(config: ProviderSettings | undefined) {
	if (!config) {
		return false
	}

	// Check all secret keys from the centralized SECRET_STATE_KEYS array.
	const hasSecretKey = SECRET_STATE_KEYS.some((key) => config[key] !== undefined)

	// Check additional non-secret configuration properties
	const hasOtherConfig = [
		// For supported providers, most configuration is handled through secret keys
		// No additional non-secret properties needed for current supported providers
	].some((value) => value !== undefined)

	return hasSecretKey || hasOtherConfig
}
