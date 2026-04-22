import { Material } from "@/schemas/material"
import { useState } from "react"

export interface ProductCardProps {
	product: Material
}

export default function ProductCard({ product }: ProductCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="w-56 h-64 border-2 rounded-lg p-2 flex flex-col gap-2 cursor-pointer"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do produto ${product.name}`}
			>
				<div className="flex flex-col gap-1">
					<header>
						<h2>Produto {product.name}</h2>
					</header>
					<p>Tipo: {product.name}</p>
					<p>Valor: {product.value_m3}</p>
				</div>
			</article>
			{/* <JobModal open={open} onOpenChange={setOpen} job={job} /> */}
		</>
	)
}
