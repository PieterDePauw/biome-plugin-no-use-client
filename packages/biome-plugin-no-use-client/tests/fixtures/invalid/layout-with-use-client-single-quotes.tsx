"use client";

import { type ReactNode, useState } from "react";

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const [theme, setTheme] = useState("light");

	return (
		<html lang="en">
			<body className={theme}>
				<header>
					<h1>Client Layout (Single Quotes)</h1>
					<button
						type="button"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					>
						Toggle Theme
					</button>
				</header>
				<main>{children}</main>
			</body>
		</html>
	);
}
