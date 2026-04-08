import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { SearchInput } from "../ui/SearchInput";

export function NavBar() {
	const location = useLocation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const isHome = location.pathname === "/";
	const searchValue = searchParams.get("q") ?? "";

	function handleSearch(value: string) {
		// Navigate to feed with search param
		if (location.pathname !== "/") {
			navigate(`/?q=${encodeURIComponent(value)}`);
		} else {
			const next = new URLSearchParams(searchParams);
			if (value) {
				next.set("q", value);
			} else {
				next.delete("q");
			}
			navigate(`/?${next.toString()}`, { replace: true });
		}
	}

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
						onSearch={handleSearch}
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
