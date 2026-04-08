interface FilterBarProps {
	filmSimulations: string[];
	activeFilter: string | null;
	onFilterChange: (filmSim: string | null) => void;
}

const MOOD_CATEGORIES = [
	"All",
	"Daylight",
	"Street",
	"Portrait",
	"B&W",
	"Landscape",
	"Vintage",
] as const;

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
	return (
		<div className="lg:hidden flex gap-1 overflow-x-auto pb-2 scrollbar-none mb-6">
			{MOOD_CATEGORIES.map((mood) => {
				const isActive =
					mood === "All" ? activeFilter === null : activeFilter === mood;

				return (
					<button
						type="button"
						key={mood}
						onClick={() => onFilterChange(mood === "All" ? null : mood)}
						className={`shrink-0 px-4 py-1.5 font-label text-[10px] uppercase tracking-[0.15em] transition-colors rounded-sm ${
							isActive
								? "bg-inverse-surface text-inverse-on-surface"
								: "text-on-surface-variant hover:text-on-surface"
						}`}
					>
						{mood}
					</button>
				);
			})}
		</div>
	);
}
