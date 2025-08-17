import { describe, it, expect } from "vitest"
import path from "path"
import { generateNormalizedAbsolutePath, generateRelativeFilePath } from "../get-relative-path"

describe("get-relative-path", () => {
	describe("generateNormalizedAbsolutePath", () => {
		it("should use provided workspace root", () => {
			const filePath = "src/file.ts"
			const workspaceroot = path.join(path.sep, "custom", "workspace")
			const result = generateNormalizedAbsolutePath(filePath, workspaceroot)
			// On Windows, path.resolve adds the drive letter, so we need to use path.resolve for the expected value
			expect(result).toBe(path.resolve(workspaceroot, filePath))
		})

		it("should handle absolute paths", () => {
			const filePath = path.join(path.sep, "absolute", "path", "file.ts")
			const workspaceroot = path.join(path.sep, "custom", "workspace")
			const result = generateNormalizedAbsolutePath(filePath, workspaceroot)
			// When an absolute path is provided, it should be resolved to include drive letter on Windows
			expect(result).toBe(path.resolve(filePath))
		})

		it("should normalize paths with . and .. segments", () => {
			const filePath = "./src/../src/file.ts"
			const workspaceroot = path.join(path.sep, "custom", "workspace")
			const result = generateNormalizedAbsolutePath(filePath, workspaceroot)
			// Use path.resolve to get the expected normalized absolute path
			expect(result).toBe(path.resolve(workspaceroot, "src", "file.ts"))
		})
	})

	describe("generateRelativeFilePath", () => {
		it("should use provided workspace root", () => {
			const workspaceroot = path.join(path.sep, "custom", "workspace")
			const absolutePath = path.join(workspaceroot, "src", "file.ts")
			const result = generateRelativeFilePath(absolutePath, workspaceroot)
			expect(result).toBe(path.join("src", "file.ts"))
		})

		it("should handle paths outside workspace", () => {
			const absolutePath = path.join(path.sep, "outside", "workspace", "file.ts")
			const workspaceroot = path.join(path.sep, "custom", "workspace")
			const result = generateRelativeFilePath(absolutePath, workspaceroot)
			// The result will have .. segments to navigate outside
			expect(result).toContain("..")
		})

		it("should handle same path as workspace", () => {
			const workspaceroot = path.join(path.sep, "custom", "workspace")
			const absolutePath = workspaceroot
			const result = generateRelativeFilePath(absolutePath, workspaceroot)
			expect(result).toBe(".")
		})

		it("should handle multi-workspace scenarios", () => {
			// Simulate the error scenario from the issue
			const workspaceroot = path.join(path.sep, "Users", "test", "project")
			const absolutePath = path.join(path.sep, "Users", "test", "admin", ".prettierrc.json")
			const result = generateRelativeFilePath(absolutePath, workspaceroot)
			// Should generate a valid relative path, not throw an error
			expect(result).toBe(path.join("..", "admin", ".prettierrc.json"))
		})
	})
})
