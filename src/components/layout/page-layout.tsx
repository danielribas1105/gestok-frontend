import React from "react"

interface PageLayoutProps {
	className?: string
	children: React.ReactNode
}

export default function PageLayout({ className, children }: PageLayoutProps) {
	return (
		<main className={`${className ?? ""} w-full py-2 px-4`}>{children}</main>
	)
}
