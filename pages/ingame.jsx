"use client";
import * as React from "react";

const R = 0.809; // 스테이지 가로:세로 비율

function Ingame() {
  const [shake, setShake] = React.useState(false);

  // 모바일 더블탭 감지용 ref
  const lastTapRef = React.useRef({ t: 0, x: 0, y: 0 });
  const TAP_TIME = 300;   // ms 이내면 더블탭
  const TAP_DIST = 24;    // px 이내면 같은 위치로 간주

  const startShake = React.useCallback(() => {
    if (shake) return;            // 🔒 흔들리는 중엔 무시
    setShake(true);
    setTimeout(() => setShake(false), 2000); // 2초 후 해제
  }, [shake]);

  // 데스크톱 더블클릭
  const onDoubleClickTree = React.useCallback(() => {
    if (shake) return;
    startShake();
  }, [shake, startShake]);

  // 모바일 더블탭
  const onTouchStartTree = React.useCallback((e) => {
    if (shake) return;

    const touch = e.changedTouches[0];
    const now = Date.now();
    const dt = now - lastTapRef.current.t;
    const dx = touch.clientX - lastTapRef.current.x;
    const dy = touch.clientY - lastTapRef.current.y;
    const dist2 = dx * dx + dy * dy;

    if (dt <= TAP_TIME && dist2 <= TAP_DIST * TAP_DIST) {
      e.preventDefault();
      startShake();
      lastTapRef.current.t = 0; // 초기화
    } else {
      lastTapRef.current = { t: now, x: touch.clientX, y: touch.clientY };
    }
  }, [shake, startShake]);

  return (
    <div
      className="ingame-root"
      css={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        className="stage"
        css={{
          position: "relative",
          aspectRatio: String(R),
          width: `min(100vw, calc(100svh * ${R}))`, // 비율 유지
          overflow: "hidden",
        }}
      >
        {/* 🌳 나무 */}
        <img
          src="/images/tree.png"
          alt="tree"
          draggable={false}              // 이미지 드래그 방지
          onDoubleClick={onDoubleClickTree}
          onTouchStart={onTouchStartTree}
          className={shake ? "tree shake" : "tree"}
          css={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            cursor: "pointer",
            pointerEvents: shake ? "none" : "auto",     // 흔들리는 동안 입력 차단
            outline: "none",                           // 포커스 박스 제거
            userSelect: "none",                        // 선택 방지
            WebkitTapHighlightColor: "transparent",    // 모바일 파란 하이라이트 제거
          }}
        />

        {/* 🧺 바구니 */}
        <img
          src="/images/basket.png"
          alt="basket"
          draggable={false}
          css={{
            position: "absolute",
            left: "30%",
            bottom: "13%",
            transform: "translateX(-50%)",
            width: "30%",           // 스테이지 너비의 30%
            aspectRatio: "1",
            objectFit: "contain",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
          }}
        />
      </div>

      {/* 안내 텍스트 */}
      <div
        className="instruction"
        css={{
          position: "fixed",
          bottom: "2svh",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          color: "#fff",
          font: '400 clamp(14px, 2.2vw, 24px)/1.4 "DungGeunMo", -apple-system, Roboto, Helvetica, Arial, sans-serif',
          background: "rgba(0, 0, 0, 0.7)",
          padding: "6px 10px",
          borderRadius: "6px",
          textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          userSelect: "none",
        }}
      >
        나무를 <b>더블탭</b>하여 새로고침
      </div>

      {/* CSS keyframes */}
      <style jsx global>{`
        @keyframes shake {
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
        .shake {
          animation: shake 2s ease;
        }
      `}</style>
    </div>
  );
}

export default Ingame;
