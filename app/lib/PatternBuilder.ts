import invariant from "tiny-invariant";

const alpha = "abcdefghijklmnopqrstuvwxyz";

export default class PatternBuilder {
  private possibilities = [alpha, alpha, alpha, alpha, alpha];

  private seeking: string[] = [];

  exclude(letter: string) {
    invariant(letter.length === 1, "letter must be one character");

    this.possibilities = this.possibilities.map((possible) =>
      possible.replace(new RegExp(letter), "")
    );
    return this;
  }

  remove(pos: number, letter: string) {
    invariant(pos >= 0 && pos < 5, "pos must be between 0 and 4");
    invariant(letter.length === 1, "letter must be one character");

    this.seeking.push(letter);
    this.possibilities[pos] = this.possibilities[pos].replace(
      new RegExp(letter),
      ""
    );
    return this;
  }

  set(pos: number, letter: string) {
    invariant(pos >= 0 && pos < 5, "pos must be between 0 and 4");
    invariant(letter.length === 1, "letter must be one character");

    this.possibilities[pos] = letter;
    return this;
  }

  build() {
    const seekers = this.seeking.reduce((memo, seek) => {
      // seeker has been eliminated by another clue
      if (this.possibilities.every((possible) => !possible.includes(seek)))
        return memo;

      return `${memo}(?=.*${seek})`;
    }, "");

    const pattern = this.possibilities.reduce((memo, possible) => {
      return memo + `[${possible}]`;
    }, seekers);

    return new RegExp(pattern);
  }
}
