import React, { useEffect, useRef, useState } from "react";
import L, { Control, map, Marker, popup, LeafletMouseEvent } from "leaflet";
import store from "../store/index";
import { observer } from "mobx-react-lite";

const Location = observer(() => {
    const map = store.map;
    const [position, setposition] = useState<string>("位置信息:");

    useEffect(() => {
        if (map) {
            map.on("mousemove", updateposition);
            return () => {
                map.off("mousemove", updateposition);
            };
        }
    }, [map]);

    const updateposition = (evt: LeafletMouseEvent) => {
        setposition("位置信息:" + evt.latlng.toString());
    };

    return (
        <div className="absolute z-20 text-white bottom-0.5 text-sm right-0.5 py-2 px-4">
            {position}
        </div>
    );
});

export default Location;