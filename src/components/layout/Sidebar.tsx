import {
	ALL_TAGS,
	CC_OPTIONS,
	DR_OPTIONS,
	GRAIN_OPTIONS,
} from "../../data/filterHelpers";
import type { FilterCounts } from "../../data/filterHelpers";
import type { RecipeFilters } from "../../data/types";

interface SidebarProps {
	filters: RecipeFilters;
	counts: FilterCounts;
	filmSimulations: string[];
	totalCount: number;
	onSetFilter: (key: keyof RecipeFilters, value: string | string[] | null) => void;
	onToggleTag: (tag: string) => void;
	onClearAll: () => void;
	activeFilterCount: number;
}

function SidebarSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="mb-6">
			<h3 className="accent-border-left font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-accent-warm mb-2 px-3">
				{title}
			</h3>
			{children}
		</div>
	);
}

function SidebarPill({
	label,
	active,
	count,
	onClick,
}: {
	label: string;
	active: boolean;
	count?: number;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={`px-2.5 py-1 font-label text-[10px] uppercase tracking-[0.1em] transition-colors rounded-sm ${
				active
					? "bg-inverse-surface text-inverse-on-surface"
					: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
			}`}
		>
			{label}
			{count !== undefined && (
				<span className="ml-1 opacity-40">{count}</span>
			)}
		</button>
	);
}

export function Sidebar({
	filters,
	counts,
	filmSimulations,
	totalCount,
	onSetFilter,
	onToggleTag,
	onClearAll,
	activeFilterCount,
}: SidebarProps) {
	return (
		<aside className="hidden lg:flex flex-col w-[240px] shrink-0 h-[calc(100vh-64px)] sticky top-16 pt-8 pb-6 px-3 overflow-y-auto">
			{/* Header */}
			<div className="mb-6 px-3">
				<h2 className="font-headline font-bold text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">
					Recipe Selector
				</h2>
				<p className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant/50">
					{totalCount} recipes
				</p>
			</div>

			{/* Tags */}
			<SidebarSection title="Mood">
				<div className="flex flex-wrap gap-1 px-3">
					{ALL_TAGS.map((tag) => (
						<button
							type="button"
							key={tag}
							onClick={() => onToggleTag(tag)}
							className={`px-2.5 py-1 font-label text-[10px] uppercase tracking-[0.1em] transition-colors rounded-sm ${
								filters.tags.includes(tag)
									? "bg-tertiary/10 text-tertiary"
									: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
							}`}
						>
							{tag}
							<span className="ml-1 opacity-40">
								{counts.tags[tag] ?? 0}
							</span>
						</button>
					))}
				</div>
			</SidebarSection>

			{/* Film Stocks */}
			<SidebarSection title="Film Stocks">
				<nav className="flex flex-col gap-0.5">
					<button
						type="button"
						onClick={() => onSetFilter("filmSimulation", null)}
						className={`flex items-center justify-between px-3 py-2 text-left transition-colors rounded-sm ${
							!filters.filmSimulation
								? "bg-surface-container-high text-on-surface font-medium border-l-2 border-tertiary"
								: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
						}`}
					>
						<span className="font-label text-[11px] uppercase tracking-widest">
							All Stocks
						</span>
					</button>
					{filmSimulations.map((sim) => (
						<button
							type="button"
							key={sim}
							onClick={() =>
								onSetFilter(
									"filmSimulation",
									filters.filmSimulation === sim ? null : sim,
								)
							}
							className={`flex items-center justify-between px-3 py-2 text-left transition-colors rounded-sm ${
								filters.filmSimulation === sim
									? "bg-surface-container-high text-on-surface font-medium border-l-2 border-tertiary"
									: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
							}`}
						>
							<span className="font-label text-[11px] uppercase tracking-widest truncate">
								{sim}
							</span>
							<span className="font-label text-[9px] text-on-surface-variant/40 ml-2">
								{counts.filmSimulations[sim] ?? 0}
							</span>
						</button>
					))}
				</nav>
			</SidebarSection>

			{/* Grain */}
			<SidebarSection title="Grain">
				<div className="flex flex-wrap gap-1 px-3">
					{GRAIN_OPTIONS.map((opt) => (
						<SidebarPill
							key={opt}
							label={opt}
							active={filters.grain === opt}
							count={counts.grain[opt]}
							onClick={() =>
								onSetFilter(
									"grain",
									filters.grain === opt ? null : opt,
								)
							}
						/>
					))}
				</div>
			</SidebarSection>

			{/* Dynamic Range */}
			<SidebarSection title="Dynamic Range">
				<div className="flex flex-wrap gap-1 px-3">
					{DR_OPTIONS.map((opt) => (
						<SidebarPill
							key={opt}
							label={opt}
							active={filters.dynamicRange === opt}
							count={counts.dynamicRange[opt]}
							onClick={() =>
								onSetFilter(
									"dynamicRange",
									filters.dynamicRange === opt ? null : opt,
								)
							}
						/>
					))}
				</div>
			</SidebarSection>

			{/* Color Chrome */}
			<SidebarSection title="Color Chrome">
				<div className="flex flex-wrap gap-1 px-3">
					{CC_OPTIONS.map((opt) => (
						<SidebarPill
							key={opt}
							label={opt}
							active={filters.colorChrome === opt}
							count={counts.colorChrome[opt]}
							onClick={() =>
								onSetFilter(
									"colorChrome",
									filters.colorChrome === opt ? null : opt,
								)
							}
						/>
					))}
				</div>
			</SidebarSection>

			{/* Active filters summary */}
			{activeFilterCount > 0 && (
				<div className="mt-auto pt-4 px-3">
					<button
						type="button"
						onClick={onClearAll}
						className="w-full font-label text-[10px] uppercase tracking-[0.15em] text-tertiary hover:text-on-surface transition-colors py-2"
					>
						Clear All Filters ({activeFilterCount})
					</button>
				</div>
			)}
		</aside>
	);
}
