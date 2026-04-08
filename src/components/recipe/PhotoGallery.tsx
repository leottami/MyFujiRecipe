import { useState } from "react";
import type { RecipePhoto } from "../../data/types";
import { HeroImage } from "./HeroImage";

interface PhotoGalleryProps {
	photos: RecipePhoto[];
	recipeName: string;
	onDelete?: (photoId: string) => void;
	onSetHero?: (photoId: string) => void;
}

export function PhotoGallery({
	photos,
	recipeName,
	onDelete,
	onSetHero,
}: PhotoGalleryProps) {
	const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
	const editable = !!onDelete || !!onSetHero;

	if (photos.length === 0) return null;

	const selected = selectedIdx !== null ? photos[selectedIdx] : null;

	function handleDelete(photoId: string) {
		if (!onDelete) return;
		onDelete(photoId);
		// Adjust selected index after deletion
		if (selectedIdx !== null) {
			if (photos.length <= 1) {
				setSelectedIdx(null);
			} else if (selectedIdx >= photos.length - 1) {
				setSelectedIdx(photos.length - 2);
			}
		}
	}

	return (
		<>
			{/* Gallery Grid */}
			<div className="mt-12 mb-8">
				<h2 className="font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-4">
					Sample Photos
					<span className="text-on-surface-variant/40 ml-2">
						{photos.length}
					</span>
				</h2>
				<div className="columns-2 md:columns-3 gap-3">
					{photos.map((photo, idx) => (
						<div
							key={photo.id}
							className="relative mb-3 break-inside-avoid group"
						>
							<button
								type="button"
								onClick={() => setSelectedIdx(idx)}
								className="block w-full cursor-pointer"
							>
								<div className="rounded-sm overflow-hidden">
									<HeroImage
										src={photo.url}
										alt={
											photo.alt ??
											`${recipeName} sample ${idx + 1}`
										}
										className="w-full group-hover:scale-[1.02] transition-transform duration-500"
										aspectRatio="auto"
									/>
								</div>
							</button>

							{/* Overlay actions on hover */}
							{editable && (
								<div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									{onSetHero && (
										<button
											type="button"
											onClick={() =>
												onSetHero(photo.id)
											}
											title="Set as header photo"
											className="w-6 h-6 bg-inverse-surface/70 backdrop-blur-sm text-inverse-on-surface rounded-sm flex items-center justify-center text-[10px] hover:bg-inverse-surface/90 transition-colors"
										>
											&#9733;
										</button>
									)}
									{onDelete && (
										<button
											type="button"
											onClick={() =>
												handleDelete(photo.id)
											}
											title="Remove photo"
											className="w-6 h-6 bg-error/70 backdrop-blur-sm text-on-error rounded-sm flex items-center justify-center text-xs hover:bg-error/90 transition-colors"
										>
											&times;
										</button>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Lightbox */}
			{selected && selectedIdx !== null && (
				<div
					className="fixed inset-0 z-50 bg-inverse-surface/90 backdrop-blur-sm flex items-center justify-center p-4"
					onClick={() => setSelectedIdx(null)}
					onKeyDown={(e) => {
						if (e.key === "Escape") setSelectedIdx(null);
						if (
							e.key === "ArrowRight" &&
							selectedIdx < photos.length - 1
						)
							setSelectedIdx(selectedIdx + 1);
						if (e.key === "ArrowLeft" && selectedIdx > 0)
							setSelectedIdx(selectedIdx - 1);
						if (e.key === "Delete" && onDelete) {
							handleDelete(selected.id);
						}
					}}
				>
					{/* Nav arrows */}
					{selectedIdx > 0 && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								setSelectedIdx(selectedIdx - 1);
							}}
							className="absolute left-4 top-1/2 -translate-y-1/2 text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors text-3xl"
						>
							&#8249;
						</button>
					)}
					{selectedIdx < photos.length - 1 && (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								setSelectedIdx(selectedIdx + 1);
							}}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors text-3xl"
						>
							&#8250;
						</button>
					)}

					{/* Top bar: counter + actions + close */}
					<div className="absolute top-4 left-4 right-4 flex items-center justify-between">
						<span className="text-inverse-on-surface/50 font-label text-[10px] uppercase tracking-[0.15em]">
							{selectedIdx + 1} / {photos.length}
						</span>

						<div className="flex items-center gap-3">
							{editable && (
								<>
									{onSetHero && (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												onSetHero(selected.id);
											}}
											className="text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors font-label text-[10px] uppercase tracking-[0.15em]"
										>
											Set as Header
										</button>
									)}
									{onDelete && (
										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(selected.id);
											}}
											className="text-error/70 hover:text-error transition-colors font-label text-[10px] uppercase tracking-[0.15em]"
										>
											Delete
										</button>
									)}
								</>
							)}
							<button
								type="button"
								onClick={() => setSelectedIdx(null)}
								className="text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors font-label text-[10px] uppercase tracking-[0.15em]"
							>
								Close
							</button>
						</div>
					</div>

					{/* Image */}
					<img
						src={selected.url}
						alt={selected.alt ?? `${recipeName} photo`}
						className="max-w-full max-h-[85vh] object-contain rounded-sm"
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}
		</>
	);
}
