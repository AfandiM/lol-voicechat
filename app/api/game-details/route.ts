import { NextRequest, NextResponse } from 'next/server';
import { getUserPUUID } from '@/lib/server-utils';
import { cookies } from 'next/headers';
import { AccessToken, AccessTokenOptions, VideoGrant } from 'livekit-server-sdk';
import { ConnectionDetails } from '@/lib/types';
import { RoomServiceClient, Room } from 'livekit-server-sdk';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

const RIOT_SPECTATE_ENDPOINT =
  'https://na1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/';

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
    if (!username_tag) {
      return new NextResponse('Missing required query parameter: username_tag', {
        status: 400,
      });
    }
    const userInfo = await getUserPUUID(username_tag || '');
    const PUUID = userInfo?.puuid || null;
    if (PUUID === null) {
      return new NextResponse('User not found!', {
        status: 404,
        statusText: 'User not found!',
      });
    }
    const username = userInfo?.gameName + '#' + userInfo?.tagLine || '';

    const response = await fetch(RIOT_SPECTATE_ENDPOINT + PUUID + '?api_key=' + RIOT_API_KEY, {
      headers: RIOT_AUTH_HEADERS,
      method: 'GET',
    });

    if (response.status == 200) {
      const data = await response.json();
      let room_id = '';
      data?.participants.forEach((participant: any) => {
        if (participant['puuid'] === PUUID) {
          room_id = String(data['gameId']).concat(String(participant['teamId']));
        }
      });
      const roomService = new RoomServiceClient(LIVEKIT_URL || '', API_KEY, API_SECRET);
      let participants: any[] = [];
      try {
        participants = await roomService.listParticipants(room_id);
      } catch (e) {
        console.log(e);
      }
      roomService.createRoom({
        name: room_id,
        maxParticipants: 5,
        emptyTimeout: 60,
        departureTimeout: 60,
      });
      let error = false;
      participants.forEach((participant) => {
        if (participant.identity === PUUID) {
          error = true;
        }
      });
      if (error) {
        return new NextResponse('User already in call!', {
          status: 401,
          statusText: 'User already in call!',
        });
      }
      // Generate participant token
      const participantToken = await createParticipantToken(
        {
          identity: PUUID,
          name: username,
        },
        room_id,
      );

      // Return connection details
      const result: ConnectionDetails = {
        serverUrl: LIVEKIT_URL || '',
        roomName: room_id,
        participantToken: participantToken,
        participantName: username,
      };
      return NextResponse.json(result);
    } else {
      return new NextResponse('User not in game!', {
        status: 404,
        statusText: 'User not in game!',
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
  }
}
async function createParticipantToken(userInfo: AccessTokenOptions, roomName: string) {
  const at = new AccessToken(API_KEY, API_SECRET, userInfo);
  at.ttl = '90m';
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
    roomCreate: false,
  };
  at.addGrant(grant);
  const token = await at.toJwt();
  return token;
}
