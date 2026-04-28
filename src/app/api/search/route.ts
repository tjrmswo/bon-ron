import axios from 'axios';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const data = req.nextUrl.searchParams.get('search');

  // console.log('Received search query: ', data);

  const response = await axios.get(
    'https://openapi.naver.com/v1/search/news.json',
    {
      params: {
        query: data || '',
        display: 10,
        start: 1,
        sort: 'sim',
      },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
      },
    },
  );

  return Response.json(response.data);
}
