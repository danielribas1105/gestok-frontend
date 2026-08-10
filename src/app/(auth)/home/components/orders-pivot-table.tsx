import { useState } from "react"
import { useOrdersPivot } from "@/hooks/orders/use-orders-pivot"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	RefreshCw,
	Package,
	DollarSign,
	Clock,
	Filter,
	Download,
} from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import UploadOrders from "./upload-orders"

export function OrdersPivotTable() {
	const [page, setPage] = useState(1)
	const [pageSize] = useState(20)
	const [search, setSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [typeFilter, setTypeFilter] = useState<string>("all")

	const [openUploadOrders, setOpenUploadOrders] = useState(false)

	const {
		pivotedData,
		allProducts,
		pagination,
		isLoading,
		isError,
		error,
		refreshOrders,
		getSummary,
	} = useOrdersPivot(page, pageSize, search)

	const summary = getSummary()

	// Apply filters
	const filteredData = pivotedData.filter((order) => {
		if (statusFilter !== "all" && order.status !== statusFilter) return false
		if (typeFilter !== "all" && order.order_type !== typeFilter) return false
		return true
	})

	// Export to CSV
	const exportToCSV = () => {
		if (filteredData.length === 0) return

		// Headers
		const headers = [
			"Código Pedido",
			"Data",
			"Cliente",
			"Código Cliente",
			"Tipo",
			"Status",
			"Usuário",
			...allProducts.map((p) => `${p.name} (${p.code})`),
			"Total Valor",
		]

		// Rows
		const rows = filteredData.map((order) => [
			order.cod_order,
			order.order_date_formatted,
			order.client_name,
			order.client_code,
			order.order_type_label,
			order.status_label,
			order.user_name,
			...allProducts.map((p) => order.products[p.id]?.quantity || 0),
			order.total_value.toFixed(2),
		])

		// Generate CSV
		const csvContent = [
			headers.join(","),
			...rows.map((row) => row.join(",")),
		].join("\n")

		// Download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
		const link = document.createElement("a")
		const url = URL.createObjectURL(blob)
		link.setAttribute("href", url)
		link.setAttribute("download", `pedidos_${new Date().toISOString()}.csv`)
		link.style.visibility = "hidden"
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-10">
				<RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
				<p className="ml-2 text-muted-foreground">
					Carregando {isLoading ? "produtos" : "pedidos"}...
				</p>
			</div>
		)
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center py-10 gap-4">
				<p className="text-destructive">Erro ao carregar pedidos</p>
				<p className="text-sm text-muted-foreground">{error?.message}</p>
				<Button onClick={() => refreshOrders()}>
					<RefreshCw className="mr-2 h-4 w-4" />
					Tentar novamente
				</Button>
			</div>
		)
	}

	if (allProducts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-10 gap-4">
				<Package className="h-16 w-16 text-muted-foreground" />
				<p className="text-muted-foreground">
					Nenhum produto cadastrado no sistema
				</p>
				<p className="text-sm text-muted-foreground">
					Cadastre produtos antes de visualizar pedidos
				</p>
			</div>
		)
	}

	return (
		<>
			<div className="space-y-6">
				{/* Summary Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Total de Pedidos
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{summary.totalOrders}</div>
							<p className="text-xs text-muted-foreground mt-1">
								{summary.totalItems} itens no total
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Valor Total</CardTitle>
							<DollarSign className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								R${" "}
								{summary.totalValue.toLocaleString("pt-BR", {
									minimumFractionDigits: 2,
								})}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Todos os pedidos
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Pendentes</CardTitle>
							<Clock className="h-4 w-4 text-yellow-600" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-yellow-600">
								{summary.pendingOrders}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Aguardando processamento
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Produtos Cadastrados
							</CardTitle>
							<Package className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{allProducts.length}</div>
							<p className="text-xs text-muted-foreground mt-1">
								Produtos ativos
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Filters and Table */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							Pedidos por Produto (Matriz Completa)
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Todas as colunas de produtos estão sempre visíveis, mesmo que não
							estejam presentes no pedido
						</p>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col md:flex-row gap-4 mb-4">
							<div className="flex-1">
								<Input
									placeholder="Buscar por código do pedido..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="w-full"
								/>
							</div>

							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-45">
									<Filter className="mr-2 h-4 w-4" />
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos os status</SelectItem>
									<SelectItem value="PENDENTE">Pendente</SelectItem>
									<SelectItem value="PROCESSADO">Processado</SelectItem>
									<SelectItem value="CANCELADO">Cancelado</SelectItem>
								</SelectContent>
							</Select>

							<Select value={typeFilter} onValueChange={setTypeFilter}>
								<SelectTrigger className="w-45">
									<Filter className="mr-2 h-4 w-4" />
									<SelectValue placeholder="Tipo" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos os tipos</SelectItem>
									<SelectItem value="VENDA">Venda</SelectItem>
									<SelectItem value="DEGUSTACAO">Degustação</SelectItem>
									<SelectItem value="BONIFICACAO">Bonificação</SelectItem>
								</SelectContent>
							</Select>

							<Button
								variant="outline"
								onClick={exportToCSV}
								className="w-full md:w-auto"
								disabled={filteredData.length === 0}
							>
								<Download className="mr-2 h-4 w-4" />
								Exportar CSV
							</Button>

							{/* onClick={refreshOrders} */}
							<Button
								variant="outline"
								onClick={() => setOpenUploadOrders(true)}
								className="w-full md:w-auto"
							>
								<RefreshCw className="mr-2 h-4 w-4" />
								Atualizar
							</Button>
						</div>

						<div className="text-sm text-muted-foreground mb-4">
							Mostrando {filteredData.length} pedidos × {allProducts.length}{" "}
							produtos = {filteredData.length * allProducts.length} células
						</div>

						{/* Tabela com scroll horizontal */}
						<ScrollArea className="w-full whitespace-nowrap rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										{/* Colunas fixas */}
										<TableHead className="sticky left-0 z-20 bg-background border-r min-w-25">
											Pedido
										</TableHead>
										<TableHead className="min-w-25">Data</TableHead>
										<TableHead className="min-w-50">Cliente</TableHead>
										{/* Total */}
										<TableHead className="text-right min-w-30 border-l bg-muted/50 sticky right-0 z-20">
											Total
										</TableHead>
										<TableHead className="min-w-20">Tipo</TableHead>
										<TableHead className="min-w-25">Status</TableHead>
										<TableHead className="min-w-30">Usuário</TableHead>

										{/* Colunas dinâmicas - TODOS os produtos */}
										{allProducts.map((product, index) => (
											<TableHead
												key={product.id}
												className={`text-center min-w-25 ${
													index % 2 === 0 ? "bg-muted/30" : ""
												}`}
											>
												<div className="flex flex-col">
													<span className="font-semibold text-xs">
														{product.name}
													</span>
													<span className="text-[10px] text-muted-foreground">
														{product.code}
													</span>
												</div>
											</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredData.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={6 + allProducts.length + 1}
												className="text-center py-10"
											>
												<p className="text-muted-foreground">
													Nenhum pedido encontrado
												</p>
											</TableCell>
										</TableRow>
									) : (
										filteredData.map((order) => (
											<TableRow
												key={order.order_id}
												className="hover:bg-muted/50"
											>
												{/* Colunas fixas */}
												<TableCell className="sticky left-0 z-10 bg-background border-r font-medium">
													{order.cod_order}
												</TableCell>

												<TableCell className="text-sm">
													{order.order_date_formatted}
												</TableCell>

												<TableCell>
													<div className="flex flex-col">
														<span className="font-medium text-sm">
															{order.client_name}
														</span>
														<span className="text-xs text-muted-foreground">
															{order.client_code}
														</span>
													</div>
												</TableCell>

												<TableCell>
													<Badge
														variant={
															order.order_type === "VENDA"
																? "default"
																: "secondary"
														}
													>
														{order.order_type_label}
													</Badge>
												</TableCell>

												<TableCell>
													<Badge
														variant={
															order.status === "PROCESSADO"
																? "default"
																: order.status === "PENDENTE"
																	? "outline"
																	: "destructive"
														}
													>
														{order.status_label}
													</Badge>
												</TableCell>

												<TableCell className="text-sm">
													{order.user_name}
												</TableCell>

												{/* Colunas dinâmicas - TODOS os produtos */}
												{allProducts.map((product, index) => {
													const productData = order.products[product.id]
													return (
														<TableCell
															key={product.id}
															className={`text-center ${index % 2 === 0 ? "bg-muted/20" : ""} ${
																productData
																	? "font-semibold"
																	: "text-muted-foreground"
															}`}
														>
															{productData ? (
																<div className="flex flex-col items-center">
																	<span className="text-base">
																		{productData.quantity}
																	</span>
																	<span className="text-[10px] text-muted-foreground">
																		{product.unit}
																	</span>
																</div>
															) : (
																<span className="text-xs">-</span>
															)}
														</TableCell>
													)
												})}

												{/* Total */}
												<TableCell className="text-right font-bold border-l bg-muted/30 sticky right-0 z-10">
													<div className="flex flex-col items-end">
														<span className="text-sm">
															R${" "}
															{order.total_value.toLocaleString("pt-BR", {
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															})}
														</span>
														<span className="text-xs text-muted-foreground">
															{order.total_items} itens
														</span>
													</div>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
							<ScrollBar orientation="horizontal" />
						</ScrollArea>

						{/* Pagination */}
						{pagination.totalPages > 1 && (
							<div className="flex items-center justify-between mt-4">
								<p className="text-sm text-muted-foreground">
									Página {pagination.page} de {pagination.totalPages}
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page === 1}
									>
										Anterior
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setPage((p) => Math.min(pagination.totalPages, p + 1))
										}
										disabled={page === pagination.totalPages}
									>
										Próxima
									</Button>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<UploadOrders
				open={openUploadOrders}
				onClose={() => setOpenUploadOrders(false)}
				onSuccess={refreshOrders}
			/>
		</>
	)
}
