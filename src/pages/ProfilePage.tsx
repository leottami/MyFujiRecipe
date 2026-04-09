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

	// Stats
	const topSim = useMemo(() => {
		const counts: Record<string, number> = {};
		for (const r of favoriteRecipes) {
			if (r.filmSimulation)
				counts[r.filmSimulation] = (counts[r.filmSimulation] ?? 0) + 1;
		}
		const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
		return sorted[0];
	}, [favoriteRecipes]);

	function handleLogout() {
		setAuthenticated(false);
		window.location.reload();
	}

	return (
		<div className="max-w-[1100px] mx-auto px-4 lg:px-10">
			{/* Hero header — dark, cinematic */}
			<div className="relative -mx-4 lg:-mx-10 px-4 lg:px-10 py-12 lg:py-16 mb-10 bg-editorial-dark overflow-hidden animate-hero-reveal">
				{/* Subtle gradient */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(196,149,106,0.08),transparent_60%)]" />

				<div className="relative">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-px h-8 bg-accent-warm/40" />
						<p className="font-label text-[9px] uppercase tracking-[0.3em] text-editorial-dark-text/40">
							Custom Settings
						</p>
					</div>

					<h1 className="font-headline font-extrabold text-5xl lg:text-7xl uppercase tracking-[-0.02em] text-editorial-dark-text/90 leading-none mb-4">
						My Camera
					</h1>

					<div className="flex items-center gap-6 font-label text-[10px] uppercase tracking-[0.15em] text-editorial-dark-text/40">
						<span>
							{slots.length}
							<span className="text-editorial-dark-text/20">
								/6
							</span>{" "}
							loaded
						</span>
						<span className="w-px h-3 bg-editorial-dark-text/15" />
						<span>
							{favorites.length} in collection
						</span>
						{topSim && (
							<>
								<span className="w-px h-3 bg-editorial-dark-text/15" />
								<span>
									Top: {topSim[0]}
								</span>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Camera Slots — 3x2 grid with tonal background */}
			<div className="mb-14">
				<div className="bg-surface-container-lowest rounded-sm p-4 lg:p-6">
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-5">
						{Array.from({ length: 6 }, (_, i) => (
							<div
								key={slots[i] ?? `empty-${i}`}
								className="animate-fade-in-up"
								style={{ animationDelay: `${i * 80}ms` }}
							>
								<CameraSlotCard
									recipe={slotRecipes[i]}
									slotNumber={i + 1}
									onRemove={
										slotRecipes[i]
											? () => removeFromCamera(slots[i]!)
											: undefined
									}
									onDrop={
										!slotRecipes[i]
											? (recipeId: string) =>
													addToCamera(recipeId)
											: undefined
									}
								/>
							</div>
						))}
					</div>
				</div>
				<p className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant/25 mt-3 text-center">
					<span className="hidden sm:inline">Drag from collection &middot; Click to view &middot; Hover to remove</span>
					<span className="sm:hidden">Tap recipe below to load &middot; Tap slot to view</span>
				</p>
			</div>

			{/* Divider */}
			<div className="flex items-center gap-4 mb-8">
				<div className="flex-1 h-px bg-surface-variant/30" />
				<span className="font-label text-[9px] uppercase tracking-[0.3em] text-on-surface-variant/30">
					Collection
				</span>
				<div className="flex-1 h-px bg-surface-variant/30" />
			</div>

			{/* Collection — draggable cards */}
			{favoriteRecipes.length > 0 && (
				<div className="mb-12">
				<div className="columns-2 md:columns-3 lg:columns-4 gap-3 lg:gap-4">
						{favoriteRecipes.map((recipe, i) => (
							<div
								key={recipe.id}
								draggable={
									!isOnCamera(recipe.id) && !isCameraFull
								}
								onDragStart={(e) => {
									e.dataTransfer.setData(
										"text/recipe-id",
										recipe.id,
									);
									e.dataTransfer.effectAllowed = "copy";
								}}
								className={`animate-fade-in-up break-inside-avoid mb-3 ${
									!isOnCamera(recipe.id) && !isCameraFull
										? "cursor-grab active:cursor-grabbing"
										: ""
								}`}
								style={{
									animationDelay: `${Math.min(i * 60, 400)}ms`,
								}}
							>
								<Link
									to={`/recipe/${recipe.id}`}
									className="group block hover:rotate-[0.5deg] transition-transform duration-300"
								>
									<div className="relative overflow-hidden rounded-sm">
										<HeroImage
											src={getHeroPhoto(recipe)}
											alt={recipe.name}
											className="w-full group-hover:scale-[1.03] transition-transform duration-500"
											aspectRatio="3/2"
										/>
										{/* Hover gradient */}
										<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

										{isOnCamera(recipe.id) && (
											<span className="absolute top-1.5 left-1.5 bg-inverse-surface/70 backdrop-blur-sm text-inverse-on-surface font-label text-[8px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm">
												C
												{slots.indexOf(recipe.id) + 1}
											</span>
										)}
										{!isOnCamera(recipe.id) && !isCameraFull && (
											<button
												type="button"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													addToCamera(recipe.id);
												}}
												className="absolute top-1.5 right-1.5 touch-visible bg-inverse-surface/70 backdrop-blur-sm text-inverse-on-surface p-1.5 rounded-sm min-w-8 min-h-8 flex items-center justify-center transition-opacity"
												aria-label={`Load ${recipe.name} to camera`}
											>
												<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
													<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
													<circle cx="12" cy="13" r="4" />
												</svg>
											</button>
										)}
									</div>
									<div className="pt-2">
										<p className="font-headline font-semibold text-xs text-on-surface group-hover:text-primary leading-tight truncate transition-colors duration-200">
											{recipe.name}
										</p>
										<p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/60">
											{extractAuthor(recipe.url)}{" "}
											<span className="text-on-surface-variant/30">
												/
											</span>{" "}
											{recipe.filmSimulation}
										</p>
									</div>
								</Link>
							</div>
						))}
					</div>
				</div>
			)}

			{favoriteRecipes.length === 0 && (
				<div className="flex flex-col items-center justify-center min-h-[30vh] gap-4">
					<div className="w-px h-12 bg-on-surface-variant/10" />
					<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/40 text-center max-w-xs">
						Your collection is empty. Browse the archive and tap the
						heart on recipes you love.
					</p>
					<Link
						to="/"
						className="font-label text-[10px] uppercase tracking-[0.15em] text-tertiary hover:text-on-surface transition-colors"
					>
						Browse Archive
					</Link>
				</div>
			)}

			{/* Footer */}
			<div className="py-10 flex items-center justify-between">
				<p className="font-label text-[8px] uppercase tracking-[0.3em] text-on-surface-variant/20">
					Fuji X-Trans IV &middot; {recipes.length} recipes
				</p>
				<button
					type="button"
					onClick={handleLogout}
					className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/30 hover:text-error transition-colors"
				>
					Sign Out
				</button>
			</div>
		</div>
	);
}
