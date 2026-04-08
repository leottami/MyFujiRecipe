import type { ReactNode } from "react";

interface FormSectionProps {
	title: string;
	children: ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
	return (
		<div className="mb-6 last:mb-0">
			<h3 className="font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50 mb-2">
				{title}
			</h3>
			<div className="bg-surface-container-lowest rounded-sm p-4">
				{children}
			</div>
		</div>
	);
}
