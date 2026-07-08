import { useProducts } from "@/hooks/products/use-products"
import ProductCard from "./product-card"
import { Product } from "@/schemas/Product"

export default function ListProducts() {
	const { data: products = [], isLoading } = useProducts()

	if (isLoading) return <p>Carregando...</p>

	if (products.length === 0) {
		return <div>Nenhum produto encontrado!</div>
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
			{products &&
				products.map((product: Product) => (
					<ProductCard key={product.id} product={product} />
				))}
		</div>
	)
}
