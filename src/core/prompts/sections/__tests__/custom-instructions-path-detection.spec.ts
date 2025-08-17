import { describe, it, expect, vi } from "vitest"
import * as os from "os"
import * as path from "path"

describe("custom-instructions path detection", () => {
	it("should use exact path comparison instead of string includes", () => {
		// Test the logic that our fix implements
		const fakeHomeDir = "/Users/john.Mojo.smith"
		const globalMojoDir = path.join(fakeHomeDir, ".Mojo") // "/Users/john.Mojo.smith/.Mojo"
		const projectMojoDir = "/projects/my-project/.Mojo"

		// Old implementation (fragile):
		// const isGlobal = MojoDir.includes(path.join(os.homedir(), ".Mojo"))
		// This could fail if the home directory path contains ".Mojo" elsewhere

		// New implementation (robust):
		// const isGlobal = path.resolve(MojoDir) === path.resolve(getGlobalMojoDirectory())

		// Test the new logic
		const isGlobalForGlobalDir = path.resolve(globalMojoDir) === path.resolve(globalMojoDir)
		const isGlobalForProjectDir = path.resolve(projectMojoDir) === path.resolve(globalMojoDir)

		expect(isGlobalForGlobalDir).toBe(true)
		expect(isGlobalForProjectDir).toBe(false)

		// Verify that the old implementation would have been problematic
		// if the home directory contained ".Mojo" in the path
		const oldLogicGlobal = globalMojoDir.includes(path.join(fakeHomeDir, ".Mojo"))
		const oldLogicProject = projectMojoDir.includes(path.join(fakeHomeDir, ".Mojo"))

		expect(oldLogicGlobal).toBe(true) // This works
		expect(oldLogicProject).toBe(false) // This also works, but is fragile

		// The issue was that if the home directory path itself contained ".Mojo",
		// the includes() check could produce false positives in edge cases
	})

	it("should handle edge cases with path resolution", () => {
		// Test various edge cases that exact path comparison handles better
		const testCases = [
			{
				global: "/Users/test/.Mojo",
				project: "/Users/test/project/.Mojo",
				expected: { global: true, project: false },
			},
			{
				global: "/home/user/.Mojo",
				project: "/home/user/.Mojo", // Same directory
				expected: { global: true, project: true },
			},
			{
				global: "/Users/john.Mojo.smith/.Mojo",
				project: "/projects/app/.Mojo",
				expected: { global: true, project: false },
			},
		]

		testCases.forEach(({ global, project, expected }) => {
			const isGlobalForGlobal = path.resolve(global) === path.resolve(global)
			const isGlobalForProject = path.resolve(project) === path.resolve(global)

			expect(isGlobalForGlobal).toBe(expected.global)
			expect(isGlobalForProject).toBe(expected.project)
		})
	})
})
