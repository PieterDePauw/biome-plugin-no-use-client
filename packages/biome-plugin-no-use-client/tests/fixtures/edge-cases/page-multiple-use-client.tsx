"use client";
"use client";

import { ReactNode, useState } from "react";

interface PageProps {
	children?: ReactNode;
}

export default function Page({ children }: PageProps) {
	const [status, setStatus] = useState("ready");

	return (
		<div>
			<h1>Page with Multiple Use Client Directives</h1>
			<p>This should trigger an error for having multiple client directives.</p>
			<button
				type="button"
				onClick={() => setStatus(status === "ready" ? "busy" : "ready")}
			>
				Status: {status}
			</button>
			{children}
		</div>
	);
}
