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
        <div style={props.style} className="absolute z-50">
            <div className="relative px-4 py-3 bg-black bg-opacity-80 text-white rounded-xl shadow-lg border border-gray-700 min-w-[180px] max-w-xs">
                {/* 顶部：信息icon、名称、关闭按钮 */}
                <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        <span className="text-base font-medium">{props.name}</span>
                    </span>
                    <button
                        className="ml-2 w-5 h-5 flex items-center justify-center text-white hover:text-red-400 focus:outline-none transition duration-150 ease-in-out rounded-full"
                        onClick={handleClose}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                {/* 数值和单位 */}
                <div className="flex flex-col items-center justify-center mb-1">
                    <span className="text-2xl font-bold leading-tight">{props.value}</span>
                    <span className="text-sm font-light">{props.unit}</span>
                </div>
                {/* 箭头 */}
                <div className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black border-opacity-80"></div>
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
