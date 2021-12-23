import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Button, Input, Tag, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/react-hooks';

import Title from '../Components/Title';
import ChatRoom from './ChatRoom';

import {
  CREATE_MESSAGE_MUTATION
} from '../graphql/index';

const LOCALSTORAGE_KEY = "save-me";

function App() {
  const savedUser = localStorage.getItem(LOCALSTORAGE_KEY);

  //const { status, messages, sendMessage, clearMessages } = useChat();
  const [username, setUsername] = useState(savedUser === null ? '' : savedUser);
  const [body, setBody] = useState(''); // textBody
  const [signedIn, setSignedIn] = useState(false);
  const [ activeKey, setActiveKey ] = useState("");
  const [sendMessage] = useMutation(CREATE_MESSAGE_MUTATION);

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

  /*useEffect(() => {
    displayStatus(status)
  }, [status]);*/

  return (
    signedIn ?
      (
        <div className="App">
          <Title username={username}/>
          <div className="App-messages">
            <ChatRoom me={username} displayStatus={displayStatus} 
                activeKey={activeKey} setActiveKey={setActiveKey}/>
          </div>
          <Input.Search
            value={body}
            onChange={(e) => setBody(e.target.value)}
            enterButton="Send"
            placeholder="Type a message here..."
            onSearch={(msg) => {
              if (!msg || !username || !activeKey) {
                displayStatus({
                  type: 'error',
                  msg: 'Please add receiver and a message body.'
                });
                return;
              }

              sendMessage({
                variables: {
                  sender: username,
                  receiver: activeKey,
                  message: msg
                }
              });
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
