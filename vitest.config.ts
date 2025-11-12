// Import modules
import { defineConfig } from "vitest/config"

// Export Vitest configuration
export default defineConfig({
	root: ".",
	test: {
		environment: "node",
		testTimeout: 120_000,
		reporters: ["default"],
		coverage: {
			"provider": "v8",
			"reporter": ["default", "json", "html"],
		}
	},
})
