// App.tsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
window.d3 = d3;
import Location from "./components/Location.tsx";
// import store from "./store/index.ts";
import MapCanvas from "./components/MapCanvas.tsx";
import Timeline from "./components/Timeline.tsx";
import SwitchPanel from "./components/SwitchPanel.tsx"; // 引入 SwitchPanel 组件
import * as Cesium from "cesium";
// store/index.ts
import { Viewer } from "cesium";
import HeatmapLayer from "./components/HeatmapLayer.tsx";

let map: Viewer | null = null;

const store = {
  setMap(viewer: Viewer) {
    map = viewer;
  },
  getMap(): Viewer | null {
    return map;
  },
};

export { store };

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
    url: "/temp2.json",
    unit: "mg/ml",
  },
  {
    name: "叶绿素",
    time: '4-21',
    url: "/temp3.json",
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
    url: "/temp2.json",
    unit: "mg/ml",
  },
  {
    name: "叶绿素",
    time: '4-24',
    url: "/temp3.json",
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
      (async () => {
        // 配置Cesium ion访问令牌（如果需要）
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YjMzMjk4Ni0wYjA0LTQ2ZjctYmVkYi05MjQzZmMxNmJkNzAiLCJpZCI6MzAxNDAzLCJpYXQiOjE3NDY5NDc5MjN9.IPEAnx-qZ2BXRfol7pxBD7Sn7mSlBaZf1K7NLcfiIAE';

        const viewer = new Cesium.Viewer(mapRef.current!, {
          shouldAnimate: true,
          animation: false,
          baseLayerPicker: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: true,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: true,
          timeline: false,
          navigationHelpButton: true,
          scene3DOnly: true, // 强制3D模式
          shadows: true, // 启用阴影
          terrainShadows: Cesium.ShadowMode.ENABLED, // 地形阴影
          mapProjection: new Cesium.WebMercatorProjection(), // 使用Web墨卡托投影
          navigationInstructionsInitiallyVisible: false, // 隐藏导航提示
        });



        store.setMap(viewer);
        setMapReady(true);

        return () => {
          viewer.destroy();
        };
      })();
    }
  }, []);
  console.log("MapData:", MapData); // 调试输出 MapData
  console.log("mapReady:", mapReady); // 调试输出 mapReady 状态

  return (
    <div className="relative h-screen w-screen"> {/* 确保根容器有 relative 定位 */}
      <div ref={mapRef} className="z-10 h-svh"></div>
      {mapReady && <Location />}
      {mapReady && <HeatmapLayer mapData={currentMapData} />}
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