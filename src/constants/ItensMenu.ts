import {
	ArrowLeftRight,
	CircleDollarSign,
	CirclePile,
	Construction,
	FileText,
	Home,
	ListCheck,
	LogOut,
	Truck,
	UserCircle2,
} from "lucide-react"

// Menu web application
export const itemsMenu = [
	{
		title: "Home",
		url: "/home",
		icon: Home,
	},
	{
		title: "Manifestos",
		url: "/statements",
		icon: ListCheck,
	},
	{
		title: "Movimentações",
		url: "/jobs",
		icon: ArrowLeftRight,
	},
	{
		title: "Obras",
		url: "/works",
		icon: Construction,
	},
	{
		title: "Materiais",
		url: "/materials",
		icon: CirclePile,
	},
	{
		title: "Veículos",
		url: "/cars",
		icon: Truck,
	},
	{
		title: "Usuários",
		url: "/users",
		icon: UserCircle2,
	},
	{
		title: "Pagamentos",
		url: "/payments",
		icon: CircleDollarSign,
	},
	{
		title: "Relatórios",
		url: "/reports",
		icon: FileText,
	},
]

// Menu landing page
export const menuLanding = [
	{
		title: "HOME",
		url: "/",
	},
	{
		title: "SOBRE NÓS",
		url: "/sobre-nos",
	},
	{
		title: "CONTATO",
		url: "/contato",
	},
]
