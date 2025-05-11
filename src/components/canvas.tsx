import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import store from "../store/index.ts";
import { observer } from "mobx-react-lite";
import Colorbar, { Range } from "./Colorbar.tsx";
import Marker, { MarkerRefProps } from "./Marker.tsx";
import { createRoot } from "react-dom/client";
import { MapDataType } from "@/App.tsx";

declare module "leaflet" {
  class ScalarField {
    static fromASCIIJson: (data: FieldData) => any;
  }
  class canvasLayer {
    static scalarField: (data: any) => any;
  }
}

const CanvasRender = observer(({ mapData }: { mapData: MapDataType }) => {
  const map = store.map;
  const layer = useRef<L.ImageOverlay>(null);
  const Lmarker = useRef<L.Marker>(null);
  const marker = useRef<MarkerRefProps>(null);
  const [range, setRange] = useState<Range>({
    min: "",
    max: "",
  });
  const [unit, setUnit] = useState("");
  const renderCanvas = async (map: L.Map) => {
    const tempData: FieldData = await fetch(mapData.url).then((res) =>
      res.json()
    );
    const field = L.ScalarField.fromASCIIJson(tempData);
    //设置数据单位
    setUnit(mapData.unit);
    //设置数据范围
    setRange({
      min: field.range[0],
      max: field.range[1],
    });
    const _layer = L.canvasLayer.scalarField(field).addTo(map);
    _layer.on("click", (e: any) => {
      if (e.value) {
        if (Lmarker.current) {
          Lmarker.current.setLatLng(e.latlng);
          marker.current?.init(e.value);
        } else {
          const html = document.createElement("div");
          createRoot(html).render(
            <Marker
              ref={marker}
              value={e.value}
              name={mapData.name}
              unit={mapData.unit}
              close={closeMarker}
            />
          );
          const icon = L.divIcon({
            className: "mapIcon",
            html: html,
          });
          Lmarker.current = L.marker(e.latlng, {
            icon: icon,
            draggable: true,
          })
            .addTo(map)
            .on("drag", (e: any) => {
              const value = field.valueAt(e.latlng.lng, e.latlng.lat);
              marker.current?.init(value);
            });
        }
      }
    });
    layer.current = _layer;
    map.fitBounds(_layer.getBounds());
  };

  useEffect(() => {
    if (map) {
      renderCanvas(map);
    }
    return () => {
      if (layer.current) {
        map.removeLayer(layer.current);
      }
      if (Lmarker.current) {
        Lmarker.current.remove();
      }
    };
  }, []);

  const closeMarker = () => {
    if (Lmarker.current) {
      Lmarker.current.remove();
      Lmarker.current = null;
    }
  };

  return <Colorbar range={range} unit={unit}></Colorbar>;
});
type FieldData = {
  cellsize: number;
  data: string[][];
  nODATA: string;
  xllcorner: number;
  yllcorner: number;
  ncols: number;
  nrows: number;
};

export default CanvasRender;
