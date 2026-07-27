import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface SummaryCardProps {
	title: string
	children: React.ReactNode
	icon: LucideIcon
}

export default function SummaryCard({
	title,
	children,
	icon: Icon,
}: SummaryCardProps) {
	return (
		<Card className="w-full">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	)
}
