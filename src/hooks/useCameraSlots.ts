import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "iamfuji_camera";
const MAX_SLOTS = 6;
const listeners = new Set<() => void>();

function readSlots(): string[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? (JSON.parse(stored) as string[]) : [];
	} catch {
		return [];
	}
}

function writeSlots(ids: string[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
	for (const listener of listeners) {
		listener();
	}
}

export function useCameraSlots() {
	const [slots, setSlots] = useState(readSlots);

	useEffect(() => {
		const listener = () => setSlots(readSlots());
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	}, []);

	const addToCamera = useCallback((id: string) => {
		const current = readSlots();
		if (current.length >= MAX_SLOTS || current.includes(id)) return;
		writeSlots([...current, id]);
	}, []);

	const removeFromCamera = useCallback((id: string) => {
		const current = readSlots();
		writeSlots(current.filter((s) => s !== id));
	}, []);

	const isOnCamera = useCallback(
		(id: string) => slots.includes(id),
		[slots],
	);

	const isCameraFull = slots.length >= MAX_SLOTS;

	return { slots, addToCamera, removeFromCamera, isOnCamera, isCameraFull };
}
