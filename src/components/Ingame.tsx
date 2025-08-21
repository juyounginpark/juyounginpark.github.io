/** @jsxImportSource @emotion/react */
"use client";
import * as React from "react";
import "../styles/ingame.css";

import {
  R, GROUND_BOTTOM, GRAVITY,
  BASKET_LEFT, BASKET_CAPACITY, LIFT_Y, LIFT_MS, FLIP_MS,
  TAP_TIME, TAP_DIST, BASKET_SLOTS
} from "../constants/game";

import type { EmojiItem } from "../types/emoji";
import { spawnEmojis } from "../utils/spawnEmojis";

/* =========================
 * 컴포넌트
 * ========================= */
export default function Ingame() {
  /* 나무 흔들림 (더블탭/더블클릭만) */
  const [treeShaking, setTreeShaking] = React.useState(false);
  const lastTapTreeRef = React.useRef<{ t: number; x: number; y: number }>({ t: 0, x: 0, y: 0 });

  /* 이모지들 */
  const [emojis, setEmojis] = React.useState<EmojiItem[]>(() => spawnEmojis(20));
  const emojisRef = React.useRef<EmojiItem[]>(emojis);
  React.useEffect(() => { emojisRef.current = emojis; }, [emojis]);

  /* 이모지: 더블탭 판정용 */
  const lastTapPerEmoji = React.useRef<Record<string, { t: number; x: number; y: number }>>({});

  /* 흔들림 타이머 저장 */
  const wobbleTimers = React.useRef<Record<string, number>>({});

  /* 낙하용 RAF/ts */
  const rafs = React.useRef<Record<string, number>>({});
  const lastTs = React.useRef<Record<string, number>>({});

  /* 바닥 도착 후 제거(나무 흔들림 낙하 전용) */
  const groundRemoveTimers = React.useRef<Record<string, number>>({});

  /* 바구니 */
  const [basketFlip, setBasketFlip] = React.useState(false);
  const [basketFlippingNow, setBasketFlippingNow] = React.useState(false);
  const [basketLift, setBasketLift] = React.useState(false);

  const basketCount = React.useMemo(
    () => emojis.filter(e => e.state === "inBasket" || e.state === "toBasket").length,
    [emojis]
  );

  const basketSwaying = treeShaking && !basketFlippingNow; // 🌳가 흔들리면 바구니/바구니 과일도 같이 스웨이

  /* ===== 공통 ===== */
  const updateEmoji = React.useCallback((id: string, patch: Partial<EmojiItem>) => {
    setEmojis(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const removeInBasketAll = React.useCallback(() => {
    setEmojis(prev => prev.filter(e => e.state !== "inBasket" && e.state !== "toBasket"));
  }, []);

  /* ===== 이모지: 흔들림(단일 클릭/탭) ===== */
  const startWobble = React.useCallback((id: string) => {
    setEmojis(prev => {
      const t = prev.find(e => e.id === id);
      if (!t || (t.state !== "onTree" && t.state !== "wobble")) return prev;
      return prev.map(e => (e.id === id ? { ...e, state: "wobble" } : e));
    });

    if (wobbleTimers.current[id]) window.clearTimeout(wobbleTimers.current[id]);
    wobbleTimers.current[id] = window.setTimeout(() => {
      updateEmoji(id, { state: "onTree" });
      delete wobbleTimers.current[id];
    }, 800);
  }, [updateEmoji]);

  /* ===== 바구니: 슬롯 예약 + 이동 ===== */
  const reserveSlotAndMove = React.useCallback((id: string) => {
    setEmojis(prev => {
      const used = new Set<number>();
      for (const e of prev) {
        if ((e.state === "inBasket" || e.state === "toBasket") && e.slotIndex != null) {
          used.add(e.slotIndex);
        }
      }
      let freeIdx: number | null = null;
      for (let i = 0; i < BASKET_CAPACITY; i++) {
        if (!used.has(i)) { freeIdx = i; break; }
      }
      if (freeIdx == null) return prev; // 만석

      return prev.map(e => {
        if (e.id !== id) return e;
        const slot = BASKET_SLOTS[freeIdx!];
        return {
          ...e,
          state: "toBasket",
          slotIndex: freeIdx!,
          left: slot.left,
          bottom: slot.bottom,
        };
      });
    });
  }, []);

  /* ===== 이모지: 더블클릭/더블탭 → 낙하 → 0.5초 후 슬롯 이동 ===== */
  const startFallToBasket = React.useCallback((id: string) => {
    setEmojis(prev => {
      const t = prev.find(e => e.id === id);
      if (!t) return prev;
      if (t.state !== "onTree" && t.state !== "wobble") return prev;
      return prev.map(e => (e.id === id ? { ...e, state: "falling", vy: 0 } : e));
    });

    let y = emojis.find(e => e.id === id)?.bottom ?? 65;
    let vy = 0;

    const step = (ts: number) => {
      if (lastTs.current[id] == null) {
        lastTs.current[id] = ts;
        rafs.current[id] = requestAnimationFrame(step);
        return;
      }
      const dt = (ts - lastTs.current[id]) / 1000;
      lastTs.current[id] = ts;

      vy += GRAVITY * dt;
      y += vy * dt;

      if (y <= GROUND_BOTTOM) {
        y = GROUND_BOTTOM;
        setEmojis(prev => prev.map(e => (e.id === id ? { ...e, bottom: y, vy: 0, state: "ground" } : e)));
        cancelAnimationFrame(rafs.current[id]);
        delete rafs.current[id];
        delete lastTs.current[id];

        window.setTimeout(() => reserveSlotAndMove(id), 500);
        return;
      }

      const yNow = y, vyNow = vy;
      setEmojis(prev => prev.map(e => (e.id === id ? { ...e, bottom: yNow, vy: vyNow } : e)));
      rafs.current[id] = requestAnimationFrame(step);
    };

    rafs.current[id] = requestAnimationFrame(step);
  }, [emojis, reserveSlotAndMove]);

  /* ===== 이모지: 바닥까지만 낙하(나무 흔들림 완료 후 강제 낙하) → 1초 뒤 제거 ===== */
  const dropToGroundOnly = React.useCallback((id: string) => {
    setEmojis(prev => {
      const t = prev.find(e => e.id === id);
      if (!t) return prev;
      if (t.state !== "onTree" && t.state !== "wobble") return prev;
      return prev.map(e => (e.id === id ? { ...e, state: "falling", vy: 0 } : e));
    });

    let y = emojis.find(e => e.id === id)?.bottom ?? 65;
    let vy = 0;

    const step = (ts: number) => {
      if (lastTs.current[id] == null) {
        lastTs.current[id] = ts;
        rafs.current[id] = requestAnimationFrame(step);
        return;
      }
      const dt = (ts - lastTs.current[id]) / 1000;
      lastTs.current[id] = ts;

      vy += GRAVITY * dt;
      y += vy * dt;

      if (y <= GROUND_BOTTOM) {
        y = GROUND_BOTTOM;
        setEmojis(prev => prev.map(e => (e.id === id ? { ...e, bottom: y, vy: 0, state: "ground" } : e)));
        cancelAnimationFrame(rafs.current[id]);
        delete rafs.current[id];
        delete lastTs.current[id];

        if (groundRemoveTimers.current[id]) clearTimeout(groundRemoveTimers.current[id]);
        groundRemoveTimers.current[id] = window.setTimeout(() => {
          updateEmoji(id, { state: "removed" });
          delete groundRemoveTimers.current[id];
        }, 1000);
        return;
      }

      const yNow = y, vyNow = vy;
      setEmojis(prev => prev.map(e => (e.id === id ? { ...e, bottom: yNow, vy: vyNow } : e)));
      rafs.current[id] = requestAnimationFrame(step);
    };

    rafs.current[id] = requestAnimationFrame(step);
  }, [emojis, updateEmoji]);

  /* ===== 바구니에서 이모지 떨어뜨려 삭제 (시작 높이 지정 가능) ===== */
  const dropFromBasketAndRemove = React.useCallback((id: string, startBottom?: number) => {
    const item = emojisRef.current.find(e => e.id === id);
    if (!item) return;

    let y = (startBottom != null)
      ? startBottom
      : (item.bottom + (basketLift ? LIFT_Y : 0));
    let vy = 0;

    setEmojis(prev => prev.map(e =>
      e.id === id ? { ...e, state: "falling", bottom: y, vy: 0 } : e
    ));

    const step = (ts: number) => {
      if (lastTs.current[id] == null) {
        lastTs.current[id] = ts;
        rafs.current[id] = requestAnimationFrame(step);
        return;
      }
      const dt = (ts - lastTs.current[id]) / 1000;
      lastTs.current[id] = ts;

      vy += GRAVITY * dt;
      y += vy * dt;

      if (y <= GROUND_BOTTOM) {
        y = GROUND_BOTTOM;
        setEmojis(prev => prev.map(e => (e.id === id ? { ...e, bottom: y, vy: 0 } : e)));
        cancelAnimationFrame(rafs.current[id]);
        delete rafs.current[id];
        delete lastTs.current[id];

        window.setTimeout(() => {
          setEmojis(prev => prev.map(e => (e.id === id ? { ...e, state: "removed" } : e)));
        }, 200);
        return;
      }

      const yNow = y;
      setEmojis(prev => prev.map(e => (e.id === id ? { ...e, bottom: yNow } : e)));
      rafs.current[id] = requestAnimationFrame(step);
    };

    rafs.current[id] = requestAnimationFrame(step);
  }, [basketLift]);

  /* ===== 바구니: 탭 → 리프트(느리게) → 플립 + 낙하 → 원위치 ===== */
  const onBasketClick = React.useCallback(() => {
    const ids = emojisRef.current
      .filter(e => e.state === "inBasket" || e.state === "toBasket")
      .map(e => e.id);
    if (ids.length === 0) return;
    if (basketFlippingNow) return;

    setBasketFlippingNow(true);

    // 1) 리프트 시작 (바구니 + 바구니 안 과일 모두 상승)
    setBasketLift(true);

    window.setTimeout(() => {
      // 2) 플립 시작
      setBasketFlip(true);

      // 현재 보이는 높이(= bottom + LIFT_Y)에서 낙하 시작
      const cur = emojisRef.current;
      ids.forEach(id => {
        const it = cur.find(e => e.id === id);
        if (!it) return;
        const startBottom = it.bottom + LIFT_Y;
        dropFromBasketAndRemove(id, startBottom);
      });

      // 3) 플립 종료 → 원위치
      window.setTimeout(() => {
        setBasketFlip(false);
        setBasketLift(false);
        setBasketFlippingNow(false);
        removeInBasketAll(); // 안전 청소
      }, FLIP_MS);
    }, LIFT_MS);
  }, [basketFlippingNow, removeInBasketAll, dropFromBasketAndRemove]);

  /* ===== 나무: 더블클릭/더블탭 → 2초 스웨이 → 이모지 낙하 → 제거 → 리스폰 ===== */
  const startTreeShake = React.useCallback(() => {
    if (treeShaking) return;
    setTreeShaking(true);

    const SHAKE_MS = 2000;
    window.setTimeout(() => setTreeShaking(false), SHAKE_MS);

    const targets = emojisRef.current
      .filter(e => e.state === "onTree" || e.state === "wobble")
      .map(e => e.id);

    window.setTimeout(() => {
      targets.forEach(id => dropToGroundOnly(id));
    }, SHAKE_MS);

    window.setTimeout(() => {
      setEmojis(prev => {
        const keep = prev.filter(e => e.state === "inBasket" || e.state === "toBasket");
        return [...keep, ...spawnEmojis(20)];
      });
    }, SHAKE_MS + 2000);
  }, [treeShaking, dropToGroundOnly]);

  const onTreeDoubleClick = React.useCallback(() => {
    startTreeShake();
  }, [startTreeShake]);

  const onTreeTouchStart = React.useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const now = Date.now();
    const dt = now - lastTapTreeRef.current.t;
    const dx = touch.clientX - lastTapTreeRef.current.x;
    const dy = touch.clientY - lastTapTreeRef.current.y;
    const d2 = dx*dx + dy*dy;

    if (dt <= TAP_TIME && d2 <= TAP_DIST*TAP_DIST) {
      e.preventDefault();
      startTreeShake();
      lastTapTreeRef.current = { t: 0, x: 0, y: 0 };
    } else {
      lastTapTreeRef.current = { t: now, x: touch.clientX, y: touch.clientY };
    }
  }, [startTreeShake]);

  /* ===== 이모지 전환 종료: 바구니 도착 처리 ===== */
  const onEmojiTransitionEnd = React.useCallback((e: React.TransitionEvent<HTMLDivElement>, id: string) => {
    setEmojis(prev => prev.map(x => (x.id === id && x.state === "toBasket" ? { ...x, state: "inBasket" } : x)));
  }, []);

  /* ===== 이모지 이벤트 바인딩 ===== */
  const onEmojiClick = React.useCallback((id: string) => {
    const t = emojisRef.current.find(e => e.id === id);
    if (!t) return;
    if (t.state === "inBasket" || t.state === "toBasket") return;
    startWobble(id);
  }, [startWobble]);

  const onEmojiDoubleClick = React.useCallback((id: string) => {
    const t = emojisRef.current.find(e => e.id === id);
    if (!t) return;
    if (t.state === "inBasket" || t.state === "toBasket") return;
    startFallToBasket(id);
  }, [startFallToBasket]);

  const onEmojiTouchStart = React.useCallback((id: string, e: React.TouchEvent) => {
    const t = emojisRef.current.find(x => x.id === id);
    if (!t) return;
    if (t.state === "inBasket" || t.state === "toBasket") return;

    const touch = e.changedTouches[0];
    const rec = lastTapPerEmoji.current[id] || { t: 0, x: 0, y: 0 };
    const now = Date.now();
    const dt = now - rec.t;
    const dx = touch.clientX - rec.x;
    const dy = touch.clientY - rec.y;
    const d2 = dx*dx + dy*dy;

    if (dt <= TAP_TIME && d2 <= TAP_DIST*TAP_DIST) {
      e.preventDefault();
      startFallToBasket(id);
      lastTapPerEmoji.current[id] = { t: 0, x: 0, y: 0 };
    } else {
      startWobble(id);
      lastTapPerEmoji.current[id] = { t: now, x: touch.clientX, y: touch.clientY };
    }
  }, [startFallToBasket, startWobble]);

  /* ===== 언마운트 클린업 ===== */
  React.useEffect(() => {
    return () => {
      Object.values(wobbleTimers.current).forEach(tid => window.clearTimeout(tid));
      Object.values(groundRemoveTimers.current).forEach(tid => window.clearTimeout(tid));
      Object.values(rafs.current).forEach(rid => cancelAnimationFrame(rid));
    };
  }, []);

  const basketClass =
    `basket ${basketFlip ? "flip" : ""} ${basketSwaying ? "sway" : ""}`;

  return (
    <div
      css={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* 비율 고정 스테이지 */}
      <div
        css={{
          position: "relative",
          aspectRatio: String(R),
          width: `min(100vw, calc(100svh * ${R}))`,
          overflow: "hidden",
        }}
      >
      {/* 🌳 나무 */}
      <img
        src="/images/tree.png"
        alt="tree"
        draggable={false}
        onDoubleClick={onTreeDoubleClick}
        onTouchStart={onTreeTouchStart}
        className={`tree ${treeShaking ? "shake" : ""}`}
        css={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          cursor: "pointer",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          zIndex: 1,
        }}
      />

      {/* 🍎 과일 레이어 (나무와 동기화해 좌우 이동) */}
      <div
        className={treeShaking ? "fruit-layer shake" : "fruit-layer"}
        css={{
          position: "absolute",
          inset: 0,
          zIndex: 3,               // 바구니 뒤(2)보다 위, 바구니 앞(4)보다 아래
          pointerEvents: "none",   // 이벤트는 과일마다 처리
        }}
      >
        {emojis
          .filter(e => e.state !== "removed" && e.state !== "inBasket" && e.state !== "toBasket")
          .map((e) => {
            const rotateWithTree = treeShaking && (e.state === "onTree" || e.state === "wobble");
            return (
              <div
                key={e.id}
                role="button"
                aria-label="emoji"
                onClick={() => onEmojiClick(e.id)}
                onDoubleClick={() => onEmojiDoubleClick(e.id)}
                onTouchStart={(ev) => onEmojiTouchStart(e.id, ev)}
                onTransitionEnd={(ev) => onEmojiTransitionEnd(ev, e.id)}
                className={[
                  "emoji",
                  e.state === "wobble" ? "wobble" : "",
                  rotateWithTree ? "tree-rotate" : "",   // ← 나무 흔들릴 때 각도만
                  e.fresh ? "fresh-grow" : "",
                ].join(" ").trim()}
                css={{
                  position: "absolute",
                  left: `${e.left}%`,
                  bottom: `${e.bottom}%`,
                  fontSize: `calc(min(8vw, 48px) * ${e.scale.toFixed(2)})`,
                  lineHeight: 1,
                  transform: "translate(-50%, 0)",
                  transformOrigin: "50% 70%",
                  userSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  outline: "none",
                  cursor: "pointer",
                  pointerEvents: "auto",
                  zIndex: 3,
                }}
              >
                {e.char}
              </div>
            );
          })}
      </div>

      {/* 🧺 바구니 (뒤) */}
      <img
        src="/images/basket.png"
        alt="basket"
        draggable={false}
        onClick={onBasketClick}
        className={`basket ${basketFlip ? "flip" : ""} ${basketSwaying ? "sway" : ""}`}
        css={{
          position: "absolute",
          left: `${BASKET_LEFT}%`,
          bottom: `${basketLift ? 13 + LIFT_Y : 13}%`,
          transform: "translateX(-50%)",
          width: "30%",
          aspectRatio: "1",
          objectFit: "contain",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          cursor: basketCount > 0 ? "pointer" : "default",
          transition: `bottom ${LIFT_MS}ms ease`,
          zIndex: 2,  // 바구니 뒤
        }}
      />

      {/* 🍎 바구니 과일만 별도 렌더 (나무 영향 X, 바구니에 맞춰 스웨이) */}
      {emojis
        .filter(e => e.state === "inBasket" || e.state === "toBasket")
        .map((e) => {
          const effectiveBottom = e.bottom + (basketLift ? LIFT_Y : 0);
          const transition = `left 0.8s ease, bottom ${LIFT_MS}ms ease, transform ${LIFT_MS}ms ease`;
          return (
            <div
              key={e.id}
              role="button"
              aria-label="emoji"
              onTransitionEnd={(ev) => onEmojiTransitionEnd(ev, e.id)}
              className={[
                "emoji",
                basketSwaying ? "in-basket-sway" : "",  // ← 바구니 좌우 스웨이만
                "in-basket",
              ].join(" ").trim()}
              css={{
                position: "absolute",
                left: `${e.left}%`,
                bottom: `${effectiveBottom}%`,
                fontSize: `calc(min(8vw, 48px) * ${e.scale.toFixed(2)})`,
                lineHeight: 1,
                transform: "translate(-50%, 0)",
                transformOrigin: "50% 70%",
                userSelect: "none",
                WebkitTapHighlightColor: "transparent",
                outline: "none",
                cursor: "default",
                pointerEvents: "none",
                transition,
                zIndex: 3,
              }}
            >
              {e.char}
            </div>
          );
        })}

      {/* 🧺 바구니 앞 오버레이 */}
      <img
        src="/images/basket_front.png"
        alt="basket front"
        draggable={false}
        className={`basket ${basketFlip ? "flip" : ""} ${basketSwaying ? "sway" : ""}`}
        css={{
          position: "absolute",
          left: `${BASKET_LEFT}%`,
          bottom: `${basketLift ? 13 + LIFT_Y : 13}%`,
          transform: "translateX(-50%)",
          width: "30%",
          aspectRatio: "1",
          objectFit: "contain",
          userSelect: "none",
          WebkitTapHighlightColor: "transparent",
          pointerEvents: "none",
          transition: `bottom ${LIFT_MS}ms ease`,
          zIndex: 4, // 바구니 앞
        }}
      />

      </div>

      {/* 안내 */}
      <div
        css={{
          position: "fixed",
          bottom: "2svh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          color: "#fff",
          font:
            '400 clamp(12px, 2.2vw, 18px)/1.4 "DungGeunMo", -apple-system, Roboto, Helvetica, Arial, sans-serif',
          background: "rgba(0,0,0,0.6)",
          padding: "6px 10px",
          borderRadius: "6px",
        }}
      >
        나무를 <b>더블탭</b>하여 새로고침
      </div>
    </div>
  );
}
