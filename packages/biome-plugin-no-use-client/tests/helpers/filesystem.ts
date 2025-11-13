// Import modules
import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as os from "node:os"

// Create a temporary directory
export async function makeTempDir(prefix = "biome-plugin-test") {
	// > Create a unique temporary directory path
	const dirPath = path.join(os.tmpdir(), `${prefix}-${Date.now()}`)
	// > Create a new temporary directory and return its path
	return await fs.mkdtemp(dirPath)
}

// Write a set of files to the specified root directory
export async function writeFileTree(root: string, files: Record<string, string>) {
	// > Write each file to the specified path within the root directory
	await Promise.all(Object.entries(files).map(async ([relativePath, content]) => {
		// >> Construct the full file path
		const filePath = path.join(root, relativePath)
		// >> Ensure the directory exists
		await fs.mkdir(path.dirname(filePath), { recursive: true })
		// >> Write the file content
		await fs.writeFile(filePath, content)
	}))
}
