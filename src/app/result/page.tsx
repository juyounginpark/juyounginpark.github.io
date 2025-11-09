"use client";
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import styles from './result.module.css';
import { apiGetResult } from '@/lib/api';

type EmojiWithStyle = {
  char: string;
  style: React.CSSProperties;
  initialBottom: string;
  initialLeft: string;
};

const initialPositions = [
  { bottom: '18%', left: '50%' },
  { bottom: '30%', left: '42%' },
  { bottom: '30%', left: '58%' },
  { bottom: '24%', left: '35%' },
  { bottom: '24%', left: '65%' },
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
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const handleBasketTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'transform' && isFlipped) {
      setStartEmojiFall(true);
      setTimeout(() => setShowRetry(true), 1500);
    }
  };

  React.useEffect(() => {
    // 세션 스토리지에서 선택한 이모지 가져오기
    let selectedEmojis: string[] = [];
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selected_emojis');
      if (stored) {
        try {
          selectedEmojis = JSON.parse(stored);
          console.log("📦 세션에서 불러온 이모지:", selectedEmojis);
        } catch (e) {
          console.error("⚠️ 세션 스토리지 파싱 실패:", e);
        }
      }
    }

    // 이모지가 없으면 기본값 사용
    if (!selectedEmojis || selectedEmojis.length === 0) {
      console.warn("⚠️ 저장된 이모지 없음, 기본값 사용");
      selectedEmojis = ['🌟', '✨', '🎯', '🎨', '🌈'];
    }

    console.log(`📊 표시할 이모지: ${selectedEmojis.length}개`, selectedEmojis);

    const emojisWithAnimation = selectedEmojis.map((char, index) => {
      const position = initialPositions[index % initialPositions.length];
      const duration = 2;
      const delay = index * 0.1;
      const endX = `${(index - (selectedEmojis.length - 1) / 2) * 80}px`;
      const startRot = `${-20 + Math.random() * 40}deg`;
      const endRot = `${-360 + Math.random() * 720}deg`;
      const easing = `cubic-bezier(0.4, 0.2, 0.6, 1)`;

      return {
        char,
        initialBottom: position.bottom,
        initialLeft: position.left,
        style: {
          '--duration': `${duration}s`,
          '--delay': `${delay}s`,
          '--easing': easing,
          '--start-rot': startRot,
          '--end-x': endX,
          '--end-rot': endRot,
        } as React.CSSProperties,
      };
    });

    setDisplayedEmojis(emojisWithAnimation);
    setLoading(false);

    // 애니메이션 시작
    const visibleTimer = setTimeout(() => setEmojisVisible(true), 200);
    const liftTimer = setTimeout(() => setIsLifted(true), 500);
    const flipTimer = setTimeout(() => setIsFlipped(true), 2500);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(liftTimer);
      clearTimeout(flipTimer);
    };
  }, [shareId]);

  // 로딩 중
  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>결과를 불러오는 중...</h1>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title} style={{ color: '#E53E3E' }}>
          오류 발생
        </h1>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '18px' }}>
          {error}
        </p>
        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Share ID: {shareId || '없음'}
        </p>
        <Link href="/" className={`${styles.retryButton} ${styles.retryButtonVisible}`}>
          처음으로 돌아가기
        </Link>
      </div>
    );
  }

  // 정상 렌더링
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