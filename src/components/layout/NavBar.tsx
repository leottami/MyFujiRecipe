import { Link, useLocation } from "react-router-dom";

export function NavBar() {
	const location = useLocation();
	const isHome = location.pathname === "/";

	return (
		<>
			{/* Desktop top nav */}
			<nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-surface-container-low/80 backdrop-blur-[20px] items-center justify-between px-10 py-4">
				<Link to="/" className="font-headline font-bold text-lg text-primary">
					Fuji Recipe Hub
				</Link>
				<div className="flex items-center gap-6">
					<Link
						to="/"
						className={`font-label text-sm uppercase tracking-widest transition-colors ${isHome ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
					>
						Gallery
					</Link>
				</div>
			</nav>

			{/* Mobile bottom nav */}
			<nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-low/80 backdrop-blur-[20px] flex items-center justify-around px-6 py-3 safe-area-inset-bottom">
				<Link
					to="/"
					className={`flex flex-col items-center gap-1 ${isHome ? "text-primary" : "text-on-surface-variant"}`}
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
						<rect x="3" y="3" width="7" height="7" />
						<rect x="14" y="3" width="7" height="7" />
						<rect x="3" y="14" width="7" height="7" />
						<rect x="14" y="14" width="7" height="7" />
					</svg>
					<span className="font-label text-[10px] uppercase tracking-widest">
						Gallery
					</span>
				</Link>
			</nav>
		</>
	);
}
