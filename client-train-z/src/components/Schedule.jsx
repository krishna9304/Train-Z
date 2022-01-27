import React from "react";
import { getRandomColor } from "../utils/randomcolors";

function Schedule({ schedule, ...props }) {
  return (
    <div
      {...props}
      className="w-full h-full overflow-auto shadow-md bg-white rounded-3xl flex"
    >
      <div className="w-1/6">
        {[8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7].map((time) => {
          return (
            <div
              key={time}
              className="h-20 w-full text-xs flex justify-center p-5 border-r border-b text-gray-400"
            >
              {(time + "").length === 1 ? `0${time}` : time}:00
            </div>
          );
        })}
      </div>
      <div className="w-5/6">
        {schedule.map((event, i) => {
          return (
            <div
              key={i}
              style={{
                height: `${event.duration * 5}rem`,
              }}
              className={`py-2 px-4 transform hover:p-0 rounded-lg duration-200 w-full text-xs flex justify-center border-r border-b text-gray-400`}
            >
              <span
                style={{
                  background: `linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()})`,
                }}
                className={`shadow-md w-full gap-3 p-2 rounded-lg flex items-center text-black text-sm`}
              >
                <div className="h-full w-1.5 rounded-full bg-white bg-opacity-30"></div>
                {event.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Schedule;
