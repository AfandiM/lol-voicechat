'use client';

import * as React from 'react';
import {
  AudioConference,
  Chat,
  ControlBar,
  LayoutContextProvider,
  LiveKitRoom,
  ParticipantAudioTile,
  TrackLoop,
  useTracks,
  VideoConference,
  WidgetState,
} from '@livekit/components-react';
import { LIVEKIT_WS_URL } from '@/lib/server-utils';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Track } from 'livekit-client';
import { AudioConferenceClientImpl } from '@/app/custom/AudioConferenceClientImpl';

const CONN_DETAILS_ENDPOINT =
  process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const handleOnLeave = React.useCallback(() => {
    router.push('/');
  }, [router]);
  const searchParams = useSearchParams();
  const participantToken = searchParams.get('token') || undefined;
  const handleOnConnected = () => {
    setLoading(false);
  };

  return (
    <>
      <main data-lk-theme="default" style={{ height: '100%' }}>
        <LiveKitRoom
          token={participantToken}
          serverUrl={'wss://lol-voice-chat-31npzaqe.livekit.cloud'}
          audio={true}
          onDisconnected={handleOnLeave}
          onConnected={handleOnConnected}
        >
          {loading ? (
            <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
              <i className="fa fa-spinner fa-spin"></i>
            </div>
          ) : (
            <AudioConferenceClientImpl> </AudioConferenceClientImpl>
          )}
        </LiveKitRoom>
      </main>
    </>
  );
}
