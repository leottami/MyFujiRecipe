import { useCallback, useState } from "react";
import { compressImage, CompressionError, ImageTooLargeError } from "../data/imageCompressor";
import { savePhoto } from "../data/photoStore";
import type { RecipePhoto } from "../data/types";

interface UploadProgress {
	current: number;
	total: number;
}

interface UsePhotoUploadReturn {
	uploading: boolean;
	progress: UploadProgress | null;
	error: string | null;
	processFiles: (files: FileList, existingPhotos: RecipePhoto[]) => Promise<RecipePhoto[]>;
}

export function usePhotoUpload(): UsePhotoUploadReturn {
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState<UploadProgress | null>(null);
	const [error, setError] = useState<string | null>(null);

	const processFiles = useCallback(
		async (files: FileList, existingPhotos: RecipePhoto[]): Promise<RecipePhoto[]> => {
			if (files.length === 0) return existingPhotos;

			setUploading(true);
			setError(null);
			setProgress({ current: 0, total: files.length });

			const newPhotos: RecipePhoto[] = [...existingPhotos];

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				if (!file) continue;

				setProgress({ current: i + 1, total: files.length });

				try {
					const compressed = await compressImage(file);
					const id = `photo-${Date.now()}-${i}`;

					await savePhoto({
						id,
						blob: compressed.blob,
						mimeType: "image/jpeg",
						width: compressed.width,
						height: compressed.height,
						sizeBytes: compressed.blob.size,
						createdAt: new Date().toISOString(),
					});

					const role = newPhotos.length === 0 ? "hero" : "sample";
					newPhotos.push({
						id,
						url: `idb://${id}`,
						role: role as "hero" | "sample",
					});
				} catch (err) {
					if (err instanceof ImageTooLargeError) {
						setError("Image too large. Max 20MB.");
					} else if (err instanceof CompressionError) {
						setError("Couldn't process image. Try another.");
					} else {
						setError("Failed to upload image.");
					}
				}
			}

			setUploading(false);
			setProgress(null);
			return newPhotos;
		},
		[],
	);

	return { uploading, progress, error, processFiles };
}
