import { useState } from "react"
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
	ShoppingCart,
	DollarSign,
	Clock,
	ArrowUpDown,
	Filter,
} from "lucide-react"
import { useOrders } from "@/hooks/orders/use-orders"

export function OrdersTable() {
	const [page, setPage] = useState(1)
	const [pageSize] = useState(20)
	const [search, setSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [typeFilter, setTypeFilter] = useState<string>("all")

	const {
		rows,
		pagination,
		isLoading,
		isError,
		error,
		refreshOrders,
		getSummary,
	} = useOrders(page, pageSize, search)

	const summary = getSummary()

	// Apply filters
	const filteredRows = rows.filter((row) => {
		if (statusFilter !== "all" && row.status !== statusFilter) return false
		if (typeFilter !== "all" && row.order_type !== typeFilter) return false
		return true
	})

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-10">
				<RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
				<p className="ml-2 text-muted-foreground">Carregando pedidos...</p>
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

	//console.log("orders", rows)

	return (
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
						<CardTitle className="text-sm font-medium">Processados</CardTitle>
						<ShoppingCart className="h-4 w-4 text-green-600" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600">
							{summary.processedOrders}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							{summary.canceledOrders} cancelados
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Filters and Search */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Pedidos e Itens</CardTitle>
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
								<ArrowUpDown className="mr-2 h-4 w-4" />
								<SelectValue placeholder="Tipo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos os tipos</SelectItem>
								<SelectItem value="ENTRADA">Entrada</SelectItem>
								<SelectItem value="SAIDA">Saída</SelectItem>
							</SelectContent>
						</Select>

						<Button
							variant="outline"
							onClick={refreshOrders}
							className="w-full md:w-auto"
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Atualizar
						</Button>
					</div>

					<div className="text-sm text-muted-foreground mb-4">
						Mostrando {filteredRows.length} de {pagination.totalRows} itens (
						{pagination.total} pedidos)
					</div>

					{/* Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-25">Pedido</TableHead>
									<TableHead>Data</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead>Produto</TableHead>
									<TableHead className="text-right">Qtd</TableHead>
									<TableHead className="text-right">Valor Unit.</TableHead>
									<TableHead className="text-right">Total Item</TableHead>
									<TableHead>Cliente</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Usuário</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredRows.length === 0 ? (
									<TableRow>
										<TableCell colSpan={10} className="text-center py-10">
											<p className="text-muted-foreground">
												Nenhum item encontrado
											</p>
										</TableCell>
									</TableRow>
								) : (
									filteredRows.map((row) => (
										<TableRow key={row.item_id} className="hover:bg-muted/50">
											<TableCell>
												<div className="flex flex-col">
													<span className="font-medium text-sm">
														{row.cod_order}
													</span>
													{/* {row.total_order_items > 1 && (
														<Badge variant="outline" className="w-fit text-xs mt-1">
															{row.total_order_items} itens
														</Badge>
													)} */}
												</div>
											</TableCell>

											<TableCell className="text-sm whitespace-nowrap">
												{row.order_date_formatted}
											</TableCell>

											<TableCell>
												<Badge
													variant={
														row.order_type === "VENDA" ? "default" : "secondary"
													}
												>
													{row.order_type_label}
												</Badge>
											</TableCell>

											<TableCell>
												<div className="flex flex-col max-w-50">
													<span
														className="font-medium text-sm truncate"
														title={row.product_name}
													>
														{row.product_name}
													</span>
													<span className="text-xs text-muted-foreground">
														Cód: {row.product_code}
													</span>
												</div>
											</TableCell>

											<TableCell className="text-right">
												<div className="flex flex-col items-end">
													<span className="font-medium">
														{row.quantity.toLocaleString("pt-BR")}
													</span>
													<span className="text-xs text-muted-foreground">
														{row.product_unit}
													</span>
												</div>
											</TableCell>

											<TableCell className="text-right text-sm">
												R${" "}
												{row.unit_value.toLocaleString("pt-BR", {
													minimumFractionDigits: 2,
												})}
											</TableCell>

											<TableCell className="text-right font-medium">
												R${" "}
												{row.item_total_value.toLocaleString("pt-BR", {
													minimumFractionDigits: 2,
												})}
											</TableCell>

											<TableCell>
												<div className="flex flex-col max-w-50">
													<span
														className="font-medium text-sm truncate"
														title={row.client_name}
													>
														{row.client_name}
													</span>
													<span className="text-xs text-muted-foreground">
														{row.client_code}
													</span>
												</div>
											</TableCell>

											<TableCell>
												<Badge
													variant={
														row.status === "PROCESSADO"
															? "default"
															: row.status === "PENDENTE"
																? "outline"
																: "destructive"
													}
												>
													{row.status_label}
												</Badge>
											</TableCell>

											<TableCell className="text-sm">
												<div className="flex flex-col">
													<span>{row.user_name}</span>
													{/* <span className="text-xs text-muted-foreground">{row.user_email}</span> */}
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

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
	)
}
