// MapCanvas.tsx
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import store from "../store";
import { MapDataType } from "../App";
import * as Cesium from "cesium";

const MapCanvas: React.FC<{ mapData: MapDataType }> = observer(({ mapData }) => {
    const viewer = store.map;

    useEffect(() => {
        console.log("MapCanvas mounted, viewer:", viewer);
        console.log("Current mapData:", mapData);

        if (viewer && mapData && mapData.url) {
            console.log("Fetching data from:", mapData.url);
            viewer.entities.removeAll();
            
            fetch(mapData.url)
                .then(res => res.json())
                .then(data => {
                    console.log("Received data:", data);
                    data.features.forEach((feature: any) => {
                        if (feature.geometry.type === "Point") {
                            const [longitude, latitude] = feature.geometry.coordinates;
                            const height = feature.properties.value || 0;
                            
                            viewer.entities.add({
                                position: Cesium.Cartesian3.fromDegrees(
                                    longitude,
                                    latitude,
                                    height
                                ),
                                point: {
                                    pixelSize: 10,
                                    color: Cesium.Color.RED,
                                    outlineColor: Cesium.Color.WHITE,
                                    outlineWidth: 2,
                                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                                },
                                label: {
                                    text: `${feature.properties.name || ""}\n${height}${mapData.unit}`,
                                    font: "14px sans-serif",
                                    fillColor: Cesium.Color.WHITE,
                                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                    outlineWidth: 2,
                                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                                    pixelOffset: new Cesium.Cartesian2(0, -10),
                                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                                },
                            });
                        }
                    });

                    viewer.zoomTo(viewer.entities);
                })
                .catch(error => {
                    console.error("加载地图数据失败:", error);
                });
        }
    }, [viewer, mapData]);

    return null;
});

export default MapCanvas;