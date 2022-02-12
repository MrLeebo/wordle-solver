import React from "react";
import {
  ActionFunction,
  LoaderFunction,
  Form as RemixForm,
  json,
  useLoaderData,
  useTransition,
} from "remix";
import { commitSession, getSession } from "../sessions";
import { Player, Clue } from "../lib/Game";
import Form from "../components/Form";
import Input from "../components/Input";
import Button from "../components/Button";
import ClueSummary from "../components/ClueSummary";
import RemainingList from "../components/RemainingList";
import { useRef } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const game = new Player(session.get("play"));
  const remaining = game.remaining();

  return json({ clues: game.clues, remaining, gameOver: game.ended() });
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const _action = String(formData.get("_action"));
  const guess = String(formData.get("guess"));

  const game = new Player(_action === "new" ? undefined : session.get("play"));

  if (_action === "guess" && guess && !game.ended()) {
    game.guess(guess.toLowerCase());
  }

  session.set("play", game.getOptions());
  return json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function Play() {
  const { clues, remaining, gameOver } = useLoaderData<{
    clues: Clue[];
    remaining: string[];
    gameOver: boolean;
  }>();
  const ref = useRef<HTMLInputElement>();
  const transition = useTransition();
  const isSubmitting = transition.state === "submitting";

  return (
    <div className="max-w-lg mx-auto">
      <RemixForm method="post" className="flex justify-end mt-2">
        <input type="hidden" name="_action" value="new" />
        <Button type="submit" disabled={isSubmitting}>
          New Game
        </Button>
      </RemixForm>

      {!gameOver && (
        <div className="mb-6">
          <Form method="post">
            <input type="hidden" name="_action" value="guess" />
            <div className="w-40">
              <Input
                ref={ref}
                name="guess"
                label="Guess"
                max="5"
                min="5"
                required
                pattern="[a-zA-Z]{5}"
                helpText="Must be a five letter word from the wordle word list"
                disabled={isSubmitting || gameOver}
              />
            </div>
            <div className="flex justify-end place-items-center">
              <Button type="submit" disabled={isSubmitting || gameOver}>
                Guess
              </Button>
            </div>
          </Form>
        </div>
      )}

      <ClueSummary clues={clues} />

      {!gameOver && (
        <RemainingList
          remaining={remaining}
          onSelect={(answer) => {
            if (ref.current) {
              ref.current.value = answer;
              ref.current.select();
            }
          }}
        />
      )}
    </div>
  );
}
