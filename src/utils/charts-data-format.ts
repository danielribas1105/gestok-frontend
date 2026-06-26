interface ChartData {
	name: string
	value: number
	color: string
}

export function ToChartData<T extends Record<string, number>>(
	obj: T,
	colorMap: Record<string, string>,
): ChartData[] {
	return Object.entries(obj).map(([name, value]) => ({
		name,
		value,
		color: colorMap[name] ?? "#94A3B8", // fallback gray
	}))
}
