import { useMemo } from "react";
import { FeedGrid } from "../components/feed/FeedGrid";
import { CameraSlotCard } from "../components/profile/CameraSlotCard";
import { setAuthenticated } from "../data/auth";
import { useCameraSlots } from "../hooks/useCameraSlots";
import { useFavorites } from "../hooks/useFavorites";
import { useRecipes } from "../hooks/useRecipes";

export function ProfilePage() {
	const { recipes } = useRecipes();
	const { favorites } = useFavorites();
	const { slots, removeFromCamera } = useCameraSlots();

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
						/>
					))}
				</div>
			</div>

			{/* Collection */}
			{favoriteRecipes.length > 0 && (
				<div className="mb-12">
					<h2 className="font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4">
						My Collection
						<span className="text-on-surface-variant/40 ml-2">
							{favoriteRecipes.length}
						</span>
					</h2>
					<FeedGrid recipes={favoriteRecipes} />
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
