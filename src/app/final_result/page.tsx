"use client"; // useState, useEffect를 사용하므로 클라이언트 컴포넌트로 지정합니다.

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Next.js의 이미지 최적화 컴포넌트 사용

// 1. 16개 MBTI 데이터와 설명을 임시로 저장합니다.
const mbtiData = [
  { type: 'ISTJ', description: '현실적이고 책임감이 강하며, 한 번 시작한 일은 끝까지 해내는 성실한 유형입니다.' },
  { type: 'ISFJ', description: '따뜻하고 겸손하며, 다른 사람의 감정을 존중하고 배려하는 마음이 깊은 유형입니다.' },
  { type: 'INFJ', description: '깊은 통찰력과 직관을 가지고 있으며, 자신의 신념을 실현하고자 하는 이상주의자 유형입니다.' },
  { type: 'INTJ', description: '독창적이고 논리적이며, 복잡한 문제를 해결하고 시스템을 개선하는 데 뛰어난 유형입니다.' },
  { type: 'ISTP', description: '과묵하고 관찰력이 뛰어나며, 도구를 사용하여 무언가를 만들거나 탐구하는 것을 즐기는 유형입니다.' },
  { type: 'ISFP', description: '온화하고 친절하며, 현재의 순간을 소중히 여기고 삶의 아름다움을 즐기는 예술가 유형입니다.' },
  { type: 'INFP', description: '낭만적이고 이상주의적이며, 자신의 가치관과 내면의 조화를 중요하게 생각하는 중재자 유형입니다.' },
  { type: 'INTP', description: '지적 호기심이 왕성하고, 논리적인 분석과 아이디어 탐구를 즐기는 사색가 유형입니다.' },
  { type: 'ESTP', description: '에너지가 넘치고 모험을 즐기며, 실제 경험을 통해 배우고 문제를 해결하는 것을 선호하는 유형입니다.' },
  { type: 'ESFP', description: '사교적이고 낙천적이며, 사람들과 어울리며 즐거운 분위기를 만드는 것을 좋아하는 연예인 유형입니다.' },
  { type: 'ENFP', description: '열정적이고 상상력이 풍부하며, 새로운 가능성을 탐색하고 긍정적인 변화를 추구하는 활동가 유형입니다.' },
  { type: 'ENTP', description: '지적이고 독창적이며, 다양한 관점에서 토론하고 새로운 아이디어를 제시하는 것을 즐기는 변론가 유형입니다.' },
  { type: 'ESTJ', description: '체계적이고 현실적이며, 규칙과 절차에 따라 일을 효율적으로 처리하는 것을 중요하게 생각하는 경영자 유형입니다.' },
  { type: 'ESFJ', description: '친절하고 사교적이며, 주변 사람들을 돕고 조화로운 관계를 유지하는 데 기쁨을 느끼는 집정관 유형입니다.' },
  { type: 'ENFJ', description: '카리스마 있고 사람들을 이끄는 능력이 있으며, 다른 사람의 성장을 돕고 영감을 주는 데 뛰어난 유형입니다.' },
  { type: 'ENTJ', description: '타고난 리더십과 결단력을 바탕으로, 목표를 설정하고 대담하게 계획을 실행해나가는 통솔자 유형입니다.' },
];

type MbtiInfo = {
  type: string;
  description: string;
};

export default function FinalResultPage() {
  // 2. 랜덤으로 선택된 MBTI 결과를 저장할 상태 변수
  const [result, setResult] = React.useState<MbtiInfo | null>(null);

  // 3. 페이지가 로드될 때 한 번만 실행하여 랜덤 MBTI를 선택
  React.useEffect(() => {
    const randomIndex = Math.floor(Math.random() * mbtiData.length);
    setResult(mbtiData[randomIndex]);
  }, []); // 의존성 배열을 비워두어 최초 렌더링 시에만 실행

  // 4. 결과가 선택되기 전에는 로딩 메시지를 표시
  if (!result) {
    return (
      <div style={pageStyle}>
        <h1>결과를 분석 중입니다...</h1>
      </div>
    );
  }

  // 5. 결과가 선택되면 내용을 렌더링
  return (
    <div style={pageStyle}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        당신은 <span style={{ color: '#0070f3' }}>[{result.type}]</span>입니다.
      </h1>

      <Image
        src={`/images/mbti/${result.type}.png`}
        alt={`${result.type} 이미지`}
        width={400} // 🌟 주의: 실제 이미지 크기에 맞게 조절해주세요.
        height={400} // 🌟 주의: 실제 이미지 크기에 맞게 조절해주세요.
        style={{
          maxWidth: '90%',
          height: 'auto',
          margin: '20px 0',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }}
      />
      
      <p style={{
        fontSize: '1.2rem',
        lineHeight: '1.6',
        maxWidth: '600px',
        padding: '0 20px'
      }}>
        {result.description}
      </p>

      <Link href="/" style={buttonStyle}>
        처음으로 돌아가기
      </Link>
    </div>
  );
}

// 스타일 객체 (가독성을 위해 분리)
const pageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: '20px',
  fontFamily: '"DungGeunMo", sans-serif',
  textAlign: 'center'
};

const buttonStyle: React.CSSProperties = {
  marginTop: '20px',
  padding: '12px 24px',
  background: 'green',
  color: 'white',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '1.2rem'
};