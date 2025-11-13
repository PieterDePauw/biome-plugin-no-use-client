"use client";

import { type ReactNode, useState } from "react";

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<html lang="en">
			<body>
				<header>
					<h1>Client Layout</h1>
					<button type="button" onClick={() => setIsCollapsed(!isCollapsed)}>
						Toggle
					</button>
				</header>
				<main className={isCollapsed ? "collapsed" : "expanded"}>
					{children}
				</main>
			</body>
		</html>
	);
}
