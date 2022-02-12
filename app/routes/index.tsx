import React from "react";
import Anchor from "../components/Anchor";

export default function Index() {
  return (
    <div className="grid place-content-center h-full font-mono text-center p-8">
      <h2 className="text-2xl mb-6">
        Welcome to <span className="text-orange-500">wordle-solver</span>!
      </h2>
      <p className="mb-6">Choose one of the following links to begin:</p>
      <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto dark:text-gray-400">
        <div className="place-self-center">
          <Anchor to="/solve">solve</Anchor>
        </div>
        <div className="place-self-center">
          <Anchor to="/play">play</Anchor>
        </div>
        <div>for help solving a wordle</div>
        <div>
          to play a wordle game
          <br />
          (with a little assistance)
        </div>
      </div>
    </div>
  );
}
