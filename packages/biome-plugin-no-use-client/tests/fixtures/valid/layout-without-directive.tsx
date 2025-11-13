import type { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	return (
		<html lang="en">
			<body>
				<header>
					<h1>App Layout</h1>
				</header>
				<main>{children}</main>
				<footer>
					<p>Footer content</p>
				</footer>
			</body>
		</html>
	);
}
