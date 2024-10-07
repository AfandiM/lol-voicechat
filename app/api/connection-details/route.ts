import {
  AccessToken,
  AccessTokenOptions,
  RoomServiceClient,
  VideoGrant,
  WebhookReceiver,
} from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

export async function POST(request: NextRequest) {
  try {
    const receiver = new WebhookReceiver('apikey', 'apisecret');
    const requestJSON = await request.json();
    console.log(requestJSON);
    const event = await receiver.receive(requestJSON);
    console.log(event);
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
  }
}
