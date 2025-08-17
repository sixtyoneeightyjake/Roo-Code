import { z } from "zod"

import { clineMessageSchema, tokenUsageSchema } from "./message.js"
import { toolNamesSchema, toolUsageSchema } from "./tool.js"

/**
 * MojoCodeEventName
 */

export enum MojoCodeEventName {
	// Task Provider Lifecycle
	TaskCreated = "taskCreated",

	// Task Lifecycle
	TaskStarted = "taskStarted",
	TaskCompleted = "taskCompleted",
	TaskAborted = "taskAborted",
	TaskFocused = "taskFocused",
	TaskUnfocused = "taskUnfocused",
	TaskActive = "taskActive",
	TaskInteractive = "taskInteractive",
	TaskResumable = "taskResumable",
	TaskIdle = "taskIdle",

	// Subtask Lifecycle
	TaskPaused = "taskPaused",
	TaskUnpaused = "taskUnpaused",
	TaskSpawned = "taskSpawned",

	// Task Execution
	Message = "message",
	TaskModeSwitched = "taskModeSwitched",
	TaskAskResponded = "taskAskResponded",

	// Task Analytics
	TaskTokenUsageUpdated = "taskTokenUsageUpdated",
	TaskToolFailed = "taskToolFailed",

	// Evals
	EvalPass = "evalPass",
	EvalFail = "evalFail",
}

/**
 * MojoCodeEvents
 */

export const MojoCodeEventsSchema = z.object({
	[MojoCodeEventName.TaskCreated]: z.tuple([z.string()]),

	[MojoCodeEventName.TaskStarted]: z.tuple([z.string()]),
	[MojoCodeEventName.TaskCompleted]: z.tuple([
		z.string(),
		tokenUsageSchema,
		toolUsageSchema,
		z.object({
			isSubtask: z.boolean(),
		}),
	]),
	[MojoCodeEventName.TaskAborted]: z.tuple([z.string()]),
	[MojoCodeEventName.TaskFocused]: z.tuple([z.string()]),
	[MojoCodeEventName.TaskUnfocused]: z.tuple([z.string()]),
	[MojoCodeEventName.TaskActive]: z.tuple([z.string()]),
	[MojoCodeEventName.TaskInteractive]: z.tuple([z.string()]),
	[MojoCodeEventName.TaskResumable]: z.tuple([z.string()]),
	[MojoCodeEventName.TaskIdle]: z.tuple([z.string()]),

	[MojoCodeEventName.TaskPaused]: z.tuple([z.string()]),
	[MojoCodeEventName.TaskUnpaused]: z.tuple([z.string()]),
	[MojoCodeEventName.TaskSpawned]: z.tuple([z.string(), z.string()]),

	[MojoCodeEventName.Message]: z.tuple([
		z.object({
			taskId: z.string(),
			action: z.union([z.literal("created"), z.literal("updated")]),
			message: clineMessageSchema,
		}),
	]),
	[MojoCodeEventName.TaskModeSwitched]: z.tuple([z.string(), z.string()]),
	[MojoCodeEventName.TaskAskResponded]: z.tuple([z.string()]),

	[MojoCodeEventName.TaskToolFailed]: z.tuple([z.string(), toolNamesSchema, z.string()]),
	[MojoCodeEventName.TaskTokenUsageUpdated]: z.tuple([z.string(), tokenUsageSchema]),
})

export type MojoCodeEvents = z.infer<typeof MojoCodeEventsSchema>

/**
 * TaskEvent
 */

export const taskEventSchema = z.discriminatedUnion("eventName", [
	// Task Provider Lifecycle
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskCreated),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskCreated],
		taskId: z.number().optional(),
	}),

	// Task Lifecycle
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskStarted),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskStarted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskCompleted),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskCompleted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskAborted),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskAborted],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskFocused),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskFocused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskUnfocused),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskUnfocused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskActive),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskActive],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskInteractive),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskInteractive],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskResumable),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskResumable],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskIdle),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskIdle],
		taskId: z.number().optional(),
	}),

	// Subtask Lifecycle
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskPaused),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskPaused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskUnpaused),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskUnpaused],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskSpawned),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskSpawned],
		taskId: z.number().optional(),
	}),

	// Task Execution
	z.object({
		eventName: z.literal(MojoCodeEventName.Message),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.Message],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskModeSwitched),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskModeSwitched],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskAskResponded),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskAskResponded],
		taskId: z.number().optional(),
	}),

	// Task Analytics
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskToolFailed),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskToolFailed],
		taskId: z.number().optional(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.TaskTokenUsageUpdated),
		payload: MojoCodeEventsSchema.shape[MojoCodeEventName.TaskTokenUsageUpdated],
		taskId: z.number().optional(),
	}),

	// Evals
	z.object({
		eventName: z.literal(MojoCodeEventName.EvalPass),
		payload: z.undefined(),
		taskId: z.number(),
	}),
	z.object({
		eventName: z.literal(MojoCodeEventName.EvalFail),
		payload: z.undefined(),
		taskId: z.number(),
	}),
])

export type TaskEvent = z.infer<typeof taskEventSchema>
