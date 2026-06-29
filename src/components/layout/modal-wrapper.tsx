"use client"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

interface ModalWrapperProps {
	open: boolean
	onOpenChange: (v: boolean) => void
	title: string
	description?: string
	width?: string
	maxHeight?: string
	children: ReactNode
}

export default function ModalWrapper({
	open,
	onOpenChange,
	title,
	description,
	width,
	maxHeight = "90vh",
	children,
}: ModalWrapperProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				style={{ width, maxWidth: "92vw", maxHeight }}
				className="flex flex-col gap-0 p-0"
			>
				<DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
					{children}
				</div>
			</DialogContent>
		</Dialog>
	)
}
