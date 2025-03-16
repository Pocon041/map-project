import React, { useEffect, useRef } from "react";
import L from "leaflet";
export default function App() {
  const mapRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(mapRef.current){
      const map=L.map(mapRef.current).setView([36,120],7);
      L.tileLayer("https://tile.openstreetmap.de/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)
    }
  },[]);
  return <div ref={mapRef} style={{height:"100vh"}}></div>;
}