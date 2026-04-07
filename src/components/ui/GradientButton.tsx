import type { ButtonHTMLAttributes } from "react";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary";
}

export function GradientButton({
	variant = "primary",
	className = "",
	children,
	...props
}: GradientButtonProps) {
	const base =
		variant === "primary"
			? "bg-gradient-to-b from-primary to-primary-dim text-on-primary rounded-sm px-6 py-3 font-headline font-semibold tracking-wide hover:opacity-90 transition-opacity"
			: "bg-surface-container-high text-on-surface rounded-sm px-6 py-3 font-body font-medium border border-outline-variant/15 hover:bg-surface-container-highest transition-colors";

	return (
		<button type="button" className={`${base} ${className}`} {...props}>
			{children}
		</button>
	);
}
