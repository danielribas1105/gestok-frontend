import {
	Contact,
	Cookie,
	FileText,
	IdCard,
	Logs,
	Store,
	UserPen,
	Van,
	Warehouse,
} from "lucide-react"

// Menu web application
export const itemsMenu = [
	{
		title: "Pedidos",
		url: "/home",
		icon: Logs,
	},
	{
		title: "Estoque",
		url: "/inventory",
		icon: Warehouse,
	},
	{
		title: "Produtos",
		url: "/products",
		icon: Cookie,
	},
	{
		title: "Clientes",
		url: "/clients",
		icon: Store,
	},
	{
		title: "Veículos",
		url: "/cars",
		icon: Van,
	},
	{
		title: "Vendedores",
		url: "/cars",
		icon: Contact,
	},
	{
		title: "Motoristas",
		url: "/drivers",
		icon: IdCard,
	},
	{
		title: "Usuários",
		url: "/users",
		icon: UserPen,
	},
	{
		title: "Relatórios",
		url: "/reports",
		icon: FileText,
	},
]
