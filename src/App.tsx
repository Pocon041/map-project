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
  const [lngLat, setLngLat] = useState<{ lng: string | null; lat: string | null }>({ lng: null, lat: null });

  useEffect(() => {
    if (mapRef.current) {
      let handler: Cesium.ScreenSpaceEventHandler | null = null;
      let viewer: Viewer | null = null;
      (async () => {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YjMzMjk4Ni0wYjA0LTQ2ZjctYmVkYi05MjQzZmMxNmJkNzAiLCJpZCI6MzAxNDAzLCJpYXQiOjE3NDY5NDc5MjN9.IPEAnx-qZ2BXRfol7pxBD7Sn7mSlBaZf1K7NLcfiIAE';

        viewer = new Cesium.Viewer(mapRef.current!, {
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
          scene3DOnly: true,
          shadows: true,
          terrainShadows: Cesium.ShadowMode.ENABLED,
          mapProjection: new Cesium.WebMercatorProjection(),
          navigationInstructionsInitiallyVisible: false,
        });

        store.setMap(viewer);
        setMapReady(true);

        // 监听鼠标移动事件
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((movement: any) => {
          const cartesian = viewer!.camera.pickEllipsoid(movement.endPosition, viewer!.scene.globe.ellipsoid);
          if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
            const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
            setLngLat({ lng, lat });
          } else {
            setLngLat({ lng: null, lat: null });
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      })();
      // 清理
      return () => {
        if (handler) handler.destroy();
        if (viewer) viewer.destroy();
      };
    }
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <div ref={mapRef} className="z-10 h-svh"></div>
      {mapReady && <Location lng={lngLat.lng} lat={lngLat.lat} />}
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