import { Skeleton } from "@/components/ui/skeleton"

export default function CardsSkeleton() {
	return (
		<div className="rounded-xl border p-5 flex flex-col gap-3">
			<Skeleton className="h-5 w-2/3" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-5/6" />
			<Skeleton className="h-4 w-4/6" />
			<div className="flex gap-2 mt-2">
				<Skeleton className="h-6 w-16 rounded-full" />
				<Skeleton className="h-6 w-20 rounded-full" />
			</div>
		</div>
	)
}
