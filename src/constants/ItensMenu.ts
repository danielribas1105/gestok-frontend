import {
	ArrowLeftRight,
	CircleDollarSign,
	CirclePile,
	Construction,
	Cookie,
	FileText,
	Home,
	IdCard,
	ListCheck,
	LogOut,
	Logs,
	Truck,
	User,
	UserCircle2,
	UserStar,
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
		icon: UserStar,
	},
	{
		title: "Veículos",
		url: "/cars",
		icon: Van,
	},
	{
		title: "Motoristas",
		url: "/drivers",
		icon: IdCard,
	},
	{
		title: "Usuários",
		url: "/users",
		icon: UserCircle2,
	},
	{
		title: "Relatórios",
		url: "/reports",
		icon: FileText,
	},
]
