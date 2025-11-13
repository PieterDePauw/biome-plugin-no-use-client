import { type ReactNode, useState } from "react";

("use client");

interface PageProps {
	children?: ReactNode;
}

export default function Page({ children }: PageProps) {
	const [count, setCount] = useState(0);

	return (
		<div>
			<h1>Page with Use Client Not at Top</h1>
			<p>
				This should trigger an error because 'use client' is not at the very
				top.
			</p>
			<button type="button" onClick={() => setCount(count + 1)}>
				Count: {count}
			</button>
			{children}
		</div>
	);
}
