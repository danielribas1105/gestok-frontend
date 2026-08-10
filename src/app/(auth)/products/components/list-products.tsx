import { useProducts } from "@/hooks/products/use-products"
import ProductCard from "./product-card"
import { Product } from "@/schemas/Product"

export default function ListProducts() {
	const { data: products = [], isLoading } = useProducts()

	if (isLoading) return <p>Carregando...</p>

	if (products.length === 0) {
		return <div>Nenhum produto encontrado!</div>
	}

	console.log("products", products)
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full gap-4">
			{products.map((product: Product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	)
}
