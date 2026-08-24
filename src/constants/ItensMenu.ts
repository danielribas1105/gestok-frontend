import {
	Contact,
	Cookie,
	FileText,
	IdCard,
	Logs,
	PackageCheck,
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
		title: "Entregas",
		url: "/delivery",
		icon: PackageCheck,
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
		title: "Comercial",
		url: "/salesperson",
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
