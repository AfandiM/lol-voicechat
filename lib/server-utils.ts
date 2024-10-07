const RIOT_API_KEY = process.env.RIOT_API_KEY;

const RIOT_AUTH_ENDPOINT =
  'https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/';

const RIOT_AUTH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
  Origin: 'https://developer.riotgames.com',
  'no-cors': '',
};

const CONN_DETAILS_ENDPOINT = '/api/connection-details';
// USE THIS FOR PRODUCTION
const BASE_URL = process.env.LIVEKIT_URL ?? 'http://localhost:3000/';

export async function getUserPUUID(username_tag: string) {
  console.log(BASE_URL);
  if (!username_tag) {
    return null;
  }
  const username = username_tag?.split('#')[0];
  const tag = username_tag?.split('#')[1];
  const url = RIOT_AUTH_ENDPOINT + username + '/' + tag + '?api_key=' + RIOT_API_KEY;
  const response = await fetch(url, {
    headers: RIOT_AUTH_HEADERS,
    method: 'GET',
  });
  if (response.status == 200) {
    const data = await response.json();
    return data;
  } else {
    return null;
  }
}

export async function getParticipantToken() {
  const url = new URL(CONN_DETAILS_ENDPOINT, BASE_URL);
  const connectionDetailsResp = await fetch(url.toString());
  // const connectionDetailsData = await connectionDetailsResp.json();
  if (connectionDetailsResp.status !== 200) {
    return null;
  }
  return connectionDetailsResp.text();
}

export const LIVEKIT_WS_URL = process.env.REACT_APP_LIVEKIT_WS_URL;
