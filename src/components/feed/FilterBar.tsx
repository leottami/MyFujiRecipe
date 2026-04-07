interface FilterBarProps {
	filmSimulations: string[];
	activeFilter: string | null;
	onFilterChange: (filmSim: string | null) => void;
}

export function FilterBar({
	filmSimulations,
	activeFilter,
	onFilterChange,
}: FilterBarProps) {
	return (
		<div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
			<button
				type="button"
				onClick={() => onFilterChange(null)}
				className={`shrink-0 px-4 py-1.5 rounded-md font-label text-xs uppercase tracking-widest transition-colors ${
					activeFilter === null
						? "bg-primary text-on-primary"
						: "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
				}`}
			>
				All
			</button>
			{filmSimulations.map((sim) => (
				<button
					type="button"
					key={sim}
					onClick={() => onFilterChange(sim)}
					className={`shrink-0 px-4 py-1.5 rounded-md font-label text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
						activeFilter === sim
							? "bg-primary text-on-primary"
							: "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
					}`}
				>
					{sim}
				</button>
			))}
		</div>
	);
}
