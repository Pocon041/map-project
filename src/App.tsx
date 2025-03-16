import React, { useEffect, useRef } from "react";
import L from "leaflet";
export default function App() {
  const mapRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(mapRef.current){
      const map=L.map(mapRef.current).setView([36,120],7);
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "",
        }
      ).addTo(map);
    }
  },[]);
  return <div ref={mapRef} style={{height:"100vh"}}></div>;
}