import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface PropertyMapProps {
  lat: number;
  lng: number;
  name: string;
}

const MAPBOX_TOKEN = "pk.eyJ1IjoiZW5laWFzIiwiYSI6ImNpb211OGQ5NTAwNHV1aGx5bWlsNDMwdjUifQ.vvPqeh27QdR8fEcUfgePiA";

const PropertyMap = ({ lat, lng, name }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [lng, lat],
        zoom: 15,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add marker
      const markerEl = document.createElement("div");
      markerEl.className = "custom-marker";
      markerEl.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `;

      new mapboxgl.Marker(markerEl)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="font-semibold text-foreground">${name}</h3>`
          )
        )
        .addTo(map.current);
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [lat, lng, name]);

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-card">
      <div ref={mapContainer} className="h-[400px] w-full" />
    </div>
  );
};

export default PropertyMap;
