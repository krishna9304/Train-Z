import { Add, SendSharp } from "@mui/icons-material";
import { CalendarPicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { Avatar } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ClassroomAvatar from "./classroom";
import { getRandomColor } from "./MentorDashboard";
import Message from "./Message";

function StudentDashboard() {
  const [value, setValue] = useState(new Date());
  const [schedule, setSchedule] = useState([
    {
      name: "Event 0",
      duration: 2,
      from: 8,
    },
    {
      name: "Event 1",
      duration: 2,
      from: 12,
    },
    {
      name: "Event 2",
      duration: 1,
      from: 16,
    },
    {
      name: "Event 3",
      duration: 1,
      from: 8,
    },
    {
      name: "Event 4",
      duration: 2,
      from: 12,
    },
    {
      name: "Event 5",
      duration: 1,
      from: 16,
    },
    {
      name: "Event 6",
      duration: 1,
      from: 8,
    },
    {
      name: "Event 7",
      duration: 1,
      from: 12,
    },
    {
      name: "Event 8",
      duration: 1,
      from: 16,
    },
  ]);

  const user = useSelector((state) => state.user.userDetails);

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] overflow-hidden flex px-10 flex-col gap-3">
      <div className="text-5xl font-thin pt-6 pb-3 w-2/4 flex items-center">
        Welcome to your dashboard, <b>{user.name.split(" ")[0]}</b>
      </div>
      <div className="flex gap-6">
        <div className="w-1/4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CalendarPicker
              onChange={(data) => {
                setValue(data);
              }}
              date={value}
              className="bg-sky-50 rounded-md"
              disablePast
              //   shouldDisableYear={true}
              view="day"
              showDaysOutsideCurrentMonth={false}
            />
          </LocalizationProvider>
        </div>
        <div className="w-1/2 rounded-xl">
          <div className="w-full h-16 flex text-white font-semibold justify-center items-center rounded-t-xl bg-sky-500">
            <span className="bg-white bg-opacity-25 rounded-lg py-2 px-5 flex gap-2 justify-center items-center">
              <svg
                width="27"
                height="30"
                viewBox="0 0 27 30"
                className="filter invert"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 13.5H9V16.5H6V13.5ZM6 19.5H9V22.5H6V19.5ZM12 13.5H15V16.5H12V13.5ZM12 19.5H15V22.5H12V19.5ZM18 13.5H21V16.5H18V13.5ZM18 19.5H21V22.5H18V19.5Z"
                  fill="black"
                />
                <path
                  d="M3 30H24C25.6545 30 27 28.6545 27 27V6C27 4.3455 25.6545 3 24 3H21V0H18V3H9V0H6V3H3C1.3455 3 0 4.3455 0 6V27C0 28.6545 1.3455 30 3 30ZM24 9L24.0015 27H3V9H24Z"
                  fill="black"
                />
              </svg>
              {new Date(value).toDateString()}
            </span>
          </div>
          <div className="h-3/5 w-full bg-gray-200 p-5 rounded-b-lg">
            <div className="w-full h-full overflow-auto shadow-md bg-white rounded-3xl flex">
              <div className="w-1/6">
                {[8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7].map((time) => {
                  return (
                    <div className="h-20 w-full text-xs flex justify-center p-5 border-r border-b text-gray-400">
                      {(time + "").length === 1 ? `0${time}` : time}:00
                    </div>
                  );
                })}
              </div>
              <div className="w-5/6">
                {schedule.map((event) => {
                  console.log(`h-[${event.duration * 20}rem]`);
                  return (
                    <div
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
          </div>
        </div>
        <div className="w-1/4 rounded-md">
          <div className="w-full h-[calc(72%-4rem)] bg-gray-100">
            <div className="w-full font-light flex justify-center items-center border h-1/12 py-3 bg-white">
              Your Classrooms
            </div>
            <div className="w-full flex flex-wrap h-11/12 gap-3 p-4">
              <ClassroomAvatar
                style={{
                  backgroundColor: getRandomColor(),
                }}
                src={"L"}
              />
              <ClassroomAvatar
                style={{
                  backgroundColor: getRandomColor(),
                }}
                src={"M"}
              />
              <ClassroomAvatar
                style={{
                  backgroundColor: getRandomColor(),
                }}
                src={"A"}
              />
              <ClassroomAvatar
                style={{
                  backgroundColor: getRandomColor(),
                }}
                src={"B"}
              />
              <ClassroomAvatar
                style={{
                  backgroundColor: getRandomColor(),
                }}
                src={"C"}
              />
              <ClassroomAvatar
                style={{
                  backgroundColor: getRandomColor(),
                }}
                src={"U"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
