const GAME_DETAILS_ENDPOINT = '/api/game-details';

export async function getUserGameID(username_tag: string) {
  const url = new URL(GAME_DETAILS_ENDPOINT, window.location.origin);
  url.searchParams.append('username_tag', username_tag);
  const response = await fetch(url);
  return response;
}
