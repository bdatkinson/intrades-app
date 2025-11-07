import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const region = process.env.AWS_REGION || 'us-east-1'
const bucket = process.env.S3_BUCKET as string

if (!bucket) {
  // Avoid throwing during import in build; runtime route will validate
  console.warn('S3_BUCKET env var is not set')
}

export const s3 = new S3Client({ region })

export async function signPutUrl(params: { key: string; contentType: string; expiresIn?: number }) {
  const { key, contentType, expiresIn = 300 } = params
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType })
  return getSignedUrl(s3, cmd, { expiresIn })
}

export async function signGetUrl(params: { key: string; expiresIn?: number }) {
  const { key, expiresIn = 300 } = params
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(s3, cmd, { expiresIn })
}
