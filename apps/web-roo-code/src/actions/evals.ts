"use server"

import { getModelId, MojoCodeSettingsSchema } from "@Mojo-code/types"
import { getRuns, getLanguageScores } from "@Mojo-code/evals"

import { formatScore } from "@/lib"

export async function getEvalRuns() {
	const languageScores = await getLanguageScores()

	const runs = (await getRuns())
		.filter((run) => !!run.taskMetrics)
		.filter(({ settings }) => MojoCodeSettingsSchema.safeParse(settings).success)
		.sort((a, b) => b.passed - a.passed)
		.map((run) => {
			const settings = MojoCodeSettingsSchema.parse(run.settings)

			return {
				...run,
				label: run.description || run.model,
				score: formatScore(run.passed / (run.passed + run.failed)),
				languageScores: languageScores[run.id],
				taskMetrics: run.taskMetrics!,
				modelId: getModelId(settings),
			}
		})

	return runs
}
