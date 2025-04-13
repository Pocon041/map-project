import React, { useEffect, useRef, useState } from "react";
import L, { LatLngBoundsExpression, Map } from "leaflet";
import store from "../store/index.ts";
import { observer } from "mobx-react-lite";
import Colorbar,{Range} from "./Colorbar.tsx";
import { extendObservable, set } from "mobx";
import {extent, interpolate, interpolateTurbo, max, scaleSequential, contours, geoPath} from 'd3'

declare module "leaflet" {
  class ScalarField{
    static fromASCIIJson: (data:FieldData) => any;
  }
  class canvasLayer{
    static scalarField: (data:any) => any;
  }
}

const CanvasOverlay = observer(() => {
  const map = store.map;
  const layer = useRef<L.ImageOverlay>(null);
  const [range,setRange] = useState<Range>({
    min:"",
    max:"",
  });
  
  const [unit,setunit] = useState("mg/ml");


  const renderCanvas = async (map:L.Map) => {
    const tempData: FieldData = await fetch("/temp2.json").then((res) =>
      res.json()
    ); 
    const field = L.ScalarField.fromASCIIJson(tempData);
    //设置数据单位
    setunit("mg/ml");
    //设置数据范围
    setRange({
      min: field.range[0],
      max: field.range[1],
    });
    layer.current = L.canvasLayer.scalarField(field).addTo(map);
  }
  useEffect(() => {
    if(map){
      renderCanvas(map);
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