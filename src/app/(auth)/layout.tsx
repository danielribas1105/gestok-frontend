import { AppSidebar } from "@/components/ui/app-sidebar"
import PageLayout from "@/components/layout/page-layout"
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import AddJobButton from "@/components/add-job-btn"
import LogoutButton from "@/components/logout-button"
import AddStatementButton from "@/components/add-statment-btn"

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex justify-between items-center py-2 px-4">
					<SidebarTrigger className="text-primary/70" />
					<div className="flex items-center gap-2">
						<AddStatementButton />
						<AddJobButton />
						<LogoutButton />
					</div>
				</header>
				<PageLayout>{children}</PageLayout>
			</SidebarInset>
		</SidebarProvider>
	)
}
