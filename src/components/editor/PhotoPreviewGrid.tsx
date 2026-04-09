import { useRef } from "react";
import type { RecipePhoto } from "../../data/types";
import { usePhotoUpload } from "../../hooks/usePhotoUpload";
import { ResolvedImage } from "./ResolvedImage";

interface PhotoPreviewGridProps {
	photos: RecipePhoto[];
	onChange: (photos: RecipePhoto[]) => void;
}

export function PhotoPreviewGrid({ photos, onChange }: PhotoPreviewGridProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { processFiles } = usePhotoUpload();

	function removePhoto(id: string) {
		const updated = photos.filter((p) => p.id !== id);
		const first = updated[0];
		if (first && !updated.some((p) => p.role === "hero")) {
			updated[0] = { ...first, role: "hero" };
		}
		onChange(updated);
	}

	function setHero(id: string) {
		const updated = photos.map((p) => ({
			...p,
			role: (p.id === id ? "hero" : "sample") as "hero" | "sample",
		}));
		onChange(updated);
	}

	async function handleAddMore(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const updated = await processFiles(files, photos);
		onChange(updated);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	if (photos.length === 0) return null;

	return (
		<div className="grid grid-cols-2 gap-2">
			{photos.map((photo) => (
				<div key={photo.id} className="relative">
					<button
						type="button"
						onClick={() => setHero(photo.id)}
						className="w-full text-left"
						aria-label={`${photo.role === "hero" ? "Hero" : "Sample"} photo. Tap to set as hero`}
					>
						<ResolvedImage
							src={photo.url}
							alt={photo.alt ?? "Recipe photo"}
							className="w-full rounded-sm"
							aspectRatio="3/2"
						/>
					</button>
					{photo.role === "hero" && (
						<span className="absolute top-1.5 left-1.5 bg-inverse-surface/70 backdrop-blur-sm text-inverse-on-surface font-label text-[8px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm pointer-events-none">
							Hero
						</span>
					)}
					<button
						type="button"
						onClick={() => removePhoto(photo.id)}
						className="absolute top-1.5 right-1.5 w-6 h-6 bg-error/80 backdrop-blur-sm text-on-error rounded-sm flex items-center justify-center text-xs"
						aria-label={`Remove photo`}
					>
						&times;
					</button>
				</div>
			))}

			{/* Add More card */}
			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				className="border-2 border-dashed border-outline-variant/40 rounded-sm flex flex-col items-center justify-center gap-1 hover:border-primary/40 transition-colors cursor-pointer"
				style={{ aspectRatio: "3/2" }}
				aria-label="Add more photos"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					className="text-on-surface-variant/40"
					aria-hidden="true"
				>
					<line x1="12" y1="5" x2="12" y2="19" />
					<line x1="5" y1="12" x2="19" y2="12" />
				</svg>
				<span className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant/40">
					Add More
				</span>
			</button>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple
				className="sr-only"
				onChange={handleAddMore}
			/>
		</div>
	);
}
