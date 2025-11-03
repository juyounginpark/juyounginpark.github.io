"use client";
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import styles from './result.module.css';
import { apiGetSharedResult } from '@/lib/api';

type EmojiWithStyle = {
  char: string;
  style: React.CSSProperties;
  initialBottom: string;
  initialLeft: string;
};

// 겹치지 않는 초기 위치
const initialPositions = [
  { bottom: '18%', left: '50%' }, // 중앙 상단
  { bottom: '30%', left: '42%' }, // 중간 좌
  { bottom: '30%', left: '58%' }, // 중간 우
  { bottom: '24%', left: '35%' }, // 하단 좌
  { bottom: '24%', left: '65%' }, // 하단 우
];

function ResultContent() {
  const searchParams = useSearchParams();
  const shareId = searchParams.get('share_id');
  const [displayedEmojis, setDisplayedEmojis] = React.useState<EmojiWithStyle[]>([]);
  
  const [isLifted, setIsLifted] = React.useState(false);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [startEmojiFall, setStartEmojiFall] = React.useState(false);
  const [showRetry, setShowRetry] = React.useState(false);
  const [emojisVisible, setEmojisVisible] = React.useState(false);

  const handleBasketTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'transform' && isFlipped) {
      setStartEmojiFall(true);
      setTimeout(() => setShowRetry(true), 1500);
    }
  };

  React.useEffect(() => {
    if (shareId) {
      apiGetSharedResult(shareId).then(data => {
        const emojisWithAnimation = data.top_emojis.map((char, index) => {
          const position = initialPositions[index % initialPositions.length];
          const duration = 2; const delay = index * 0.1;
          const endX = `${(index - (data.top_emojis.length - 1) / 2) * 80}px`;
          const startRot = `${-20 + Math.random() * 40}deg`;
          const endRot = `${-360 + Math.random() * 720}deg`;
          const easing = `cubic-bezier(0.4, 0.2, 0.6, 1)`;

          return {
            char, 
            initialBottom: position.bottom, 
            initialLeft: position.left,
            style: {
              '--duration': `${duration}s`, '--delay': `${delay}s`, '--easing': easing,
              '--start-rot': startRot, '--end-x': endX, '--end-rot': endRot,
            } as React.CSSProperties,
          };
        });
        setDisplayedEmojis(emojisWithAnimation);
      }).catch(error => console.error("공유 결과 로딩 실패:", error));
    }
    
    const visibleTimer = setTimeout(() => { setEmojisVisible(true); }, 200);
    const liftTimer = setTimeout(() => { setIsLifted(true); }, 500);
    const flipTimer = setTimeout(() => { setIsFlipped(true); }, 500 + 1500 + 500);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(liftTimer);
      clearTimeout(flipTimer);
    };
  }, [shareId]);

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} ${isLifted ? styles.titleHidden : ''}`}>
        수확 성공!
      </h1>

      <div className={styles.basketContainer}>
        <div
          className={`
            ${styles.basketWrapper}
            ${isLifted ? styles.basketWrapperLifted : ''}
            ${isFlipped ? styles.basketWrapperFlipped : ''}
          `}
          onTransitionEnd={handleBasketTransitionEnd}
        >
          <img
            src="/images/basket.png"
            alt="basket"
            className={styles.basketImg}
            style={{ zIndex: 1 }}
          />
          {displayedEmojis.map(({ char, initialBottom, initialLeft, style }, index) => (
            <div
              key={index}
              className={`
                ${styles.emoji}
                ${emojisVisible ? styles.emojiVisible : ''}
                ${startEmojiFall ? styles.emojiFalling : ''}
              `}
              style={{ ...style, bottom: initialBottom, left: initialLeft }}
            >
              {char}
            </div>
          ))}
          <img
            src="/images/basket_front.png"
            alt="basket front"
            className={`${styles.basketImg} ${styles.basketFront}`}
          />
        </div>
      </div>

      <Link href="/final_result" className={`${styles.retryButton} ${showRetry ? styles.retryButtonVisible : ''}`}>
        결과 확인
      </Link>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '24px'
      }}>
        로딩 중...
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}