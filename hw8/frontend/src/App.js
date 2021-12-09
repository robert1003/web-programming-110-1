import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Button, Input, Tag, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useChat from './useChat';

const LOCALSTORAGE_KEY = "save-me";

function App() {
  const savedUser = localStorage.getItem(LOCALSTORAGE_KEY);
  console.log(savedUser);

  const { status, messages, sendMessage, clearMessages } = useChat();
  const [username, setUsername] = useState(savedUser === null ? '' : savedUser);
  const [body, setBody] = useState(''); // textBody
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, username);
    }
  },[signedIn, username]);

  const displayStatus = (payload) => {
    if (payload.msg) {
      const { type, msg } = payload;
      const content = { content: msg, duration: 0.5 };

      switch (type) {
        case 'success':
          message.success(content);
          break;
        case 'error':
        default:
          message.error(content);
          break;

      }
    }
  }

  useEffect(() => {
    displayStatus(status)
  }, [status]);

  return (
    signedIn ?
      (
        <div className="App">
      <div className="App-title">
        <h1>{username}'s Chat Room</h1>
        <Button type="primary" danger onClick={clearMessages}>
          Clear
        </Button>
      </div>
      <div className="App-messages">
        {messages.length === 0 ? (
            <p style={{ color: '#ccc' }}>
              No messages...
            </p>
          ) : (
            messages.map(({name, body}, i) => (
              <p className="App-message" key={i}>
                <Tag color="blue">{name}</Tag> {body}
              </p>
            ))
          )}
        
      </div>
      <Input.Search
        value={body}
        onChange={(e) => setBody(e.target.value)}
        enterButton="Send"
        placeholder="Type a message here..."
        onSearch={(msg) => {
          if (!msg || !username) {
            displayStatus({
              type: 'error',
              msg: 'Please enter a username and a message body.'
            });
            return;
          }

          sendMessage({ name: username, body: msg });
          setBody('');
        }}
      ></Input.Search>
        </div>
      ) : (
        <div className="App">
          <div className="App-title">
            <h1>My Chat Room</h1>
          </div>
          <Input.Search
            prefix={<UserOutlined />}
            value={username}
            enterButton="Sign In"
            placeholder="Username"
            value={username}
            size="large"
            style={{ width: 300, margin: 50 }}
            onChange={(e) => setUsername(e.target.value)}
            onSearch={(name) => {
              if (!name) displayStatus({
                type: 'error',
                msg: 'Missing user name'
              });
              else setSignedIn(true);
            }}
          ></Input.Search>
        </div>
      )

  );

}

export default App
