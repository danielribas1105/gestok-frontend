import { Code, Coffee, Heart } from "lucide-react"

export default function Footer() {
	return (
		<footer className="flex flex-col text-[12px]">
			<div className="flex items-center gap-1">
				<p>Developed with</p>
				<Heart size={20} color="#ff0000" />
				<p>and</p>
				<Coffee size={22} color="#b5842a" />
			</div>
			<div className="flex items-center gap-1">
				<Code size={22} color="#5e17eb" />
				<p>DRCode - Developer</p>
			</div>
			<p className="text-[12px] mt-1">@2026 - All rights reserved</p>
		</footer>
	)
}
