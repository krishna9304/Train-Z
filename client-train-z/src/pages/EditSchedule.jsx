import { Add } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import Schedule from "../components/Schedule";
import { Config } from "../configs/server-urls";

function EditSchedule() {
  const [day, setDay] = useState(new Date(Date.now()).getDay());
  const [open, setOpen] = useState(false);
  const {
    user: { userDetails },
  } = useSelector((s) => s);

  const [session, setSession] = useState({
    name: "",
    start: 8,
    end: 9,
    link: "",
    desc: "",
  });

  const addSession = () => {
    const d = new Intl.DateTimeFormat("en-US", { weekday: "long" })
      .format(day)
      .toLowerCase();
    console.log(d);
    axios
      .post(Config.CREATESESSION, {
        session,
        userId: userDetails._id,
        userType: "MENTOR",
        day: d,
      })
      .then(({ data }) => {
        if (data.res) {
          toast("Session Added", { type: "success" });
        } else {
          if (data.errs) {
            data.errs.forEach((err) => {
              toast(err, { type: "error" });
            });
          }
        }
      })
      .catch(console.error);
  };

  return (
    <>
      <Layout>
        <div className="w-full h-[calc(100vh-3.5rem)] overflow-hidden flex md:px-10 flex-col justify-center items-center gap-3">
          <div className="md:w-1/2 w-full rounded-xl flex justify-center items-center flex-col">
            <div className="w-full h-16 flex text-white font-semibold justify-center items-center rounded-t-xl bg-sky-500">
              <div className="flex flex-grow" />
              <span className="w-52 rounded-lg py-2 px-5 flex gap-2 justify-center items-center">
                <FormControl fullWidth>
                  <Select
                    sx={{
                      color: "#fff",
                    }}
                    className="bg-white rounded-md bg-opacity-30"
                    size="small"
                    input={<OutlinedInput />}
                    labelId="day-label"
                    id="day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                  >
                    <MenuItem value={0}>Sunday</MenuItem>
                    <MenuItem value={1}>Monday</MenuItem>
                    <MenuItem value={2}>Tuesday</MenuItem>
                    <MenuItem value={3}>Wednesday</MenuItem>
                    <MenuItem value={4}>Thursday</MenuItem>
                    <MenuItem value={5}>Friday</MenuItem>
                    <MenuItem value={6}>Saturday</MenuItem>
                  </Select>
                </FormControl>
              </span>
              <div className="flex-grow flex justify-end">
                <span
                  onClick={() => {
                    setOpen(true);
                  }}
                  className="p-2 bg-white bg-opacity-30 rounded-md mr-3 cursor-pointer hover:bg-opacity-60 duration-300"
                >
                  <Add />
                </span>
              </div>
            </div>
            <div className="h-3/5 w-full bg-gray-200 p-5 rounded-b-lg">
              <Schedule schedule={[]} />
            </div>
          </div>
        </div>
      </Layout>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="rounded-lg p-8 flex flex-col gap-4 justify-center items-center bg-white md:w-1/3 w-2/3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-3xl">New Event</span>
          <div className="flex flex-col gap-4 w-full items-center">
            <OutlinedInput
              required
              autoFocus
              value={session.name}
              onChange={(e) =>
                setSession((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
              placeholder="Name"
            />
            <TextareaAutosize
              value={session.desc}
              onChange={(e) =>
                setSession((prev) => ({ ...prev, desc: e.target.value }))
              }
              placeholder="Description"
              className="px-3 w-full py-4 max-h-96 min-h-[1.25rem] focus:outline-blue-500 hover:border-black border-gray-400 rounded-md border"
            />
            <div className="flex gap-4 w-full">
              <FormControl fullWidth>
                <InputLabel id="start-label">Start</InputLabel>
                <Select
                  labelId="start-label"
                  value={session.start}
                  label="Start"
                  onChange={(e) =>
                    setSession((prev) => ({
                      ...prev,
                      start: e.target.value,
                    }))
                  }
                >
                  {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="start-label">End</InputLabel>
                <Select
                  labelId="start-label"
                  value={session.end}
                  label="Start"
                  onChange={(e) =>
                    setSession((prev) => ({
                      ...prev,
                      end: e.target.value,
                    }))
                  }
                >
                  {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <OutlinedInput
              fullWidth
              required
              value={session.link}
              onChange={(e) =>
                setSession((prev) => ({ ...prev, link: e.target.value }))
              }
              type="url"
              placeholder="Meeting link"
            />
            <Button onClick={addSession} className="w-32" variant="outlined">
              Add
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default EditSchedule;
