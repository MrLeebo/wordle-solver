import React, { memo } from "react";

interface Props {
  remaining: string[];
}

function RemainingList({ remaining }: Props) {
  if (!remaining) return null;

  const numFormatter = new Intl.NumberFormat();
  return (
    <div className="font-mono">
      <p className="mb-4">
        {numFormatter.format(remaining.length)} out of{" "}
        {numFormatter.format(2315)} remaining
      </p>
      <div className="text-gray-400 text-sm leading-loose">
        {remaining.join(", ")}
      </div>
    </div>
  );
}

export default memo(RemainingList);
