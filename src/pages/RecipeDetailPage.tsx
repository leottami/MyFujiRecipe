import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HeroImage } from "../components/recipe/HeroImage";
import { PhotoGallery } from "../components/recipe/PhotoGallery";
import { RecipeMetadata } from "../components/recipe/RecipeMetadata";
import { TagEditor } from "../components/recipe/TagEditor";
import { SkeletonDetail } from "../components/ui/Skeleton";
import { ToastContainer } from "../components/ui/Toast";
import type { RecipePhoto } from "../data/types";
import { extractAuthor, extractAuthorId, getHeroPhoto } from "../data/utils";
import { useCameraSlots } from "../hooks/useCameraSlots";
import { useFavorites } from "../hooks/useFavorites";
import { useRecipeMutations } from "../hooks/useRecipeMutations";
import { useRecipe } from "../hooks/useRecipes";
import { useToast } from "../hooks/useToast";

export function RecipeDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { recipe, loading, error } = useRecipe(id);
	const { updateRecipe } = useRecipeMutations();
	const { isFavorite, toggleFavorite } = useFavorites();
	const { isOnCamera, addToCamera, removeFromCamera, isCameraFull } = useCameraSlots();
	const { toasts, showToast, dismissToast } = useToast();
	const [photos, setPhotos] = useState<RecipePhoto[]>([]);
	const [tags, setTags] = useState<string[]>([]);

	useEffect(() => {
		if (recipe) {
			setPhotos(recipe.photos);
			setTags(recipe.tags ?? []);
		}
	}, [recipe]);

	const handleFavoriteToggle = useCallback(() => {
		if (!recipe) return;
		const wasFav = isFavorite(recipe.id);
		toggleFavorite(recipe.id);
		showToast(wasFav ? "Removed from favorites" : "Added to favorites");
	}, [recipe, isFavorite, toggleFavorite, showToast]);

	const handleTagsChange = useCallback(
		async (newTags: string[]) => {
			setTags(newTags);
			if (recipe) {
				await updateRecipe({ id: recipe.id, tags: newTags });
				showToast("Tags updated");
			}
		},
		[recipe, updateRecipe, showToast],
	);

	const handleDeletePhoto = useCallback(
		async (photoId: string) => {
			const updated = photos.filter((p) => p.id !== photoId);
			setPhotos(updated);
			if (recipe) {
				await updateRecipe({ id: recipe.id, photos: updated });
				showToast("Photo removed");
			}
		},
		[photos, recipe, updateRecipe, showToast],
	);

	const handleSetHero = useCallback(
		async (photoId: string) => {
			const updated = photos.map((p) => ({
				...p,
				role: (p.id === photoId ? "hero" : "sample") as "hero" | "sample",
			}));
			setPhotos(updated);
			if (recipe) {
				await updateRecipe({ id: recipe.id, photos: updated });
				showToast("Header photo updated");
			}
		},
		[photos, recipe, updateRecipe, showToast],
	);

	if (loading) {
		return <SkeletonDetail />;
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
			{/* Immersive Hero Image */}
			<div className="relative rounded-sm overflow-hidden -mx-4 lg:mx-0 mb-8">
				<div className="relative h-[65vh] lg:h-[60vh] min-h-80 max-h-[600px]">
					<HeroImage
						src={heroUrl}
						alt={`Photo taken with ${recipe.name} recipe`}
						className="w-full h-full object-cover"
						aspectRatio=""
					/>
					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-editorial-dark/80 via-editorial-dark/30 to-transparent" />
				</div>

				{/* Overlay content */}
				<div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
					<Link
						to="/"
						className="inline-block font-label text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors mb-4"
					>
						&larr; Back to Archive
					</Link>

					<h1 className="font-headline font-extrabold text-4xl lg:text-6xl text-white leading-[1.02] tracking-[-0.03em] mb-2">
						{recipe.name}
					</h1>

					<p className="font-label text-[10px] uppercase tracking-[0.15em] text-white/50 mb-4">
						Created by{" "}
						<Link
							to={`/photographer/${extractAuthorId(recipe.url)}`}
							className="text-white/70 hover:text-white transition-colors"
						>
							{author}
						</Link>
					</p>

					{/* Action Buttons — inline on hero */}
					<div className="flex flex-wrap items-center gap-2">
						<Link
							to={`/recipe/${recipe.id}/edit`}
							className="bg-white/15 backdrop-blur-sm text-white font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-sm hover:bg-white/25 transition-colors"
						>
							Edit Recipe
						</Link>
						<button
							type="button"
							onClick={handleFavoriteToggle}
							aria-label={isFavorite(recipe.id) ? "Remove from favorites" : "Add to favorites"}
							className={`backdrop-blur-sm font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-sm transition-colors ${
								isFavorite(recipe.id)
									? "bg-tertiary/80 text-white"
									: "bg-white/15 text-white hover:bg-white/25"
							}`}
						>
							{isFavorite(recipe.id) ? "\u2665 Favorited" : "\u2661 Favorite"}
						</button>
						<button
							type="button"
							onClick={() => {
								if (isOnCamera(recipe.id)) {
									removeFromCamera(recipe.id);
									showToast("Removed from camera");
								} else {
									addToCamera(recipe.id);
									showToast("Loaded to camera");
								}
							}}
							disabled={!isOnCamera(recipe.id) && isCameraFull}
							className={`backdrop-blur-sm font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-sm transition-colors ${
								isOnCamera(recipe.id)
									? "bg-white/25 text-white"
									: isCameraFull
										? "bg-white/5 text-white/30 cursor-not-allowed"
										: "bg-white/15 text-white hover:bg-white/25"
							}`}
						>
							{isOnCamera(recipe.id)
								? "On Camera \u2713"
								: isCameraFull
									? "Camera Full"
									: "Load to Camera"}
						</button>
						<a
							href={recipe.url}
							target="_blank"
							rel="noopener noreferrer"
							className="font-label text-[10px] uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors ml-1"
						>
							Source &rarr;
						</a>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className="lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-16">
				<div className="animate-slide-in-left">
					<div className="mb-6">
						<TagEditor tags={tags} onChange={handleTagsChange} />
					</div>

					<p className="font-body text-on-surface-variant text-sm leading-[1.7] mb-8 max-w-lg italic">
						{recipe.description ??
							`A ${recipe.filmSimulation} profile for the ${recipe.sensor} sensor with ${recipe.dynamicRange} dynamic range.`}
					</p>
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

			<ToastContainer toasts={toasts} onDismiss={dismissToast} />
		</div>
	);
}
