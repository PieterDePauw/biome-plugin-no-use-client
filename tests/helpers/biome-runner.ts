import * as child_process from "node:child_process"
import * as util from "node:util"
import * as module from "node:module"

// Promisify execFile for easier async/await usage
const execFile = util.promisify(child_process.execFile)

// Run the Biome CLI with given args in cwd
export async function runBiome(cwd: string, biomeBinAbs: string, args: string[]) {
	try {
		// > Execute the Biome CLI with the provided arguments
		const { stdout, stderr } = await execFile(process.execPath, [biomeBinAbs, ...args], { cwd })
		// > Return the execution results
		return { code: 0, stdout, stderr }
	} catch (e) {
		if (!(e instanceof Object && "code" in e)) throw e
		const err = e as unknown as { code?: number; stdout?: string; stderr?: string }
		const code = typeof err.code === "number" ? err.code : 1
		const stdout = typeof err.stdout === "string" ? err.stdout : ""
		const stderr = typeof err.stderr === "string" ? err.stderr : ""
		return { code, stdout, stderr }
	}
}

// Resolve the Biome binary path
export function getBiomeBinPath() {
	// > Resolve the Biome binary from THIS package's devDependency
	const require = module.createRequire(import.meta.url)
	// > Return the resolved path to the Biome binary
	return require.resolve("@biomejs/biome/bin/biome")
}

// Helper to create standard biome.jsonc configuration
export function createBiomeConfig(pluginPath?: string): string {
	const plugin = pluginPath || "./node_modules/biome-plugin-no-use-client/src/no-use-client-on-page.grit";
	return `{
		"$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
		"linter": { "enabled": true },
		"plugins": ["${plugin}"]
	}`;
}

// Re-export the shouldTriggerRule from grit-pattern-extractor for backward compatibility
export { shouldTriggerRule } from "./grit-pattern-extractor"