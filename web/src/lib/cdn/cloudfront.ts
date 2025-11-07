import crypto from 'crypto'

function urlSafeBase64(b: Buffer | string) {
  const s = (typeof b === 'string' ? b : b.toString('base64')).replace(/\+/g, '-').replace(/=/g, '_').replace(/\//g, '~')
  return s
}

function getPrivateKey(): string | null {
  const pk = process.env.CLOUDFRONT_PRIVATE_KEY || ''
  if (!pk) return null
  // Support base64-encoded or raw PEM with \n
  if (pk.includes('BEGIN') || pk.includes('\n')) return pk.replace(/\\n/g, '\n')
  try {
    const decoded = Buffer.from(pk, 'base64').toString('utf8')
    return decoded
  } catch {
    return pk
  }
}

export function signCloudFrontUrl(params: { resourcePath: string; expiresInSec?: number }): string {
  const domain = process.env.CLOUDFRONT_DOMAIN
  const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID
  const priv = getPrivateKey()

  if (!domain || !keyPairId || !priv) {
    throw new Error('CloudFront signing not configured (CLOUDFRONT_DOMAIN, CLOUDFRONT_KEY_PAIR_ID, CLOUDFRONT_PRIVATE_KEY)')
  }

  const resourceUrl = `https://${domain}/${params.resourcePath.replace(/^\/+/, '')}`
  const expires = Math.floor(Date.now() / 1000) + (params.expiresInSec ?? 300)

  // Canned policy: {"Statement":[{"Resource":"<url>","Condition":{"DateLessThan":{"AWS:EpochTime":<expires>}}}]}
  const policy = JSON.stringify({
    Statement: [
      {
        Resource: resourceUrl,
        Condition: { DateLessThan: { 'AWS:EpochTime': expires } },
      },
    ],
  })

  const signer = crypto.createSign('RSA-SHA1')
  signer.update(policy)
  const signature = signer.sign(priv)

  const signedUrl = `${resourceUrl}?Expires=${expires}&Signature=${urlSafeBase64(signature)}&Key-Pair-Id=${encodeURIComponent(
    keyPairId,
  )}`
  return signedUrl
}
