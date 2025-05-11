import { MapDataType } from "@/App";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export default function Resource(props: ResourceProps) {
  const [value, setValue] = useState(String(props.defalutIndex));
  const handleValueChange = (val: string) => {
    setValue(val);
    props.update(+val);
  };
  return (
    <div className="absolute z-20 top-4 left-4 bg-white/40 px-3 py-5 rounded-lg text-white w-72">
      <div className="bg-sky-950/90 rounded-sm px-3 py-1">遥感数据</div>
      <RadioGroup
        value={value}
        onValueChange={handleValueChange}
        className="bg-sky-950/75 mt-2 py-2 px-3 rounded-sm"
      >
        {props.source.map((el, index) => (
          <div className="flex items-center space-x-2" key={el.name}>
            <RadioGroupItem value={String(index)} id={el.name} />
            <Label htmlFor={el.name}>{el.name}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
type ResourceProps = {
  source: MapDataType[];
  update: (index: number) => void;
  defalutIndex: number;
};
