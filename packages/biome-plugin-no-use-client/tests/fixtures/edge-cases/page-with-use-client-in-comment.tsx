import type { ReactNode } from "react";

interface PageProps {
	children?: ReactNode;
}

// This file has 'use client' in a comment, which should NOT trigger the rule
// 'use client';

export default function Page({ children }: PageProps) {
	return (
		<div>
			<h1>Page with Use Client in Comment</h1>
			<p>This should be valid because the directive is in a comment.</p>
			{children}
		</div>
	);
}
