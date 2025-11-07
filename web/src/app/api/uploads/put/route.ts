import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const region = process.env.AWS_REGION || 'us-east-1'
const bucket = process.env.S3_BUCKET
const s3 = new S3Client({ region })

export async function POST(req: NextRequest) {
  if (!bucket) return NextResponse.json({ error: 'S3_BUCKET not configured' }, { status: 500 })

  // Query string key=?contentType=?
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key') || undefined
  const contentTypeQS = searchParams.get('contentType') || undefined

  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })

  // Read entire body (sufficient for moderate sizes). For very large files, switch to streaming/multipart.
  const bodyArrayBuffer = await req.arrayBuffer()
  const body = Buffer.from(bodyArrayBuffer)

  // Prefer explicit contentType if present; otherwise fall back to request header
  const contentType = contentTypeQS || req.headers.get('content-type') || 'application/octet-stream'

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )

  return NextResponse.json({ ok: true, key })
}
