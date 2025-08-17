import { useCallback, useState } from "react"
import { Checkbox } from "vscrui"
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react"

import type { ProviderSettings } from "@Mojo-code/types"

import { VSCodeButtonLink } from "@src/components/common/VSCodeButtonLink"

import { inputEventTransform } from "../transforms"

type GeminiProps = {
	apiConfiguration: ProviderSettings
	setApiConfigurationField: (field: keyof ProviderSettings, value: ProviderSettings[keyof ProviderSettings]) => void
	fromWelcomeView?: boolean
}

export const Gemini = ({ apiConfiguration, setApiConfigurationField, fromWelcomeView }: GeminiProps) => {
	const [googleGeminiBaseUrlSelected, setGoogleGeminiBaseUrlSelected] = useState(
		!!apiConfiguration?.googleGeminiBaseUrl,
	)

	const handleInputChange = useCallback(
		<K extends keyof ProviderSettings, E>(
			field: K,
			transform: (event: E) => ProviderSettings[K] = inputEventTransform,
		) =>
			(event: E | Event) => {
				setApiConfigurationField(field, transform(event as E))
			},
		[setApiConfigurationField],
	)

	return (
		<>
			<VSCodeTextField
				value={apiConfiguration?.geminiApiKey || ""}
				type="password"
				onInput={handleInputChange("geminiApiKey")}
				placeholder="Enter your API key"
				className="w-full">
				<label className="block font-medium mb-1">Gemini API Key</label>
			</VSCodeTextField>
			<div className="text-sm text-vscode-descriptionForeground -mt-2">
				API keys are stored securely and never shared.
			</div>
			{!apiConfiguration?.geminiApiKey && (
				<VSCodeButtonLink href="https://ai.google.dev/" appearance="secondary">
					Get Gemini API Key
				</VSCodeButtonLink>
			)}

			<div>
				<Checkbox
					data-testid="checkbox-custom-base-url"
					checked={googleGeminiBaseUrlSelected}
					onChange={(checked: boolean) => {
						setGoogleGeminiBaseUrlSelected(checked)
						if (!checked) {
							setApiConfigurationField("googleGeminiBaseUrl", "")
						}
					}}>
					Use Custom Base URL
				</Checkbox>
				{googleGeminiBaseUrlSelected && (
					<VSCodeTextField
						value={apiConfiguration?.googleGeminiBaseUrl || ""}
						type="url"
						onInput={handleInputChange("googleGeminiBaseUrl")}
						placeholder="https://generativelanguage.googleapis.com"
						className="w-full mt-1"
					/>
				)}

				{!fromWelcomeView && (
					<>
						<Checkbox
							className="mt-6"
							data-testid="checkbox-url-context"
							checked={!!apiConfiguration.enableUrlContext}
							onChange={(checked: boolean) => setApiConfigurationField("enableUrlContext", checked)}>
							Enable URL Context
						</Checkbox>
						<div className="text-sm text-vscode-descriptionForeground mb-3 mt-1.5">
							Allow Gemini to access and analyze content from URLs you provide.
						</div>

						<Checkbox
							data-testid="checkbox-grounding-search"
							checked={!!apiConfiguration.enableGrounding}
							onChange={(checked: boolean) => setApiConfigurationField("enableGrounding", checked)}>
							Enable Grounding with Google Search
						</Checkbox>
						<div className="text-sm text-vscode-descriptionForeground mb-3 mt-1.5">
							Ground Gemini responses with real-time information from Google Search.
						</div>
					</>
				)}
			</div>
		</>
	)
}
