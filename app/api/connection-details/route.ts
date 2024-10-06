import { AccessToken, AccessTokenOptions, RoomServiceClient, VideoGrant } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

export async function GET(request: NextRequest) {
  try {
    const room_id = request.nextUrl.searchParams.get('room_id');
    const username_tag = request.cookies.get('username_tag')?.value;
    const roomService = new RoomServiceClient(LIVEKIT_URL || '', API_KEY, API_SECRET);
    let participants = [];
    try {
      participants = await roomService.listParticipants(room_id);
    } catch (e) {
      console.log(e);
    }
    let error = false;
    participants.forEach((participant) => {
      if (participant.identity === username_tag) {
        error = true;
      }
    });
    if (error) {
      return new NextResponse('User already in call!', {
        status: 401,
        statusText: 'User already in call!',
      });
    }
    if (cookies().get('participantToken') === undefined) {
      return new NextResponse('Missing participant token', { status: 400 });
    }
    return new NextResponse(cookies().get('participantToken')?.value, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(userInfo: AccessTokenOptions, roomName: string) {
  const at = new AccessToken(API_KEY, API_SECRET, userInfo);
  at.ttl = '90m';
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);
  return at.toJwt();
}

/**
 * Get the LiveKit server URL for the given region.
 */
function getLiveKitURL(region: string | null): string {
  let targetKey = 'LIVEKIT_URL';
  if (region) {
    targetKey = `LIVEKIT_URL_${region}`.toUpperCase();
  }
  const url = process.env[targetKey];
  if (!url) {
    throw new Error(`${targetKey} is not defined`);
  }
  return url;
}
