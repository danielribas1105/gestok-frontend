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
				className="h-56 border-2 rounded-lg p-3 flex flex-col justify-between gap-2 cursor-pointer hover:border-primary transition-colors"
				onClick={() => setOpen(true)}
				onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
				role="button"
				tabIndex={0}
				aria-label={`Ver detalhes do produto ${product.name}`}
			>
				<header className="flex gap-3 items-center">
					<div className="relative w-24 h-24 flex justify-center overflow-hidden">
						<Image
							src={product.image ?? avatar}
							alt={`Foto do produto ${product.name}`}
							fill
							className="object-cover rounded-full"
						/>
					</div>
					<div className="flex flex-2/3 flex-col">
						<h2 className="text-lg text-secondary-foreground font-semibold">
							{product.name?.toUpperCase()}
						</h2>
						<span className="flex gap-2 text-sm">
							<p className="text-muted-foreground">Código:</p>
							<p
								className={`${product.code ? "text-muted-foreground" : "text-red-500"}`}
							>
								{product.code ?? "Não cadastrado"}
							</p>
						</span>
					</div>
				</header>
				<div className="flex flex-col gap-1">
					<div className="flex gap-10">
						<LabelCard
							description="Unidade de medida"
							label="Unidade"
							value={product.unit ?? "-"}
						/>
						<LabelCard
							description="Quantidade de caixas por pallet"
							label="Caixas por pallet"
							value={product.boxes_per_pallet ?? "-"}
						/>
					</div>
					<div className="flex gap-10">
						<LabelCard
							description="Peso bruto do produto"
							label="Peso (Kg)"
							value={product.kg_per_unit ?? "-"}
						/>
						<LabelCard
							description="Volume unitário"
							label="Volume (m³)"
							value={product.volume_m3_per_unit ?? "-"}
						/>
					</div>
				</div>
				<footer className="flex items-center justify-between gap-10">
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
