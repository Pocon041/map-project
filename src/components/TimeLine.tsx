import { MapDataType } from "../App";
import { Slider } from "./ui/slider";
import { useState, useMemo, useRef } from "react";
import {
    ChevronLast,
    ChevronFirst,
    Play,
    Pause,
    Lock,
    Unlock,
} from "lucide-react";
import { cn } from "../lib/utils";
import React from "react";

export default function Timeline(props: TimelineProps) {
    const [lockedStatus, setLockedStatus] = useState(true);
    const LockIcon = lockedStatus ? Lock : Unlock;
    const [index, setIndex] = useState(props.defaultIndex);
    const currentTime = props.data[index].time;
    const lastTime = useMemo(() => {
        return props.data.at(-1)!.time;
    }, [props.data]);
    const handleChange = (index: number[]) => {
        const currentIndex = index[0];
        setIndex(currentIndex);
    };
    const handleCommit = (index: number[]) => {
        const currentIndex = index[0];
        setIndex(currentIndex);
        props.updateIndex(currentIndex);
    };
    const Timer = useRef<NodeJS.Timeout>(null);
    const nextFrame = () => {
        setIndex((preIndex) => {
            let index = preIndex + 1;
            if (index >= props.data.length) {
                index = 0;
            }
            props.updateIndex(index);
            return index;
        });
    };
    const prevFrame = () => {
        setIndex((preIndex) => {
            let index = preIndex - 1;
            if (index < 0) {
                index = props.data.length - 1;
            }
            props.updateIndex(index);
            return index;
        });
    };
    const play = () => {
        Timer.current = setInterval(() => {
            nextFrame();
        }, 1000);
    };
    const pause = () => {
        if (Timer.current) {
            clearInterval(Timer.current);
            Timer.current = null;
        }
    };
    return (
        <div className="box absolute w-1/2 left-1/2 bottom-10 -translate-x-1/2 z-20 bg-white/70 py-2 px-4 rounded-2xl group">
            {/* action bar */}
            <div
                className={cn(
                    "action flex items-center justify-between overflow-hidden",
                    lockedStatus
                        ? "animate-slideUp"
                        : "group-hover:animate-slideUp animate-slideIn"
                )}
            >
                <div className="flex gap-3 pb-2">
                    <ChevronFirst
                        className="size-4.5 cursor-pointer"
                        onClick={prevFrame}
                    />
                    <ChevronLast
                        className="size-4.5 cursor-pointer"
                        onClick={nextFrame}
                    />
                    <Play className="size-4.5 cursor-pointer" onClick={play} />
                    <Pause className="size-4.5 cursor-pointer" onClick={pause} />
                </div>
                <div className="pb-2">
                    <LockIcon
                        onClick={() => {
                            setLockedStatus(!lockedStatus);
                        }}
                        className="size-4.5 cursor-pointer animate-wiggle"
                    />
                </div>
            </div>
            {/* timebar */}
            <div className="flex items-center justify-between gap-4 ">
                <Slider
                    value={[index]}
                    onValueChange={handleChange}
                    onValueCommit={handleCommit}
                    max={props.data.length - 1}
                ></Slider>
                <div className="text-nowrap">
                    <span className="text-sky-400 font-bold">{currentTime} </span>/
                    {lastTime}
                </div>
            </div>
        </div>
    );
}
type TimelineProps = {
    defaultIndex: number;
    data: MapDataType[];
    updateIndex: React.Dispatch<React.SetStateAction<number>>;
};
