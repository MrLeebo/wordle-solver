import React, { ButtonHTMLAttributes, memo } from "react";

function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-orange-900 bg-white rounded-lg border border-orange-200 hover:bg-orange-100 hover:text-orange-700 focus:z-10 focus:ring-2 focus:ring-teal-700 focus:text-teal-700 disabled:opacity-75 disabled:pointer-events-none disabled:hover:bg-transparent"
      {...props}
    />
  );
}

export default memo(Button);
