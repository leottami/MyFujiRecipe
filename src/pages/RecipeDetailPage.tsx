import { Link, useParams } from "react-router-dom";
import { HeroImage } from "../components/recipe/HeroImage";
import { RecipeMetadata } from "../components/recipe/RecipeMetadata";
import { MetadataChip } from "../components/ui/MetadataChip";
import { useRecipe } from "../hooks/useRecipes";

export function RecipeDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { recipe, loading, error } = useRecipe(id);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<p className="font-label text-sm uppercase tracking-widest text-on-surface-variant animate-pulse">
					Loading...
				</p>
			</div>
		);
	}

	if (error || !recipe) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<p className="font-label text-sm text-error">
					{error ?? "Recipe not found"}
				</p>
				<Link
					to="/"
					className="font-label text-xs uppercase tracking-widest text-primary hover:underline"
				>
					Back to Gallery
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-[1200px] mx-auto">
			{/* Hero Section */}
			<div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-8 lg:px-10 lg:pt-8">
				<div>
					<HeroImage
						src={recipe.thumbnailUrl}
						alt={`Photo taken with ${recipe.name} recipe`}
						className="w-full lg:rounded-md"
						aspectRatio="3/2"
					/>
				</div>

				<div className="px-4 pt-6 lg:px-0 lg:pt-0">
					{/* Back link */}
					<Link
						to="/"
						className="inline-block font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-4"
					>
						&larr; Gallery
					</Link>

					{/* Title */}
					<h1 className="font-headline font-extrabold text-2xl lg:text-4xl text-on-surface leading-tight mb-3">
						{recipe.name}
					</h1>

					{/* Quick metadata */}
					<div className="flex flex-wrap gap-2 mb-4">
						<MetadataChip label={recipe.filmSimulation} />
						<MetadataChip label={recipe.sensor} />
						<MetadataChip label={recipe.dynamicRange} />
					</div>

					{/* Source attribution */}
					<a
						href={recipe.url}
						target="_blank"
						rel="noopener noreferrer"
						className="font-label text-xs uppercase tracking-widest text-primary hover:underline"
					>
						View Original Source
					</a>
				</div>
			</div>

			{/* Settings */}
			<div className="px-4 pt-8 pb-8 lg:px-10 lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-8">
				<div className="lg:col-start-2">
					<RecipeMetadata recipe={recipe} />
				</div>
			</div>
		</div>
	);
}
