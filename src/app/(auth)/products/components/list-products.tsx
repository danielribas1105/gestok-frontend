import { Product } from "@/schemas/Product"
import ProductCard from "./product-card"

interface ListProductsProps {
	products: Product[]
	isLoading: boolean
	onClick?: (product: Product) => void
}

export default function ListProducts({
	products,
	isLoading,
	onClick,
}: ListProductsProps) {
	if (isLoading) return <p>Carregando...</p>

	if (products.length === 0) {
		return <div>Nenhum produto encontrado!</div>
	}
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
			{products.map((product: Product) => (
				<ProductCard key={product.id} product={product} onClick={onClick} />
			))}
		</div>
	)
}
