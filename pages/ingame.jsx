"use client";
import * as React from "react";

const R = 0.809; // 가로:세로 비율(예: 480 x 593이면 480/593)

function Ingame() {
  return (
    <div
      className="ingame-root"
      css={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",   // 화면 한가운데 배치
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* 비율 고정 스테이지 (레터박싱) */}
      <div
        className="stage"
        css={{
          position: "relative",
          aspectRatio: String(R),                   // 비율 고정
          width: `min(110vw, calc(110svh * ${R}))`,// 화면을 넘지 않는 최대 크기
          // height는 aspect-ratio로 자동 결정됨
          // (원한다면 최대/최소 폭 제한도 가능: maxWidth, minWidth)
          overflow: "hidden",
          borderRadius: "8px", // 선택
        }}
      >
        {/* 배경(나무) - 스테이지 기준으로 채우기 */}
        <img
          src="/images/tree.png"
          alt="tree"
          css={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",   
            objectPosition: "center",
          }}
        />

        {/* 바구니 - 스테이지 기준 %로 크기/위치 */}
        <img
          src="/images/basket.png"
          alt="basket"
          css={{
            position: "absolute",
            left: "30%",
            bottom: "13%",          // 스테이지 높이에 대한 % (깨짐 방지)
            transform: "translateX(-50%)",
            width: "30%",           // 스테이지 너비의 % (vw 대신 %!)
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
            zIndex: 9999, // 다른 요소 위로 올리기
            color: "#fff", // 글자색: 흰색
            font: '400 clamp(14px, 2.2vw, 24px)/1.4 "DungGeunMo", -apple-system, Roboto, Helvetica, Arial, sans-serif',
            background: "rgba(0, 0, 0, 0.7)",
            padding: "6px 10px",
            borderRadius: "6px",
            textShadow: "0 1px 2px rgba(0,0,0,0.6)", // 가독성 보강(선택)
          }}
        >
          나무를 탭하여 새로고침
        </div>

    </div>
  );
}

export default Ingame;
