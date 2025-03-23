import React, { useEffect, useRef, useState } from "react";
import L, { Control, map, Marker, popup } from "leaflet";
import Location from "./components/Location.tsx"
import store from "./store/index.ts"

export default function App() {
  const mapRef=useRef<HTMLDivElement>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [mapReady,setMapReady] = useState(false);
  const map = useRef<L.Map>(null);

  useEffect(()=>{
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
      
      const attributionControl = L.control
      .attribution({
        position:"bottomright",
        prefix:"陈中浩 | 移动鼠标以获得坐标"
      })
      .addTo(_map);

      L.control.zoom({position:'bottomright'}).addTo(_map);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "",
        }
      ).addTo(_map);
      
      
      //const latLngControl = createLatLngControl();
      //latLngControl.addTo(map);
      function onMapMove(e:any){
        setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng }); // 更新经纬度状态
        attributionControl.setPrefix(`陈中浩 | 经度: ${e.latlng.lng.toFixed(4)} , 纬度: ${e.latlng.lat.toFixed(4)}`);
      }

      _map.on('mousemove', onMapMove);

      return() =>{
        _map.off('mousemove',onMapMove);
        _map.remove();
      }
    }
  },[]);
  

  return (
    <div className="relative">
      <div ref={mapRef} className="z-10 h-svh"></div>
      {mapReady && <Location /> }
    </div>
    
  );
}