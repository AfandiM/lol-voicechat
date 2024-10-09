'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import styles from '../styles/Home.module.css';
import { getUserGameID } from '@/lib/client-utils';
import '../styles/index.css';

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
        console.log(response);
        if (response.status === 401) {
          setErrorMessage('User already in call!');
          setLoading(false);
        } else if (response.status !== 200) {
          setErrorMessage('User not in game!');
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
        <div className="login-container">
          <div className="login-header">
            <h1>LoL Voice Chat</h1>
          </div>
          <div className="login-body">
            <input
              style={{ backgroundColor: 'white', color: 'black' }}
              type="text"
              placeholder="Summoner Name#TAG"
              name="username_tag"
              value={username_tag}
              onChange={(e) => setUsernameTag(e.target.value)}
              disabled={loading}
            ></input>
            <button type="submit" onClick={joinRoom} disabled={loading}>
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Join Voice Chat'}
            </button>

            <div className="background-overlay"></div>
            <div>
              <p style={{ color: 'red', fontWeight: 600 }}>{errorMessage}</p>
            </div>
          </div>
        </div>
        <div className="login-container">
          <p style={{ fontWeight: 500, color: 'black' }}>This is a prototype</p>
          <br />
          <a href="mailto:lolvc.dev@gmail.com" style={{ fontWeight: 500 }}>
            Suggestions and concerns are welcome
          </a>
        </div>
        <a href="https://github.com/AfandiM/lol-voicechat" style={{ color: 'inherit' }}>
          <i className="fa fa-github" style={{ fontSize: '48px' }}></i>
        </a>
        <br />
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
