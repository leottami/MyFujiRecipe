import type { ReactNode } from "react";
import { NavBar } from "./NavBar";

interface AppShellProps {
	children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
	return (
		<div className="min-h-screen bg-background">
			<NavBar />
			<main className="pb-24 lg:pb-8 lg:pt-20">{children}</main>
		</div>
	);
}
