import { useState } from "react";
import {
	ALL_TAGS,
	CC_OPTIONS,
	DR_OPTIONS,
	GRAIN_OPTIONS,
} from "../../data/filterHelpers";
import type { FilterCounts } from "../../data/filterHelpers";
import type { RecipeFilters } from "../../data/types";

interface FilterBarProps {
	filters: RecipeFilters;
	counts: FilterCounts;
	filmSimulations: string[];
	onSetFilter: (key: keyof RecipeFilters, value: string | string[] | null) => void;
	onToggleTag: (tag: string) => void;
	onClearAll: () => void;
	activeFilterCount: number;
}

function PillToggle({
	label,
	active,
	count,
	onClick,
	variant = "default",
}: {
	label: string;
	active: boolean;
	count?: number;
	onClick: () => void;
	variant?: "default" | "tag";
}) {
	const baseClass =
		"shrink-0 px-3 py-2.5 font-label text-[10px] uppercase tracking-[0.15em] transition-colors rounded-sm";
	const activeClass =
		variant === "tag"
			? "bg-tertiary/10 text-tertiary"
			: "bg-inverse-surface text-inverse-on-surface";
	const inactiveClass = "text-on-surface-variant hover:text-on-surface";

	return (
		<button
			type="button"
			onClick={onClick}
			className={`${baseClass} ${active ? activeClass : inactiveClass}`}
		>
			{label}
			{count !== undefined && (
				<span className="ml-1 opacity-40">{count}</span>
			)}
		</button>
	);
}

function FilterSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="py-3">
			<p className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant/50 mb-2">
				{title}
			</p>
			<div className="flex flex-wrap gap-1">{children}</div>
		</div>
	);
}

export function FilterBar({
	filters,
	counts,
	filmSimulations,
	onSetFilter,
	onToggleTag,
	onClearAll,
	activeFilterCount,
}: FilterBarProps) {
	const [expanded, setExpanded] = useState(false);
	const technicalFilterCount =
		activeFilterCount - filters.tags.length;

	return (
		<div className="lg:hidden mb-4">
			{/* Tag pills — primary discovery row */}
			<div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none">
				{ALL_TAGS.map((tag) => (
					<PillToggle
						key={tag}
						label={tag}
						active={filters.tags.includes(tag)}
						count={counts.tags[tag]}
						onClick={() => onToggleTag(tag)}
						variant="tag"
					/>
				))}
			</div>

			{/* Expand trigger */}
			<button
				type="button"
				onClick={() => setExpanded(!expanded)}
				className="flex items-center gap-2 font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant hover:text-on-surface transition-colors py-2 min-h-11"
			>
				<span>Filters</span>
				{technicalFilterCount > 0 && (
					<span className="bg-tertiary text-on-error px-1.5 py-0.5 rounded-sm text-[9px]">
						{technicalFilterCount}
					</span>
				)}
				<span className="text-[8px]">{expanded ? "▲" : "▼"}</span>
			</button>

			{/* Expandable filter panel */}
			{expanded && (
				<div className="bg-surface-container-low/80 backdrop-blur-[20px] rounded-sm p-4 mb-4">
					{/* Film simulation */}
					<FilterSection title="Film Stock">
						<PillToggle
							label="All"
							active={!filters.filmSimulation}
							onClick={() => onSetFilter("filmSimulation", null)}
						/>
						<div className="flex gap-1 overflow-x-auto scrollbar-none w-full">
							{filmSimulations.map((sim) => (
								<PillToggle
									key={sim}
									label={sim}
									active={filters.filmSimulation === sim}
									count={counts.filmSimulations[sim]}
									onClick={() =>
										onSetFilter(
											"filmSimulation",
											filters.filmSimulation === sim
												? null
												: sim,
										)
									}
								/>
							))}
						</div>
					</FilterSection>

					{/* Grain */}
					<FilterSection title="Grain">
						{GRAIN_OPTIONS.map((opt) => (
							<PillToggle
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
					</FilterSection>

					{/* Dynamic Range */}
					<FilterSection title="Dynamic Range">
						{DR_OPTIONS.map((opt) => (
							<PillToggle
								key={opt}
								label={opt.replace("DR", "DR ")}
								active={filters.dynamicRange === opt}
								count={counts.dynamicRange[opt]}
								onClick={() =>
									onSetFilter(
										"dynamicRange",
										filters.dynamicRange === opt
											? null
											: opt,
									)
								}
							/>
						))}
					</FilterSection>

					{/* Color Chrome */}
					<FilterSection title="Color Chrome">
						{CC_OPTIONS.map((opt) => (
							<PillToggle
								key={opt}
								label={opt}
								active={filters.colorChrome === opt}
								count={counts.colorChrome[opt]}
								onClick={() =>
									onSetFilter(
										"colorChrome",
										filters.colorChrome === opt
											? null
											: opt,
									)
								}
							/>
						))}
					</FilterSection>

					{activeFilterCount > 0 && (
						<button
							type="button"
							onClick={onClearAll}
							className="font-label text-[10px] uppercase tracking-[0.15em] text-tertiary hover:text-on-surface transition-colors mt-2"
						>
							Clear All Filters
						</button>
					)}
				</div>
			)}
		</div>
	);
}
