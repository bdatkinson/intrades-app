import { NextRequest, NextResponse } from 'next/server'
import { signPutUrl, signGetUrl } from '@/lib/s3/signer'
import { signCloudFrontUrl } from '@/lib/cdn/cloudfront'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const method = String(body.method || '').toUpperCase()
    const key = String(body.key || '')
    const contentType = body.contentType ? String(body.contentType) : undefined

    if (!process.env.S3_BUCKET) {
      return NextResponse.json({ error: 'Server not configured: S3_BUCKET missing' }, { status: 500 })
    }

    if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })
    if (method === 'PUT') {
      if (!contentType) return NextResponse.json({ error: 'Missing contentType' }, { status: 400 })
      // TODO: authn/authz + key prefix validation
      const url = await signPutUrl({ key, contentType })
      return NextResponse.json({ url })
    }
    if (method === 'GET') {
      // Prefer CloudFront signed URL when configured; fallback to S3 presign
      try {
        const url = signCloudFrontUrl({ resourcePath: key })
        return NextResponse.json({ url })
      } catch {
        const url = await signGetUrl({ key })
        return NextResponse.json({ url })
      }
    }
    return NextResponse.json({ error: 'Unsupported method' }, { status: 400 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
