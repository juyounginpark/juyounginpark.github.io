import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>이모지콘 (EmojiCon)</h1>
      <p>나만의 커스텀 이모지콘을 뽑는 웹 게임</p>
      <div style={{ marginTop: '20px' }}>
        <Link href="/ingame" style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px'
        }}>
          게임 시작
        </Link>
      </div>
    </div>
  );
}
