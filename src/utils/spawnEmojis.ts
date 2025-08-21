import { EMOJI_POOL, TREE_AREA, SCALE_MIN, SCALE_MAX, RADIUS_BASE_PCT } from "../constants/game";
import type { EmojiItem } from "../types/emoji";
import { rand, dist2 } from "./math";

/** 겹치지 않게 스폰 (+ fresh: true 보장) */
export function spawnEmojis(count = 20): EmojiItem[] {
  const placed: EmojiItem[] = [];
  const MAX_TRIES = 200;

  for (let i = 0; i < count; i++) {
    const char = EMOJI_POOL[i % EMOJI_POOL.length];
    const scale = rand(SCALE_MIN, SCALE_MAX);
    const radius = RADIUS_BASE_PCT * scale;

    let ok = false;
    for (let t = 0; t < MAX_TRIES; t++) {
      const left = rand(TREE_AREA.leftMin + radius, TREE_AREA.leftMax - radius);
      const bottom = rand(TREE_AREA.bottomMin + radius, TREE_AREA.bottomMax - radius);

      let collide = false;
      for (const e of placed) {
        const need2 = (radius + e.radius) ** 2;
        if (dist2(left, bottom, e.left, e.bottom) < need2) { collide = true; break; }
      }
      if (collide) continue;

      placed.push({
        id: `e_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
        char, left, bottom, scale, radius,
        state: "onTree",
        fresh: true,
      });
      ok = true;
      break;
    }

    if (!ok) {
      const shrink = radius * 0.8;
      for (let t = 0; t < MAX_TRIES; t++) {
        const left = rand(TREE_AREA.leftMin + shrink, TREE_AREA.leftMax - shrink);
        const bottom = rand(TREE_AREA.bottomMin + shrink, TREE_AREA.bottomMax - shrink);

        let collide = false;
        for (const e of placed) {
          const need2 = (shrink + e.radius) ** 2;
          if (dist2(left, bottom, e.left, e.bottom) < need2) { collide = true; break; }
        }
        if (collide) continue;

        placed.push({
          id: `e_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
          char, left, bottom, scale, radius: shrink,
          state: "onTree",
          fresh: true,
        });
        break;
      }
    }
  }
  return placed;
}
