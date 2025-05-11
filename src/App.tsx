import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import * as d3 from "d3";
window.d3 = d3;
import "./assets/leaflet.canvaslayer.field.js";
import Location from "./components/Location";
import CanvasRender from "./components/canvas";
import store from "./store";
import Timeline from "./components/TimeLine";
import Resource from "./components/Resource";
const MapData: MapDataType[] = [
  {
    name: "温度",
    time: "4-19",
    url: "/temp1.json",
    unit: "℃",
  },
  {
    name: "盐度",
    time: "4-20",
    url: "/temp2.json",
    unit: "mg/ml",
  },
  {
    name: "叶绿素",
    time: "4-21",
    url: "/temp2.json",
    unit: "mol/ml",
  },
  {
    name: "温度2",
    time: "4-22",
    url: "/temp1.json",
    unit: "℃",
  },
  {
    name: "盐度2",
    time: "4-23",
    url: "/temp2.json",
    unit: "mg/ml",
  },
  {
    name: "叶绿素2",
    time: "4-24",
    url: "/temp2.json",
    unit: "mol/ml",
  },
];
export interface MapDataType {
  name: string;
  url: string;
  unit: string;
  time: string;
}
const Default_Time_Index = 0;

export default function App() {
  // const currentDataKey: string = "温度";
  const [currentTimeIndex, setCurrentTimeIndex] = useState(Default_Time_Index);
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

      setMapReady(true);

      L.control
        .scale({
          imperial: false,
          position: "bottomright",
        })
        .addTo(_map);
      L.control.zoom({ position: "bottomright" }).addTo(_map);
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "",
        }
      ).addTo(_map);

      return () => {
        _map.remove();
      };
    }
  }, []);

  return (
    <div className="relative">
      <div ref={mapRef} className="z-10 h-svh"></div>
      {mapReady && (
        <>
          <Location />
          <CanvasRender mapData={currentMapData} />
        </>
      )}
      <Timeline
        defalutIndex={Default_Time_Index}
        data={MapData}
        updateIndex={setCurrentTimeIndex}
      ></Timeline>
      <Resource
        defalutIndex={Default_Time_Index}
        source={MapData}
        update={setCurrentTimeIndex}
      />
    </div>
  );
}
