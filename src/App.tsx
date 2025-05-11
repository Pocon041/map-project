// App.tsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import * as d3 from "d3";
window.d3 = d3;
import "./assets/leaflet.canvaslayer.field.js";
import Location from "./components/Location.tsx";
import store from "./store/index.ts";
import MapCanvas from "./components/canvas.tsx";
import SwitchPanel from "./components/SwitchPanel.tsx"; // 引入 SwitchPanel 组件
import Timeline from "./components/TimeLine.tsx";

const MapData: MapDataType[] = [
  {
    name: "温度",
    time: '4-19',
    url: "/temp1.json",
    unit: "°C",
  },
  {
    name: "盐度",
    time: '4-20',
    url: "temp2.json",
    unit: "mg/ml",
  },
  {
    name: "叶绿素",
    time: '4-21',
    url: "temp3.json",
    unit: "mg/ml",
  },
  {
    name: "温度",
    time: '4-22',
    url: "/temp1.json",
    unit: "°C",
  },
  {
    name: "盐度",
    time: '4-23',
    url: "temp2.json",
    unit: "mg/ml",
  },
  {
    name: "叶绿素",
    time: '4-24',
    url: "temp3.json",
    unit: "mg/ml",
  },
];

export interface MapDataType {
  name: string;
  time: string;
  url: string;
  unit: string;
}

const Default_Time_Index = 0;

export default function App() {
  const [currentTimeIndex, setCurrentTimeindex] = useState(Default_Time_Index);
  const currentMapData = MapData[currentTimeIndex];
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapRef.current) {
      const _map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([36, 120], 5);

      store.setMap(_map);
      setMapReady(true); // 确保此处正确设置 mapReady 为 true
      console.log("Map initialized and mapReady set to true"); // 调试输出

      L.control.scale({ imperial: false, position: "bottomright" }).addTo(_map);
      L.control.zoom({ position: "bottomright" }).addTo(_map);

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "" }
      ).addTo(_map);

      return () => {
        _map.remove();
      };
    }
  }, []);

  console.log("MapData:", MapData); // 调试输出 MapData
  console.log("mapReady:", mapReady); // 调试输出 mapReady 状态

  return (
    <div className="relative h-screen w-screen"> {/* 确保根容器有 relative 定位 */}
      <div ref={mapRef} className="z-10 h-svh"></div>
      {mapReady && <Location />}
      {mapReady && <MapCanvas mapData={currentMapData} />}
      <Timeline
        defaultIndex={Default_Time_Index}
        data={MapData}
        updateIndex={setCurrentTimeindex}
      />
      {mapReady && (
        <SwitchPanel
          data={MapData}
          updateIndex={setCurrentTimeindex}
          currentIndex={currentTimeIndex}
        />
      )}
    </div>
  );
}

function e1(value: { name: string; url: string; uint: string; unit?: undefined; } | { name: string; url: string; unit: string; uint?: undefined; }, index: number, obj: ({ name: string; url: string; uint: string; unit?: undefined; } | { name: string; url: string; unit: string; uint?: undefined; })[]): value is { name: string; url: string; uint: string; unit?: undefined; } | { name: string; url: string; unit: string; uint?: undefined; } {
  throw new Error("Function not implemented.");
}