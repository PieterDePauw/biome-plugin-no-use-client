"use client";

import { type ReactNode, useState } from "react";

interface NestedPageProps {
	params: { slug: string };
	children?: ReactNode;
}

export default function NestedPage({ params, children }: NestedPageProps) {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<div>
			<h1>Nested Client Page: {params.slug}</h1>
			<p>
				This nested page should trigger an error for using client directive.
			</p>
			<button type="button" onClick={() => setIsVisible(!isVisible)}>
				Toggle Visibility
			</button>
			{isVisible && <div>{children}</div>}
		</div>
	);
}
