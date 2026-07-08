import Image from "next/image"
import avatar from "@/../public/no-image.jpg"
import { Product } from "@/schemas/Product"
import { useState } from "react"
import ProductModal from "./product-modal"
import { Badge } from "@/components/ui/badge"
import LabelCard from "@/components/ui/label-card"
import { formatDate } from "@/utils/format-date"

export interface ProductCardProps {
	product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<>
			<article
				className="h-64 border-2 rounded-lg p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do produto ${product.description}`}
			>
				<header className="flex gap-3 items-center">
					<div className="relative w-24 h-24 flex justify-center overflow-hidden">
						<Image
							src={product.image ?? avatar}
							alt={`Foto do produto ${product.description}`}
							fill
							className="object-cover rounded-full"
						/>
					</div>
					<div className="flex flex-2/3 flex-col">
						<h2 className="text-xl text-secondary-foreground font-semibold">
							{product.description}
						</h2>
						<p className="text-sm text-muted-foreground">{product.code}</p>
					</div>
				</header>
				<div className="flex flex-col gap-2">
					<LabelCard
						description="Unidade de referência"
						label="Unidade"
						value={product.unit ?? ""}
					/>
					<LabelCard
						description="Valor do produto"
						label="Valor"
						value={product.value ?? ""}
					/>
				</div>
				<footer className="flex items-center gap-10">
					<LabelCard
						description="Data de cadastro do produto"
						label="Cadastro"
						value={formatDate(product.created_at ?? "")}
					/>
					<Badge variant={product.active ? "default" : "destructive"}>
						{product.active ? "ATIVO" : "INATIVO"}
					</Badge>
				</footer>
			</article>
			<ProductModal open={open} onOpenChange={setOpen} product={product} />
		</>
	)
}
