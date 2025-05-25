import React, { useEffect, useState } from 'react';
import * as Cesium from 'cesium';
import { store } from '../App';
import { MapDataType } from '../App';
import Colorbar, { Range } from './Colorbar';
import Marker from './Marker';

interface HeatmapLayerProps {
  mapData: MapDataType;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ mapData }) => {
  const [range, setRange] = useState<Range>({ min: '', max: '' });
  const [unit, setUnit] = useState<string>('');
  const [marker, setMarker] = useState<{
    screenX: number;
    screenY: number;
    value: number;
    unit: string;
    name: string;
  } | null>(null);
  let heatmapLayer: Cesium.ImageryLayer | null = null;

  useEffect(() => {
    const viewer = store.getMap();
    if (!viewer) {
      console.error('Cesium viewer not initialized');
      return;
    }

    // 清除旧的影像图层
    for (let i = viewer.imageryLayers.length - 1; i > 0; i--) {
      const layer = viewer.imageryLayers.get(i);
      viewer.imageryLayers.remove(layer, false);
    }

    fetch(mapData.url)
      .then(response => response.json())
      .then(grid => {
        // 只在这里解构一次
        const { ncols, nrows, data, xllcorner, yllcorner, cellsize } = grid;

        // 计算 min/max
        let min = Infinity, max = -Infinity;
        for (let row = 0; row < nrows; row++) {
          for (let col = 0; col < ncols; col++) {
            const v = Number(data[row][col]);
            if (!isNaN(v)) {
              min = Math.min(min, v);
              max = Math.max(max, v);
            }
          }
        }
        setRange({ min: min.toString(), max: max.toString() });
        setUnit(mapData.unit);

        // 生成 canvas
        const canvas = createHeatmapCanvas(grid);
        const west = xllcorner;
        const south = yllcorner;
        const east = xllcorner + ncols * cellsize;
        const north = yllcorner + nrows * cellsize;

        // 贴图
        const imageryProvider = new Cesium.SingleTileImageryProvider({
          url: canvas.toDataURL(),
          rectangle: Cesium.Rectangle.fromDegrees(west, south, east, north),
          tileWidth: canvas.width,
          tileHeight: canvas.height
        });
        heatmapLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);

        // 相机定位
        viewer.camera.flyTo({
          destination: Cesium.Rectangle.fromDegrees(west, south, east, north),
          duration: 2
        });

        document.body.appendChild(canvas); // 临时调试用，看看图片内容

        // 监听点击事件
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((movement: any) => {
          const cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
          if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const lon = Cesium.Math.toDegrees(cartographic.longitude);
            const lat = Cesium.Math.toDegrees(cartographic.latitude);

            // 反查数据行列
            const { ncols, nrows, xllcorner, yllcorner, cellsize, data } = grid; // grid需在外层useRef保存
            const col = Math.floor((lon - xllcorner) / cellsize);
            const row = nrows - 1 - Math.floor((lat - yllcorner) / cellsize);
            if (
              row >= 0 && row < nrows &&
              col >= 0 && col < ncols
            ) {
              const value = Number(data[row][col]);
              if (!isNaN(value)) {
                // 屏幕坐标
                const windowPosition = Cesium.SceneTransforms.worldToWindowCoordinates(
                  viewer.scene,
                  Cesium.Cartesian3.fromDegrees(lon, lat)
                );
                if (windowPosition) {
                  setMarker({
                    screenX: windowPosition.x,
                    screenY: windowPosition.y,
                    value: value,
                    unit: mapData.unit,
                    name: mapData.name
                  });
                }
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        return () => {
          if (heatmapLayer) {
            viewer.imageryLayers.remove(heatmapLayer, false);
            heatmapLayer = null;
          }
          handler.destroy();
        };
      })
      .catch(error => {
        console.error('Error loading or processing heatmap data:', error);
      });
  }, [mapData]);

  return (
    <>
      <Colorbar range={range} unit={unit} />
      {marker && (
        <Marker
          value={marker.value.toString()}
          unit={marker.unit}
          name={marker.name}
          style={{
            position: 'absolute',
            left: marker.screenX,
            top: marker.screenY,
            zIndex: 1000
          }}
          onClose={() => setMarker(null)}
        />
      )}
    </>
  );
};

function createHeatmapCanvas(grid) {
  const { ncols, nrows, data } = grid;
  const canvas = document.createElement('canvas');
  canvas.width = ncols;
  canvas.height = nrows;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法获取2D绘图上下文');
  }
  const imageData = ctx.createImageData(ncols, nrows);

  // 计算数值范围
  let min = Infinity, max = -Infinity;
  for (let row = 0; row < nrows; row++) {
    for (let col = 0; col < ncols; col++) {
      const v = Number(data[row][col]);
      if (!isNaN(v)) {
        min = Math.min(min, v);
        max = Math.max(max, v);
      }
    }
  }

  // 映射到颜色
  for (let row = 0; row < nrows; row++) {
    for (let col = 0; col < ncols; col++) {
      const idx = (row * ncols + col) * 4;
      const v = Number(data[row][col]);
      if (isNaN(v)) {
        imageData.data[idx + 3] = 0; // 透明
      } else {
        // 归一化
        const t = (v - min) / (max - min);
        // 伪彩色映射
        const color = Cesium.Color.fromHsl((1 - t) * 240 / 360, 1.0, 0.5);
        imageData.data[idx] = color.red * 255;
        imageData.data[idx + 1] = color.green * 255;
        imageData.data[idx + 2] = color.blue * 255;
        imageData.data[idx + 3] = 200; // 不透明度
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export default HeatmapLayer; 