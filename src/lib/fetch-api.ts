import { headers } from 'next/headers'

export type ApiResponse<T> = {
  data: T
}

function getBaseUrl() {
  const headerList = headers()
  const host = headerList.get('x-forwarded-host') ?? headerList.get('host')
  const protocol = headerList.get('x-forwarded-proto') ?? 'http'
  if (host) return `${protocol}://${host}`
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'
}

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`API request failed: ${path} (${res.status})`)
  }

  const json = (await res.json()) as ApiResponse<T>
  return json.data
}
