'use client'

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

type LoaderCompat = {
  importLibrary?: (name: 'maps' | string) => Promise<unknown>
  load?: () => Promise<unknown>
}

export default function MapPage(){
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!key) return

    const loader = new Loader({ apiKey: key, version: 'weekly' }) as unknown as LoaderCompat

    let cancelled = false
    const ensureMaps = async () => {
      if (typeof loader.importLibrary === 'function') {
        await loader.importLibrary('maps')
      } else if (typeof loader.load === 'function') {
        await loader.load()
      }
      if (cancelled || !ref.current) return
      new google.maps.Map(ref.current, {
        center: { lat: 39.5, lng: -98.35 },
        zoom: 4,
        disableDefaultUI: false,
      })
    }
    ensureMaps()

    return () => { cancelled = true }
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Map</h1>
      <p className="mt-2 text-foreground/70">Find opportunities and challenges near you.</p>
      <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded border border-[var(--brand-border)] bg-[color:var(--brand-muted)]/30">
        <div ref={ref} className="h-full w-full" />
      </div>
      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <p className="mt-3 text-sm text-foreground/70">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to display the map.</p>
      )}
    </main>
  )
}
