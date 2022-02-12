import React, { memo } from "react";
import { Link, LinkProps } from "remix";

function Anchor(props: LinkProps) {
  return (
    <Link
      className="text-teal-900 bg-white hover:bg-teal-100 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      {...props}
    />
  );
}

export default memo(Anchor);
