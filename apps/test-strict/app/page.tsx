"use client";

// This page intentionally contains "use client" to trigger the plugin error
export default function HomePage() {
	return (
		<div>
			<h2>Strict Test Page - Should Also Fail</h2>
			<p>This page contains a "use client" directive and should be flagged.</p>
		</div>
	);
}
