import { useState } from "react";
import { FeedGrid } from "../components/feed/FeedGrid";
import { FilterBar } from "../components/feed/FilterBar";
import { HeroSection } from "../components/feed/HeroSection";
import { Sidebar } from "../components/layout/Sidebar";
import { SkeletonFeedGrid } from "../components/ui/Skeleton";
import { useFavorites } from "../hooks/useFavorites";
import { useFilters } from "../hooks/useFilters";
import { useRecipes } from "../hooks/useRecipes";

function ActiveFilterChips({
	filters,
	onSetFilter,
	onToggleTag,
	onClearAll,
}: {
	filters: ReturnType<typeof useFilters>["filters"];
	onSetFilter: ReturnType<typeof useFilters>["setFilter"];
	onToggleTag: ReturnType<typeof useFilters>["toggleTag"];
	onClearAll: ReturnType<typeof useFilters>["clearAll"];
}) {
	const chips: { label: string; onRemove: () => void }[] = [];

	for (const tag of filters.tags) {
		chips.push({ label: tag, onRemove: () => onToggleTag(tag) });
	}
	if (filters.filmSimulation) {
		chips.push({
			label: filters.filmSimulation,
			onRemove: () => onSetFilter("filmSimulation", null),
		});
	}
	if (filters.grain) {
		chips.push({
			label: `Grain: ${filters.grain}`,
			onRemove: () => onSetFilter("grain", null),
		});
	}
	if (filters.dynamicRange) {
		chips.push({
			label: filters.dynamicRange,
			onRemove: () => onSetFilter("dynamicRange", null),
		});
	}
	if (filters.colorChrome) {
		chips.push({
			label: `CC: ${filters.colorChrome}`,
			onRemove: () => onSetFilter("colorChrome", null),
		});
	}

	if (chips.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-2 mb-6">
			{chips.map((chip) => (
				<span
					key={chip.label}
					className="inline-flex items-center gap-1.5 bg-surface-container text-on-surface-variant font-label text-[10px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-sm"
				>
					{chip.label}
					<button
						type="button"
						onClick={chip.onRemove}
						className="text-on-surface-variant/60 hover:text-on-surface transition-colors"
					>
						&times;
					</button>
				</span>
			))}
			<button
				type="button"
				onClick={onClearAll}
				className="font-label text-[10px] uppercase tracking-[0.15em] text-tertiary hover:text-on-surface transition-colors ml-1"
			>
				Clear All
			</button>
		</div>
	);
}

export function FeedPage() {
	const { recipes, loading, error } = useRecipes();
	const {
		filters,
		setFilter,
		toggleTag,
		clearAll,
		activeFilterCount,
		filtered,
		filmSimulations,
		counts,
	} = useFilters(recipes);
	const { favorites, count: favCount } = useFavorites();
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

	const displayRecipes = showFavoritesOnly
		? filtered.filter((r) => favorites.includes(r.id))
		: filtered;

	if (loading) {
		return (
			<div className="px-4 pt-2 lg:px-10 lg:pt-6 lg:ml-60">
				<SkeletonFeedGrid />
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
				filters={filters}
				counts={counts}
				filmSimulations={filmSimulations}
				totalCount={filtered.length}
				onSetFilter={setFilter}
				onToggleTag={toggleTag}
				onClearAll={clearAll}
				activeFilterCount={activeFilterCount}
			/>

			<div className="flex-1 min-w-0 px-4 pt-2 lg:px-10 lg:pt-6">
				<FilterBar
					filters={filters}
					counts={counts}
					filmSimulations={filmSimulations}
					onSetFilter={setFilter}
					onToggleTag={toggleTag}
					onClearAll={clearAll}
					activeFilterCount={activeFilterCount}
				/>

				<HeroSection />

				{/* Favorites toggle + active filter chips */}
				<div className="flex flex-wrap items-center gap-2 mb-4">
					<button
						type="button"
						onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
						className={`shrink-0 px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.15em] transition-colors rounded-sm ${
							showFavoritesOnly
								? "bg-tertiary/10 text-tertiary"
								: "text-on-surface-variant hover:text-on-surface"
						}`}
					>
						{"\u2665"} Favorites{favCount > 0 ? ` (${favCount})` : ""}
					</button>
				</div>

				<ActiveFilterChips
					filters={filters}
					onSetFilter={setFilter}
					onToggleTag={toggleTag}
					onClearAll={clearAll}
				/>

				{displayRecipes.length === 0 ? (
					<div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
						<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
							{showFavoritesOnly
								? "No favorites yet — tap the heart on any recipe"
								: "No recipes match current filters"}
						</p>
						{(activeFilterCount > 0 || showFavoritesOnly) && (
							<button
								type="button"
								onClick={() => {
									clearAll();
									setShowFavoritesOnly(false);
								}}
								className="font-label text-[10px] uppercase tracking-[0.15em] text-tertiary hover:text-on-surface transition-colors"
							>
								Clear All Filters
							</button>
						)}
					</div>
				) : (
					<FeedGrid recipes={displayRecipes} />
				)}
			</div>
		</div>
	);
}
