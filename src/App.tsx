import React, { useEffect, useRef, useState } from "react";
import L, { Control, map, Marker, popup } from "leaflet";
import Location from "./components/Location.tsx"
import store from "./store/index.ts"

export default function App() {
  const mapRef=useRef<HTMLDivElement>(null);
  //const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [mapReady,setMapReady] = useState(false);
  const map = useRef<L.Map>(null);

  useEffect(()=>{
    getTempData();
    if(mapRef.current){
      const _map=L.map(mapRef.current,{
        zoomControl:false,
        attributionControl:false
      }).setView([36,120],7);
      store.setMap(_map);
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
  
  const getTempData = async()=>{
    await fetch("/temp1.json");
  };

  return (
    <div className="relative">
      <div ref={mapRef} className="z-10 h-svh"></div>
      {mapReady && <Location /> }
    </div>
    
  );
}