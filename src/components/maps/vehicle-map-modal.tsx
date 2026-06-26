"use client"
import { useEffect, useRef, useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// ─── Tipos ───────────────────────────────────────────────────────────────────

type VehicleStatus = "moving" | "stopped" | "offline"

interface Vehicle {
	id: string
	plate: string
	driver: string
	status: VehicleStatus
	lat: number
	lng: number
	speed: number // km/h
	lastUpdate: string
}

// ─── Dados mockados ───────────────────────────────────────────────────────────

const MOCK_VEHICLES: Vehicle[] = [
	{
		id: "v1",
		plate: "ABC-1234",
		driver: "Carlos Silva",
		status: "moving",
		lat: -23.5505,
		lng: -46.6333,
		speed: 62,
		lastUpdate: "há 1 min",
	},
	{
		id: "v2",
		plate: "DEF-5678",
		driver: "Fernanda Lima",
		status: "stopped",
		lat: -23.5615,
		lng: -46.656,
		speed: 0,
		lastUpdate: "há 3 min",
	},
	{
		id: "v3",
		plate: "GHI-9012",
		driver: "Roberto Costa",
		status: "moving",
		lat: -23.543,
		lng: -46.62,
		speed: 48,
		lastUpdate: "há 2 min",
	},
	{
		id: "v4",
		plate: "JKL-3456",
		driver: "Marcos Rocha",
		status: "offline",
		lat: -23.57,
		lng: -46.645,
		speed: 0,
		lastUpdate: "há 22 min",
	},
	{
		id: "v5",
		plate: "MNO-7890",
		driver: "Patrícia Nunes",
		status: "moving",
		lat: -23.548,
		lng: -46.648,
		speed: 35,
		lastUpdate: "há 1 min",
	},
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
	VehicleStatus,
	{ label: string; color: string; markerColor: string }
> = {
	moving: { label: "Em movimento", color: "#51a41e", markerColor: "#51a41e" },
	stopped: { label: "Parado", color: "#f59e0b", markerColor: "#f59e0b" },
	offline: { label: "Offline", color: "#6b7280", markerColor: "#6b7280" },
}

// ─── Componente do Mapa (renderizado via HTML embutido em iframe) ──────────────

function LeafletMap({
	vehicles,
	selectedId,
	onSelect,
}: {
	vehicles: Vehicle[]
	selectedId: string | null
	onSelect: (id: string) => void
}) {
	const iframeRef = useRef<HTMLIFrameElement>(null)

	// Serializa os veículos para passar ao iframe via postMessage
	useEffect(() => {
		const iframe = iframeRef.current
		if (!iframe) return

		const send = () => {
			iframe.contentWindow?.postMessage(
				{ type: "INIT", vehicles, selectedId },
				"*",
			)
		}

		iframe.addEventListener("load", send)
		return () => iframe.removeEventListener("load", send)
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	// Atualiza seleção sem recarregar o iframe
	useEffect(() => {
		iframeRef.current?.contentWindow?.postMessage(
			{ type: "SELECT", selectedId },
			"*",
		)
	}, [selectedId])

	// Recebe clique no marcador vindo do iframe
	useEffect(() => {
		const handler = (e: MessageEvent) => {
			if (e.data?.type === "MARKER_CLICK") onSelect(e.data.id)
		}
		window.addEventListener("message", handler)
		return () => window.removeEventListener("message", handler)
	}, [onSelect])

	const html = buildMapHtml(vehicles)

	return (
		<iframe
			ref={iframeRef}
			srcDoc={html}
			className="w-full h-full border-0 rounded-lg"
			title="Mapa de veículos"
			sandbox="allow-scripts allow-same-origin"
		/>
	)
}

function buildMapHtml(vehicles: Vehicle[]): string {
	const center = {
		lat: vehicles.reduce((s, v) => s + v.lat, 0) / vehicles.length,
		lng: vehicles.reduce((s, v) => s + v.lng, 0) / vehicles.length,
	}

	const vehiclesJson = JSON.stringify(vehicles)
	const statusJson = JSON.stringify(STATUS_CONFIG)

	return /* html */ `<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8"/>
			<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
			<style>
				* { margin: 0; padding: 0; box-sizing: border-box; }
				html, body, #map { width: 100%; height: 100%; }
				.custom-marker { width: 32px; height: 32px; }
			</style>
		</head>
		<body>
			<div id="map"></div>
			<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
			<script>
				const vehicles = ${vehiclesJson};
				const STATUS   = ${statusJson};
				let selectedId = null;
				const markers  = {};

				const map = L.map('map', { zoomControl: true }).setView([${center.lat}, ${center.lng}], 13);

				L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: '© OpenStreetMap contributors'
				}).addTo(map);

				function svgIcon(color, selected) {
					const ring  = selected ? \`<circle cx="16" cy="16" r="15" fill="none" stroke="\${color}" stroke-width="2.5" stroke-dasharray="4 2" opacity="0.8"/>\` : '';
					return L.divIcon({
						className: '',
						iconSize: [32, 40],
						iconAnchor: [16, 40],
						popupAnchor: [0, -40],
						html: \`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
							\${ring}
							<ellipse cx="16" cy="38" rx="6" ry="2" fill="rgba(0,0,0,0.2)"/>
							<path d="M16 2C9.4 2 4 7.4 4 14c0 9 12 24 12 24s12-15 12-24C28 7.4 22.6 2 16 2z" fill="\${color}" stroke="white" stroke-width="1.5"/>
							<circle cx="16" cy="14" r="5" fill="white" opacity="0.9"/>
							<circle cx="16" cy="14" r="3" fill="\${color}"/>
						</svg>\`
					});
				}

				vehicles.forEach(v => {
					const cfg = STATUS[v.status];
					const marker = L.marker([v.lat, v.lng], { icon: svgIcon(cfg.markerColor, false) })
						.addTo(map)
						.on('click', () => {
							window.parent.postMessage({ type: 'MARKER_CLICK', id: v.id }, '*');
						});
					markers[v.id] = { marker, color: cfg.markerColor };
				});

				window.addEventListener('message', e => {
					if (e.data?.type === 'INIT') {
					// already rendered
					}
					if (e.data?.type === 'SELECT') {
						const prev = selectedId;
						selectedId = e.data.selectedId;
						if (prev && markers[prev]) {
							markers[prev].marker.setIcon(svgIcon(markers[prev].color, false));
						}
						if (selectedId && markers[selectedId]) {
							markers[selectedId].marker.setIcon(svgIcon(markers[selectedId].color, true));
							const v = vehicles.find(x => x.id === selectedId);
							if (v) map.setView([v.lat, v.lng], 15, { animate: true });
						}
					}
				});
			</script>
		</body>
	</html>`
}

// ─── Sidebar de veículos ──────────────────────────────────────────────────────

function VehicleList({
	vehicles,
	selectedId,
	onSelect,
}: {
	vehicles: Vehicle[]
	selectedId: string | null
	onSelect: (id: string) => void
}) {
	return (
		<div className="flex flex-col gap-1 overflow-y-auto pr-1">
			{vehicles.map((v) => {
				const cfg = STATUS_CONFIG[v.status]
				const isSelected = v.id === selectedId

				return (
					<button
						key={v.id}
						onClick={() => onSelect(v.id)}
						className={[
							"w-full text-left rounded-lg px-3 py-2.5 transition-all border",
							isSelected
								? "bg-[#51a41e]/10 border-[#51a41e]/50 shadow-sm"
								: "bg-card border-border hover:bg-muted/50",
						].join(" ")}
					>
						<div className="flex items-center justify-between gap-2 mb-1">
							<span className="font-mono text-sm font-semibold tracking-wide">
								{v.plate}
							</span>
							<Badge
								variant="outline"
								className="text-[10px] px-1.5 py-0 font-medium"
								style={{
									color: cfg.color,
									borderColor: cfg.color + "55",
									background: cfg.color + "15",
								}}
							>
								{cfg.label}
							</Badge>
						</div>
						<p className="text-xs text-muted-foreground truncate">{v.driver}</p>
						<div className="flex items-center gap-2 mt-1">
							{v.status === "moving" && (
								<span className="text-xs text-muted-foreground">
									{v.speed} km/h
								</span>
							)}
							<span className="text-xs text-muted-foreground ml-auto">
								{v.lastUpdate}
							</span>
						</div>
					</button>
				)
			})}
		</div>
	)
}

// ─── Modal principal ──────────────────────────────────────────────────────────

interface VehicleMapModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export default function VehicleMapModal({
	open,
	onOpenChange,
}: VehicleMapModalProps) {
	const [selectedId, setSelectedId] = useState<string | null>(null)

	const moving = MOCK_VEHICLES.filter((v) => v.status === "moving").length
	const stopped = MOCK_VEHICLES.filter((v) => v.status === "stopped").length
	const offline = MOCK_VEHICLES.filter((v) => v.status === "offline").length

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="p-0 gap-0 overflow-hidden"
				style={{
					width: "80vw",
					maxWidth: "92vw",
					height: "90vh",
				}}
			>
				{/* Header */}
				<DialogHeader className="px-5 py-3 border-b shrink-0">
					<div className="flex items-center gap-4">
						<DialogTitle className="text-base font-semibold">
							Localização dos Veículos
						</DialogTitle>
						<div className="flex items-center gap-2">
							<span className="flex items-center gap-1 text-xs text-muted-foreground">
								<span className="inline-block w-2 h-2 rounded-full bg-[#51a41e]" />
								{moving} em movimento
							</span>
							<span className="flex items-center gap-1 text-xs text-muted-foreground">
								<span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
								{stopped} parado{stopped !== 1 ? "s" : ""}
							</span>
							<span className="flex items-center gap-1 text-xs text-muted-foreground">
								<span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
								{offline} offline
							</span>
						</div>
					</div>
				</DialogHeader>

				{/* Body */}
				<div className="flex flex-1 overflow-hidden min-h-0">
					{/* Sidebar */}
					<div className="w-56 shrink-0 border-r p-2 overflow-hidden flex flex-col gap-2">
						<p className="text-xs font-medium text-muted-foreground px-1 shrink-0">
							{MOCK_VEHICLES.length} veículos
						</p>
						<VehicleList
							vehicles={MOCK_VEHICLES}
							selectedId={selectedId}
							onSelect={(id) =>
								setSelectedId((prev) => (prev === id ? null : id))
							}
						/>
					</div>

					{/* Mapa */}
					<div className="flex-1 overflow-hidden p-2">
						<LeafletMap
							vehicles={MOCK_VEHICLES}
							selectedId={selectedId}
							onSelect={(id) =>
								setSelectedId((prev) => (prev === id ? null : id))
							}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
