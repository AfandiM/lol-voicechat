import * as React from 'react';
import { Track } from 'livekit-client';
import {
  WidgetState,
  useTracks,
  LayoutContextProvider,
  TrackLoop,
  ParticipantAudioTile,
  ControlBar,
  Chat,
  ParticipantTile,
} from '@livekit/components-react';

export interface AudioConferenceProps extends React.HTMLAttributes<HTMLDivElement> {}
export function AudioConferenceClientImpl({ ...props }: AudioConferenceProps) {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
  });

  const audioTracks = useTracks([Track.Source.Microphone]);

  return (
    <div className="lk-video-conference">
      <LayoutContextProvider onWidgetChange={setWidgetState}>
        <div className="lk-video-conference-inner" {...props}>
          <div className="lk-audio-conference-stage">
            <TrackLoop tracks={audioTracks}>
              <ParticipantAudioTile />
            </TrackLoop>
          </div>
          <ControlBar
            controls={{
              microphone: true,
              screenShare: false,
              camera: false,
              chat: true,
            }}
          />
        </div>
        <Chat style={{ display: widgetState.showChat ? 'grid' : 'none' }} />
        <div style={{ display: 'none' }}></div>
      </LayoutContextProvider>
    </div>
  );
}
