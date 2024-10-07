'use client';

import * as React from 'react';
import {
  LiveKitRoom,
  useLiveKitRoom,
  useRoomContext,
  useRoomInfo,
} from '@livekit/components-react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { AudioConferenceClientImpl } from '@/app/custom/AudioConferenceClientImpl';

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
