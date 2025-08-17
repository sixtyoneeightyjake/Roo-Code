import type { ProviderSettings } from "@Mojo-code/types"

export class ProfileValidator {
	public static isProfileAllowed(profile: ProviderSettings): boolean {
		// No organization filtering - all profiles are allowed
		return true
	}


}
