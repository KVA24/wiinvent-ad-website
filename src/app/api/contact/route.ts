import { NextResponse } from 'next/server'
import { contactSchema } from '@/lib/contact-schema'

const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

// ponytail: in-memory rate limit, per-instance only. Move to Redis if the
// site ever runs more than one container.
function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      errors[String(issue.path[0])] = issue.message
    }
    return NextResponse.json({ ok: false, errors }, { status: 400 })
  }

  // --- replace this block when the real destination is chosen ---
  console.info('[contact]', JSON.stringify(parsed.data))
  // --- end ---

  return NextResponse.json({ ok: true })
}
