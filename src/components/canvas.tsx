import React, { useEffect, useRef, useState } from "react";
import L, { LatLngBoundsExpression, Map } from "leaflet";
import store from "../store/index.ts";
import { observer } from "mobx-react-lite";
import Colorbar,{Range} from "./Colorbar.tsx";
import { extendObservable, set } from "mobx";
import {extent, interpolate, interpolateTurbo, max, scaleSequential, contours, geoPath} from 'd3'
import Marker, { MarkerRefProps } from "./Marker.tsx";
import { createRoot } from "react-dom/client";

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
  const Lmarker = useRef<L.Marker>(null);
  const marker = useRef<MarkerRefProps>(null)

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
    const _layer = L.canvasLayer.scalarField(field).addTo(map);
  
    _layer.on('click',(e:any) => {
      if(e.value){
        if(Lmarker.current){
          Lmarker.current.setLatLng(e.latlng);
          marker.current?.init(e.value);
        }else{
          const html = document.createElement('div');
          createRoot(html).render(<Marker ref={marker} value={e.value}/>);
          const icon = L.divIcon({
            className:"mapIcon",
            html: html,
          });
          Lmarker.current = L.marker(e.latlng,{
            icon: icon,
            draggable: true,
          }).addTo(map);
        }
      }
      //L.popup().setLatLng(e.latlng).setContent(html).openOn(map);
    })

    layer.current = _layer;
    map.fitBounds(_layer.getBounds());
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