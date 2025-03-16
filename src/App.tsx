import React, { useEffect, useRef } from "react";
import L from "leaflet";
export default function App() {
  const mapRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(mapRef.current){
      const map=L.map(mapRef.current,{
        zoomControl:false,
        attributionControl:false
      }).setView([36,120],7);
      L.control
        .scale({
          imperial:false,
          position:"bottomright",
        })
        .addTo(map);

      L.control.zoom({position:'bottomright'}).addTo(map),

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