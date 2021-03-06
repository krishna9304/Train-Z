import React, { useState } from "react";
import CalendarPicker from "@mui/lab/CalendarPicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Add, SendSharp } from "@mui/icons-material";
import Message from "./Message";
import { Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Schedule from "./Schedule";

const MentorDashboard = () => {
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
      duration: 1,
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
      duration: 2,
      from: 12,
    },
    {
      name: "Event 8",
      duration: 1,
      from: 16,
    },
  ]);

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] overflow-hidden flex px-10 flex-col gap-3">
      <div className="text-5xl font-extrabold pt-6 pb-3 w-1/4 flex justify-center items-center">
        Availability
      </div>
      <div className="flex gap-6">
        <div className="w-1/4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CalendarPicker
              onChange={(data) => {
                console.log(data);
                setValue(data);
              }}
              date={value}
              className="bg-sky-50 rounded-md"
              disablePast
              view="day"
              showDaysOutsideCurrentMonth={false}
            />
          </LocalizationProvider>
        </div>
        <div className="w-1/2 rounded-xl">
          <div className="w-full h-16 flex text-white font-semibold justify-center items-center rounded-t-xl bg-sky-500">
            <div className="w-1/4"></div>
            <div className="w-1/2 flex justify-center items-center">
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
            <div className="w-1/4 flex justify-end p-3">
              <Link
                to={`/schedule/edit`}
                className="bg-white bg-opacity-30 hover:bg-opacity-50 text-white duration-100 p-2 rounded-md"
              >
                <Edit />
              </Link>
            </div>
          </div>
          <div className="h-3/5 w-full bg-gray-200 p-5 rounded-b-lg">
            <Schedule schedule={schedule} />
          </div>
        </div>
        <div className="w-1/4 rounded-md">
          <div className="w-full h-32 bg-white border rounded-t-md">
            <div className="text-xs font-semibold p-2 text-gray-400">
              Your Classroom
            </div>
          </div>
          <div className="h-[calc(60%-4rem)] w-full bg-gray-50 p-5 rounded-b-lg flex flex-col justify-end items-end">
            <div className="max-h-screen overflow-y-auto">
              <Message>
                <img
                  src="https://cdn.dribbble.com/users/1579320/screenshots/14376775/media/245ddfc9c60c06dedfa93e3f31511aef.png?compress=1&resize=1600x1200&vertical=top"
                  alt=""
                />
              </Message>
            </div>
            <div className="flex justify-center items-center w-full gap-2">
              <input
                className="w-full border border-gray-300 bg-white rounded-full outline-none p-2 px-4 text-xs font-thin"
                placeholder="Send a Text"
              />
              <div className="p-1 flex justify-center items-center bg-sky-400 rounded-full">
                <Add fontSize="small" />
              </div>
              <div className="py-1 px-3 flex justify-center items-center bg-sky-400 rounded-full">
                <SendSharp fontSize={"small"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
