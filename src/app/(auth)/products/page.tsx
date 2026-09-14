"use client"
import TitlePage from "@/components/layout/title-page"
import { useState } from "react"
import ListProducts from "./components/list-products"
import ProductModal from "./components/product-modal"
import { DataTable } from "@/components/ui/data-table"
import { useProducts } from "@/hooks/products/use-products"
import { ProductsColumns } from "./components/products-columns"
import { Product } from "@/schemas/Product"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsPage() {
	const { data: products = [], isLoading } = useProducts()
	const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
		undefined,
	)

	if (isLoading) {
		return (
			<section>
				<div className="flex flex-col gap-1 items-center pt-16">
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
					<Skeleton className="h-6 w-[70%] rounded-md" />
				</div>
			</section>
		)
	}

	return (
		<section className="flex flex-col gap-7">
			<TitlePage
				title="Produtos"
				placeholder="Procure pelo nome"
				textTooltip="Adicionar produto"
			/>
			<div className="flex justify-center">
				{/* Desktop: tabela normal */}
				<div className="hidden md:block">
					<DataTable
						columns={ProductsColumns}
						data={products}
						onRowClick={(product) => setSelectedProduct(product)}
					/>
				</div>
				{/* Mobile: cards */}
				<div className="md:hidden">
					<ListProducts
						products={products}
						isLoading={isLoading}
						onClick={(product) => setSelectedProduct(product)}
					/>
				</div>
			</div>
			<ProductModal
				open={!!selectedProduct}
				onOpenChange={(v) => {
					if (!v) setSelectedProduct(undefined)
				}}
				product={selectedProduct}
			/>
		</section>
	)
}
