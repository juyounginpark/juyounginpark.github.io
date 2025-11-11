"use client";
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import styles from './result.module.css';

type EmojiWithStyle = {
  char: string;
  style: React.CSSProperties;
  initialBottom: string;
  initialLeft: string;
};

type EmojiResultResponse = {
  style: string;
  lines: string[];
  picked_emojis: string[];
  share_id: string;
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
    const fetchEmojiResult = async () => {
      if (!shareId) {
        setError('공유 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        console.log("🔄 이모지 결과 요청 중...", shareId);
        
        const response = await fetch('/api/emoji/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            share_id: shareId,
          }),
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data: EmojiResultResponse = await response.json();
        console.log("✅ API 응답:", data);

        const selectedEmojis = data.picked_emojis || [];

        if (selectedEmojis.length === 0) {
          console.warn("⚠️ 이모지가 없음, 기본값 사용");
          selectedEmojis.push('🌟', '✨', '🎯', '🎨', '🌈');
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
        setTimeout(() => setEmojisVisible(true), 200);
        setTimeout(() => setIsLifted(true), 500);
        setTimeout(() => setIsFlipped(true), 2500);

      } catch (err) {
        console.error("❌ API 요청 에러:", err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchEmojiResult();
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

      <Link 
        href={`/final_result?share_id=${shareId}`} 
        className={`${styles.retryButton} ${showRetry ? styles.retryButtonVisible : ''}`}
      >
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