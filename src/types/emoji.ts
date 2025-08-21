export type EmojiState =
  | "onTree"
  | "wobble"
  | "falling"
  | "ground"
  | "toBasket"
  | "inBasket"
  | "removed";

export type EmojiItem = {
  id: string;
  char: string;
  left: number;     // %
  bottom: number;   // %
  scale: number;    // 0.8~1.2
  radius: number;   // 겹침 방지용 반경(%)
  state: EmojiState;
  vy?: number;         // 낙하 속도
  slotIndex?: number;  // 바구니 슬롯 인덱스
  fresh?: boolean;     // 🌱 새로 생성
};
