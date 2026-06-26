import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL =
	process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"

async function handler(
	request: NextRequest,
	{ params }: { params: Promise<{ path: string[] }> },
) {
	const { path } = await params
	const cookieStore = await cookies()
	const token = cookieStore.get("access_token")?.value

	const search = request.nextUrl.search // ex: "?page=2"
	const url = `${API_URL}/${path.join("/")}${search}`

	const hasBody = !["GET", "HEAD"].includes(request.method)
	const body = hasBody ? await request.text() : undefined

	const res = await fetch(url, {
		method: request.method,
		headers: {
			"Content-Type": request.headers.get("content-type") ?? "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body,
		cache: "no-store",
	})

	if (res.status === 204) {
		return new NextResponse(null, { status: 204 })
	}

	const data = await res.text()

	return new NextResponse(data, {
		status: res.status,
		headers: {
			"Content-Type": res.headers.get("content-type") ?? "application/json",
		},
	})
}

export {
	handler as GET,
	handler as POST,
	handler as PUT,
	handler as PATCH,
	handler as DELETE,
}
