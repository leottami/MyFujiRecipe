import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CameraSlotCard } from "../components/profile/CameraSlotCard";
import { HeroImage } from "../components/recipe/HeroImage";
import { setAuthenticated } from "../data/auth";
import { extractAuthor, getHeroPhoto } from "../data/utils";
import { useCameraSlots } from "../hooks/useCameraSlots";
import { useFavorites } from "../hooks/useFavorites";
import { useRecipes } from "../hooks/useRecipes";

export function ProfilePage() {
	const { recipes } = useRecipes();
	const { favorites } = useFavorites();
	const { slots, addToCamera, removeFromCamera, isOnCamera, isCameraFull } =
		useCameraSlots();

	const favoriteRecipes = useMemo(
		() => recipes.filter((r) => favorites.includes(r.id)),
		[recipes, favorites],
	);

	const slotRecipes = useMemo(() => {
		const recipeMap = new Map(recipes.map((r) => [r.id, r]));
		return slots.map((id) => recipeMap.get(id));
	}, [recipes, slots]);

	function handleLogout() {
		setAuthenticated(false);
		window.location.reload();
	}

	return (
		<div className="max-w-[1100px] mx-auto px-4 lg:px-10 animate-page-enter">
			{/* Header */}
			<div className="py-8">
				<h1 className="font-headline font-extrabold text-3xl lg:text-4xl uppercase tracking-[0.1em] text-on-surface leading-tight mb-2">
					My Archive
				</h1>
				<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/60">
					{favorites.length} saved &middot; {slots.length}/6 on camera
				</p>
			</div>

			{/* Camera Slots */}
			<div className="mb-12">
				<h2 className="font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4">
					My Camera
					<span className="text-on-surface-variant/40 ml-2">
						{slots.length}/6
					</span>
				</h2>
				<div className="grid grid-cols-3 gap-3 lg:gap-4">
					{Array.from({ length: 6 }, (_, i) => (
						<CameraSlotCard
							key={slots[i] ?? `empty-${i}`}
							recipe={slotRecipes[i]}
							slotNumber={i + 1}
							onRemove={
								slotRecipes[i]
									? () => removeFromCamera(slots[i]!)
									: undefined
							}
							onDrop={
								!slotRecipes[i]
									? (recipeId: string) => addToCamera(recipeId)
									: undefined
							}
						/>
					))}
				</div>
				<p className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant/30 mt-2">
					Drag recipes from your collection below into empty slots
				</p>
			</div>

			{/* Collection — draggable cards */}
			{favoriteRecipes.length > 0 && (
				<div className="mb-12">
					<h2 className="font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4">
						My Collection
						<span className="text-on-surface-variant/40 ml-2">
							{favoriteRecipes.length}
						</span>
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
						{favoriteRecipes.map((recipe) => (
							<div
								key={recipe.id}
								draggable={!isOnCamera(recipe.id) && !isCameraFull}
								onDragStart={(e) => {
									e.dataTransfer.setData(
										"text/recipe-id",
										recipe.id,
									);
									e.dataTransfer.effectAllowed = "copy";
								}}
								className={`animate-fade-in-up ${
									!isOnCamera(recipe.id) && !isCameraFull
										? "cursor-grab active:cursor-grabbing"
										: ""
								}`}
							>
								<Link
									to={`/recipe/${recipe.id}`}
									className="group block"
								>
									<div className="relative overflow-hidden rounded-sm">
										<HeroImage
											src={getHeroPhoto(recipe)}
											alt={recipe.name}
											className="w-full group-hover:scale-[1.03] transition-transform duration-500"
											aspectRatio="3/2"
										/>
										{isOnCamera(recipe.id) && (
											<span className="absolute top-1.5 left-1.5 bg-inverse-surface/60 backdrop-blur-sm text-inverse-on-surface font-label text-[8px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm">
												On Camera
											</span>
										)}
									</div>
									<div className="pt-2">
										<p className="font-headline font-semibold text-xs text-on-surface leading-tight truncate">
											{recipe.name}
										</p>
										<p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/50">
											{extractAuthor(recipe.url)}
										</p>
									</div>
								</Link>
							</div>
						))}
					</div>
				</div>
			)}

			{favoriteRecipes.length === 0 && (
				<div className="flex items-center justify-center min-h-[30vh]">
					<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50">
						No favorites yet — tap the heart on any recipe to start your collection
					</p>
				</div>
			)}

			{/* Logout */}
			<div className="py-8 border-t border-surface-variant/20">
				<button
					type="button"
					onClick={handleLogout}
					className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/50 hover:text-error transition-colors"
				>
					Sign Out
				</button>
			</div>
		</div>
	);
}
