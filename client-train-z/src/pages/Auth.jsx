import { Tab } from "@headlessui/react";
import React from "react";
import Layout from "../components/Layout";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

const Auth = () => {
  return (
    <Layout
      className={`flex flex-col justify-center items-center`}
      childrenClassName={
        "w-full flex flex-col flex-grow h-1/2 justify-center items-center"
      }
    >
      <Tab.Group
        as="div"
        className="flex flex-col justify-center items-center max-w-md h-[60vh]"
        defaultIndex={0}
      >
        <Tab.List
          className={
            "flex gap-2 px-1 py-1 w-full rounded-lg justify-between bg-sky-400 select-none"
          }
        >
          <Tab as="div" className={"focus:outline-none flex w-full"}>
            {({ selected }) => (
              <span
                className={`p-2 rounded-md w-full font-semibold cursor-pointer text-center ${
                  selected ? "bg-white shadow-sm" : "text-white"
                }`}
              >
                Sign In
              </span>
            )}
          </Tab>
          <Tab as="div" className={"focus:outline-none flex w-full"}>
            {({ selected }) => (
              <span
                className={`p-2 rounded-md w-full font-semibold cursor-pointer text-center ${
                  selected ? "bg-white shadow-sm" : "text-white"
                }`}
              >
                Sign Up
              </span>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels
          as="div"
          className={`border-2 flex flex-col flex-grow h-full p-10 rounded-lg m-4 w-full shadow-lg`}
        >
          <Tab.Panel className="flex flex-col flex-grow" as="div">
            <SignIn />
          </Tab.Panel>
          <Tab.Panel className="flex flex-col flex-grow" as="div">
            <SignUp />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  );
};

export default Auth;
