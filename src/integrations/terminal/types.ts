import EventEmitter from "events"

export type rooterminalProvider = "vscode" | "execa"

export interface rooterminal {
	provider: rooterminalProvider
	id: number
	busy: boolean
	running: boolean
	taskId?: string
	process?: rooterminalProcess
	getCurrentWorkingDirectory(): string
	isClosed: () => boolean
	runCommand: (command: string, callbacks: rooterminalCallbacks) => rooterminalProcessResultPromise
	setActiveStream(stream: AsyncIterable<string> | undefined, pid?: number): void
	shellExecutionComplete(exitDetails: ExitCodeDetails): void
	getProcessesWithOutput(): rooterminalProcess[]
	getUnretrievedOutput(): string
	getLastCommand(): string
	cleanCompletedProcessQueue(): void
}

export interface rooterminalCallbacks {
	onLine: (line: string, process: rooterminalProcess) => void
	onCompleted: (output: string | undefined, process: rooterminalProcess) => void
	onShellExecutionStarted: (pid: number | undefined, process: rooterminalProcess) => void
	onShellExecutionComplete: (details: ExitCodeDetails, process: rooterminalProcess) => void
	onNoShellIntegration?: (message: string, process: rooterminalProcess) => void
}

export interface rooterminalProcess extends EventEmitter<rooterminalProcessEvents> {
	command: string
	isHot: boolean
	run: (command: string) => Promise<void>
	continue: () => void
	abort: () => void
	hasUnretrievedOutput: () => boolean
	getUnretrievedOutput: () => string
}

export type rooterminalProcessResultPromise = rooterminalProcess & Promise<void>

export interface rooterminalProcessEvents {
	line: [line: string]
	continue: []
	completed: [output?: string]
	stream_available: [stream: AsyncIterable<string>]
	shell_execution_started: [pid: number | undefined]
	shell_execution_complete: [exitDetails: ExitCodeDetails]
	error: [error: Error]
	no_shell_integration: [message: string]
}

export interface ExitCodeDetails {
	exitCode: number | undefined
	signal?: number | undefined
	signalName?: string
	coreDumpPossible?: boolean
}
