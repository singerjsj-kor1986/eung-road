import { NextResponse } from 'next/server';

export async function GET() {
  const NAVER_ID = 'lee_eung1446'; 
  const rssUrl = `https://rss.blog.naver.com/${NAVER_ID}.xml`;

  try {
    const response = await fetch(rssUrl, { cache: 'no-store' });
    const xmlText = await response.text();

    // XML에서 <item> 단위로 최대 6개까지 가져오기 (그리드 뷰를 위해 개수를 늘렸습니다)
    const items = xmlText.match(/<item>([\s\S]*?)<\/item>/g)?.slice(0, 6) || [];
    
    const posts = items.map((item, index) => {
      // 1. 기본 정보 추출
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || "최신 시공 사례";
      const link = item.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/)?.[1] || "#";
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
      const date = new Date(pubDate).toLocaleDateString('ko-KR');

      // 2. 썸네일 이미지 추출 로직 추가
      // description 안에 포함된 첫 번째 <img> 태그의 src 주소를 찾습니다.
      const description = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || "";
      const imgSrcMatch = description.match(/<img[^>]+src=["']([^"']+)["']/);
      let thumbnail = imgSrcMatch ? imgSrcMatch[1] : null;

      // 네이버 블로그 이미지는 뒤에 옵션(?type=...)을 붙여야 외부에서 잘 보일 수 있습니다.
      if (thumbnail && thumbnail.includes('postfiles.pstatic.net')) {
        thumbnail = thumbnail.replace(/\?type=.*/, '') + '?type=w800';
      }

      return { 
        id: index, 
        title, 
        date, 
        link, 
        thumbnail // 추출한 썸네일 주소 추가
      };
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json([{ id: 0, title: "블로그를 불러올 수 없습니다.", date: "-", link: "#", thumbnail: null }]);
  }
}