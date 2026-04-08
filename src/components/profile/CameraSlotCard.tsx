import { useState } from "react";
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
	onDrop?: (recipeId: string) => void;
}

function EmptySlot({ slotNumber, onDrop }: EmptySlotProps) {
	const [dragOver, setDragOver] = useState(false);

	return (
		<div
			className={`flex flex-col items-center justify-center aspect-[3/2] rounded-sm transition-all duration-200 ${
				dragOver
					? "bg-tertiary/5 ring-2 ring-tertiary/30 ring-inset"
					: "bg-surface-container/50"
			}`}
			onDragOver={(e) => {
				if (!onDrop) return;
				e.preventDefault();
				setDragOver(true);
			}}
			onDragLeave={() => setDragOver(false)}
			onDrop={(e) => {
				e.preventDefault();
				setDragOver(false);
				const recipeId = e.dataTransfer.getData("text/recipe-id");
				if (recipeId && onDrop) onDrop(recipeId);
			}}
		>
			<span className={`font-headline font-bold text-lg transition-colors ${
				dragOver ? "text-tertiary/40" : "text-on-surface-variant/15"
			}`}>
				C{slotNumber}
			</span>
			{dragOver && (
				<span className="font-label text-[8px] uppercase tracking-widest text-tertiary/50 mt-1">
					Drop
				</span>
			)}
		</div>
	);
}

interface CameraSlotCardProps {
	recipe?: Recipe;
	slotNumber: number;
	onRemove?: () => void;
	onDrop?: (recipeId: string) => void;
}

export function CameraSlotCard({
	recipe,
	slotNumber,
	onRemove,
	onDrop,
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
	return <EmptySlot slotNumber={slotNumber} onDrop={onDrop} />;
}
