// 스테이지 비율
export const R = 0.809;

// 나무 위 랜덤 배치 영역(스테이지 % 좌표)
export const TREE_AREA = {
  leftMin: 15,
  leftMax: 85,
  bottomMin: 35,
  bottomMax: 80,
};

// 이모지 스케일(±20%)
export const SCALE_MIN = 0.8;
export const SCALE_MAX = 1.2;

// 겹침 방지용 기본 반경(%)
export const RADIUS_BASE_PCT = 4.0;

// 물리 파라미터
export const GROUND_BOTTOM = 5;   // 바닥 Y(%)
export const GRAVITY = -220;      // %/s^2

// 바구니 셋업
export const BASKET_LEFT = 30;     // 바구니 중심 X(%)
export const BASKET_BOTTOM = 40.3; // 바구니 윗면 근처 Y(%)
export const BASKET_CAPACITY = 5;
export const BASKET_h = 19;

// 바구니 슬롯(담긴 순서대로 배치): 0 1 2 / 3 4
export const BASKET_SLOTS: Array<{ left: number; bottom: number }> = [
  { left: BASKET_LEFT - 4, bottom: BASKET_BOTTOM + 2 - BASKET_h }, // 0
  { left: BASKET_LEFT +  0, bottom: BASKET_BOTTOM + 2 - BASKET_h }, // 1
  { left: BASKET_LEFT +  4, bottom: BASKET_BOTTOM + 2 - BASKET_h }, // 2
  { left: BASKET_LEFT -  2, bottom: BASKET_BOTTOM - 1 - BASKET_h }, // 3
  { left: BASKET_LEFT +  2, bottom: BASKET_BOTTOM - 1 - BASKET_h }, // 4
];

// 더블탭 판정
export const TAP_TIME = 300;
export const TAP_DIST = 24;

// 바구니 비우기 애니메이션 파라미터
export const LIFT_Y = 20;     // 리프트 높이(%)
export const LIFT_MS = 420;   // 리프트 상승 시간(ms)
export const FLIP_MS = 700;   // 뒤집기 시간(ms)

// 이모지 풀
export const EMOJI_POOL = [
  "😊","😁","😒","😍","🤣","🫣","😡","😘","😶‍🌫️","😱",
  "🚓","🌭","💿","🥷","👩‍🍳","🧑‍🎄","🚨","🧜‍♂️","🥕","🍆"
];
