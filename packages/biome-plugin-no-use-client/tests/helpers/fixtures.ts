import * as fs from "node:fs/promises"
import * as path from "node:path"

// Fixture content cache for performance
let fixtureCache: Map<string, string> = new Map();

// Helper to read fixture content with caching
export async function readFixture(category: string, filename: string): Promise<string> {
	// > Create a unique cache key
	const cacheKey = `${category}/${filename}`;
	// > Return cached content if available
	if (fixtureCache.has(cacheKey)) return fixtureCache.get(cacheKey)!;
	// > Read from file system and cache
	const content = await fs.readFile(path.join(path.resolve(__dirname, "../fixtures"), category, filename), 'utf-8');
	// > Cache the content
	fixtureCache.set(cacheKey, content);
	// > Return the content
	return content;
}

// Preload all fixtures into cache (optional optimization)
export async function preloadFixtures(): Promise<void> {
	const fixturesRoot = path.resolve(__dirname, "../fixtures");
	const categories = await fs.readdir(fixturesRoot);

	for (const category of categories) {
		const categoryPath = path.join(fixturesRoot, category);
		const stat = await fs.stat(categoryPath);

		if (stat.isDirectory()) {
			const fixtures = await fs.readdir(categoryPath);

			// Preload all fixtures in this category
			await Promise.all(
				fixtures.map(async (filename) => {
					await readFixture(category, filename);
				})
			);
		}
	}
}

// Clear fixture cache (used during cleanup)
export function clearFixtureCache(): void {
	fixtureCache.clear();
} 
