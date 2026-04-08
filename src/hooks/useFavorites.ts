import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "iamfuji_favorites";

function getSnapshot(): string[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? (JSON.parse(stored) as string[]) : [];
	} catch {
		return [];
	}
}

let cachedFavorites = getSnapshot();

function subscribe(callback: () => void): () => void {
	function handleStorage(e: StorageEvent) {
		if (e.key === STORAGE_KEY) {
			cachedFavorites = getSnapshot();
			callback();
		}
	}
	window.addEventListener("storage", handleStorage);
	return () => window.removeEventListener("storage", handleStorage);
}

function getSnapshotCached(): string[] {
	return cachedFavorites;
}

function writeFavorites(ids: string[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
	cachedFavorites = ids;
}

export function useFavorites() {
	const favorites = useSyncExternalStore(subscribe, getSnapshotCached);

	const toggleFavorite = useCallback(
		(id: string) => {
			const current = getSnapshot();
			const next = current.includes(id)
				? current.filter((f) => f !== id)
				: [...current, id];
			writeFavorites(next);
		},
		[],
	);

	const isFavorite = useCallback(
		(id: string) => favorites.includes(id),
		[favorites],
	);

	const count = useMemo(() => favorites.length, [favorites]);

	return { favorites, toggleFavorite, isFavorite, count };
}
