import * as child_process from "node:child_process";
import * as util from "node:util";
import * as path from "node:path";
import { delay } from "./delay";

// Promisify execFile for easier async/await usage
const execFile = util.promisify(child_process.execFile);

// Global semaphore to limit concurrent npm installs
let npmInstallSemaphore = 0;
const MAX_CONCURRENT_INSTALLS = 1; // Serialize npm installs to prevent race conditions

// Use npm pack to create a tarball of the package in cwd
export async function npmPack(cwd: string) {
	// > Produces a tarball in cwd and returns its absolute path
	const { stdout } = await execFile("npm", ["pack", "--silent"], { cwd });
	// > Get the tarball file name from stdout
	const tarball = stdout.trim().split("\n").at(-1)?.trim();
	// > If tarball creation failed, throw an error
	if (!tarball) throw new Error("Failed to create npm pack tarball");
	// > Return the absolute path to the created tarball
	return path.join(cwd, tarball);
}

// Install the given tarball into a new npm project in tempRoot with retry logic
export async function installInto(tempRoot: string, tarballPath: string) {
	// Wait for npm install semaphore
	while (npmInstallSemaphore >= MAX_CONCURRENT_INSTALLS) {
		await delay(50);
	}
	npmInstallSemaphore++;

	try {
		// > Initialize a new npm project
		await execFile("npm", ["init", "-y"], { cwd: tempRoot });

		// > Install the tarball package with retry logic for race conditions
		let attempts = 0;
		const maxAttempts = 5; // Increased from 3

		while (attempts < maxAttempts) {
			try {
				await execFile(
					"npm",
					["i", "--silent", "--no-audit", "--no-fund", tarballPath],
					{ cwd: tempRoot },
				);
				return; // Success, exit retry loop
			} catch (error) {
				attempts++;
				if (attempts >= maxAttempts) {
					throw error; // Re-throw on final attempt
				}
				// Add exponential backoff delay with jitter
				const baseDelay = 200 * Math.pow(2, attempts);
				const jitter = Math.random() * 100;
				await delay(baseDelay + jitter);
			}
		}
	} finally {
		npmInstallSemaphore--;
	}
	// We'll rely on the package's own devDependency of @biomejs/biome by calling the CLI from this repo.
}
