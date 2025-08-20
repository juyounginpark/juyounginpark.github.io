/** @jsxImportSource @emotion/react */
"use client";
import * as React from "react";

/* =========================
 * 상수/배치 파라미터
 * ========================= */
const R = 0.809; // 스테이지 가로:세로 비율

// 나무 위 랜덤 배치 영역(스테이지 % 좌표)
const TREE_AREA = {
  leftMin: 25,
  leftMax: 75,
  bottomMin: 45,
  bottomMax: 80,
};

// 이모지 스케일(±20%)
const SCALE_MIN = 0.8;
const SCALE_MAX = 1.2;

// 겹침 방지용 기본 반경(%)
const RADIUS_BASE_PCT = 4.0;

// 물리 파라미터
const GROUND_BOTTOM = 5;   // 바닥 Y(%)
const GRAVITY = -220;      // %/s^2

// 바구니 셋업
const BASKET_LEFT = 30;     // 바구니 중심 X(%)
const BASKET_BOTTOM = 40.3; // 바구니 윗면 근처 Y(%)
const BASKET_CAPACITY = 5;
const BASKET_h = 19;

// 바구니 슬롯(담긴 순서대로 배치): 0 1 2 / 3 4
const BASKET_SLOTS: Array<{ left: number; bottom: number }> = [
  { left: BASKET_LEFT - 4, bottom: BASKET_BOTTOM + 2 - BASKET_h }, // 0
  { left: BASKET_LEFT +  0, bottom: BASKET_BOTTOM + 2 - BASKET_h }, // 1
  { left: BASKET_LEFT +  4, bottom: BASKET_BOTTOM + 2 - BASKET_h }, // 2
  { left: BASKET_LEFT -  2, bottom: BASKET_BOTTOM - 1 - BASKET_h }, // 3
  { left: BASKET_LEFT +  2, bottom: BASKET_BOTTOM - 1 - BASKET_h }, // 4
];

// 더블탭 판정
const TAP_TIME = 300;
const TAP_DIST = 24;

// 바구니 비우기 애니메이션 파라미터
const LIFT_Y = 20;   // 리프트 높이(%) — 바구니/이모지 Y좌표 +20
const LIFT_MS = 250; // 리프트 상승 시간(ms)
const FLIP_MS = 700; // 뒤집기 시간(ms)

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const dist2 = (x1: number, y1: number, x2: number, y2: number) =>
  (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);

/* =========================
 * 타입
 * ========================= */
type EmojiState =
  | "onTree"
  | "wobble"
  | "falling"
  | "ground"
  | "toBasket"
  | "inBasket"
  | "removed";

type EmojiItem = {
  id: string;
  char: string;
  left: number;     // %
  bottom: number;   // %
  scale: number;    // 0.8~1.2
  radius: number;   // 겹침 방지용 반경(%)
  state: EmojiState;
  vy?: number;      // 낙하 속도
  slotIndex?: number; // 바구니 슬롯 인덱스
  fresh?: boolean;   // 🌱 새로 생성
};

/* =========================
 * 이모지 풀
 * ========================= */
const EMOJI_POOL = [
  "🍎","🍏","🍐","🍊","🍋","🍒","🍇","🍑","🍓","🍌",
  "🍉","🥝","🥥","🍍","🥭","🍈","🍅","🌰","🥕","🍆"
];

/* =========================
 * 겹치지 않게 스폰 (+ fresh: true 보장)
 * ========================= */
function spawnEmojis(count = 20): EmojiItem[] {
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
        if (dist2(left, bottom, e.left, e.bottom) < need2) {
          collide = true;
          break;
        }
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
      // 혼잡하면 반경 줄여 재시도
      const shrink = radius * 0.8;
      for (let t = 0; t < MAX_TRIES; t++) {
        const left = rand(TREE_AREA.leftMin + shrink, TREE_AREA.leftMax - shrink);
        const bottom = rand(TREE_AREA.bottomMin + shrink, TREE_AREA.bottomMax - shrink);

        let collide = false;
        for (const e of placed) {
          const need2 = (shrink + e.radius) ** 2;
          if (dist2(left, bottom, e.left, e.bottom) < need2) {
            collide = true;
            break;
          }
        }
        if (collide) continue;

        placed.push({
          id: `e_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
          char, left, bottom, scale, radius: shrink,
          state: "onTree",
          fresh: true,
        });
        ok = true;
        break;
      }
    }
  }
  return placed;
}

/* =========================
 * 컴포넌트
 * ========================= */
export default function Ingame() {
  /* 나무 흔들림 (더블탭/더블클릭만) */
  const [treeShaking, setTreeShaking] = React.useState(false);
  const lastTapTreeRef = React.useRef<{ t: number; x: number; y: number }>({ t: 0, x: 0, y: 0 });

  /* 이모지들 */
  const [emojis, setEmojis] = React.useState<EmojiItem[]>(() => spawnEmojis(20));

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
  const [basketLift, setBasketLift] = React.useState(false); // 👈 리프트 상태

  const basketCount = React.useMemo(
    () => emojis.filter(e => e.state === "inBasket" || e.state === "toBasket").length,
    [emojis]
  );

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
      if (!t || t.state !== "onTree") return prev;
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

  /* ===== 이모지: 더블클릭/더블탭 → 낙하 → 2초 후 슬롯 이동 ===== */
  const startFallToBasket = React.useCallback((id: string) => {
    setEmojis(prev => {
      const t = prev.find(e => e.id === id);
      if (!t) return prev;
      if (t.state !== "onTree" && t.state !== "wobble") return prev;
      return prev.map(e => (e.id === id ? { ...e, state: "falling", vy: 0 } : e));
    });

    // 로컬 물리
    let y: number;
    let vy = 0;
    {
      const t = emojis.find(e => e.id === id);
      y = t ? t.bottom : 65;
    }

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

        // 2초 → 0.5초로 살짝 빠르게 (요청에 맞춰 조정 가능)
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

    let y: number;
    let vy = 0;
    {
      const t = emojis.find(e => e.id === id);
      y = t ? t.bottom : 65;
    }

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

        // 1초 후 제거
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

  /* ===== 바구니에서 이모지 떨어뜨려 삭제 ===== */
  const dropFromBasketAndRemove = React.useCallback((id: string) => {
    // 현재 화면에서 보이는 Y(리프트 적용 상태면 +LIFT_Y)
    const item = emojis.find(e => e.id === id);
    if (!item) return;

    let y = item.bottom + (basketLift ? LIFT_Y : 0);
    let vy = 0;

    // falling으로 전환하면서 시작 y를 설정
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

        // 바닥 닿으면 바로 제거(또는 200~300ms 대기 후 제거)
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
  }, [emojis, basketLift]);

  /* ===== 바구니: 뒤집어 비우기(리프트 → 플립 + 낙하 → 원위치) ===== */
  const onBasketClick = React.useCallback(() => {
    const ids = emojis.filter(e => e.state === "inBasket" || e.state === "toBasket").map(e => e.id);
    if (ids.length === 0) return;
    if (basketFlippingNow) return;

    setBasketFlippingNow(true);

    // 1) 리프트: 바구니와 내부 이모지 Y + LIFT_Y
    setBasketLift(true);

    window.setTimeout(() => {
      // 2) 플립 시작 + 내부 이모지 낙하 시작
      setBasketFlip(true);
      ids.forEach(id => dropFromBasketAndRemove(id));

      // 3) 플립 종료 → 바구니 원위치
      window.setTimeout(() => {
        setBasketFlip(false);
        setBasketLift(false);
        setBasketFlippingNow(false);
      }, FLIP_MS);
    }, LIFT_MS);
  }, [emojis, basketFlippingNow, dropFromBasketAndRemove]);

  /* ===== 나무: 더블클릭/더블탭 → 2초 좌우+회전 스웨이 → 이모지 낙하 → 제거 → 리스폰 ===== */
  const startTreeShake = React.useCallback(() => {
    if (treeShaking) return;
    setTreeShaking(true);

    const SHAKE_MS = 2000;
    window.setTimeout(() => setTreeShaking(false), SHAKE_MS);

    const targets = emojis
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
  }, [treeShaking, emojis, dropToGroundOnly]);

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
    const t = emojis.find(e => e.id === id);
    if (!t) return;
    if (t.state === "inBasket" || t.state === "toBasket") return;
    startWobble(id);
  }, [emojis, startWobble]);

  const onEmojiDoubleClick = React.useCallback((id: string) => {
    const t = emojis.find(e => e.id === id);
    if (!t) return;
    if (t.state === "inBasket" || t.state === "toBasket") return;
    startFallToBasket(id);
  }, [emojis, startFallToBasket]);

  const onEmojiTouchStart = React.useCallback((id: string, e: React.TouchEvent) => {
    const t = emojis.find(x => x.id === id);
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
  }, [emojis, startFallToBasket, startWobble]);

  /* ===== 언마운트 클린업 ===== */
  React.useEffect(() => {
    return () => {
      Object.values(wobbleTimers.current).forEach(tid => window.clearTimeout(tid));
      Object.values(groundRemoveTimers.current).forEach(tid => window.clearTimeout(tid));
      Object.values(rafs.current).forEach(rid => cancelAnimationFrame(rid));
    };
  }, []);

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
          className={treeShaking ? "tree shake" : "tree"}
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
          }}
        />

        {/* 🧺 바구니 (탭: 리프트→플립→비우기) */}
        <img
          src="/images/basket.png"
          alt="basket"
          draggable={false}
          onClick={onBasketClick}
          className={basketFlip ? "basket flip" : "basket"}
          css={{
            position: "absolute",
            left: `${BASKET_LEFT}%`,
            bottom: `${basketLift ? 13 + LIFT_Y : 13}%`, // 👈 리프트 반영
            transform: "translateX(-50%)",
            width: "30%",
            aspectRatio: "1",
            objectFit: "contain",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
            cursor: basketCount > 0 ? "pointer" : "default",
            transition: "bottom 0.25s ease", // 👈 부드러운 상승
          }}
        />

        {/* 🍎 이모지들 */}
        {emojis
          .filter(e => e.state !== "removed")
          .map((e) => {
            const inBasket = e.state === "inBasket" || e.state === "toBasket";
            const effectiveBottom = e.bottom + (basketLift && inBasket ? LIFT_Y : 0); // 👈 리프트 반영
            const transition =
              inBasket
                ? "left 0.8s ease, bottom 0.5s ease, transform 0.25s ease"
                : (e.state === "toBasket" ? "left 0.8s ease, bottom 0.8s ease" : "none");

            const swayWithTree = treeShaking && (e.state === "onTree" || e.state === "wobble");

            return (
              <div
                key={e.id}
                role="button"
                aria-label="emoji"
                onClick={() => onEmojiClick(e.id)}
                onDoubleClick={() => onEmojiDoubleClick(e.id)}
                onTouchStart={(ev) => onEmojiTouchStart(e.id, ev)}
                onTransitionEnd={(ev) => onEmojiTransitionEnd(ev, e.id)}
                className={`emoji ${e.state === "wobble" ? "wobble" : ""} ${swayWithTree ? "tree-sway" : ""} ${e.fresh ? "fresh-grow" : ""} ${inBasket ? "in-basket" : ""}`}
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
                  cursor:
                    inBasket ? "default" : "pointer",
                  pointerEvents:
                    inBasket ? "none" : "auto",
                  transition,
                }}
              >
                {e.char}
              </div>
            );
          })}
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

      {/* 전역 keyframes */}
      <style jsx global>{`
        /* 나무 좌우 흔들림 */
        @keyframes shakeX {
          0%   { transform: translateX(0); }
          10%  { transform: translateX(-10px); }
          20%  { transform: translateX(10px); }
          30%  { transform: translateX(-8px); }
          40%  { transform: translateX(8px); }
          50%  { transform: translateX(-6px); }
          60%  { transform: translateX(6px); }
          70%  { transform: translateX(-4px); }
          80%  { transform: translateX(4px); }
          90%  { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
        .shake { animation: shakeX 2s ease; }

        /* 이모지: 단일 흔들림(±40°, 0.8초) */
        @keyframes wobbleRotate {
          0%   { transform: translate(-50%, 0) rotate(0deg); }
          15%  { transform: translate(-50%, 0) rotate(40deg); }
          35%  { transform: translate(-50%, 0) rotate(-32deg); }
          55%  { transform: translate(-50%, 0) rotate(24deg); }
          75%  { transform: translate(-50%, 0) rotate(-12deg); }
          100% { transform: translate(-50%, 0) rotate(0deg); }
        }
        .emoji.wobble { animation: wobbleRotate 0.8s ease-in-out; }

        /* 이모지: 나무와 동조 좌우 + 회전 스웨이(2초) */
        @keyframes swayRot {
          0%   { transform: translate(-50%, 0) rotate(0deg)    translateX(0); }
          10%  { transform: translate(-50%, 0) rotate(14deg)   translateX(-10px); }
          20%  { transform: translate(-50%, 0) rotate(-14deg)  translateX(10px); }
          30%  { transform: translate(-50%, 0) rotate(12deg)   translateX(-8px); }
          40%  { transform: translate(-50%, 0) rotate(-12deg)  translateX(8px); }
          50%  { transform: translate(-50%, 0) rotate(9deg)    translateX(-6px); }
          60%  { transform: translate(-50%, 0) rotate(-9deg)   translateX(6px); }
          70%  { transform: translate(-50%, 0) rotate(6deg)    translateX(-4px); }
          80%  { transform: translate(-50%, 0) rotate(-6deg)   translateX(4px); }
          90%  { transform: translate(-50%, 0) rotate(3deg)    translateX(-2px); }
          100% { transform: translate(-50%, 0) rotate(0deg)    translateX(0); }
        }
        .emoji.tree-sway { animation: swayRot 2s ease; }

        /* 겹칠 때: wobble + tree-sway */
        .emoji.tree-sway.wobble {
          animation: wobbleRotate 0.8s ease-in-out, swayRot 2s ease;
        }

        /* 🌱 새로 생성된 이모지: 씨앗 → 살짝 오버슛 → 안정 */
        @keyframes growIn {
          0%   { transform: translate(-50%, 0) scale(0.2); opacity: 0; }
          60%  { transform: translate(-50%, 0) scale(1.08); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); }
        }
        .emoji.fresh-grow {
          animation: growIn 600ms cubic-bezier(.2,.8,.2,1);
          transform-origin: 50% 70%;
        }

        /* 트리 스웨이 + fresh-grow 동시 */
        .emoji.tree-sway.fresh-grow {
          animation: growIn 600ms cubic-bezier(.2,.8,.2,1), swayRot 2s ease;
        }

        /* 바구니 뒤집힘 */
        @keyframes flipBasket {
          0%   { transform: translateX(-50%) rotate(0deg); }
          60%  { transform: translateX(-50%) rotate(-170deg); }
          100% { transform: translateX(-50%) rotate(-180deg); }
        }
        .basket.flip {
          animation: flipBasket ${FLIP_MS}ms ease;
          transform-origin: 50% 60%;
        }

        /* 클릭 흔들림(wobble) + 자라남(fresh-grow) 동시 적용 */
        .emoji.wobble.fresh-grow {
          animation: wobbleRotate 0.8s ease-in-out, growIn 600ms cubic-bezier(.2,.8,.2,1);
        }

        /* 트리 스웨이 + 클릭 흔들림 동시 적용 */
        .emoji.tree-sway.wobble {
          animation: wobbleRotate 0.8s ease-in-out, swayRot 2s ease;
        }

        /* 트리 스웨이 + 클릭 흔들림 + 자라남 모두 동시 적용 */
        .emoji.tree-sway.wobble.fresh-grow {
          animation: wobbleRotate 0.8s ease-in-out, growIn 600ms cubic-bezier(.2,.8,.2,1), swayRot 2s ease;
        }
      `}</style>
    </div>
  );
}
