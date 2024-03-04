import { useParamsStore } from "@/hooks/useParamsStore";
import { Button } from "flowbite-react";
import React from "react";
import { AiOutlineClockCircle, AiOutlineSortAscending } from "react-icons/ai";
import { BsFillStopCircleFill, BsStopwatchFill } from "react-icons/bs";
import { GiFlame, GiFinishLine } from "react-icons/gi";

const pageSizeButtons = [4, 8, 12];

const orderButons = [
  {
    label: "Alphabetical",
    icon: AiOutlineSortAscending,
    value: "make",
  },
  {
    label: "End date",
    icon: AiOutlineClockCircle,
    value: "endingSoon",
  },
  {
    label: "Recently added",
    icon: BsFillStopCircleFill,
    value: "new",
  },
];

const filterButons = [
  {
    label: "Live Auctions",
    icon: GiFlame,
    value: "live",
  },
  {
    label: "Endding < 6 hours",
    icon: GiFinishLine,
    value: "endingSoon",
  },
  {
    label: "Completed",
    icon: BsStopwatchFill,
    value: "finished",
  },
];

export default function Filters() {
  const pageSize = useParamsStore((state) => state.pageSize);
  const setParams = useParamsStore((state) => state.setParams);
  const orderBy = useParamsStore((state) => state.orderBy);
  const filterBy = useParamsStore((state) => state.filterBy);

  return (
    <div className=" flex justify-between items-center mb-4">
      <div>
        <span className=" uppercase text-gray-500 mr-2">Filter by</span>
        <Button.Group>
          {filterButons.map(({ label, icon: Icon, value }) => (
            <Button
              key={value}
              onClick={() => setParams({ filterBy: value })}
              color={`${filterBy === value ? "red" : "gray"}`}
            >
              <Icon className="mr-3 h-4 w-4" />
              {label}
            </Button>
          ))}
        </Button.Group>
      </div>

      <div>
        <span className=" uppercase text-gray-500 mr-2">Order by</span>
        <Button.Group>
          {orderButons.map(({ label, icon: Icon, value }) => (
            <Button
              key={value}
              onClick={() => setParams({ orderBy: value })}
              color={`${orderBy === value ? "red" : "gray"}`}
            >
              <Icon className="mr-3 h-4 w-4" />
              {label}
            </Button>
          ))}
        </Button.Group>
      </div>
      <div>
        <span className=" uppercase text-gray-500 mr-2">Page size</span>
        <Button.Group>
          {pageSizeButtons.map((v, i) => (
            <Button
              className=" focus:ring-1"
              key={i}
              onClick={() => setParams({ pageSize: v })}
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
