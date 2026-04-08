import { useCallback, useState } from "react";

export interface Toast {
	id: number;
	message: string;
}

let nextId = 0;

export function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((message: string, duration = 2500) => {
		const id = nextId++;
		setToasts((prev) => [...prev, { id, message }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, duration);
	}, []);

	const dismissToast = useCallback((id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return { toasts, showToast, dismissToast };
}
