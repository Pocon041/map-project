import React, { useEffect, useRef, useState } from "react";
import L, { LatLngBoundsExpression, Map } from "leaflet";
import store from "../store/index.ts";
import { observer } from "mobx-react-lite";
import Colorbar,{Range} from "./Colorbar.tsx";
import { extendObservable, set } from "mobx";
import {extent} from 'd3'

const CanvasOverlay = observer(() => {
  const map = store.map;
  const layer = useRef<L.ImageOverlay>(null);
  const [range,setRange] = useState<Range>({
    min:"",
    max:"",
  });
  const [unit,setunit] = useState("mg/ml");


  const renderCanvas = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.fillRect(10, 10, 55, 50);
    const url = canvas.toDataURL("png");
  
    const response = await fetch("/temp1.json");
    const tempData: FieldData = await response.json();
    //设置数据单位
    setunit("mg/ml");
    //设置数据范围
    const tempArray:string[] = tempData.data.reduce((sum,el)=>{
      return sum.concat(el);
    }, []).filter(el=>el != tempData.nODATA);
    const extentRange = extent(tempArray) as string[];
    console.log(tempArray,extentRange);
    setRange({
      min: extentRange[0],
      max: extentRange[1],
    })

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

  

  useEffect(() => {
    if(map){
      renderCanvas();
    }
    if(layer.current){
      map.removeLayer(layer.current);
    }
  }, []);
  
  return <Colorbar range = {range} unit = {unit}></Colorbar>; 
});

type FieldData = {
  cellsize: number;
  data: string[][];
  nODATA: string;
  ncols: number;
  nrows: number;
  xllcorner: number;
  yllcorner: number;
};

export default CanvasOverlay;