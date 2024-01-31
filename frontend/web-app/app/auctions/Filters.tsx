import { useParamsStore } from "@/hooks/useParamsStore";
import { Button } from "flowbite-react";
import React from "react";

const pageSizeButtons = [4, 8, 12];

export default function Filters() {
  const pageSize = useParamsStore((state) => state.pageSize);
  const setParams = useParamsStore((state) => state.setParams);
  return (
    <div className=" flex justify-between items-center mb-4">
      <div>
        <span className=" uppercase text-gray-500 mr-2">Page size</span>
        <Button.Group>
          {pageSizeButtons.map((v, i) => (
            <Button
              className=" focus:ring-1"
              key={i}
              onClick={() => setParams({pageSize: v})}
              color={`${pageSize === v ? "red" : "gray"}`}
            >
              {v}
            </Button>
          ))}
        </Button.Group>
      </div>
    </div>
  );
}
