"use client"

import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts"

interface PieChartData {
	name: string
	value: number
	color: string
}

interface PieChartComponentProps {
	data: PieChartData[]
}

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
}: any) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5
	const x = cx + radius * Math.cos(-midAngle * RADIAN)
	const y = cy + radius * Math.sin(-midAngle * RADIAN)

	return (
		<>
			{percent > 0 ? (
				<text
					x={x}
					y={y}
					fill="white"
					textAnchor="middle"
					dominantBaseline="central"
					fontSize="14px"
				>
					{`${(percent * 100).toFixed(0)}%`}
				</text>
			) : (
				""
			)}
		</>
	)
}

export default function PieChartComponent({ data }: PieChartComponentProps) {
	return (
		<ResponsiveContainer width="100%" height="100%">
			<PieChart>
				<Pie
					data={data}
					cx="50%"
					cy="50%"
					labelLine={false}
					label={renderCustomizedLabel}
					outerRadius="90%"
					dataKey="value"
				>
					{data.map((d, index) => (
						<Cell key={`cell-${index}`} fill={d.color} />
					))}
				</Pie>
			</PieChart>
		</ResponsiveContainer>
	)
}
