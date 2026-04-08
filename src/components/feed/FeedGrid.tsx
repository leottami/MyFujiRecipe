import { useCallback, useEffect, useRef, useState } from "react";
import type { Recipe } from "../../data/types";
import { RecipeCard } from "../recipe/RecipeCard";

interface FeedGridProps {
	recipes: Recipe[];
	batchSize?: number;
}

export function FeedGrid({ recipes, batchSize = 20 }: FeedGridProps) {
	const [visibleCount, setVisibleCount] = useState(batchSize);
	const sentinelRef = useRef<HTMLDivElement>(null);

	const loadMore = useCallback(() => {
		setVisibleCount((prev) => Math.min(prev + batchSize, recipes.length));
	}, [batchSize, recipes.length]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset pagination when recipe list changes
	useEffect(() => {
		setVisibleCount(batchSize);
	}, [recipes.length, batchSize]);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					loadMore();
				}
			},
			{ rootMargin: "200px" },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [loadMore]);

	const visible = recipes.slice(0, visibleCount);

	return (
		<>
			{/* Mobile: masonry columns */}
			<div className="columns-1 md:columns-2 gap-4 lg:hidden">
				{visible.map((recipe, i) => (
					<div
						key={recipe.id}
						className="animate-fade-in-up"
						style={{ animationDelay: `${Math.min(i * 60, 600)}ms` }}
					>
						<RecipeCard recipe={recipe} />
					</div>
				))}
			</div>

			{/* Desktop: editorial grid with asymmetric offset */}
			<div className="hidden lg:grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-x-10 gap-y-6">
				{visible.map((recipe, i) => (
					<div
						key={recipe.id}
						className={`animate-fade-in-up ${i % 2 === 1 ? "mt-16" : ""}`}
						style={{ animationDelay: `${Math.min(i * 80, 800)}ms` }}
					>
						<RecipeCard recipe={recipe} />
					</div>
				))}
			</div>

			{visibleCount < recipes.length && (
				<div ref={sentinelRef} className="h-10" />
			)}
		</>
	);
}
