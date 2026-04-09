const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.82;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export interface CompressedImage {
	blob: Blob;
	width: number;
	height: number;
}

export class ImageTooLargeError extends Error {
	constructor(sizeBytes: number) {
		super(`Image too large: ${(sizeBytes / 1024 / 1024).toFixed(1)}MB. Max 20MB.`);
		this.name = "ImageTooLargeError";
	}
}

export class CompressionError extends Error {
	constructor(cause?: unknown) {
		super("Failed to process image");
		this.name = "CompressionError";
	}
}

function loadImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new CompressionError("Failed to load image"));
		};
		img.src = url;
	});
}

function calculateDimensions(
	width: number,
	height: number,
): { width: number; height: number } {
	const longest = Math.max(width, height);
	if (longest <= MAX_DIMENSION) return { width, height };

	const scale = MAX_DIMENSION / longest;
	return {
		width: Math.round(width * scale),
		height: Math.round(height * scale),
	};
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) resolve(blob);
				else reject(new CompressionError("Canvas toBlob returned null"));
			},
			"image/jpeg",
			JPEG_QUALITY,
		);
	});
}

export async function compressImage(file: File): Promise<CompressedImage> {
	if (file.size > MAX_FILE_SIZE) {
		throw new ImageTooLargeError(file.size);
	}

	try {
		const img = await loadImage(file);
		const { width, height } = calculateDimensions(img.width, img.height);

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d");
		if (!ctx) throw new CompressionError("Canvas 2D context unavailable");

		ctx.drawImage(img, 0, 0, width, height);

		const blob = await canvasToBlob(canvas);

		// Clean up canvas memory
		canvas.width = 0;
		canvas.height = 0;

		return { blob, width, height };
	} catch (error) {
		if (error instanceof ImageTooLargeError || error instanceof CompressionError) {
			throw error;
		}
		throw new CompressionError(error);
	}
}
