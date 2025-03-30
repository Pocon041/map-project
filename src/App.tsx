import React, { useEffect, useRef, useState } from "react";
import L, { Control, imageOverlay, map, Marker, popup } from "leaflet";
import Location from "./components/Location.tsx"
import store from "./store/index.ts"
import CanvasOverlay from "./components/canvas.tsx";

export default function App() {
  const mapRef=useRef<HTMLDivElement>(null);
  const [mapReady,setMapReady] = useState(false);
  
  useEffect(()=>{
    if(mapRef.current){
      const _map=L.map(mapRef.current,{
        zoomControl:false,
        attributionControl:false
      }).setView([36,120],5);
      store.setMap(_map);
      //renderCanvas(_map);
      setMapReady(true);

      L.control
        .scale({
          imperial:false,
          position:"bottomright",
        })
        .addTo(_map);

      L.control.zoom({position:'bottomright'}).addTo(_map);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "",
        }
      ).addTo(_map);
      
      return() =>{
        _map.remove();
      }
    }
  },[]);
  
  return (
    <div className="relative">
      <div ref={mapRef} className="z-10 h-svh"></div>
      {mapReady && <Location /> }
      {mapReady && <CanvasOverlay/>}
    </div>
    
  );
}
