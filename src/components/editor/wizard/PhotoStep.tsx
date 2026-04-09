import type { RecipePhoto } from "../../../data/types";
import { PhotoPreviewGrid } from "../PhotoPreviewGrid";
import { PhotoUploadZone } from "../PhotoUploadZone";

interface PhotoStepProps {
	photos: RecipePhoto[];
	onChange: (photos: RecipePhoto[]) => void;
}

export function PhotoStep({ photos, onChange }: PhotoStepProps) {
	return (
		<div className="px-4">
			<h2 className="font-headline font-bold text-lg text-on-surface mb-1">
				Photos
			</h2>
			<p className="font-body text-sm text-on-surface-variant mb-6">
				Add photos from your camera roll or paste a URL
			</p>

			{photos.length === 0 ? (
				<PhotoUploadZone photos={photos} onChange={onChange} />
			) : (
				<>
					<PhotoPreviewGrid photos={photos} onChange={onChange} />
					<div className="mt-4">
						<PhotoUploadZone photos={photos} onChange={onChange} />
					</div>
				</>
			)}

			<p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant/40 mt-4 text-center">
				Optional — skip to add photos later
			</p>
		</div>
	);
}
