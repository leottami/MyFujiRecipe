import { FeedGrid } from "../components/feed/FeedGrid";
import { FilterBar } from "../components/feed/FilterBar";
import { SearchInput } from "../components/ui/SearchInput";
import { useFilters } from "../hooks/useFilters";
import { useRecipes } from "../hooks/useRecipes";

export function FeedPage() {
	const { recipes, loading, error } = useRecipes();
	const { filters, setFilter, filtered, filmSimulations } = useFilters(recipes);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<p className="font-label text-sm uppercase tracking-widest text-on-surface-variant animate-pulse">
					Loading recipes...
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
		<div className="px-4 pt-6 lg:px-10 lg:pt-8 max-w-[1600px] mx-auto">
			<header className="mb-8 lg:mb-12">
				<h1 className="font-headline font-extrabold text-3xl lg:text-5xl text-on-surface leading-tight mb-2">
					Recipe Gallery
				</h1>
				<p className="font-body text-on-surface-variant text-sm lg:text-base max-w-lg">
					Curated Fujifilm film simulation recipes. Discover your next signature
					look.
				</p>
			</header>

			<div className="space-y-4 mb-8">
				<SearchInput
					placeholder="Search recipes"
					value={filters.search}
					onSearch={(v) => setFilter("search", v || null)}
				/>
				<FilterBar
					filmSimulations={filmSimulations}
					activeFilter={filters.filmSimulation}
					onFilterChange={(sim) => setFilter("filmSimulation", sim)}
				/>
			</div>

			{filtered.length === 0 ? (
				<div className="flex items-center justify-center min-h-[40vh]">
					<p className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
						No recipes match your filters
					</p>
				</div>
			) : (
				<FeedGrid recipes={filtered} />
			)}
		</div>
	);
}
