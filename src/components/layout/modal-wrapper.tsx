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
	children: ReactNode
}

export default function ModalWrapper({
	open,
	onOpenChange,
	title,
	description,
	children,
}: ModalWrapperProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}
