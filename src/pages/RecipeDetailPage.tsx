import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HeroImage } from "../components/recipe/HeroImage";
import { PhotoGallery } from "../components/recipe/PhotoGallery";
import { RecipeMetadata } from "../components/recipe/RecipeMetadata";
import { TagEditor } from "../components/recipe/TagEditor";
import type { RecipePhoto } from "../data/types";
import { extractAuthor, getHeroPhoto } from "../data/utils";
import { useRecipeMutations } from "../hooks/useRecipeMutations";
import { useRecipe } from "../hooks/useRecipes";

export function RecipeDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { recipe, loading, error } = useRecipe(id);
	const { updateRecipe } = useRecipeMutations();
	const [photos, setPhotos] = useState<RecipePhoto[]>([]);
	const [tags, setTags] = useState<string[]>([]);

	useEffect(() => {
		if (recipe) {
			setPhotos(recipe.photos);
			setTags(recipe.tags ?? []);
		}
	}, [recipe]);

	const handleTagsChange = useCallback(
		async (newTags: string[]) => {
			setTags(newTags);
			if (recipe) await updateRecipe({ id: recipe.id, tags: newTags });
		},
		[recipe, updateRecipe],
	);

	const handleDeletePhoto = useCallback(
		async (photoId: string) => {
			const updated = photos.filter((p) => p.id !== photoId);
			setPhotos(updated);
			if (recipe) await updateRecipe({ id: recipe.id, photos: updated });
		},
		[photos, recipe, updateRecipe],
	);

	const handleSetHero = useCallback(
		async (photoId: string) => {
			const updated = photos.map((p) => ({
				...p,
				role: (p.id === photoId ? "hero" : "sample") as "hero" | "sample",
			}));
			setPhotos(updated);
			if (recipe) await updateRecipe({ id: recipe.id, photos: updated });
		},
		[photos, recipe, updateRecipe],
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

	if (error || !recipe) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
				<p className="font-label text-sm text-error">
					{error ?? "Recipe not found"}
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

	const author = extractAuthor(recipe.url);
	const heroUrl = getHeroPhoto({ ...recipe, photos });
	const samplePhotos = photos.filter((p) => p.role === "sample");

	return (
		<div className="max-w-[1100px] mx-auto px-4 lg:px-10">
			{/* Hero Image */}
			<div className="rounded-sm overflow-hidden -mx-4 lg:mx-0 mb-8">
				<HeroImage
					src={heroUrl}
					alt={`Photo taken with ${recipe.name} recipe`}
					className="w-full"
					aspectRatio="21/9"
				/>
			</div>

			{/* Title Section */}
			<div className="lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-16">
				<div>
					<Link
						to="/"
						className="inline-block font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors mb-6"
					>
						&larr; Back to Archive
					</Link>

					<h1 className="font-headline font-extrabold text-3xl lg:text-5xl text-on-surface leading-[1.05] tracking-tight mb-3">
						{recipe.name}
					</h1>

					<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60 mb-4">
						Created by {author}
					</p>

					<div className="mb-6">
						<TagEditor tags={tags} onChange={handleTagsChange} />
					</div>

					<p className="font-body text-on-surface-variant text-sm leading-relaxed mb-8 max-w-lg">
						A bespoke {recipe.filmSimulation} profile calibrated for the{" "}
						{recipe.sensor} sensor. Tuned with {recipe.dynamicRange} dynamic
						range and{" "}
						{recipe.grainEffect && recipe.grainEffect !== "Off"
							? `${recipe.grainEffect.toLowerCase()} grain`
							: "no grain"}{" "}
						for an organic analog texture.
					</p>

					{/* Action Buttons */}
					<div className="flex items-center gap-3 mb-10">
						<Link
							to={`/recipe/${recipe.id}/edit`}
							className="bg-inverse-surface text-inverse-on-surface font-label text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-sm hover:opacity-90 transition-opacity"
						>
							Edit Recipe
						</Link>
						<button
							type="button"
							className="bg-surface-container text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-sm hover:bg-surface-container-high transition-colors"
						>
							Share
						</button>
						<a
							href={recipe.url}
							target="_blank"
							rel="noopener noreferrer"
							className="font-label text-[10px] uppercase tracking-[0.15em] text-tertiary hover:underline ml-2"
						>
							View Source
						</a>
					</div>
				</div>

				{/* Technical Specifications */}
				<div>
					<RecipeMetadata recipe={recipe} />
				</div>
			</div>

			{/* Sample Photos Gallery */}
			<PhotoGallery
				photos={samplePhotos}
				recipeName={recipe.name}
				onDelete={handleDeletePhoto}
				onSetHero={handleSetHero}
			/>
		</div>
	);
}
