import { config } from "@Mojo-code/config-eslint/base"
import globals from "globals"

/** @type {import("eslint").Linter.Config} */
export default [
	...config,
	{
		files: ["**/*.cjs"],
		languageOptions: {
			globals: {
				...globals.node,
				...globals.commonjs,
			},
			sourceType: "commonjs",
		},
		rules: {
			"@typescript-eslint/no-require-imports": "off",
		},
	},
]
