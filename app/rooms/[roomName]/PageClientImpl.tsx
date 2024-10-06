'use client';

import * as React from 'react';
import { AudioConference, LiveKitRoom, VideoConference } from '@livekit/components-react';

import { useRouter } from 'next/navigation';

const CONN_DETAILS_ENDPOINT =
  process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details';

const LIVEKIT_WS_URL = process.env.LIVEKIT_WS_URL;

export default function PageClientImpl({
  params,
}: {
  params: { participantToken: string | null };
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const handleOnLeave = React.useCallback(() => {
    router.push('/');
  }, [router]);
  // const searchParams = useSearchParams();
  // const token = searchParams.get("token") || undefined;

  return (
    <>
      <main data-lk-theme="default" style={{ height: '90%' }}>
        <LiveKitRoom
          token={params.participantToken}
          serverUrl={'wss://lol-voice-chat-31npzaqe.livekit.cloud'}
          audio={false}
          onDisconnected={handleOnLeave}
          onConnected={() => setLoading(false)}
        >
          {loading ? (
            <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
              <i className="fa fa-spinner fa-spin"></i>
            </div>
          ) : (
            <AudioConference></AudioConference>
          )}
        </LiveKitRoom>
      </main>
    </>
  );
}
