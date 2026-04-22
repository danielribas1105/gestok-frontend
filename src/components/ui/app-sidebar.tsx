"use client"
import Image from "next/image"
import Link from "next/link"
import { User } from "lucide-react"

import logo from "@/../public/logo/logo-gestok.png"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar"
import { itemsMenu } from "@/constants/ItensMenu"
import Footer from "../layout/footer"

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="group-data-[collapsible=icon]:hidden">
				<div className="flex flex-col items-center py-6">
					<Image
						src={logo}
						alt={"Logo GestOk"}
						width={200}
						height={200}
						loading="eager"
						priority
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{itemsMenu.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon color="#EF7017" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href="/profile">
										<User color="#EF7017" />
										<span>Meu Perfil</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="group-data-[collapsible=icon]:hidden pt-4">
					<Footer />
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
