import { expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Uploader from './uploader'

const file = new File([new Uint8Array([1,2,3])], 'photo.jpg', { type: 'image/jpeg' })

beforeEach(() => {
  vi.restoreAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

test('proxy upload flow posts to /api/uploads/put and signs GET', async () => {
  const user = userEvent.setup()
  const fetchMock = vi.spyOn(global as unknown as { fetch: typeof fetch }, 'fetch')
    // First call: proxy POST
    .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    // Second call: sign GET
    .mockResolvedValueOnce(new Response(JSON.stringify({ url: 'https://cdn.example.com/uploads/challenges/42/123-photo.jpg' }), { status: 200, headers: { 'content-type': 'application/json' } }))

  render(<Uploader accept="image/*" challengeId={42} uploadMode="proxy" />)

  const el = screen.getByLabelText(/upload file/i) as HTMLInputElement

  await user.upload(el, file)

  // Ensure proxy upload called
  expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/api\/uploads\/put\?/), expect.objectContaining({ method: 'POST' }))
  // Ensure sign GET called
  expect(fetchMock).toHaveBeenCalledWith('/api/uploads/sign', expect.any(Object))

  // Shows key label after done
  await screen.findByText(/Key:/)
})

test('presigned PUT flow signs PUT then uploads, then signs GET', async () => {
  const user = userEvent.setup()
  const fetchMock = vi.spyOn(global as unknown as { fetch: typeof fetch }, 'fetch')
    // First: sign PUT
    .mockResolvedValueOnce(new Response(JSON.stringify({ url: 'https://s3.example.com/presigned-put' }), { status: 200, headers: { 'content-type': 'application/json' } }))
    // Second: actual PUT to S3
    .mockResolvedValueOnce(new Response('', { status: 200 }))
    // Third: sign GET
    .mockResolvedValueOnce(new Response(JSON.stringify({ url: 'https://cdn.example.com/uploads/challenges/42/123-photo.jpg' }), { status: 200, headers: { 'content-type': 'application/json' } }))

  render(<Uploader accept="image/*" challengeId={42} uploadMode="presigned" />)

  const el = screen.getByLabelText(/upload file/i) as HTMLInputElement
  await user.upload(el, file)

  // First call is to sign PUT
  expect(fetchMock.mock.calls[0][0]).toEqual('/api/uploads/sign')
  // Second call uses the URL returned for PUT
  expect(fetchMock.mock.calls[1][0]).toEqual('https://s3.example.com/presigned-put')
  // Third call is sign GET
  expect(fetchMock.mock.calls[2][0]).toEqual('/api/uploads/sign')
})
