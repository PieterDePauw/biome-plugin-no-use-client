// Import modules
import { describe, it, expect } from "vitest";
import {
	readFixture,
	shouldTriggerRule,
	extractFilenamePattern,
} from "./helpers";

/**
 * Fast unit tests for the GritQL pattern without npm pack/install overhead
 * These tests validate the pattern logic by checking file name matching
 * and content detection independently.
 */

// FILE NAME MATCHING TESTS
describe("GritQL Pattern Logic - File Name Matching", () => {
	// > Use the regex pattern extracted directly from the GritQL file
	const pageLayoutRegex = extractFilenamePattern();

	// > Define valid page file names for testing
	/* biome-ignore formatting: "keep on a single line" */
	const validPageFileNames = [
		"page.js",
		"page.jsx",
		"page.ts",
		"page.tsx",
		"app/page.tsx",
		"app/dashboard/page.ts",
		"src/app/users/[id]/page.jsx",
		"nested/deep/structure/page.js",
	];

	// > Define valid layout file names for testing
	/* biome-ignore formatting: "keep on a single line" */
	const validLayoutFileNames = [
		"layout.js",
		"layout.jsx",
		"layout.ts",
		"layout.tsx",
		"app/layout.tsx",
		"app/dashboard/layout.ts",
		"src/app/users/layout.jsx",
		"nested/deep/structure/layout.js",
	];

	// > Define invalid file names that should not match as page/layout files
	/* biome-ignore formatting: "keep on a single line" */
	const invalidFileNames = [
		"component.tsx",
		"Button.jsx",
		"utils.ts",
		"config.js",
		"page.test.ts",
		"layout.stories.tsx",
		"page-component.tsx",
		"layout-wrapper.tsx",
		"app/components/Header.tsx",
		"src/utils/helper.js",
	];

	// > CASES THAT SHOULD BE IDENTIFIED AS PAGE FILES
	describe("should match page files", () =>
		it.each(validPageFileNames)("matches %s", (filename) =>
			expect(pageLayoutRegex.test(filename)).toBe(true),
		));

	// > CASES THAT SHOULD BE IDENTIFIED AS LAYOUT FILES
	describe("should match layout files", () =>
		it.each(validLayoutFileNames)("matches %s", (filename) =>
			expect(pageLayoutRegex.test(filename)).toBe(true),
		));

	// > CASES THAT SHOULD NOT BE IDENTIFIED AS PAGE/LAYOUT FILES
	describe("should NOT match non-page/layout files", () =>
		it.each(invalidFileNames)("does not match %s", (filename) =>
			expect(pageLayoutRegex.test(filename)).toBe(false),
		));
});

// USE CLIENT DIRECTIVE DETECTION TESTS
describe("GritQL Pattern Logic - Use Client Detection", () => {
	function containsUseClientDirective(content: string): boolean {
		// Simulate the GritQL pattern matching for "use client" directives
		return content.includes('"use client"') || content.includes("'use client'");
	}

	// CASES THAT SHOULD DETECT THE DIRECTIVE
	describe("should detect use client directives", () => {
		it("detects double quote directive", async () => {
			const content = await readFixture(
				"invalid",
				"page-with-use-client-double-quotes.tsx",
			);
			expect(containsUseClientDirective(content)).toBe(true);
		});

		it("detects single quote directive", async () => {
			const content = await readFixture(
				"invalid",
				"page-with-use-client-single-quotes.tsx",
			);
			expect(containsUseClientDirective(content)).toBe(true);
		});

		it("detects directive not at top", async () => {
			const content = await readFixture(
				"edge-cases",
				"page-with-use-client-not-at-top.tsx",
			);
			expect(containsUseClientDirective(content)).toBe(true);
		});

		it("detects multiple directives", async () => {
			const content = await readFixture(
				"edge-cases",
				"page-multiple-use-client.tsx",
			);
			expect(containsUseClientDirective(content)).toBe(true);
		});

		it("detects directive with whitespace", async () => {
			const content = await readFixture(
				"edge-cases",
				"layout-with-whitespace-use-client.tsx",
			);
			expect(containsUseClientDirective(content)).toBe(true);
		});
	});

	// CASES THAT SHOULD NOT DETECT THE DIRECTIVE
	describe("should NOT detect use client in valid cases", () => {
		it("does not detect in files without directive", async () => {
			const content = await readFixture("valid", "page-without-directive.tsx");
			expect(containsUseClientDirective(content)).toBe(false);
		});

		it("does not detect in layout without directive", async () => {
			const content = await readFixture(
				"valid",
				"layout-without-directive.tsx",
			);
			expect(containsUseClientDirective(content)).toBe(false);
		});

		it("detects but allows in non-page components", async () => {
			const content = await readFixture(
				"valid",
				"component-with-use-client.tsx",
			);
			// Component WITH use client is valid because it's not a page/layout
			expect(containsUseClientDirective(content)).toBe(true);
		});

		it("does not detect in commented directives", async () => {
			const content = await readFixture(
				"edge-cases",
				"page-with-use-client-in-comment.tsx",
			);
			// Simple check - in reality, GritQL would handle comment parsing
			const hasUncommentedDirective = content.split("\n").some((line) => {
				const trimmed = line.trim();
				return (
					(trimmed.includes('"use client"') ||
						trimmed.includes("'use client'")) &&
					!trimmed.startsWith("//")
				);
			});
			expect(hasUncommentedDirective).toBe(false);
		});
	});
});

// COMBINED PATTERN LOGIC TESTS
describe("Combined Pattern Logic", () => {
	//  > CASES THAT SHOULD TRIGGER THE RULE
	describe("should trigger rule for invalid cases", () => {
		// >> Test if a page file with 'use client' triggers the rule
		it("triggers for page with 'use client'", async () => {
			const content = await readFixture(
				"invalid",
				"page-with-use-client-single-quotes.tsx",
			);
			expect(shouldTriggerRule("app/page.tsx", content)).toBe(true);
		});

		// >> Test if a page file with "use client" triggers the rule
		it('triggers for page with "use client"', async () => {
			const content = await readFixture(
				"invalid",
				"page-with-use-client-double-quotes.tsx",
			);
			expect(shouldTriggerRule("app/page.tsx", content)).toBe(true);
		});

		// >> Test if a layout file with 'use client' triggers the rule
		it("triggers for layout with 'use client'", async () => {
			const content = await readFixture(
				"invalid",
				"layout-with-use-client-single-quotes.tsx",
			);
			expect(shouldTriggerRule("app/layout.tsx", content)).toBe(true);
		});

		// >> Test if a layout file with "use client" triggers the rule
		it('triggers for layout with "use client"', async () => {
			const content = await readFixture(
				"invalid",
				"layout-with-use-client-double-quotes.tsx",
			);
			expect(shouldTriggerRule("app/layout.tsx", content)).toBe(true);
		});

		// >> Test if a deeply nested page file with 'use client' triggers the rule
		it("triggers for nested page with use client", async () => {
			const content = await readFixture(
				"invalid",
				"nested-page-with-use-client.tsx",
			);
			expect(shouldTriggerRule("app/users/[id]/page.tsx", content)).toBe(true);
		});
	});

	// > CASES THAT SHOULD NOT TRIGGER THE RULE
	describe("should NOT trigger rule for valid cases", async () => {
		// >> Test if a page file without 'use client' does not trigger the rule
		it("does not trigger for page without use client", async () => {
			const content = await readFixture("valid", "page-without-directive.tsx");
			expect(shouldTriggerRule("app/page.tsx", content)).toBe(false);
		});

		// >> Test if a layout file without 'use client' does not trigger the rule
		it("does not trigger for layout without use client", async () => {
			const content = await readFixture(
				"valid",
				"layout-without-directive.tsx",
			);
			expect(shouldTriggerRule("app/layout.tsx", content)).toBe(false);
		});

		// >> Test if any other file with a 'use client' directive does not trigger the rule
		it("does not trigger for component with use client", async () => {
			const content = await readFixture(
				"valid",
				"component-with-use-client.tsx",
			);
			expect(shouldTriggerRule("app/components/Button.tsx", content)).toBe(
				false,
			);
		});
	});
});

// PERFORMANCE TESTS
describe("Performance Tests - Pattern Matching", () => {
	// > Use the regex pattern extracted directly from the GritQL file
	const regex = extractFilenamePattern();

	// > Test if the pattern matching logic performs efficiently on large files
	it("should handle large content efficiently", () => {
		const largeContent =
			"const data = " +
			JSON.stringify({
				items: Array.from({ length: 1000 }, (_, i) => ({
					id: i,
					name: `Item ${i}`,
				})),
			}) +
			";\n\nexport default function Page() { return <div>Large page</div>; }";

		// > Get the start time
		const start = performance.now();
		// > Perform the pattern matching logic
		const result =
			regex.test("app/page.tsx") &&
			(largeContent.includes('"use client"') ||
				largeContent.includes("'use client'"));
		// > Get the end time
		const end = performance.now();
		// > Get the duration of the operation in milliseconds
		const durationInMs = end - start;
		// > Expect no match (since there's no use client directive)
		expect(result).toBe(false);
		// > Expect the operation to be fast (less than 10ms)
		expect(durationInMs).toBeLessThan(10);
	});

	// > Test if the pattern matching logic performs efficiently on many files
	it("should handle many file checks efficiently", () => {
		// > Generate 1000 filenames by selecting names and extensions
		const filenames = Array.from({ length: 1000 }, (_, i) => {
			const types = ["page", "layout", "component", "utils"];
			const exts = ["js", "jsx", "ts", "tsx"];
			return `app/item-${i}/${types[i % 4]}.${exts[i % 4]}`;
		});
		// > Get the start time
		const start = performance.now();
		// > Filter filenames that match the regex
		const matches = filenames.filter((filename) => regex.test(filename));
		// > Get the end time
		const end = performance.now();
		// > Get the number of matched files
		const matchedCount = matches.length;
		// > Get the duration of the operation in milliseconds
		const durationInMs = end - start;
		// > Expect half the files to match (500 out of 1000)
		expect(matchedCount).toBe(500); // Half should match (page and layout)
		// > Expect the operation to be fast (less than 50ms)
		expect(durationInMs).toBeLessThan(50); // Should be very fast
	});
});
