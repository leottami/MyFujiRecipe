import { useState } from "react";
import type { RecipePhoto } from "../../data/types";
import { HeroImage } from "../recipe/HeroImage";

interface PhotoUrlFieldProps {
	photos: RecipePhoto[];
	onChange: (photos: RecipePhoto[]) => void;
}

export function PhotoUrlField({ photos, onChange }: PhotoUrlFieldProps) {
	const [url, setUrl] = useState("");

	function addPhoto() {
		const trimmed = url.trim();
		if (!trimmed) return;

		const id = `photo-${Date.now()}`;
		const role = photos.length === 0 ? "hero" : "sample";
		onChange([...photos, { id, url: trimmed, role: role as "hero" | "sample" }]);
		setUrl("");
	}

	function removePhoto(id: string) {
		const updated = photos.filter((p) => p.id !== id);
		const first = updated[0];
		if (first && !updated.some((p) => p.role === "hero")) {
			updated[0] = { ...first, role: "hero" };
		}
		onChange(updated);
	}

	return (
		<div>
			{photos.length > 0 && (
				<div className="grid grid-cols-2 gap-2 mb-4">
					{photos.map((photo) => (
						<div key={photo.id} className="relative group">
							<HeroImage
								src={photo.url}
								alt={photo.alt ?? "Recipe photo"}
								className="w-full rounded-sm"
								aspectRatio="3/2"
							/>
							{photo.role === "hero" && (
								<span className="absolute top-1.5 left-1.5 bg-inverse-surface/70 backdrop-blur-sm text-inverse-on-surface font-label text-[8px] uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm">
									Hero
								</span>
							)}
							<button
								type="button"
								onClick={() => removePhoto(photo.id)}
								className="absolute top-1.5 right-1.5 w-5 h-5 bg-error/80 backdrop-blur-sm text-on-error rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
							>
								&times;
							</button>
						</div>
					))}
				</div>
			)}

			<div className="flex gap-2">
				<input
					type="text"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="Paste image URL..."
					onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhoto())}
					className="flex-1 bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none font-body text-sm text-on-surface py-1.5 transition-colors"
				/>
				<button
					type="button"
					onClick={addPhoto}
					className="bg-surface-container text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-sm hover:bg-surface-container-high transition-colors shrink-0"
				>
					Add
				</button>
			</div>
		</div>
	);
}
