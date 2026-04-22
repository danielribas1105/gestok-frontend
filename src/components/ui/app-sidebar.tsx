"use client"
import Image from "next/image"
import Link from "next/link"
import { User } from "lucide-react"

import logo from "@/../public/logo/logo-gestobra-512x512.png"
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
} from "@/components/ui/sidebar"
import { itemsMenu } from "@/constants/ItensMenu"
import Footer from "../layout/footer"

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader className="group-data-[collapsible=icon]:hidden">
				<div className="flex flex-col items-center">
					<Image
						src={logo}
						alt={"Logo GestObra"}
						width={150}
						height={150}
						loading="eager"
						priority
					/>
					<h3 className="font-logo font-bold text-3xl text-logo-blue-dark">
						GestObra
					</h3>
					<p className="text-sm text-center text-logo-blue-dark/60">
						Plataforma de gestão de obras e transporte de entulho
					</p>
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
											<item.icon color="#51a41e" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/profile">
								<User color="#51a41e" />
								<span>Meu Perfil</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<div className="group-data-[collapsible=icon]:hidden">
					<Footer />
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
