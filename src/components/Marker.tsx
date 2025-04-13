import React, { forwardRef, useState, useImperativeHandle } from "react";

const Marker=forwardRef<MarkerRefProps,MarkerProps>((props,ref)=>{
    const [value,setValue]=useState(props.value);
useImperativeHandle(ref,()=>{
    return{
        init(value:string){
            setValue(value);
        },
    };
})
return (
    <div className="relative top-1.5 left-1.5">
        <div className="px-2 py-1 bg-white text-black whitespace-nowrap absolute -translate-x-1/2 top-[-40px] after:content-[''] after:absolute 
        after:border-l-transparent after:border-r-transparent after:border-b-transparent after:border-t-white after:border-4 after:top-full after:left-1/2 
        after:-translate-x-1/2">
            当前数值: {value}
        </div>
    </div>
);
})

export default Marker;

type MarkerProps={
    value:string;
}

export type MarkerRefProps={
    init:(data:string)=>void;
}