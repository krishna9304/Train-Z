import React from "react";

function Message({ children, user, ...props }) {
  return (
    <div
      {...props}
      className="w-full max-w-sm px-3 py-2 bg-sky-200 rounded-md rounded-br-none my-2 font-medium text-sm"
    >
      {children}
    </div>
  );
}

export default Message;
