import * as fs from "node:fs"
import * as path from "node:path"

// Path to the GritQL source file
const GRIT_FILE_PATH = path.resolve("./src/no-use-client-on-page.grit")

// Cache for the extracted filename pattern
let cachedFilenamePattern: RegExp | null = null

/**
 * Extracts the filename regex pattern from the GritQL file.
 * This ensures we use the exact same pattern that the Biome plugin uses.
 *
 * Pattern source: src/no-use-client-on-page.grit line 7
 * Format: $name <: r"pattern"
 */
export function extractFilenamePattern(): RegExp {
	try {
		// Return cached pattern if already extracted
		if (cachedFilenamePattern) return cachedFilenamePattern
		// Read the GritQL file
		const gritContent = fs.readFileSync(GRIT_FILE_PATH, "utf-8")
		// Extract the regex pattern from the line containing $name <: r"pattern"
		// This matches: $name <: r"(?:.*/)?(?:page|layout)\.(?:js|jsx|ts|tsx)$"
		const filenamePatternMatch = gritContent.match(/\$name\s*<:\s*r"([^"]+)"/)
		if (!filenamePatternMatch) throw new Error(`Failed to extract filename pattern from GritQL file: ${GRIT_FILE_PATH}\n` + `Expected to find pattern like: $name <: r"pattern"`)
		// Create RegExp from the extracted pattern
		const patternString = filenamePatternMatch[1]
		cachedFilenamePattern = new RegExp(patternString)
		return cachedFilenamePattern
	} catch (error) {
		if (error instanceof Error) throw new Error(`Error reading GritQL pattern from ${GRIT_FILE_PATH}: ${error.message}`)
		throw error
	}
}

/**
 * Test helper function to determine if a file should trigger the rule.
 * Uses patterns extracted directly from the GritQL source file.
 */
export function shouldTriggerRule(filename: string, content: string): boolean {
	// Use the pattern extracted from the GritQL file
	const filenamePattern = extractFilenamePattern()
	const isPageOrLayout = filenamePattern.test(filename)

	// Check if the content contains any of the use client patterns
	const hasUseClient = ['"use client"', "'use client'"].some(pattern => content.includes(pattern))

	// Return true if both conditions are met
	return isPageOrLayout && hasUseClient
}
