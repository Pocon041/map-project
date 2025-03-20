import React, { useEffect, useRef, useState } from "react";
import L, { Marker, popup } from "leaflet";
export default function App() {
  const mapRef=useRef<HTMLDivElement>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

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

      L.control.zoom({position:'bottomright'}).addTo(map);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "",
        }
      ).addTo(map);
      
      var popup = L.popup();
      
      function onMapClick(e:any){
        popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
        setLatLng(e.latlng); // 更新经纬度状态
        //L.marker(e.latlng).addTo(map);
      }

      // 创建自定义控件
      const latLngControl = L.control.zoom({ position: 'bottomright' });

      latLngControl.onAdd = function () {
        const div = L.DomUtil.create('div', 'lat-lng-control');
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
        div.style.borderRadius = '5px';
        div.innerHTML = latLng ? `经度: ${latLng.lng.toFixed(4)}<br />纬度: ${latLng.lat.toFixed(4)}` : '点击地图获取经纬度';
        return div;
      };

      latLngControl.addTo(map);

      map.on('click', onMapClick);
    }
  },[]);
  
  
  return <div ref={mapRef} style={{height:"100vh"}}></div>;
}