import { UserOutlined } from "@ant-design/icons/lib/icons";
import { Menu, Transition } from "@headlessui/react";
import Avatar from "antd/lib/avatar/avatar";
import React, { Fragment } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ className, ...props }) => {
  return (
    <nav
      {...props}
      className={`fixed bg-opacity-80 select-none bg-white backdrop-blur-sm z-30 top-0 left-0 flex px-6 border-b shadow-md md:px-10 w-full h-14 p-2 justify-between items-center ${className}`}
    >
      <Link
        to="/"
        className="select-none hover:text-black py-4 font-black text-3xl text-gray-900"
      >
        Train-Z
      </Link>
      <span className="space-x-4 ">
        <NavLink to="/auth">Sign In</NavLink>
        <Menu>
          <Menu.Button className={"focus:outline-none"}>
            <Avatar icon={<UserOutlined />} />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition duration-200 ease-out"
            enterFrom="transform scale-0 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-200 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-0 opacity-0"
          >
            <Menu.Items className="focus:outline-none flex min-w-max w-36 right-8  flex-col shadow-md absolute mt-2 bg-white border p-2 rounded-md">
              <Menu.Item>
                {({ active }) => (
                  <NavLink
                    className={`${
                      active ? "bg-sky-300 text-white" : "text-gray-900"
                    } group hover:text-white flex text-center rounded-md font-semibold items-center w-full px-4 py-2 text-base`}
                    to="/profile"
                  >
                    Profile
                  </NavLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={`${
                      active ? "bg-red-400 text-white" : "text-gray-900"
                    } group flex text-center rounded-md font-semibold items-center w-full px-4 py-2 text-base`}
                  >
                    Log Out
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </span>
    </nav>
  );
};

export default Navbar;
