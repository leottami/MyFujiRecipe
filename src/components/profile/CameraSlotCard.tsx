import { Link } from "react-router-dom";
import type { Recipe } from "../../data/types";
import { getHeroPhoto } from "../../data/utils";
import { HeroImage } from "../recipe/HeroImage";

interface FilledSlotProps {
	recipe: Recipe;
	slotNumber: number;
	onRemove: () => void;
}

function FilledSlot({ recipe, slotNumber, onRemove }: FilledSlotProps) {
	return (
		<div className="group relative">
			<Link to={`/recipe/${recipe.id}`} className="block">
				<div className="relative overflow-hidden rounded-sm">
					<HeroImage
						src={getHeroPhoto(recipe)}
						alt={recipe.name}
						className="w-full group-hover:scale-[1.03] transition-transform duration-500"
						aspectRatio="3/2"
					/>
					<span className="absolute top-1.5 left-1.5 bg-inverse-surface/60 backdrop-blur-sm text-inverse-on-surface font-label text-[8px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm">
						C{slotNumber}
					</span>
				</div>
				<div className="pt-2">
					<p className="font-headline font-semibold text-xs text-on-surface leading-tight truncate">
						{recipe.name}
					</p>
					<p className="font-label text-[9px] uppercase tracking-[0.1em] text-on-surface-variant/50 truncate">
						{recipe.filmSimulation}
					</p>
				</div>
			</Link>
			<button
				type="button"
				onClick={onRemove}
				className="absolute top-1.5 right-1.5 w-5 h-5 bg-error/70 backdrop-blur-sm text-on-error rounded-sm flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
			>
				&times;
			</button>
		</div>
	);
}

interface EmptySlotProps {
	slotNumber: number;
}

function EmptySlot({ slotNumber }: EmptySlotProps) {
	return (
		<div className="flex flex-col items-center justify-center aspect-[3/2] border-2 border-dashed border-surface-variant/40 rounded-sm">
			<span className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant/30 mb-1">
				C{slotNumber}
			</span>
			<span className="text-on-surface-variant/20 text-lg">+</span>
		</div>
	);
}

interface CameraSlotCardProps {
	recipe?: Recipe;
	slotNumber: number;
	onRemove?: () => void;
}

export function CameraSlotCard({
	recipe,
	slotNumber,
	onRemove,
}: CameraSlotCardProps) {
	if (recipe && onRemove) {
		return (
			<FilledSlot
				recipe={recipe}
				slotNumber={slotNumber}
				onRemove={onRemove}
			/>
		);
	}
	return <EmptySlot slotNumber={slotNumber} />;
}
