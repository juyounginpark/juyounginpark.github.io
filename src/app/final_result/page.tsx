"use client";

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';

type EmojiResultResponse = {
  style: string;
  lines: string[];
  picked_emojis: string[];
  share_id: string;
};

function FinalResultContent() {
  const searchParams = useSearchParams();
  const shareId = searchParams.get('share_id');
  
  const [result, setResult] = React.useState<EmojiResultResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchResult = async () => {
      if (!shareId) {
        setError('공유 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        console.log("🔄 최종 결과 요청 중...", shareId);
        
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
        
        setResult(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ API 요청 에러:", err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchResult();
  }, [shareId]);

  // 로딩 중
  if (loading) {
    return (
      <div style={pageStyle}>
        <h1 style={{ fontSize: '2rem' }}>결과를 분석 중입니다...</h1>
      </div>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <div style={pageStyle}>
        <h1 style={{ fontSize: '2rem', color: '#E53E3E' }}>오류 발생</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>{error}</p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
          Share ID: {shareId || '없음'}
        </p>
        <Link href="/" style={buttonStyle}>
          처음으로 돌아가기
        </Link>
      </div>
    );
  }

  // 결과 없음
  if (!result) {
    return (
      <div style={pageStyle}>
        <h1 style={{ fontSize: '2rem' }}>결과를 찾을 수 없습니다.</h1>
        <Link href="/" style={buttonStyle}>
          처음으로 돌아가기
        </Link>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        당신은 <span style={{ color: '#0070f3' }}>[{result.style}]</span>입니다.
      </h1>

      <Image
        src={`/images/mbti/${result.style}.png`}
        alt={`${result.style} 이미지`}
        width={400}
        height={400}
        style={{
          maxWidth: '90%',
          height: 'auto',
          margin: '20px 0',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }}
      />
      
      {/* API에서 받은 문장들을 표시 */}
      <div style={{
        fontSize: '1.2rem',
        lineHeight: '1.8',
        maxWidth: '600px',
        padding: '0 20px',
        marginTop: '20px'
      }}>
        {result.lines.map((line, index) => (
          <p key={index} style={{ marginBottom: '12px' }}>
            {line}
          </p>
        ))}
      </div>

      {/* 선택된 이모지 표시 */}
      <div style={{
        display: 'flex',
        gap: '15px',
        fontSize: '3rem',
        marginTop: '30px',
        marginBottom: '20px'
      }}>
        {result.picked_emojis.map((emoji, index) => (
          <span key={index}>{emoji}</span>
        ))}
      </div>

      <Link href="/" style={buttonStyle}>
        처음으로 돌아가기
      </Link>
    </div>
  );
}

export default function FinalResultPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '24px',
        fontFamily: '"DungGeunMo", sans-serif'
      }}>
        로딩 중...
      </div>
    }>
      <FinalResultContent />
    </Suspense>
  );
}

// 스타일 객체
const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: '20px',
  fontFamily: '"DungGeunMo", sans-serif',
  textAlign: 'center',
  padding: '20px'
};

const buttonStyle: React.CSSProperties = {
  marginTop: '20px',
  padding: '12px 24px',
  background: 'green',
  color: 'white',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer'
}