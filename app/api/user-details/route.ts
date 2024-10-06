import { NextRequest, NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const RIOT_AUTH_ENDPOINT =
  'https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/';
const RIOT_AUTH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
  Origin: 'https://developer.riotgames.com',
};

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const username_tag = request.nextUrl.searchParams.get('username_tag');

    const username = username_tag?.split('#')[0];
    const tag = username_tag?.split('#')[1];
    const url = RIOT_AUTH_ENDPOINT + username + '/' + tag + '?api_key=' + RIOT_API_KEY;
    const response = await fetch(url, {
      headers: RIOT_AUTH_HEADERS,
      method: 'GET',
    });
    if (response.status == 200) {
      const data = await response.json();
      return new NextResponse(JSON.stringify(data), { status: 200 });
    } else {
      return new NextResponse('User not found', { status: 404 });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}
