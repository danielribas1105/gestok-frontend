import * as React from "react"

import { Input } from "./input"

interface InputFormProps extends React.ComponentProps<"input"> {
	label: string
	widthLabel?: boolean
	error?: string
}

export default function InputForm({
	label,
	widthLabel,
	error,
	...props
}: InputFormProps) {
	return (
		<div className="flex items-center gap-2">
			<span className={`font-bold ${widthLabel ? "w-22.5" : ""}`}>{label}</span>
			<div className="flex flex-col flex-1 gap-1">
				<Input aria-invalid={!!error} {...props} />
				{error && <span className="text-xs text-destructive">{error}</span>}
			</div>
		</div>
	)
}
