import React, { forwardRef, useState, useImperativeHandle, RefObject } from "react";

const Marker = forwardRef<MarkerRefProps, MarkerProps>((props, ref) => {
    useImperativeHandle(ref, () => ({
        init(value: string) {
            // 可选：如果你需要外部控制，可以加 setState
        },
        close() {
            if (props.onClose) {
                props.onClose();
            }
        }
    }), [props]);

    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        if (typeof ref === 'object' && ref !== null && 'current' in ref) {
            ref.current?.close();
        }
    };

    return (
        <div style={props.style} className="absolute">
            <div className="px-2 py-1 bg-white text-gray-700 font-sans rounded-lg shadow-sm border border-gray-200 absolute -translate-x-1/2 top-[-30px] after:content-[''] after:absolute 
            after:border-l-transparent after:border-r-transparent after:border-b-transparent after:border-t-white after:border-4 after:top-full after:left-1/2 
            after:-translate-x-1/2 flex items-center space-x-2">
                <span className="text-sm font-bold">{props.name}:</span>
                <span className="text-sm">{props.value}{props.unit}</span>
                <button
                    className="ml-1 w-4 h-4 flex items-center justify-center text-red-600 hover:text-red-800 focus:outline-none transition duration-150 ease-in-out rounded-full border-2 border-red-400"
                    onClick={handleClose}
                >
                    X
                </button>
            </div>
        </div>
    );
});

export default Marker;

interface MarkerProps {
    value: string;
    unit: string;
    name: string;
    style?: React.CSSProperties;
    onClose?: () => void;
}

export type MarkerRefProps = {
    init: (data: string) => void;
    close: () => void;
};
