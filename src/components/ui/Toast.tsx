import type { Toast as ToastType } from "../../hooks/useToast";

interface ToastContainerProps {
	toasts: ToastType[];
	onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
	if (toasts.length === 0) return null;

	return (
		<div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className="pointer-events-auto bg-inverse-surface/90 backdrop-blur-sm text-inverse-on-surface font-label text-[10px] uppercase tracking-[0.15em] px-5 py-2.5 rounded-sm shadow-elevated animate-fade-in-up cursor-pointer"
					onClick={() => onDismiss(toast.id)}
				>
					{toast.message}
				</div>
			))}
		</div>
	);
}
