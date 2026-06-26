import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import QueryProvider from "@/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
	title: "GestOk",
	description: "Web Application",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="pt-BR" className={cn("font-sans", inter.variable)}>
			<body className="bg-background text-foreground antialiased">
				<QueryProvider>
					<TooltipProvider>{children}</TooltipProvider>
					<Toaster />
				</QueryProvider>
			</body>
		</html>
	)
}
