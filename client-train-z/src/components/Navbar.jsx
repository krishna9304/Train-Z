import { Menu, Transition } from "@headlessui/react";
import { ChevronRightRounded } from "@mui/icons-material";
import React, { Fragment } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { removeCurrentUser } from "../redux/slices/userSlice";

const Navbar = ({ className = "", detailed = false, ...props }) => {
  const [, , removeCookie] = useCookies(["jwt"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  return (
    <nav
      {...props}
      className={`fixed bg-opacity-80 select-none bg-white backdrop-blur-sm z-30 top-0 left-0 flex px-6 border-b shadow-md md:px-10 w-full h-14 p-2 justify-between items-center ${className}`}
    >
      {detailed ? (
        <>
          <Link
            to="/"
            className="select-none hover:text-black py-4 font-bold text-2xl text-gray-900"
          >
            <span>Train-Z</span>
            <span className="font-thin uppercase text-lg">CLASSROOM</span>
          </Link>
          <span className="space-x-4 flex items-center justify-center">
            <Menu>
              <Menu.Button>
                <div className="bg-sky-100 py-1 px-3 rounded-md text-sky-900 text-sm font-semibold">
                  Hi, {user.userDetails.name.split(" ")[0]}
                  <ChevronRightRounded fontSize="30pt" />
                </div>
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
                <Menu.Items className="focus:outline-none flex min-w-max w-36 right-8 top-12  flex-col shadow-md absolute mt-2 bg-white border p-2 rounded-md">
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
                        onClick={() => {
                          removeCookie("jwt");
                          dispatch(removeCurrentUser());
                          navigate("/");
                        }}
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
        </>
      ) : (
        <div className="w-full flex justify-center items-center">
          <Link
            to="/"
            className="select-none hover:text-black py-4 font-bold text-2xl text-gray-900"
          >
            <span>Train-Z</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
