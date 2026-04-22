import { Code, Coffee, Heart } from "lucide-react"

export default function Footer() {
	return (
		<footer className="flex flex-col text-sm">
			<div className="flex items-center gap-1">
				<p>Desenvolvido com</p>
				<Heart size={20} color="#ff0000" />
				<p>e</p>
				<Coffee size={22} color="#b5842a" />
			</div>
			<div className="flex items-center gap-1">
				<p>por</p>
				<Code size={22} color="#5e17eb" />
				<p>DRCode</p>
			</div>
			<p className="text-sm mt-1">@2026 - Todos os direitos reservados</p>
		</footer>
	)
}
