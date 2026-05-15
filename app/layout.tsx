import './globals.css'
import Script from 'next/script' // Next.js 전용 스크립트 컴포넌트

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        
        {/* 인스타그램 위젯 스크립트 (Behold에서 받은 주소를 여기에 넣으세요) */}
        <Script 
          src="https://services.behold.so/link/kMTxH" 
          strategy="lazyOnload" 
        />
      </body>
    </html>
  )
}