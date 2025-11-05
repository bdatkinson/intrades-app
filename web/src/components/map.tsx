"use client";

import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

type Props = { lat?: number; lng?: number; zoom?: number; height?: number };

export default function Map({ lat = 37.7749, lng = -122.4194, zoom = 10, height = 300 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;
    const loader = new Loader({ apiKey: key, version: "weekly" });
    let map: google.maps.Map | undefined;
    loader
      .load()
      .then(() => {
        if (!ref.current) return;
        map = new google.maps.Map(ref.current, {
          center: { lat, lng },
          zoom,
        });
        new google.maps.Marker({ position: { lat, lng }, map });
      })
      .catch((e) => console.error(e));
    return () => {
      map = undefined;
    };
  }, [lat, lng, zoom]);

  return (
    <div>
      <div ref={ref} style={{ height, width: "100%" }} className="rounded border" />
    </div>
  );
}
