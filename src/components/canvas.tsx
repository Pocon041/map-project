import React, { useEffect, useRef, useState } from "react";
import L, { LatLngBoundsExpression, Map } from "leaflet";
import store from "../store/index.ts";
import { observer } from "mobx-react-lite";
import Colorbar,{Range} from "./Colorbar.tsx";

const CanvasOverlay = observer(() => {
  const map = store.map;
  const layer = useRef<L.ImageOverlay>(null);
  const range:Range = {min:"0",max:"1"}
  const [unit,setunit] = useState("mg/ml");

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

  if(map){
    renderCanvas();
  }

  useEffect(() => {
    if(layer.current){
      map.removeLayer(layer.current);
    }
  }, []);
  
  return <Colorbar range = {range} unit = {unit}></Colorbar>; 
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