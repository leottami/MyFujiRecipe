import { Link } from "react-router-dom";
import type { Recipe } from "../../data/types";
import { extractAuthor, extractAuthorId, getHeroPhoto } from "../../data/utils";
import { useFavorites } from "../../hooks/useFavorites";
import { HeroImage } from "./HeroImage";

interface FeaturedCardProps {
	recipe: Recipe;
}

export function FeaturedCard({ recipe }: FeaturedCardProps) {
	const author = extractAuthor(recipe.url);
	const { isFavorite, toggleFavorite } = useFavorites();
	const favorited = isFavorite(recipe.id);

	return (
		<Link
			to={`/recipe/${recipe.id}`}
			className="group block animate-fade-in-up mb-8 lg:mb-12"
		>
			<div className="relative overflow-hidden rounded-sm -mx-4 lg:mx-0">
				<HeroImage
					src={getHeroPhoto(recipe)}
					alt={`Photo taken with ${recipe.name} recipe`}
					className="w-full group-hover:scale-[1.02] transition-transform duration-700 ease-out"
					aspectRatio="16/9"
				/>

				{/* Gradient overlay — always visible */}
				<div className="absolute inset-0 bg-gradient-to-t from-editorial-dark/70 via-editorial-dark/20 to-transparent" />

				{/* Content overlay */}
				<div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
					<p className="font-label text-[9px] uppercase tracking-[0.2em] text-white/50 mb-2 flex items-center gap-2">
						<span className="inline-block w-1 h-1 rounded-sm bg-accent-warm" />
						Featured
					</p>
					<h2 className="font-headline font-extrabold text-2xl lg:text-4xl text-white leading-[1.05] tracking-[-0.02em] mb-2">
						{recipe.name}
					</h2>
					<div className="flex items-center gap-3">
						<Link
							to={`/photographer/${extractAuthorId(recipe.url)}`}
							onClick={(e) => e.stopPropagation()}
							className="font-label text-[10px] uppercase tracking-[0.15em] text-white/60 hover:text-white transition-colors"
						>
							{author}
						</Link>
						<span className="w-px h-3 bg-white/20" />
						<span className="font-label text-[10px] uppercase tracking-[0.15em] text-white/40">
							{recipe.filmSimulation}
						</span>
						<span className="w-px h-3 bg-white/20" />
						<span className="font-label text-[10px] uppercase tracking-[0.15em] text-white/40">
							{recipe.dynamicRange ?? "DR Auto"}
						</span>
					</div>
				</div>

				{/* Favorite heart — top right */}
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						toggleFavorite(recipe.id);
					}}
					aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
					className="absolute top-4 right-4 p-3 min-w-11 min-h-11 flex items-center justify-center"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill={favorited ? "#b91e25" : "none"}
						stroke={favorited ? "#b91e25" : "#ffffff"}
						strokeWidth="2"
						className={`drop-shadow-sm ${favorited ? "animate-heart-spring" : ""}`}
						aria-hidden="true"
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
				</button>
			</div>
		</Link>
	);
}
