interface SidebarProps {
	filmSimulations: string[];
	activeFilter: string | null;
	onFilterChange: (sim: string | null) => void;
}

export function Sidebar({
	filmSimulations,
	activeFilter,
	onFilterChange,
}: SidebarProps) {
	return (
		<aside className="hidden lg:flex flex-col w-[220px] shrink-0 h-[calc(100vh-64px)] sticky top-16 pt-8 pb-6 px-6 overflow-y-auto">
			<div className="mb-8">
				<h2 className="font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">
					Film Stocks
				</h2>
				<p className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant/50">
					Technical Selector
				</p>
			</div>

			<nav className="flex flex-col gap-0.5 mb-auto">
				<button
					type="button"
					onClick={() => onFilterChange(null)}
					className={`flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-sm ${
						activeFilter === null
							? "bg-surface-container-high text-on-surface font-medium border-l-2 border-tertiary"
							: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
					}`}
				>
					<span className="font-label text-xs uppercase tracking-widest">
						All Stocks
					</span>
				</button>
				{filmSimulations.map((sim) => (
					<button
						type="button"
						key={sim}
						onClick={() => onFilterChange(sim)}
						className={`flex items-center gap-3 px-3 py-2.5 text-left transition-colors rounded-sm ${
							activeFilter === sim
								? "bg-surface-container-high text-on-surface font-medium border-l-2 border-tertiary"
								: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
						}`}
					>
						<span className="font-label text-xs uppercase tracking-widest truncate">
							{sim}
						</span>
					</button>
				))}
			</nav>

			<div className="flex flex-col gap-3 pt-6 mt-6 border-t border-outline-variant/15">
				<button
					type="button"
					className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-on-surface transition-colors text-left px-3 py-1"
				>
					Calibrate Sensor
				</button>
				<button
					type="button"
					className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-on-surface transition-colors text-left px-3 py-1"
				>
					Support
				</button>
				<button
					type="button"
					className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-on-surface transition-colors text-left px-3 py-1"
				>
					Archive
				</button>
			</div>
		</aside>
	);
}
