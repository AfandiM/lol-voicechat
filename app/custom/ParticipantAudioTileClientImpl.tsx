import {
  ParticipantTileProps,
  useEnsureTrackRef,
  useParticipantTile,
  TrackRefContext,
  isTrackReference,
  AudioTrack,
  BarVisualizer,
  TrackMutedIndicator,
  ParticipantName,
  ConnectionQualityIndicator,
  useParticipantContext,
  useParticipants,
} from '@livekit/components-react';
import { RemoteParticipant } from 'livekit-client';
import * as React from 'react';

export const ParticipantAudioTileClientImpl: (
  props: ParticipantTileProps & React.RefAttributes<HTMLDivElement>,
) => React.ReactNode = /* @__PURE__ */ React.forwardRef<HTMLDivElement, ParticipantTileProps>(
  function ParticipantAudioTile(
    {
      children,
      disableSpeakingIndicator,
      onParticipantClick,
      trackRef,
      ...htmlProps
    }: ParticipantTileProps,
    ref,
  ) {
    const trackReference = useEnsureTrackRef(trackRef);
    const { elementProps } = useParticipantTile({
      trackRef: trackReference,
      htmlProps,
      disableSpeakingIndicator,
      onParticipantClick,
    });
    const participantContext = useParticipants();
    const [participantVolume, setParticipantVolume] = React.useState(100);
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setParticipantVolume(e.target.valueAsNumber);
      const remote = trackReference.participant as RemoteParticipant;
      remote.setVolume(e.target.valueAsNumber / 100);
    };

    return (
      <div ref={ref} style={{ position: 'relative', minHeight: '160px' }} {...elementProps}>
        <TrackRefContext.Provider value={trackReference}>
          {children ?? (
            <>
              {isTrackReference(trackReference) && (
                <AudioTrack trackRef={trackReference}></AudioTrack>
              )}
              {trackReference?.participant.isLocal ? null : (
                <div style={{ alignSelf: 'center', marginTop: '10px' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={participantVolume}
                    onChange={handleVolumeChange}
                  />
                </div>
              )}
              <BarVisualizer barCount={7} options={{ minHeight: 8 }} />
              <div className="lk-participant-metadata">
                <div className="lk-participant-metadata-item">
                  <TrackMutedIndicator trackRef={trackReference}></TrackMutedIndicator>
                  <ParticipantName />
                </div>
                <ConnectionQualityIndicator className="lk-participant-metadata-item" />
              </div>
            </>
          )}
        </TrackRefContext.Provider>
      </div>
    );
  },
);
