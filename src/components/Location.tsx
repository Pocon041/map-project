import React, { useEffect,useState } from "react";
import L from "leaflet";
export default function Location(props:LocationProps) 
{
    const map=props.map;
    const [position,setposition]=useState<string>("位置信息:");
    useEffect(()=>{
        map.on("mousemove",updateposition);
        return()=>{
            map.off("mousemove",updateposition);
        };
    },[map]);

    const updateposition=(evt:L.LeafletMouseEvent)=>{
        setposition("位置信息:"+evt.latlng.toString());
    };
    return(
    <div className="absolute z-20 bg-[#1191cc] bottom-4 left-4 py-2 px-4">
        {position}
     </div>
     );
}
type LocationProps={
    map:L.Map;
};