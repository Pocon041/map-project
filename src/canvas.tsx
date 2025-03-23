// CanvasOverlay.tsx
import React, { useEffect, useRef } from "react";
import L, { LatLngBoundsExpression, Map } from "leaflet";
import store from "./store/index.ts";
import { observer } from "mobx-react-lite";


const CanvasOverlay = observer(() => {
  const map = store.map;
  useEffect(() => {
    const renderCanvas = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "rgb(255,0,0)";
      ctx.fillRect(10, 10, 55, 50);
      const url = canvas.toDataURL("png");
      console.log(url);

      const response = await fetch("/temp1.json");
      const tempData: FieldData = await response.json();

      const imageBounds: LatLngBoundsExpression = L.latLngBounds([
        [tempData.yllcorner, tempData.xllcorner],
        [
          tempData.yllcorner + tempData.nrows * tempData.cellsize,
          tempData.xllcorner + tempData.ncols * tempData.cellsize,
        ],
      ]);

      const layer = L.imageOverlay(url, imageBounds).addTo(map);
      console.log(layer);
    };

    renderCanvas();
  }, [map]);

  return null; 
});

type FieldData = {
  cellsize: number;
  data: string[][];
  ncols: number;
  nrows: number;
  xllcorner: number;
  yllcorner: number;
};

export default CanvasOverlay;