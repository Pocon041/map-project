import React, { useEffect, useRef, useState } from "react";
import L, { Control, Marker, popup } from "leaflet";
export default function App() {
  const mapRef=useRef<HTMLDivElement>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);

  const createLatLngControl = (): Control => {
    const latLngControl = L.Control.extend({
      options: {
        position: "bottomright",
      },
      onAdd: function () {
        const div = L.DomUtil.create("div", "lat-lng-control");
        div.style.padding = "5px";
        div.style.borderRadius = "5px";
        div.innerHTML = latLng
          ? `(陈中浩)经度: ${latLng.lng.toFixed(4)} , 纬度: ${latLng.lat.toFixed(4)}`
          : "移动鼠标获取经纬度";
        return div;
      },
    });
    return new latLngControl();
  };

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
      
      const attributionControl = L.control
      .attribution({
        position:"bottomright",
        prefix:"陈中浩 | 移动鼠标以获得坐标"
      })
      .addTo(map);

      L.control.zoom({position:'bottomright'}).addTo(map);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "",
        }
      ).addTo(map);
      
      
      //const latLngControl = createLatLngControl();
      //latLngControl.addTo(map);
      function onMapMove(e:any){
        setLatLng({ lat: e.latlng.lat, lng: e.latlng.lng }); // 更新经纬度状态
        //L.marker(e.latlng).addTo(map);
        //latLngControl.getContainer().innerHTML = `(陈中浩)经度: ${e.latlng.lng.toFixed(4)} , 纬度: ${e.latlng.lat.toFixed(4)}`;
        attributionControl.setPrefix(`陈中浩 | 经度: ${e.latlng.lng.toFixed(4)} , 纬度: ${e.latlng.lat.toFixed(4)}`);
      }

      map.on('mousemove', onMapMove);

      return() =>{
        map.off('mousemove',onMapMove);
        map.remove();
      }
    }
  },[]);
  

    
  
  return <div ref={mapRef} style={{height:"100vh"}}></div>;
}