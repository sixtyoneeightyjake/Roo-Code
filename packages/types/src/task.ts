import { z } from "zod"

import { MojoCodeEventName } from "./events.js"
import { type ClineMessage, type TokenUsage } from "./message.js"
import { type ToolUsage, type ToolName } from "./tool.js"
import type { StaticAppProperties, GitProperties, TelemetryProperties } from "./telemetry.js"

/**
 * TaskProviderLike
 */

export interface TaskProviderState {
	mode?: string
}

export interface TaskProviderLike {
	readonly cwd: string
	readonly appProperties: StaticAppProperties
	readonly gitProperties: GitProperties | undefined

	getCurrentTask(): TaskLike | undefined
	getCurrentTaskStack(): string[]
	getRecentTasks(): string[]

	createTask(text?: string, images?: string[], parentTask?: TaskLike): Promise<TaskLike>
	cancelTask(): Promise<void>
	clearTask(): Promise<void>
	resumeTask(taskId: string): void

	getState(): Promise<TaskProviderState>
	postStateToWebview(): Promise<void>
	postMessageToWebview(message: unknown): Promise<void>

	getTelemetryProperties(): Promise<TelemetryProperties>

	on<K extends keyof TaskProviderEvents>(
		event: K,
		listener: (...args: TaskProviderEvents[K]) => void | Promise<void>,
	): this

	off<K extends keyof TaskProviderEvents>(
		event: K,
		listener: (...args: TaskProviderEvents[K]) => void | Promise<void>,
	): this
}

export type TaskProviderEvents = {
	[MojoCodeEventName.TaskCreated]: [task: TaskLike]

	// Proxied from the Task EventEmitter.
	[MojoCodeEventName.TaskStarted]: [taskId: string]
	[MojoCodeEventName.TaskCompleted]: [taskId: string, tokenUsage: TokenUsage, toolUsage: ToolUsage]
	[MojoCodeEventName.TaskAborted]: [taskId: string]
	[MojoCodeEventName.TaskFocused]: [taskId: string]
	[MojoCodeEventName.TaskUnfocused]: [taskId: string]
	[MojoCodeEventName.TaskActive]: [taskId: string]
	[MojoCodeEventName.TaskInteractive]: [taskId: string]
	[MojoCodeEventName.TaskResumable]: [taskId: string]
	[MojoCodeEventName.TaskIdle]: [taskId: string]
}

/**
 * TaskLike
 */

export enum TaskStatus {
	Running = "running",
	Interactive = "interactive",
	Resumable = "resumable",
	Idle = "idle",
	None = "none",
}

export const taskMetadataSchema = z.object({
	task: z.string().optional(),
	images: z.array(z.string()).optional(),
})

export type TaskMetadata = z.infer<typeof taskMetadataSchema>

export interface TaskLike {
	readonly taskId: string
	readonly taskStatus: TaskStatus
	readonly taskAsk: ClineMessage | undefined
	readonly metadata: TaskMetadata

	readonly rootTask?: TaskLike

	on<K extends keyof TaskEvents>(event: K, listener: (...args: TaskEvents[K]) => void | Promise<void>): this
	off<K extends keyof TaskEvents>(event: K, listener: (...args: TaskEvents[K]) => void | Promise<void>): this

	approveAsk(options?: { text?: string; images?: string[] }): void
	denyAsk(options?: { text?: string; images?: string[] }): void
	submitUserMessage(text: string, images?: string[]): void
}

export type TaskEvents = {
	// Task Lifecycle
	[MojoCodeEventName.TaskStarted]: []
	[MojoCodeEventName.TaskCompleted]: [taskId: string, tokenUsage: TokenUsage, toolUsage: ToolUsage]
	[MojoCodeEventName.TaskAborted]: []
	[MojoCodeEventName.TaskFocused]: []
	[MojoCodeEventName.TaskUnfocused]: []
	[MojoCodeEventName.TaskActive]: [taskId: string]
	[MojoCodeEventName.TaskInteractive]: [taskId: string]
	[MojoCodeEventName.TaskResumable]: [taskId: string]
	[MojoCodeEventName.TaskIdle]: [taskId: string]

	// Subtask Lifecycle
	[MojoCodeEventName.TaskPaused]: []
	[MojoCodeEventName.TaskUnpaused]: []
	[MojoCodeEventName.TaskSpawned]: [taskId: string]

	// Task Execution
	[MojoCodeEventName.Message]: [{ action: "created" | "updated"; message: ClineMessage }]
	[MojoCodeEventName.TaskModeSwitched]: [taskId: string, mode: string]
	[MojoCodeEventName.TaskAskResponded]: []

	// Task Analytics
	[MojoCodeEventName.TaskToolFailed]: [taskId: string, tool: ToolName, error: string]
	[MojoCodeEventName.TaskTokenUsageUpdated]: [taskId: string, tokenUsage: TokenUsage]
}
