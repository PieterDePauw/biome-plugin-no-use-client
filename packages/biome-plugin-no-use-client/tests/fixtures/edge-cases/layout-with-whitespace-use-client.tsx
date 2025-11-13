"use client";

import { type ReactNode, useState } from "react";

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const [sidebar, setSidebar] = useState(true);

	return (
		<html lang="en">
			<body>
				<header>
					<h1>Layout with Whitespace Use Client</h1>
					<button type="button" onClick={() => setSidebar(!sidebar)}>
						Toggle Sidebar
					</button>
				</header>
				<div style={{ display: "flex" }}>
					{sidebar && <aside>Sidebar</aside>}
					<main>{children}</main>
				</div>
			</body>
		</html>
	);
}
