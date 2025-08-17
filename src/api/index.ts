import { Anthropic } from "@anthropic-ai/sdk"

import type { ProviderSettings, ModelInfo } from "@Mojo-code/types"

import { ApiStream } from "./transform/stream"

import { AnthropicHandler, OpenAiHandler, GeminiHandler, OpenAiNativeHandler } from "./providers"

export interface SingleCompletionHandler {
	completePrompt(prompt: string): Promise<string>
}

export interface ApiHandlerCreateMessageMetadata {
	mode?: string
	taskId: string
	previousResponseId?: string
	/**
	 * When true, the provider must NOT fall back to internal continuity state
	 * (e.g., lastResponseId) if previousResponseId is absent.
	 * Used to enforce "skip once" after a condense operation.
	 */
	suppressPreviousResponseId?: boolean
}

export interface ApiHandler {
	createMessage(
		systemPrompt: string,
		messages: Anthropic.Messages.MessageParam[],
		metadata?: ApiHandlerCreateMessageMetadata,
	): ApiStream

	getModel(): { id: string; info: ModelInfo }

	/**
	 * Counts tokens for content blocks
	 * All providers extend BaseProvider which provides a default tiktoken implementation,
	 * but they can override this to use their native token counting endpoints
	 *
	 * @param content The content to count tokens for
	 * @returns A promise resolving to the token count
	 */
	countTokens(content: Array<Anthropic.Messages.ContentBlockParam>): Promise<number>
}

export function buildApiHandler(configuration: ProviderSettings): ApiHandler {
	const { apiProvider, ...options } = configuration

	switch (apiProvider) {
		case "anthropic":
			return new AnthropicHandler(options)
		case "openai":
			return new OpenAiHandler(options)
		case "gemini":
			return new GeminiHandler(options)
		case "openai-native":
			return new OpenAiNativeHandler(options)
		default:
			// Default to anthropic for any unrecognized provider
			return new AnthropicHandler(options)
	}
}
