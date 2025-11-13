import * as fs from "node:fs/promises";
import * as path from "node:path";
import { getBiomeBinPath, runBiome } from "./biome-runner";
import { makeTempDir, writeFileTree } from "./filesystem";
import { clearFixtureCache } from "./fixtures";
import { installInto, npmPack } from "./package-management";

// Shared test environment for performance optimization
let sharedTestEnv: {
	tmpDir: string;
	tarballPath: string;
	biomeBin: string;
} | null = null;

// Setup shared test environment (called once in beforeAll)
export async function setupSharedTestEnv(pkgRoot: string): Promise<void> {
	if (sharedTestEnv) {
		throw new Error("Shared test environment already initialized");
	}

	const tmpDir = await makeTempDir("shared-biome-test");
	const tarballPath = await npmPack(pkgRoot);
	const biomeBin = getBiomeBinPath();

	// Install the package once in shared directory
	await installInto(tmpDir, tarballPath);

	sharedTestEnv = {
		tmpDir,
		tarballPath,
		biomeBin,
	};
}

// Get shared test environment (throws if not initialized)
export function getSharedTestEnv(): NonNullable<typeof sharedTestEnv> {
	if (!sharedTestEnv) {
		throw new Error(
			"Shared test environment not initialized. Call setupSharedTestEnv() first.",
		);
	}
	return sharedTestEnv;
}

// Cleanup shared test environment (called once in afterAll)
export async function cleanupSharedTestEnv(): Promise<void> {
	if (!sharedTestEnv) return;

	try {
		await fs.rm(sharedTestEnv.tmpDir, { recursive: true, force: true });
		if (sharedTestEnv.tarballPath) {
			await fs.unlink(sharedTestEnv.tarballPath).catch(() => {
				// Ignore errors - file might already be deleted
			});
		}
	} catch (error) {
		console.warn("Failed to cleanup shared test environment:", error);
	} finally {
		sharedTestEnv = null;
		clearFixtureCache();
	}
}

// Fast test runner using shared environment (eliminates npm install per test)
export async function runBiomeInSharedEnv(
	testFiles: Record<string, string>,
	args: string[] = ["lint", "--diagnostic-level=error", "."],
): Promise<{ code: number; stdout: string; stderr: string }> {
	const { tmpDir, biomeBin } = getSharedTestEnv();

	try {
		// Write test files directly to the shared directory (cleanup after test)
		await writeFileTree(tmpDir, testFiles);

		// Run Biome CLI in the shared directory (where node_modules exists)
		const result = await runBiome(tmpDir, biomeBin, args);

		return result;
	} finally {
		// Clean up test-specific files (but keep node_modules and package.json)
		try {
			for (const relativePath of Object.keys(testFiles)) {
				const filePath = path.join(tmpDir, relativePath);
				try {
					await fs.unlink(filePath);
				} catch {
					// Ignore errors - file might not exist or be a directory
				}
			}

			// Clean up any directories created by test files
			for (const relativePath of Object.keys(testFiles)) {
				const dirPath = path.dirname(path.join(tmpDir, relativePath));
				if (dirPath !== tmpDir) {
					try {
						await fs.rmdir(dirPath);
					} catch {
						// Ignore errors - directory might not be empty or not exist
					}
				}
			}
		} catch {
			// Ignore cleanup errors
		}
	}
}
