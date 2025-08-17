// npx vitest run src/__tests__/index.test.ts

import { generatePackageJson } from "../index.js"

describe("generatePackageJson", () => {
	it("should be a test", () => {
		const generatedPackageJson = generatePackageJson({
			packageJson: {
				name: "Mojo-cline",
				displayName: "%extension.displayName%",
				description: "%extension.description%",
				publisher: "MojoVeterinaryInc",
				version: "3.17.2",
				icon: "assets/icons/icon.png",
				contributes: {
					viewsContainers: {
						activitybar: [
							{
								id: "Mojo-cline-ActivityBar",
								title: "%views.activitybar.title%",
								icon: "assets/icons/icon.svg",
							},
						],
					},
					views: {
						"Mojo-cline-ActivityBar": [
							{
								type: "webview",
								id: "Mojo-cline.SidebarProvider",
								name: "",
							},
						],
					},
					commands: [
						{
							command: "Mojo-cline.plusButtonClicked",
							title: "%command.newTask.title%",
							icon: "$(add)",
						},
						{
							command: "Mojo-cline.openInNewTab",
							title: "%command.openInNewTab.title%",
							category: "%configuration.title%",
						},
					],
					menus: {
						"editor/context": [
							{
								submenu: "Mojo-cline.contextMenu",
								group: "navigation",
							},
						],
						"Mojo-cline.contextMenu": [
							{
								command: "Mojo-cline.addToContext",
								group: "1_actions@1",
							},
						],
						"editor/title": [
							{
								command: "Mojo-cline.plusButtonClicked",
								group: "navigation@1",
								when: "activeWebviewPanelId == Mojo-cline.TabPanelProvider",
							},
							{
								command: "Mojo-cline.settingsButtonClicked",
								group: "navigation@6",
								when: "activeWebviewPanelId == Mojo-cline.TabPanelProvider",
							},
						],
					},
					submenus: [
						{
							id: "Mojo-cline.contextMenu",
							label: "%views.contextMenu.label%",
						},
						{
							id: "Mojo-cline.terminalMenu",
							label: "%views.terminalMenu.label%",
						},
					],
					configuration: {
						title: "%configuration.title%",
						properties: {
							"Mojo-cline.allowedCommands": {
								type: "array",
								items: {
									type: "string",
								},
								default: ["npm test", "npm install", "tsc", "git log", "git diff", "git show"],
								description: "%commands.allowedCommands.description%",
							},
							"Mojo-cline.customStoragePath": {
								type: "string",
								default: "",
								description: "%settings.customStoragePath.description%",
							},
						},
					},
				},
				scripts: {
					lint: "eslint **/*.ts",
				},
			},
			overrideJson: {
				name: "Mojo-code-nightly",
				displayName: "Mojo Code Nightly",
				publisher: "MojoVeterinaryInc",
				version: "0.0.1",
				icon: "assets/icons/icon-nightly.png",
				scripts: {},
			},
			substitution: ["Mojo-cline", "Mojo-code-nightly"],
		})

		expect(generatedPackageJson).toStrictEqual({
			name: "Mojo-code-nightly",
			displayName: "Mojo Code Nightly",
			description: "%extension.description%",
			publisher: "MojoVeterinaryInc",
			version: "0.0.1",
			icon: "assets/icons/icon-nightly.png",
			contributes: {
				viewsContainers: {
					activitybar: [
						{
							id: "Mojo-code-nightly-ActivityBar",
							title: "%views.activitybar.title%",
							icon: "assets/icons/icon.svg",
						},
					],
				},
				views: {
					"Mojo-code-nightly-ActivityBar": [
						{
							type: "webview",
							id: "Mojo-code-nightly.SidebarProvider",
							name: "",
						},
					],
				},
				commands: [
					{
						command: "Mojo-code-nightly.plusButtonClicked",
						title: "%command.newTask.title%",
						icon: "$(add)",
					},
					{
						command: "Mojo-code-nightly.openInNewTab",
						title: "%command.openInNewTab.title%",
						category: "%configuration.title%",
					},
				],
				menus: {
					"editor/context": [
						{
							submenu: "Mojo-code-nightly.contextMenu",
							group: "navigation",
						},
					],
					"Mojo-code-nightly.contextMenu": [
						{
							command: "Mojo-code-nightly.addToContext",
							group: "1_actions@1",
						},
					],
					"editor/title": [
						{
							command: "Mojo-code-nightly.plusButtonClicked",
							group: "navigation@1",
							when: "activeWebviewPanelId == Mojo-code-nightly.TabPanelProvider",
						},
						{
							command: "Mojo-code-nightly.settingsButtonClicked",
							group: "navigation@6",
							when: "activeWebviewPanelId == Mojo-code-nightly.TabPanelProvider",
						},
					],
				},
				submenus: [
					{
						id: "Mojo-code-nightly.contextMenu",
						label: "%views.contextMenu.label%",
					},
					{
						id: "Mojo-code-nightly.terminalMenu",
						label: "%views.terminalMenu.label%",
					},
				],
				configuration: {
					title: "%configuration.title%",
					properties: {
						"Mojo-code-nightly.allowedCommands": {
							type: "array",
							items: {
								type: "string",
							},
							default: ["npm test", "npm install", "tsc", "git log", "git diff", "git show"],
							description: "%commands.allowedCommands.description%",
						},
						"Mojo-code-nightly.customStoragePath": {
							type: "string",
							default: "",
							description: "%settings.customStoragePath.description%",
						},
					},
				},
			},
			scripts: {},
		})
	})
})
