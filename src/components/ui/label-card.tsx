import { Skeleton } from "./skeleton"

interface LabelCardProps {
	description: string
	label: string
	value: string | number | undefined
	position?: string
	isLoading?: boolean
}

export default function LabelCard({
	description,
	label,
	value,
	position,
	isLoading,
}: LabelCardProps) {
	return (
		<dl>
			<dt className="sr-only">{description}</dt>
			<dd className={`flex gap-2 items-center ${position}`}>
				<p className="font-semibold text-muted-foreground">{label}:</p>
				{isLoading ? (
					<Skeleton className="h-6 w-full rounded-md" />
				) : (
					<p className="font-semibold">{value}</p>
				)}
			</dd>
		</dl>
	)
}
