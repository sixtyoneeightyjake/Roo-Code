import path from "path"
import { MojoProtectedController } from "../RooProtectedController"

describe("MojoProtectedController", () => {
	const TEST_CWD = "/test/workspace"
	let controller: MojoProtectedController

	beforeEach(() => {
		controller = new MojoProtectedController(TEST_CWD)
	})

	describe("isWriteProtected", () => {
		it("should protect .Mojoignore file", () => {
			expect(controller.isWriteProtected(".Mojoignore")).toBe(true)
		})

		it("should protect files in .Mojo directory", () => {
			expect(controller.isWriteProtected(".Mojo/config.json")).toBe(true)
			expect(controller.isWriteProtected(".Mojo/settings/user.json")).toBe(true)
			expect(controller.isWriteProtected(".Mojo/modes/custom.json")).toBe(true)
		})

		it("should protect .Mojoprotected file", () => {
			expect(controller.isWriteProtected(".Mojoprotected")).toBe(true)
		})

		it("should protect .Mojomodes files", () => {
			expect(controller.isWriteProtected(".Mojomodes")).toBe(true)
		})

		it("should protect .Mojorules* files", () => {
			expect(controller.isWriteProtected(".Mojorules")).toBe(true)
			expect(controller.isWriteProtected(".Mojorules.md")).toBe(true)
		})

		it("should protect .clinerules* files", () => {
			expect(controller.isWriteProtected(".clinerules")).toBe(true)
			expect(controller.isWriteProtected(".clinerules.md")).toBe(true)
		})

		it("should protect files in .vscode directory", () => {
			expect(controller.isWriteProtected(".vscode/settings.json")).toBe(true)
			expect(controller.isWriteProtected(".vscode/launch.json")).toBe(true)
			expect(controller.isWriteProtected(".vscode/tasks.json")).toBe(true)
		})

		it("should protect AGENTS.md file", () => {
			expect(controller.isWriteProtected("AGENTS.md")).toBe(true)
		})

		it("should protect AGENT.md file", () => {
			expect(controller.isWriteProtected("AGENT.md")).toBe(true)
		})

		it("should not protect other files starting with .Mojo", () => {
			expect(controller.isWriteProtected(".Mojosettings")).toBe(false)
			expect(controller.isWriteProtected(".Mojoconfig")).toBe(false)
		})

		it("should not protect regular files", () => {
			expect(controller.isWriteProtected("src/index.ts")).toBe(false)
			expect(controller.isWriteProtected("package.json")).toBe(false)
			expect(controller.isWriteProtected("README.md")).toBe(false)
		})

		it("should not protect files that contain 'Mojo' but don't start with .Mojo", () => {
			expect(controller.isWriteProtected("src/Mojo-utils.ts")).toBe(false)
			expect(controller.isWriteProtected("config/Mojo.config.js")).toBe(false)
		})

		it("should handle nested paths correctly", () => {
			expect(controller.isWriteProtected(".Mojo/config.json")).toBe(true) // .Mojo/** matches at root
			expect(controller.isWriteProtected("nested/.Mojoignore")).toBe(true) // .Mojoignore matches anywhere by default
			expect(controller.isWriteProtected("nested/.Mojomodes")).toBe(true) // .Mojomodes matches anywhere by default
			expect(controller.isWriteProtected("nested/.Mojorules.md")).toBe(true) // .Mojorules* matches anywhere by default
		})

		it("should handle absolute paths by converting to relative", () => {
			const absolutePath = path.join(TEST_CWD, ".Mojoignore")
			expect(controller.isWriteProtected(absolutePath)).toBe(true)
		})

		it("should handle paths with different separators", () => {
			expect(controller.isWriteProtected(".Mojo\\config.json")).toBe(true)
			expect(controller.isWriteProtected(".Mojo/config.json")).toBe(true)
		})
	})

	describe("getProtectedFiles", () => {
		it("should return set of protected files from a list", () => {
			const files = ["src/index.ts", ".Mojoignore", "package.json", ".Mojo/config.json", "README.md"]

			const protectedFiles = controller.getProtectedFiles(files)

			expect(protectedFiles).toEqual(new Set([".Mojoignore", ".Mojo/config.json"]))
		})

		it("should return empty set when no files are protected", () => {
			const files = ["src/index.ts", "package.json", "README.md"]

			const protectedFiles = controller.getProtectedFiles(files)

			expect(protectedFiles).toEqual(new Set())
		})
	})

	describe("annotatePathsWithProtection", () => {
		it("should annotate paths with protection status", () => {
			const files = ["src/index.ts", ".Mojoignore", ".Mojo/config.json", "package.json"]

			const annotated = controller.annotatePathsWithProtection(files)

			expect(annotated).toEqual([
				{ path: "src/index.ts", isProtected: false },
				{ path: ".Mojoignore", isProtected: true },
				{ path: ".Mojo/config.json", isProtected: true },
				{ path: "package.json", isProtected: false },
			])
		})
	})

	describe("getProtectionMessage", () => {
		it("should return appropriate protection message", () => {
			const message = controller.getProtectionMessage()
			expect(message).toBe("This is a Mojo configuration file and requires approval for modifications")
		})
	})

	describe("getInstructions", () => {
		it("should return formatted instructions about protected files", () => {
			const instructions = controller.getInstructions()

			expect(instructions).toContain("# Protected Files")
			expect(instructions).toContain("write-protected")
			expect(instructions).toContain(".Mojoignore")
			expect(instructions).toContain(".Mojo/**")
			expect(instructions).toContain("\u{1F6E1}") // Shield symbol
		})
	})

	describe("getProtectedPatterns", () => {
		it("should return the list of protected patterns", () => {
			const patterns = MojoProtectedController.getProtectedPatterns()

			expect(patterns).toEqual([
				".Mojoignore",
				".Mojomodes",
				".Mojorules*",
				".clinerules*",
				".Mojo/**",
				".vscode/**",
				".Mojoprotected",
				"AGENTS.md",
				"AGENT.md",
			])
		})
	})
})
