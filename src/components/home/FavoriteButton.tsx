"use client";

import { useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";

export function FavoriteButton({ destinationId }: { destinationId: string }) {
  const [favorite, setFavorite] = useState(() => isFavorite(destinationId));

  return (
    <button
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      onClick={(event) => {
        event.stopPropagation();
        setFavorite(toggleFavorite(destinationId));
      }}
      className="flex h-11 w-11 items-center justify-center rounded-pill border border-border-hairline bg-bg-canvas text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
    </button>
  );
}
