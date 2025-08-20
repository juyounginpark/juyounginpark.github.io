"use client";
import * as React from "react";

const R = 0.809;

function Ingame() {
  const [shake, setShake] = React.useState(false);

  const handleShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 2000); // 2초 후 원상복구
  };

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
          width: `min(100vw, calc(100svh * ${R}))`,
          overflow: "hidden",
        }}
      >
        {/* 나무 */}
        <img
          src="/images/tree.png"
          alt="tree"
          onDoubleClick={handleShake}   // ✅ 더블클릭 이벤트
          className={shake ? "tree shake" : "tree"}
          css={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            cursor: "pointer",
          }}
        />

        {/* 바구니 */}
        <img
          src="/images/basket.png"
          alt="basket"
          css={{
            position: "absolute",
            left: "30%",
            bottom: "13%",
            transform: "translateX(-50%)",
            width: "30%",
            aspectRatio: "1",
            objectFit: "contain",
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
