import { CAPACITY_LABELS } from "@/constants/Cars"
import { cn } from "@/lib/utils"

type CapacityUnit = "m3" | "boxes" | "kg" | "pallets"

interface CapacityBarProps {
	label: string
	unit: CapacityUnit
	value: number
	capacity?: number
}

export default function CapacityBar({
	label,
	unit,
	value,
	capacity,
}: CapacityBarProps) {
	const isApplicable = capacity !== undefined && capacity > 0

	const ratio = isApplicable ? value / capacity : 0

	const level = !isApplicable
		? "not-applicable"
		: ratio > 1
			? "over"
			: ratio >= 0.9
				? "warning"
				: "ok"

	const formattedValue = value.toLocaleString("pt-BR", {
		maximumFractionDigits: 2,
	})

	const formattedCapacity = capacity?.toLocaleString("pt-BR", {
		maximumFractionDigits: 2,
	})

	const unitLabel = CAPACITY_LABELS[unit]

	return (
		<div className="flex min-w-0 flex-col gap-1">
			<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
				<span className="truncate">
					{isApplicable
						? `${formattedValue} ${unitLabel} / ${formattedCapacity} ${unitLabel}`
						: `${label} — Não aplicável`}
				</span>

				<span
					className={cn(
						"shrink-0",
						level === "over" && "font-medium text-red-600",
						level === "warning" && "font-medium text-amber-600",
						level === "ok" && "font-medium text-green-600",
						level === "not-applicable" && "text-muted-foreground",
					)}
				>
					{level === "over"
						? "Excedente"
						: level === "warning"
							? "Limite"
							: level === "ok"
								? "OK"
								: "NA"}
				</span>
			</div>

			<div className="h-2 overflow-hidden rounded-full bg-gray-100">
				<div
					className={cn(
						"h-full rounded-full transition-all",
						level === "over" && "bg-red-500",
						level === "warning" && "bg-amber-500",
						level === "ok" && "bg-green-500",
						level === "not-applicable" && "bg-gray-200",
					)}
					style={{
						width: isApplicable ? `${Math.min(ratio * 100, 100)}%` : "0%",
					}}
				/>
			</div>
		</div>
	)
}
