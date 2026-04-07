import type { InputHTMLAttributes } from "react";

interface SearchInputProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
	onSearch?: (value: string) => void;
}

export function SearchInput({
	onSearch,
	className = "",
	...props
}: SearchInputProps) {
	return (
		<input
			type="search"
			className={`bg-transparent border-b-2 border-surface-variant focus:border-primary placeholder:uppercase placeholder:tracking-widest placeholder:text-on-surface-variant/50 placeholder:text-xs font-label text-sm py-2 outline-none transition-colors w-full ${className}`}
			onChange={(e) => onSearch?.(e.target.value)}
			{...props}
		/>
	);
}
