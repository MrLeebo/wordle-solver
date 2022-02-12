import React, { memo } from "react";
import { Form, useTransition } from "remix";
import type { Clue } from "../lib/Game";

interface Props {
  clues: Clue[];
  editable?: boolean;
}

function ClueSummary({ clues, editable }: Props) {
  const transition = useTransition();
  if (!clues) return null;

  return (
    <div className="font-mono mb-6">
      {clues.map(([won, clue, guess], index) => (
        <div key={index} className="flex place-items-start space-x-4">
          <span>
            {guess}
            {" - "}
          </span>
          {won ? (
            <span>(WINNER)</span>
          ) : clue == null ? (
            <span>(GAME OVER)</span>
          ) : (
            <div className="inline-flex space-x-4">
              <div>
                {Array.from(clue).map((char, index) => (
                  <span key={index}>
                    {char === "." ? (
                      <span className="inline-block w-6 h-6 bg-gray-50 border border-gray-100 text-center">
                        {editable && "."}
                      </span>
                    ) : char === ";" ? (
                      <span className="inline-block w-6 h-6 bg-yellow-100 border border-yellow-200 text-center">
                        {editable && ";"}
                      </span>
                    ) : char === "/" ? (
                      <span className="inline-block w-6 h-6 bg-green-100 border border-green-200 text-center">
                        {editable && "/"}
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                ))}
              </div>
              {editable && (
                <Form method="post">
                  <input type="hidden" name="_action" value="delete" />
                  <input type="hidden" name="clue" value={index} />
                  <button
                    type="submit"
                    aria-label="delete"
                    className="text-red-500 hover:underline disabled:opacity-75"
                    disabled={transition.state === "submitting"}
                  >
                    remove
                  </button>
                </Form>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default memo(ClueSummary);
