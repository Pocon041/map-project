// src/components/SwitchPanel.tsx
import React from "react";
import { MapDataType } from "../App.tsx";

interface SwitchPanelProps {
    data: MapDataType[];
    updateIndex: (index: number) => void;
    currentIndex: number;
}

const SwitchPanel: React.FC<SwitchPanelProps> = ({ data, updateIndex, currentIndex }) => {
    return (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-md z-50 border-2 border-red-500">
            <h2 className="text-lg font-bold mb-2">切换面板</h2>
            <div className="flex flex-col space-y-2">
                {data.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full p-2 rounded-lg text-left ${currentIndex === index ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                            }`}
                        onClick={() => updateIndex(index)}
                    >
                        {item.name} - {item.time}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SwitchPanel;