'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';
import { getUserGameID } from '@/lib/client-utils';

export default function Page() {
  const [username_tag, setUsernameTag] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const joinRoom = async () => {
    setErrorMessage('');
    if (!username_tag || !username_tag.includes('#')) {
      setErrorMessage('Please enter a valid Username#TAG');
    } else {
      setLoading(true);
      getUserGameID(username_tag).then(async (response) => {
        if (response.status !== 200) {
          setErrorMessage(response.statusText);
          setLoading(false);
        } else {
          let room_id = await response.json();
          router.push(`/rooms/${room_id['roomName']}?token=${room_id['participantToken']}`);
        }
      });
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <script
        type="text/javascript"
        src="https://storage.ko-fi.com/cdn/widget/Widget_2.js"
      ></script>
      <main className={styles.main} data-lk-theme="default">
        <div className="header">
          <h1 style={{ color: 'green', width: '100%' }}>LoL Voice Chat</h1>
        </div>
        <div className={styles.inputContainer}>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter your Username#TAG"
            name="username_tag"
            value={username_tag}
            onChange={(e) => setUsernameTag(e.target.value)}
            disabled={loading}
          ></input>
        </div>
        <div className={styles.tabContent}>
          <button
            style={{ marginTop: '1rem' }}
            className="lk-button"
            onClick={joinRoom}
            disabled={loading}
          >
            {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Join Room'}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}></div>
          </div>
        </div>
        <div>
          <p style={{ color: 'red', fontWeight: 600 }}>{errorMessage}</p>
        </div>
        <a href="https://ko-fi.com/U7U014D0YR" target="_blank">
          <img
            height="36"
            style={{ border: 0, height: '36px' }}
            src="https://storage.ko-fi.com/cdn/kofi4.png?v=3"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </main>
    </>
  );
}
