import * as fs from "fs";
import path from "path";
import invariant from "tiny-invariant";
import PatternBuilder from "./PatternBuilder";

const filepath = path.join(__dirname, "../answers.txt");
export const answers = fs.readFileSync(filepath).toString().split("\n");

export type Clue = [boolean, string, string];

abstract class Game {
  protected sample: string;
  clues: Clue[] = [];

  constructor(options?: { sample: string; clues: Clue[] }) {
    this.sample =
      options?.sample ||
      answers[parseInt(String(Math.random() * answers.length), 10)];
    if (options?.clues) this.clues = options.clues;
  }

  ended() {
    if (!this.clues || this.clues.length === 0) return false;
    const [won, clue] = this.clues[this.clues.length - 1];
    return won || clue == null;
  }

  getOptions() {
    return { sample: this.sample, clues: this.clues };
  }

  private createBuilder() {
    const builder = new PatternBuilder();

    for (const [won, clue, guess] of this.clues) {
      if (won || !clue) continue;

      for (let i = 0; i < 5; i++) {
        const symbol = clue[i];
        const letter = guess[i];

        const allExcluded = () => {
          for (let n = 0; n < 5; n++) {
            if (letter !== guess[n]) continue;
            if (clue[n] !== ".") return false;
          }

          return true;
        };

        if (symbol === "/") builder.set(i, letter);
        else if (symbol === ";") builder.remove(i, letter);
        else if (symbol === ".") {
          // don't exclude the letter if there are duplicates...
          if (
            guess.indexOf(letter) === guess.lastIndexOf(letter) ||
            allExcluded()
          ) {
            builder.exclude(letter);
            // ...unless all of the duplicates are excluded
          }
        }
      }
    }

    return builder;
  }

  remaining() {
    try {
      const pattern = this.createBuilder().build();
      return answers.filter((a) => pattern.test(a));
    } catch (err) {
      console.error(err);
      // session got in a bad state or has
      // been tampered with, let's just refresh
      this.clues = [];
      return answers;
    }
  }
}

export class Solver extends Game {
  narrow(input: string, clue: string) {
    this.clues.push([false, clue, input]);
  }

  remove(cluePos: number) {
    this.clues.splice(cluePos, 1);
  }
}

export class Player extends Game {
  guess(input: string): Clue {
    invariant(input, "input is required");

    if (input === this.sample) {
      const n = this.clues.push([true, input, input]);
      return this.clues[n - 1];
    }

    const clue = Array.from(input).reduce((memo, char, i) => {
      if (char === this.sample[i]) return memo + "/";

      const pos = this.sample.indexOf(char);
      if (pos !== -1 && input[pos] !== char) return memo + ";";

      return memo + ".";
    }, "");

    const n = this.clues.push([
      false,
      this.clues.length === 6 ? null : clue,
      input,
    ]);

    return this.clues[n - 1];
  }
}
