import { Link, useLocation } from "react-router-dom";
import { SearchInput } from "../ui/SearchInput";

interface NavBarProps {
	searchValue: string;
	onSearch: (value: string) => void;
}

export function NavBar({ searchValue, onSearch }: NavBarProps) {
	const location = useLocation();
	const isHome = location.pathname === "/";

	return (
		<nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-surface-container-low/80 backdrop-blur-[20px] items-center justify-between px-6 h-16">
			<Link
				to="/"
				className="font-headline font-bold text-sm uppercase tracking-[0.2em] text-on-surface shrink-0"
			>
				Tactile Archive
			</Link>

			<div className="flex items-center gap-1 mx-8">
				<Link
					to="/"
					className={`font-label text-[11px] uppercase tracking-[0.15em] px-4 py-2 transition-colors ${
						isHome
							? "text-tertiary font-semibold"
							: "text-on-surface-variant hover:text-on-surface"
					}`}
				>
					Browse
				</Link>
			</div>

			<div className="flex items-center gap-4 shrink-0">
				<div className="w-48">
					<SearchInput
						placeholder="Search archive"
						value={searchValue}
						onSearch={onSearch}
					/>
				</div>
				<Link
					to="/profile"
					className={`font-label text-[10px] uppercase tracking-[0.15em] px-3 py-2 transition-colors ${
						location.pathname === "/profile"
							? "text-tertiary font-semibold"
							: "text-on-surface-variant hover:text-on-surface"
					}`}
				>
					Profile
				</Link>
				<Link
					to="/recipe/new"
					className="bg-inverse-surface text-inverse-on-surface font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-sm hover:opacity-90 transition-opacity"
				>
					New Recipe
				</Link>
			</div>
		</nav>
	);
}
