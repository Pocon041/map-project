import {scaleSequential, interpolateTurbo} from 'd3'
import { JSX } from 'react';

export default function Colorbar(Props:ColorProps){
    const range = Props.range;
    const min = Number(range.min)
    const max = Number(range.max)
    const colorMap = scaleSequential(interpolateTurbo).domain([min, max]);
    const colors:string[] = []

    for(let index = min ; index < max ; index = index + (max - min)/100){
        colors.push(colorMap(index));
    }
    console.log(colors);

    const colorDom:JSX.Element = (
    <div className='flex flex-col'>
        {colors.map((el) => (
            <div key={el} style = {{background:el}} className='h-0.5 w-3'></div>
        ))}
    </div>
    );

    return (
    <div className='absolute left-5 bottom-5 z-20 text-white'>
        <div>{range.min}</div>
        {colorDom}
        <div>{range.max}</div>
    </div>
    )
    
}

type ColorProps = {
    range: Range;
};

export type Range = {
    min: string;
    max: string;
}