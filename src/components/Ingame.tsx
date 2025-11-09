/** @jsxImportSource @emotion/react */
"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import "../styles/ingame.css";

import {
  R, GROUND_BOTTOM, GRAVITY,
  BASKET_LEFT, BASKET_CAPACITY, LIFT_Y, LIFT_MS, FLIP_MS,
  TAP_TIME, TAP_DIST, BASKET_SLOTS
} from "../constants/game";

import type { EmojiItem } from "../types/emoji";
import { spawnEmojis } from "../utils/spawnEmojis";
import {
  apiStartGame,
  apiPickEmoji,
  apiRefreshEmojis,
  apiDeleteEmojisFromBasket,
  apiFinishGame,
} from "@/lib/api";

export default function Ingame() {
  const router = useRouter();
  const [runId, setRunId] = React.useState<string | null>(null);
  const [treeShaking, setTreeShaking] = React.useState(false);
  const lastTapTreeRef = React.useRef<{ t: number; x: number; y: number }>({ t: 0, x: 0, y: 0 });
  const [emojis, setEmojis] = React.useState<EmojiItem[]>(() => spawnEmojis(20));
  const emojisRef = React.useRef<EmojiItem[]>(emojis);
  React.useEffect(() => { emojisRef.current = emojis; }, [emojis]);
  const lastTapPerEmoji = React.useRef<Record<string, { t: number; x: number; y: number }>>({});
  const wobbleTimers = React.useRef<Record<string, number>>({});
  const rafs = React.useRef<Record<string, number>>({});
  const lastTs = React.useRef<Record<string, number>>({});
  const groundRemoveTimers = React.useRef<Record<string, number>>({});
  const [basketFlip, setBasketFlip] = React.useState(false);
  const [basketFlippingNow, setBasketFlippingNow] = React.useState(false);
  const [basketLift, setBasketLift] = React.useState(false);

  const basketCount = React.useMemo(
    () => emojis.filter(e => e.state === "inBasket" || e.state === "toBasket").length,
    [emojis]
  );

  const basketSwaying = treeShaking && !basketFlippingNow;

  const handleConfirmClick = React.useCallback(() => {
    if (!runId) {
      console.warn("⚠️ runId 없음 - 확인 버튼");
      return;
    }
    console.log("🎯 결과 생성 API 호출...");
    apiFinishGame({ run_id: runId }).then(data => {
      console.log("✅ 결과 생성 성공:", data);
      router.push(`/result?share_id=${data.share_id}`);
    }).catch(err => console.error("❌ 결과 생성 실패:", err));
  }, [router, runId]);

  const updateEmoji = React.useCallback((id: string, patch: Partial<EmojiItem>) => {
    setEmojis(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const removeInBasketAll = React.useCallback(() => {
    setEmojis(prev => prev.filter(e => e.state !== "inBasket" && e.state !== "toBasket"));
  }, []);

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
      if (freeIdx == null) {
        console.warn("⚠️ 바구니 슬롯 만석");
        return prev;
      }
      return prev.map(e => {
        if (e.id !== id) return e;
        const slot = BASKET_SLOTS[freeIdx!];
        return { ...e, state: "toBasket", slotIndex: freeIdx!, left: slot.left, bottom: slot.bottom };
      });
    });
  }, []);

  const startFallToBasket = React.useCallback((id: string) => {
    const current = emojisRef.current.find(e => e.id === id);
    if (!current) { console.warn("⚠️ 이모지를 찾을 수 없음:", id); return; }
    if (!runId) { console.warn("⚠️ runId 없음 - 이모지 선택 불가"); return; }
    if (current.state !== "onTree" && current.state !== "wobble") { console.warn("⚠️ 잘못된 이모지 상태:", current.state); return; }
    if (basketCount >= BASKET_CAPACITY) { console.warn("⚠️ 바구니 가득참"); return; }

    console.log(`🎯 이모지 선택 API 호출: ${current.char}`);
    apiPickEmoji({ emoji: current.char }).then(res => {
      console.log("✅ 이모지 선택 성공:", res);
      if (!res.ok) { console.warn("⚠️ API에서 ok=false 반환"); return; }

      const startY = current.bottom;
      setEmojis(prev => prev.map(e => (e.id === id ? { ...e, state: "falling", vy: 0 } : e)));
      let y = startY, vy = 0;

      const step = (ts: number) => {
        if (lastTs.current[id] == null) { lastTs.current[id] = ts; rafs.current[id] = requestAnimationFrame(step); return; }
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
    }).catch(err => {
      console.error("❌ 이모지 선택 실패:", err);
      if (err.response?.status === 409) console.warn("⚠️ 중복 선택 (409 DUPLICATE_PICK)");
      else if (err.response?.status === 400) console.warn("⚠️ 잘못된 요청 (400 BAD_REQUEST)");
      else console.error("❌ 알 수 없는 에러:", err.message);
    });
  }, [reserveSlotAndMove, basketCount, runId]);

  const dropToGroundOnly = React.useCallback((id: string) => {
    const current = emojisRef.current.find(e => e.id === id);
    if (!current) return;
    if (current.state !== "onTree" && current.state !== "wobble") return;
    const startY = current.bottom;
    setEmojis(prev => prev.map(e => (e.id === id ? { ...e, state: "falling", vy: 0 } : e)));
    let y = startY, vy = 0;

    const step = (ts: number) => {
      if (lastTs.current[id] == null) { lastTs.current[id] = ts; rafs.current[id] = requestAnimationFrame(step); return; }
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
          setEmojis(prev => prev.map(e => (e.id === id ? { ...e, state: "removed" } : e)));
          delete groundRemoveTimers.current[id];
        }, 1000);
        return;
      }
      const yNow = y, vyNow = vy;
      setEmojis(prev => prev.map(e => (e.id === id ? { ...e, bottom: yNow, vy: vyNow } : e)));
      rafs.current[id] = requestAnimationFrame(step);
    };
    rafs.current[id] = requestAnimationFrame(step);
  }, []);

  const dropFromBasketAndRemove = React.useCallback((id: string, startBottom?: number) => {
    const item = emojisRef.current.find(e => e.id === id);
    if (!item) return;
    let y = (startBottom != null) ? startBottom : (item.bottom + (basketLift ? LIFT_Y : 0));
    let vy = 0;
    setEmojis(prev => prev.map(e => e.id === id ? { ...e, state: "falling", bottom: y, vy: 0 } : e));

    const step = (ts: number) => {
      if (lastTs.current[id] == null) { lastTs.current[id] = ts; rafs.current[id] = requestAnimationFrame(step); return; }
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

  const onBasketClick = React.useCallback(() => {
    const ids = emojisRef.current.filter(e => e.state === "inBasket" || e.state === "toBasket").map(e => e.id);
    if (ids.length === 0) { console.log("ℹ️ 바구니가 비어있음"); return; }
    if (basketFlippingNow) { console.log("ℹ️ 이미 바구니를 비우는 중"); return; }
    if (!runId) { console.warn("⚠️ runId 없음 - 바구니 비우기 불가"); return; }

    console.log("🗑️ 바구니 비우기 API 호출...");
    apiDeleteEmojisFromBasket().then(data => {
      console.log("✅ 바구니 비우기 성공:", data);
      if (!data.ok) { console.warn("⚠️ API에서 ok=false 반환"); return; }
      setBasketFlippingNow(true);
      setBasketLift(true);
      window.setTimeout(() => {
        setBasketFlip(true);
        const cur = emojisRef.current;
        ids.forEach(id => {
          const it = cur.find(e => e.id === id);
          if (!it) return;
          const startBottom = it.bottom + LIFT_Y;
          dropFromBasketAndRemove(id, startBottom);
        });
        window.setTimeout(() => {
          setBasketFlip(false);
          setBasketLift(false);
          setBasketFlippingNow(false);
          removeInBasketAll();
        }, FLIP_MS);
      }, LIFT_MS);
    }).catch(err => console.error("❌ 바구니 비우기 실패:", err));
  }, [basketFlippingNow, removeInBasketAll, dropFromBasketAndRemove, runId]);

  const startTreeShake = React.useCallback(() => {
    if (treeShaking) { console.log("ℹ️ 이미 나무를 흔드는 중"); return; }
    if (!runId) { console.warn("⚠️ runId 없음 - 나무 흔들기 불가"); return; }
    setTreeShaking(true);
    const SHAKE_MS = 2000;
    window.setTimeout(() => setTreeShaking(false), SHAKE_MS);
    console.log("🌳 나무 흔들기 API 호출...");
    apiRefreshEmojis({ run_id: runId }).then(data => {
      console.log("✅ 새로고침 성공:", data);
      console.log("🆕 새 이모지 풀:", data.pool);
      const targets = emojisRef.current.filter(e => e.state === "onTree" || e.state === "wobble").map(e => e.id);
      window.setTimeout(() => { targets.forEach(id => dropToGroundOnly(id)); }, SHAKE_MS);
      window.setTimeout(() => {
        setEmojis(prev => {
          const keep = prev.filter(e => e.state === "inBasket" || e.state === "toBasket");
          const newEmojis = spawnEmojis(20, data.pool);
          console.log(`🌟 새 이모지 스폰 완료: 유지 ${keep.length}개 + 신규 ${newEmojis.length}개`);
          return [...keep, ...newEmojis];
        });
      }, SHAKE_MS + 2000);
    }).catch(err => {
      console.error("❌ 새로고침 실패:", err);
      setTreeShaking(false);
    });
  }, [treeShaking, dropToGroundOnly, runId]);

  const onTreeDoubleClick = React.useCallback(() => { startTreeShake(); }, [startTreeShake]);

  const onTreeTouchStart = React.useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const now = Date.now();
    const dt = now - lastTapTreeRef.current.t;
    const dx = touch.clientX - lastTapTreeRef.current.x;
    const dy = touch.clientY - lastTapTreeRef.current.y;
    const d2 = dx * dx + dy * dy;
    if (dt <= TAP_TIME && d2 <= TAP_DIST * TAP_DIST) {
      e.preventDefault();
      startTreeShake();
      lastTapTreeRef.current = { t: 0, x: 0, y: 0 };
    } else {
      lastTapTreeRef.current = { t: now, x: touch.clientX, y: touch.clientY };
    }
  }, [startTreeShake]);

  const onEmojiTransitionEnd = React.useCallback((e: React.TransitionEvent<HTMLDivElement>, id: string) => {
    setEmojis(prev => prev.map(x => (x.id === id && x.state === "toBasket" ? { ...x, state: "inBasket" } : x)));
  }, []);

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
    const d2 = dx * dx + dy * dy;
    if (dt <= TAP_TIME && d2 <= TAP_DIST * TAP_DIST) {
      e.preventDefault();
      startFallToBasket(id);
      lastTapPerEmoji.current[id] = { t: 0, x: 0, y: 0 };
    } else {
      startWobble(id);
      lastTapPerEmoji.current[id] = { t: now, x: touch.clientX, y: touch.clientY };
    }
  }, [startFallToBasket, startWobble]);

  React.useEffect(() => {
    console.log("🎮 게임 시작 API 호출...");
    apiStartGame().then(data => {
      console.log("✅ 게임 시작 성공:", data);
      console.log("📦 받은 데이터:", { run_id: data.run_id, pool_length: data.pool?.length, pool: data.pool });
      setRunId(data.run_id);
      const targets = emojisRef.current.filter(e => e.state === "onTree" || e.state === "wobble").map(e => e.id);
      targets.forEach(id => dropToGroundOnly(id));
      window.setTimeout(() => {
        console.log("🌟 새 이모지 스폰 시작:", data.pool);
        setEmojis(spawnEmojis(20, data.pool));
      }, 2000);
    }).catch(err => {
      console.error("❌ 게임 시작 실패:", err);
      console.error("에러 상세:", { message: err.message, response: err.response, status: err.response?.status });
    });
  }, [dropToGroundOnly]);

  React.useEffect(() => {
    return () => {
      console.log("🧹 컴포넌트 언마운트 - 타이머 정리");
      Object.values(wobbleTimers.current).forEach(tid => window.clearTimeout(tid));
      Object.values(groundRemoveTimers.current).forEach(tid => window.clearTimeout(tid));
      Object.values(rafs.current).forEach(rid => cancelAnimationFrame(rid));
    };
  }, []);

  return (
    <div css={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", background: "#fff", overflow: "hidden" }}>
      <div css={{ position: "relative", aspectRatio: String(R), width: `min(100vw, calc(100svh * ${R}))`, overflow: "hidden" }}>
        <img src="/images/tree.png" alt="tree" draggable={false} onDoubleClick={onTreeDoubleClick} onTouchStart={onTreeTouchStart}
          className={`tree ${treeShaking ? "shake" : ""}`}
          css={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", cursor: "pointer", userSelect: "none", WebkitTapHighlightColor: "transparent", zIndex: 1 }} />
        <div className={treeShaking ? "fruit-layer shake" : "fruit-layer"} css={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none" }}>
          {emojis.filter(e => e.state !== "removed" && e.state !== "inBasket" && e.state !== "toBasket").map((e) => {
            const rotateWithTree = treeShaking && (e.state === "onTree" || e.state === "wobble");
            return (
              <div key={e.id} role="button" aria-label="emoji" onClick={() => onEmojiClick(e.id)} onDoubleClick={() => onEmojiDoubleClick(e.id)}
                onTouchStart={(ev) => onEmojiTouchStart(e.id, ev)} onTransitionEnd={(ev) => onEmojiTransitionEnd(ev, e.id)}
                className={["emoji", e.state === "wobble" ? "wobble" : "", rotateWithTree ? "tree-rotate" : "", e.fresh ? "fresh-grow" : ""].join(" ").trim()}
                css={{ position: "absolute", left: `${e.left}%`, bottom: `${e.bottom}%`, fontSize: `calc(min(8vw, 48px) * ${e.scale.toFixed(2)})`,
                  lineHeight: 1, transform: "translate(-50%, 0)", transformOrigin: "50% 70%", userSelect: "none", WebkitTapHighlightColor: "transparent",
                  outline: "none", cursor: "pointer", pointerEvents: "auto", zIndex: 3 }}>
                {e.char}
              </div>
            );
          })}
        </div>
        <img src="/images/basket.png" alt="basket" draggable={false} onClick={onBasketClick}
          className={`basket ${basketFlip ? "flip" : ""} ${basketSwaying ? "sway" : ""}`}
          css={{ position: "absolute", left: `${BASKET_LEFT}%`, bottom: `${basketLift ? 13 + LIFT_Y : 13}%`, transform: "translateX(-50%)",
            width: "30%", aspectRatio: "1", objectFit: "contain", userSelect: "none", WebkitTapHighlightColor: "transparent",
            cursor: basketCount > 0 ? "pointer" : "default", transition: `bottom ${LIFT_MS}ms ease`, zIndex: 2 }} />
        {emojis.filter(e => e.state === "inBasket" || e.state === "toBasket").map((e) => {
          const effectiveBottom = e.bottom + (basketLift ? LIFT_Y : 0);
          const transition = `left 0.8s ease, bottom ${LIFT_MS}ms ease, transform ${LIFT_MS}ms ease`;
          return (
            <div key={e.id} role="button" aria-label="emoji" onTransitionEnd={(ev) => onEmojiTransitionEnd(ev, e.id)}
              className={["emoji", basketSwaying ? "in-basket-sway" : "", "in-basket"].join(" ").trim()}
              css={{ position: "absolute", left: `${e.left}%`, bottom: `${effectiveBottom}%`, fontSize: `calc(min(8vw, 48px) * ${e.scale.toFixed(2)})`,
                lineHeight: 1, transform: "translate(-50%, 0)", transformOrigin: "50% 70%", userSelect: "none", WebkitTapHighlightColor: "transparent",
                outline: "none", cursor: "default", pointerEvents: "none", transition, zIndex: 3 }}>
              {e.char}
            </div>
          );
        })}
        <img src="/images/basket_front.png" alt="basket front" draggable={false}
          className={`basket ${basketFlip ? "flip" : ""} ${basketSwaying ? "sway" : ""}`}
          css={{ position: "absolute", left: `${BASKET_LEFT}%`, bottom: `${basketLift ? 13 + LIFT_Y : 13}%`, transform: "translateX(-50%)",
            width: "30%", aspectRatio: "1", objectFit: "contain", userSelect: "none", WebkitTapHighlightColor: "transparent",
            pointerEvents: "none", transition: `bottom ${LIFT_MS}ms ease`, zIndex: 4 }} />
      </div>
      {basketCount === 5 && (
        <button onClick={handleConfirmClick} className="confirm-button"
          css={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, padding: '10px 40px',
            font: '600 clamp(16px, 2.5vw, 22px)/1.4 "DungGeunMo", sans-serif', color: '#fff', background: '#E53E3E', border: 'none',
            borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', cursor: 'pointer', transition: 'background 0.2s',
            '&:hover': { background: '#C53030' } }}>
          확인
        </button>
      )}
      <div css={{ position: "fixed", bottom: "2svh", left: "50%", transform: "translateX(-50%)", zIndex: 10, color: "#fff",
        font: '400 clamp(12px, 2.2vw, 18px)/1.4 "DungGeunMo", -apple-system, Roboto, Helvetica, Arial, sans-serif',
        background: "rgba(0,0,0,0.6)", padding: "6px 10px", borderRadius: "6px" }}>
        나무를 <b>더블탭</b>하여 새로고침
      </div>
    </div>
  );
}