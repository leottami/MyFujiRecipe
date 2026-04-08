import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "iamfuji_favorites";
const listeners = new Set<() => void>();

function readFavorites(): string[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? (JSON.parse(stored) as string[]) : [];
	} catch {
		return [];
	}
}

function writeFavorites(ids: string[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
	for (const listener of listeners) {
		listener();
	}
}

export function useFavorites() {
	const [favorites, setFavorites] = useState(readFavorites);

	useEffect(() => {
		const listener = () => setFavorites(readFavorites());
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	}, []);

	const toggleFavorite = useCallback((id: string) => {
		const current = readFavorites();
		const next = current.includes(id)
			? current.filter((f) => f !== id)
			: [...current, id];
		writeFavorites(next);
	}, []);

	const isFavorite = useCallback(
		(id: string) => favorites.includes(id),
		[favorites],
	);

	return { favorites, toggleFavorite, isFavorite, count: favorites.length };
}
