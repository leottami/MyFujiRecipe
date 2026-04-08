import { FeedGrid } from "../components/feed/FeedGrid";
import { FilterBar } from "../components/feed/FilterBar";
import { HeroSection } from "../components/feed/HeroSection";
import { Sidebar } from "../components/layout/Sidebar";
import { useFilters } from "../hooks/useFilters";
import { useRecipes } from "../hooks/useRecipes";

export function FeedPage() {
	const { recipes, loading, error } = useRecipes();
	const { filters, setFilter, filtered, filmSimulations } = useFilters(recipes);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant animate-pulse">
					Calibrating sensor profiles...
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<p className="font-label text-sm text-error">{error}</p>
			</div>
		);
	}

	return (
		<div className="flex">
			<Sidebar
				filmSimulations={filmSimulations}
				activeFilter={filters.filmSimulation}
				onFilterChange={(sim) => setFilter("filmSimulation", sim)}
			/>

			<div className="flex-1 min-w-0 px-4 pt-2 lg:px-10 lg:pt-6">
				<FilterBar
					filmSimulations={filmSimulations}
					activeFilter={filters.filmSimulation}
					onFilterChange={(sim) => setFilter("filmSimulation", sim)}
				/>

				<HeroSection />

				{filtered.length === 0 ? (
					<div className="flex items-center justify-center min-h-[40vh]">
						<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
							No entries match current selection
						</p>
					</div>
				) : (
					<FeedGrid recipes={filtered} />
				)}
			</div>
		</div>
	);
}
