import { Link, useLocation } from "react-router-dom";

export function BottomNav() {
	const location = useLocation();
	const isHome = location.pathname === "/";

	const items = [
		{
			to: "/",
			label: "Feed",
			active: isHome,
			icon: (
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
			),
		},
		{
			to: "/recipe/new",
			label: "Create",
			active: location.pathname === "/recipe/new",
			icon: (
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden="true"
				>
					<line x1="12" y1="5" x2="12" y2="19" />
					<line x1="5" y1="12" x2="19" y2="12" />
				</svg>
			),
		},
		{
			to: "/profile",
			label: "Profile",
			active: location.pathname === "/profile",
			icon: (
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					aria-hidden="true"
				>
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
					<circle cx="12" cy="7" r="4" />
				</svg>
			),
		},
	];

	return (
		<nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-low/80 backdrop-blur-[20px] flex items-center justify-around px-2 py-2">
			{items.map((item) => (
				<Link
					key={item.label}
					to={item.to}
					className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
						item.active ? "text-on-surface" : "text-on-surface-variant/60"
					}`}
				>
					{item.icon}
					<span className="font-label text-[9px] uppercase tracking-[0.15em]">
						{item.label}
					</span>
				</Link>
			))}
		</nav>
	);
}
