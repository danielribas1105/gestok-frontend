import { Info } from "lucide-react"
import Image from "next/image"
import { Work } from "@/schemas/work"
import { useState } from "react"
import WorkModal from "./work-modal"

export interface WorkCardProps {
	work: Work
}

export default function WorkCard({ work }: WorkCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2 cursor-pointer"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes da obra ${work.name}`}
			>
				<div className="relative w-full h-36 flex justify-center overflow-hidden">
					<Image
						src={work.image ?? "/no-image.jpg"}
						alt={`Foto da obra ${work.name}`}
						fill
						className="object-cover rounded-lg"
					/>
				</div>
				<header>
					<h2>{work.name}</h2>
				</header>
				<dl>
					<dt className="sr-only">Código</dt>
					<dd>Código: {work.id}</dd>
				</dl>
				<footer className="flex items-center gap-1">
					<Info
						size={16}
						color={work.active ? "#00FF00" : "#FF0000"}
						aria-hidden="true"
					/>
					<span className="text-sm uppercase">
						{work.active ? "Ativo" : "Inativo"}
					</span>
				</footer>
			</article>
			<WorkModal open={open} onOpenChange={setOpen} work={work} />
		</>
	)
}
