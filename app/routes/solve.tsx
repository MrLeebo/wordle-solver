import React from "react";
import {
  Form as RemixForm,
  LoaderFunction,
  json,
  useLoaderData,
  ActionFunction,
  useTransition,
} from "remix";
import Button from "~/components/Button";
import Form from "~/components/Form";
import Input from "~/components/Input";
import ClueSummary from "~/components/ClueSummary";
import RemainingList from "~/components/RemainingList";
import { commitSession, getSession } from "~/sessions";
import { Solver, Clue } from "../lib/Game";
import { useRef } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const game = new Solver(session.get("solve"));
  const remaining = game.remaining();

  return json({ clues: game.clues, remaining, gameOver: game.ended() });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const _action = String(formData.get("_action"));
  const guess = String(formData.get("guess"));
  const clue = String(formData.get("clue"));

  const game = new Solver(_action === "new" ? undefined : session.get("solve"));

  if (_action === "submit" && guess && !game.ended()) {
    game.narrow(guess.toLowerCase(), clue);
  } else if (_action === "delete") {
    game.remove(Number(clue));
  }

  session.set("solve", game.getOptions());

  return json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function Solve(): JSX.Element {
  const { clues, remaining, gameOver } = useLoaderData<{
    clues: Clue[];
    remaining: string[];
    gameOver: boolean;
  }>();
  const guessRef = useRef<HTMLInputElement>();
  const clueRef = useRef<HTMLInputElement>();
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <div className="max-w-sm m-auto">
      <RemixForm className="flex justify-end mt-2" method="post">
        <input type="hidden" name="_action" value="new" />
        <Button type="submit" disabled={isSubmitting}>
          Start over
        </Button>
      </RemixForm>

      {!gameOver && (
        <div className="mb-6">
          <Form method="post">
            <input type="hidden" name="_action" value="submit" />
            <Input
              ref={guessRef}
              name="guess"
              label="Guess"
              min="5"
              max="5"
              required
              pattern="[a-zA-Z]{5}"
              disabled={isSubmitting || gameOver}
              onChange={(e) => {
                e.target.value = e.target.value
                  .replace(/[^a-zA-Z]/g, "")
                  .slice(0, 5);

                if (clueRef.current) clueRef.current.value = "";
                if (e.target.value?.length === 5) clueRef.current.select();
              }}
            />
            <Input
              ref={clueRef}
              name="clue"
              label="Clue"
              pattern="[.;/]{5}"
              disabled={isSubmitting || gameOver}
              onChange={(e) => {
                e.target.value = e.target.value
                  .replace(/[^.;/]/g, "")
                  .slice(0, 5);
              }}
              helpText={
                <>
                  <p className="mb-4">
                    use the following syntax to describe the wordle clue your
                    guess received
                  </p>
                  <ul className="dark:text-gray-400 space-y-2 mb-4">
                    <li>
                      <kbd className="inline-block h-6 w-6 text-center bg-gray-50 border border-gray-100 rounded">
                        .
                      </kbd>{" "}
                      no match
                    </li>
                    <li>
                      <kbd className="inline-block h-6 w-6 text-center bg-yellow-100 border border-yellow-200 rounded">
                        ;
                      </kbd>{" "}
                      matched on another letter
                    </li>
                    <li>
                      <kbd className="inline-block h-6 w-6 text-center bg-green-100 border border-green-200 rounded">
                        /
                      </kbd>{" "}
                      exact match
                    </li>
                  </ul>
                  <p>
                    example: if your guess was '
                    <span className="font-bold tracking-wide">oaken</span>' and
                    the real answer is '
                    <span className="font-bold tracking-wide">ocean</span>' then
                    the clue would be '
                    <span className="font-bold tracking-wide">/;.;/</span>'
                  </p>
                </>
              }
              min="5"
              max="5"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || gameOver}>
                Submit
              </Button>
            </div>
          </Form>
        </div>
      )}

      <ClueSummary clues={clues} editable />
      <RemainingList
        remaining={remaining}
        onSelect={(answer) => {
          if (guessRef.current) {
            guessRef.current.value = answer;
            if (clueRef.current) {
              clueRef.current.value = "";
              clueRef.current.select();
            }
          }
        }}
      />
    </div>
  );
}
