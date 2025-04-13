import React, { useEffect, useRef, useState } from "react";
import L, { Control, imageOverlay, map, Marker, popup } from "leaflet";
import Location from "./components/Location.tsx";
import store from "./store/index.ts";
import * as d3 from "d3";
window.d3 = d3;
import CanvasOverlay from "./components/canvas.tsx";
import "./assets/leaflet.canvaslayer.field.js";

const MapData = [
  {
    name:'温度',
    url: '/temp1.json',
    unit: '℃'
  },
  {
    name:'盐度',
    url: '/temp2.json',
    unit: 'mg/ml'
  },
  {
    name:'叶绿素',
    url: '/temp3.json',
    unit: 'mol/ml'
  },
];
export interface MapDataType {
  name: string;
  url: string;
  unit: string;
}

export default function App() {
  const currentDataKey: string = "温度";
  const currentMapData = MapData.find(el => el.name === currentDataKey)!;
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
      {mapReady && (
        <>
          <Location />
          <CanvasOverlay mapData={currentMapData}/>
        </>
      ) }
    </div>
  );
}
