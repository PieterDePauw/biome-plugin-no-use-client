import * as path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	setupSharedTestEnv,
	cleanupSharedTestEnv,
	runBiomeInSharedEnv,
	readFixture,
	createBiomeConfig,
	preloadFixtures,
} from "./helpers";

const PKG_ROOT = path.resolve(__dirname, "..");

beforeAll(async () => {
	// Setup shared test environment (single npm install)
	await setupSharedTestEnv(PKG_ROOT);

	// Preload all fixtures into cache for performance
	await preloadFixtures();
});

afterAll(async () => {
	// Cleanup shared test environment
	await cleanupSharedTestEnv();
});

describe("Core Integration Tests - Invalid Cases", () => {
	it("should error on page.tsx with 'use client' (double quotes)", async () => {
		const content = await readFixture('invalid', 'page-with-use-client-double-quotes.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/page.tsx": content,
		});

		expect(res.code).toBe(1);
		const output = res.stdout + res.stderr;
		expect(output).toContain("Remove the 'use client' directive.");
	});

	it("should error on page.tsx with 'use client' (single quotes)", async () => {
		const content = await readFixture('invalid', 'page-with-use-client-single-quotes.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/page.tsx": content,
		});

		expect(res.code).toBe(1);
		const output = res.stdout + res.stderr;
		expect(output).toContain("Remove the 'use client' directive.");
	});

	it("should error on layout.tsx with 'use client' (double quotes)", async () => {
		const content = await readFixture('invalid', 'layout-with-use-client-double-quotes.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/layout.tsx": content,
		});

		expect(res.code).toBe(1);
		const output = res.stdout + res.stderr;
		expect(output).toContain("Remove the 'use client' directive.");
	});

	it("should error on layout.tsx with 'use client' (single quotes)", async () => {
		const content = await readFixture('invalid', 'layout-with-use-client-single-quotes.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/layout.tsx": content,
		});

		expect(res.code).toBe(1);
		const output = res.stdout + res.stderr;
		expect(output).toContain("Remove the 'use client' directive.");
	});

	it("should error on nested page with 'use client'", async () => {
		const content = await readFixture('invalid', 'nested-page-with-use-client.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/users/[id]/page.tsx": content,
		});

		expect(res.code).toBe(1);
		const output = res.stdout + res.stderr;
		expect(output).toContain("Remove the 'use client' directive.");
	});
});

describe("Core Integration Tests - Valid Cases", () => {
	it("should not error on page.tsx without 'use client'", async () => {
		const content = await readFixture('valid', 'page-without-directive.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/page.tsx": content,
		});

		expect(res.code).toBe(0);
		const output = res.stdout + res.stderr;
		expect(output).not.toContain("Remove the 'use client' directive.");
	});

	it("should not error on layout.tsx without 'use client'", async () => {
		const content = await readFixture('valid', 'layout-without-directive.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/layout.tsx": content,
		});

		expect(res.code).toBe(0);
		const output = res.stdout + res.stderr;
		expect(output).not.toContain("Remove the 'use client' directive.");
	});

	it("should not error on component with 'use client' (CRITICAL TEST)", async () => {
		const content = await readFixture('valid', 'component-with-use-client.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/components/Button.tsx": content,
		});

		expect(res.code).toBe(0);
		const output = res.stdout + res.stderr;
		expect(output).not.toContain("Remove the 'use client' directive.");
	});
});

describe("Essential Edge Cases", () => {
	it("should not error on page with 'use client' in comment", async () => {
		const content = await readFixture('edge-cases', 'page-with-use-client-in-comment.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/page.tsx": content,
		});

		expect(res.code).toBe(0);
		const output = res.stdout + res.stderr;
		expect(output).not.toContain("Remove the 'use client' directive.");
	});

	it("should error on page with 'use client' not at top", async () => {
		const content = await readFixture('edge-cases', 'page-with-use-client-not-at-top.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/page.tsx": content,
		});

		expect(res.code).toBe(1);
		const output = res.stdout + res.stderr;
		expect(output).toContain("Remove the 'use client' directive.");
	});
});

describe("Multi-File Scenarios", () => {
	it("should handle multiple invalid files correctly", async () => {
		const pageContent = await readFixture('invalid', 'page-with-use-client-double-quotes.tsx');
		const layoutContent = await readFixture('invalid', 'layout-with-use-client-single-quotes.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/page.tsx": pageContent,
			"app/layout.tsx": layoutContent,
		});

		expect(res.code).toBe(1);
		const output = res.stdout + res.stderr;
		expect(output).toContain("Remove the 'use client' directive.");

		// Should report multiple errors (rough count check)
		const errorCount = (output.match(/Remove the 'use client' directive\./g) || []).length;
		expect(errorCount).toBeGreaterThan(1);
	});

	it("should handle mixed valid and invalid files in nested structure", async () => {
		const validPageContent = await readFixture('valid', 'page-without-directive.tsx');
		const invalidLayoutContent = await readFixture('invalid', 'layout-with-use-client-double-quotes.tsx');
		const componentContent = await readFixture('valid', 'component-with-use-client.tsx');

		const res = await runBiomeInSharedEnv({
			"biome.jsonc": createBiomeConfig(),
			"app/page.tsx": validPageContent, // Valid
			"app/layout.tsx": invalidLayoutContent, // Invalid
			"app/components/Button.tsx": componentContent, // Valid (component with use client)
		});

		expect(res.code).toBe(1); // Should fail due to layout.tsx
		const output = res.stdout + res.stderr;
		expect(output).toContain("Remove the 'use client' directive.");

		// Should only have one error (from layout.tsx)
		const errorCount = (output.match(/Remove the 'use client' directive\./g) || []).length;
		expect(errorCount).toBe(1);
	});
});