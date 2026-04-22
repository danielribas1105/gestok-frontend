import { useMaterials } from "@/hooks/materials/use-materials"
import { Material } from "@/schemas/material"
import ProductCard from "./product-card"

export default function ListProducts() {
	const { data: materials = [], isLoading } = useMaterials()

	if (isLoading) return <p>Carregando...</p>

	if (materials.length === 0) {
		return <div>Nenhum produto encontrado!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
			{materials &&
				materials.map((material: Material) => (
					<ProductCard key={material.id} product={material} />
				))}
		</div>
	)
}
