import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { MobileHeader } from "./MobileHeader";
import { NavBar } from "./NavBar";

interface AppShellProps {
	children: ReactNode;
	searchValue?: string;
	onSearch?: (value: string) => void;
}

export function AppShell({
	children,
	searchValue = "",
	onSearch,
}: AppShellProps) {
	return (
		<div className="min-h-screen bg-background">
			<NavBar searchValue={searchValue} onSearch={onSearch ?? (() => {})} />
			<MobileHeader />
			<main className="pt-14 pb-20 lg:pt-16 lg:pb-8">{children}</main>
			<BottomNav />
		</div>
	);
}
