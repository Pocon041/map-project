import React from "react";

interface LocationProps {
  lng?: string | null;
  lat?: string | null;
}

const Location: React.FC<LocationProps> = ({ lng, lat }) => {
    return (
        <div className="absolute z-20 bg-[#bac3c7] bottom-0 right-0 py-2 px-4 mb-4 mr-4">
            姓名：陈中浩 学号：23020007009<br />
            {lng && lat ? (
                <>
                    经度：{lng}，纬度：{lat}
                </>
            ) : (
                "请将鼠标移动到地图上"
            )}
        </div>
    );
};

export default Location;