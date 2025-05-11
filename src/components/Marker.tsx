import { MapDataType } from "@/App";
import { forwardRef, useImperativeHandle, useState } from "react";
import { X } from "lucide-react";

const Marker = forwardRef<MarkerRefProps, MarkerProps>((props, ref) => {
  const [value, setValue] = useState(props.value);
  const [name, setName] = useState(props.name);
  const [unit, setUnit] = useState(props.unit);
  useImperativeHandle(
    ref,
    () => {
      return {
        init(value: string) {
          setValue(value);
        },
      };
    },
    []
  );
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.close();
  };
  return (
    <div className="relative top-1.5 left-1.5">
      <div className="px-4 pt-8 pb-3 bg-white text-black whitespace-nowrap absolute -translate-x-1/2 top-[-30px] after:content-[''] after:absolute after:border-l-transparent after:border-r-transparent after:border-b-transparent after:border-t-white  after:border-4  after:top-full after:left-1/2 after:-translate-x-1/2">
        {name}: {value} {unit}
        <X
          className="absolute top-2 right-2 size-5 hover:text-sky-700"
          onClick={handleClose}
        ></X>
      </div>
    </div>
  );
});

export default Marker;

type MarkerProps = {
  value: string;
  name: string;
  unit: string;
  close: () => void;
};
export type MarkerRefProps = {
  init: (data: string) => void;
};
