import React from "react";
import { memo } from "react";
import Anchor from "./Anchor";

function Layout(props) {
  return (
    <>
      <nav className="font-mono bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <a href="/" className="flex">
            <span className="self-center text-lg text-orange-500 font-semibold whitespace-nowrap">
              wordle-solver
            </span>
          </a>

          <div>
            <Anchor to="/solve">solve</Anchor>
            <Anchor to="/play">play</Anchor>
            <a
              className="text-teal-900 bg-white hover:bg-teal-100 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              href="https://codesandbox.io/s/wordle-solver-m8vut"
              target="_blank"
              rel="noopener noreferrer"
            >
              source code
            </a>
          </div>
        </div>
      </nav>
      {props.children}
    </>
  );
}

export default memo(Layout);
