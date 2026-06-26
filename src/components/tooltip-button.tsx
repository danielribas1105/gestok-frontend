"use client"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"

export function TooltipButton({
	label,
	icon: Icon,
	className,
	iconClassName,
	onClick,
	side = "bottom",
}: {
	label: string
	icon: React.ElementType
	className?: string
	iconClassName?: string
	onClick?: () => void
	side?: "bottom" | "right"
}) {
	const [visible, setVisible] = useState(false)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const handleMouseEnter = () => {
		timerRef.current = setTimeout(() => setVisible(true), 100)
	}

	const handleMouseLeave = () => {
		if (timerRef.current) clearTimeout(timerRef.current)
		setVisible(false)
	}

	return (
		<div
			className="relative"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<Button
				type="button"
				aria-label={label}
				onClick={onClick}
				className={`flex h-10 w-10 items-center justify-center rounded-full border border-app-border-alt bg-app-surface hover:bg-app-surface-hover transition-colors ${className ?? ""}`}
			>
				<Icon
					size={18}
					className={`${iconClassName ? iconClassName : "text-app-text-secondary"}`}
				/>
			</Button>

			{visible && (
				<div
					className={`absolute z-9999 animate-in fade-in duration-500 ${
						side === "right"
							? "left-[calc(100%+6px)] top-1/2 -translate-y-1/2"
							: "left-1/2 top-[calc(100%+6px)] -translate-x-1/2"
					}`}
				>
					<div
						className={`absolute h-2 w-2 rotate-45 border-app-border-alt bg-app-surface ${
							side === "right"
								? "-left-1 top-1/2 -translate-y-1/2 border-b border-l"
								: "-top-1 left-1/2 -translate-x-1/2 border-l border-t"
						}`}
					/>
					<div className="relative whitespace-nowrap rounded-md border border-app-border-alt bg-app-surface px-4 py-1.5 mt-1 text-xs font-medium text-app-text-secondary shadow-lg">
						{label}
					</div>
				</div>
			)}
		</div>
	)
}
