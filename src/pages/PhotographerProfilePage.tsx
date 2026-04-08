import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FeedGrid } from "../components/feed/FeedGrid";
import { extractAuthor, extractAuthorId } from "../data/utils";
import { useRecipes } from "../hooks/useRecipes";

export function PhotographerProfilePage() {
	const { authorId } = useParams<{ authorId: string }>();
	const { recipes, loading, error } = useRecipes();
	const [simFilter, setSimFilter] = useState<string | null>(null);

	const authorRecipes = useMemo(
		() => recipes.filter((r) => extractAuthorId(r.url) === authorId),
		[recipes, authorId],
	);

	const authorName = authorRecipes[0]
		? extractAuthor(authorRecipes[0].url)
		: `@${(authorId ?? "").toUpperCase()}`;

	const authorDomain = authorRecipes[0]
		? new URL(authorRecipes[0].url).hostname.replace("www.", "")
		: null;

	const filmSimulations = useMemo(() => {
		const sims = new Set(
			authorRecipes.map((r) => r.filmSimulation).filter(Boolean),
		);
		return [...sims].sort();
	}, [authorRecipes]);

	const displayed = useMemo(
		() =>
			simFilter
				? authorRecipes.filter((r) => r.filmSimulation === simFilter)
				: authorRecipes,
		[authorRecipes, simFilter],
	);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant animate-pulse">
					Loading profile...
				</p>
			</div>
		);
	}

	if (error || authorRecipes.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<p className="font-label text-sm text-error">
					Photographer not found
				</p>
				<Link
					to="/"
					className="font-label text-[10px] uppercase tracking-[0.15em] text-primary hover:underline"
				>
					Return to Archive
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-[1100px] mx-auto px-4 lg:px-10">
			{/* Header */}
			<div className="py-8">
				<Link
					to="/"
					className="inline-block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors mb-6"
				>
					&larr; Back to Archive
				</Link>

				<h1 className="font-headline font-extrabold text-3xl lg:text-5xl text-on-surface leading-[1.05] tracking-tight mb-2">
					{authorName}
				</h1>

				<div className="flex items-center gap-4 mb-2">
					{authorDomain && (
						<a
							href={`https://${authorDomain}`}
							target="_blank"
							rel="noopener noreferrer"
							className="font-label text-[10px] uppercase tracking-[0.15em] text-tertiary hover:underline"
						>
							{authorDomain}
						</a>
					)}
					<span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60">
						{authorRecipes.length} recipes
					</span>
				</div>
			</div>

			{/* Film simulation sub-filter */}
			{filmSimulations.length > 1 && (
				<div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none mb-6">
					<button
						type="button"
						onClick={() => setSimFilter(null)}
						className={`shrink-0 px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.15em] transition-colors rounded-sm ${
							!simFilter
								? "bg-inverse-surface text-inverse-on-surface"
								: "text-on-surface-variant hover:text-on-surface"
						}`}
					>
						All
					</button>
					{filmSimulations.map((sim) => (
						<button
							type="button"
							key={sim}
							onClick={() =>
								setSimFilter(simFilter === sim ? null : sim)
							}
							className={`shrink-0 px-3 py-1.5 font-label text-[10px] uppercase tracking-[0.15em] transition-colors rounded-sm ${
								simFilter === sim
									? "bg-inverse-surface text-inverse-on-surface"
									: "text-on-surface-variant hover:text-on-surface"
							}`}
						>
							{sim}
						</button>
					))}
				</div>
			)}

			{/* Recipe gallery */}
			<FeedGrid recipes={displayed} />
		</div>
	);
}
