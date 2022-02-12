import React, { memo } from "react";

interface Props {
  remaining: string[];
  onSelect?: (answer: string) => void;
}

function RemainingList({ remaining, onSelect }: Props) {
  if (!remaining) return null;

  const list = remaining.reduce((memo, answer) => {
    if (memo.length > 0) {
      memo.push(", ");
    }
    memo.push(
      <button
        className="hover:underline"
        key={answer}
        onClick={() => onSelect && onSelect(answer)}
      >
        {answer}
      </button>
    );
    return memo;
  }, []);

  const numFormatter = new Intl.NumberFormat();
  return (
    <div className="font-mono">
      <p className="mb-4">
        {numFormatter.format(remaining.length)} out of{" "}
        {numFormatter.format(2315)} remaining
      </p>
      <div className="text-gray-400 text-sm leading-loose">{list}</div>
    </div>
  );
}

export default memo(RemainingList);
