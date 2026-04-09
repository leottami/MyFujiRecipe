import { useRef, useState } from "react";
import type { RecipePhoto } from "../../data/types";
import { usePhotoUpload } from "../../hooks/usePhotoUpload";

interface PhotoUploadZoneProps {
	photos: RecipePhoto[];
	onChange: (photos: RecipePhoto[]) => void;
}

export function PhotoUploadZone({ photos, onChange }: PhotoUploadZoneProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { uploading, progress, error, processFiles } = usePhotoUpload();
	const [showUrl, setShowUrl] = useState(false);
	const [url, setUrl] = useState("");

	async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const updated = await processFiles(files, photos);
		onChange(updated);
		// Reset input so the same file can be re-selected
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function isValidImageUrl(input: string): boolean {
		try {
			return ["http:", "https:"].includes(new URL(input).protocol);
		} catch {
			return false;
		}
	}

	function addUrl() {
		const trimmed = url.trim();
		if (!trimmed || !isValidImageUrl(trimmed)) return;
		const id = `photo-${Date.now()}`;
		const role = photos.length === 0 ? "hero" : "sample";
		onChange([...photos, { id, url: trimmed, role: role as "hero" | "sample" }]);
		setUrl("");
		setShowUrl(false);
	}

	if (uploading && progress) {
		return (
			<div className="bg-surface-container-lowest rounded-sm border-2 border-dashed border-outline-variant/40 p-6 flex flex-col items-center justify-center min-h-50 gap-3">
				<div className="w-full max-w-50 h-1 bg-surface-variant rounded-full overflow-hidden">
					<div
						className="h-full bg-primary rounded-full transition-all duration-300"
						style={{ width: `${(progress.current / progress.total) * 100}%` }}
					/>
				</div>
				<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
					Compressing... {progress.current} of {progress.total}
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{/* Upload zone */}
			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				className="bg-surface-container-lowest rounded-sm border-2 border-dashed border-outline-variant/40 p-6 flex flex-col items-center justify-center min-h-50 gap-2 hover:border-primary/40 transition-colors cursor-pointer"
				aria-label="Upload photos. Tap to select from camera or photo library"
			>
				<svg
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-on-surface-variant/40"
					aria-hidden="true"
				>
					<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
					<circle cx="12" cy="13" r="4" />
				</svg>
				<span className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
					Tap to add photos
				</span>
				<span className="font-body text-xs text-on-surface-variant/50">
					Camera · Photo Library
				</span>
			</button>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				multiple
				className="sr-only"
				onChange={handleFiles}
			/>

			{error && (
				<p className="font-label text-[10px] text-error text-center">{error}</p>
			)}

			{/* URL toggle */}
			{!showUrl ? (
				<div className="flex items-center gap-2">
					<span className="flex-1 border-t border-outline-variant/20" />
					<button
						type="button"
						onClick={() => setShowUrl(true)}
						className="font-label text-[10px] uppercase tracking-[0.15em] text-primary"
					>
						Paste image URL
					</button>
					<span className="flex-1 border-t border-outline-variant/20" />
				</div>
			) : (
				<div className="flex gap-2">
					<input
						type="text"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="Paste image URL..."
						onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
						className="flex-1 bg-transparent border-b-2 border-surface-variant focus:border-primary outline-none font-body text-sm text-on-surface py-1.5 transition-colors"
					/>
					<button
						type="button"
						onClick={addUrl}
						className="bg-surface-container text-on-surface-variant font-label text-[10px] uppercase tracking-[0.15em] px-4 py-2 rounded-sm hover:bg-surface-container-high transition-colors shrink-0"
					>
						Add
					</button>
				</div>
			)}
		</div>
	);
}
