import { useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

export function MobileHeader() {
	const location = useLocation();
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);
	const searchValue = searchParams.get("q") ?? "";

	// Hide on editor routes — WizardLayout renders its own header
	const isEditor = /^\/recipe\/(new|[^/]+\/edit)$/.test(location.pathname);
	if (isEditor) return null;

	function openSearch() {
		setSearchOpen(true);
		setTimeout(() => inputRef.current?.focus(), 100);
	}

	function closeSearch() {
		setSearchOpen(false);
	}

	function handleSearch(value: string) {
		if (location.pathname !== "/") {
			navigate(value ? `/?q=${encodeURIComponent(value)}` : "/");
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
		<header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface-container-low/80 backdrop-blur-[20px] px-4 h-14 flex items-center">
			{searchOpen ? (
				/* Search mode */
				<div className="flex items-center gap-3 w-full animate-fade-in-up">
					<button
						type="button"
						onClick={closeSearch}
						className="p-2 -ml-2 text-on-surface-variant shrink-0"
						aria-label="Close search"
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
						>
							<line x1="19" y1="12" x2="5" y2="12" />
							<polyline points="12 19 5 12 12 5" />
						</svg>
					</button>
					<input
						ref={inputRef}
						type="search"
						value={searchValue}
						onChange={(e) => handleSearch(e.target.value)}
						onKeyDown={(e) => e.key === "Escape" && closeSearch()}
						placeholder="Search recipes..."
						className="flex-1 bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none font-body text-sm text-on-surface py-2 transition-colors"
					/>
				</div>
			) : (
				/* Normal mode */
				<>
					<Link
						to="/"
						className="font-headline font-bold text-sm uppercase tracking-[0.2em] text-on-surface"
					>
						The Archive
					</Link>

					<div className="ml-auto">
						<button
							type="button"
							onClick={openSearch}
							className="p-2 -mr-2 text-on-surface-variant"
							aria-label="Search"
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<circle cx="11" cy="11" r="8" />
								<line
									x1="21"
									y1="21"
									x2="16.65"
									y2="16.65"
								/>
							</svg>
						</button>
					</div>
				</>
			)}
		</header>
	);
}
