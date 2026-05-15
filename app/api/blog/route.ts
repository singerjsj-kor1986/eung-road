import { NextResponse } from 'next/server';

// 1. 블로그 게시물 데이터의 형식을 정의합니다 (TypeScript 오류 방지)
interface BlogPost {
  id: number;
  title: string;
  date: string;
  link: string;
  thumbnail: string | null;
}

export async function GET() {
  const NAVER_ID = 'lee_eung1446'; 
  const rssUrl = `https://rss.blog.naver.com/${NAVER_ID}.xml`;

  try {
    const response = await fetch(rssUrl, { cache: 'no-store' });
    const xmlText = await response.text();

    // XML에서 <item> 단위로 최대 6개까지 가져오기
    const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g)?.slice(0, 6) || [];
    
    // 2. 각 항목(item)에 타입을 지정하여 처리합니다.
    const posts: BlogPost[] = items.map((item: string, index: number) => {
      // 기본 정보 추출
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || "최신 시공 사례";
      const link = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/)?.[1] || "#";
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const date = new Date(pubDate).toLocaleDateString('ko-KR');

      // 썸네일 이미지 추출 로직
      const description = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || "";
      const imgSrcMatch = description.match(/<img[^>]+src=["']([^"']+)["']/);
      let thumbnail = imgSrcMatch ? imgSrcMatch[1] : null;

      // 네이버 블로그 이미지 옵션 처리 (w800으로 고화질 설정)
      if (thumbnail && thumbnail.includes('postfiles.pstatic.net')) {
        thumbnail = thumbnail.replace(/\?type=.*/, '') + '?type=w800';
      }

      return { 
        id: index, 
        title, 
        date, 
        link, 
        thumbnail 
      };
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog fetch error:', error);
    // 에러 발생 시에도 규격에 맞는 데이터를 반환합니다.
    const errorData: BlogPost[] = [{ 
      id: 0, 
      title: "블로그를 불러올 수 없습니다.", 
      date: "-", 
      link: "#", 
      thumbnail: null 
    }];
    return NextResponse.json(errorData);
  }
}