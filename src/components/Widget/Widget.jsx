import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  WidgetCon,
  ChatName,
  JoinWrap,
  WidgetInputName,
  JoinButton,
  TextArea,
  SendBtn,
  IconButton,
  ChatText,
  MessageBox,
  ChatDiv,
  MessageWrap,
  UserImg,
  MessageTime,
} from './Widget.styled';
import { socket } from 'services/API';

const Widget = () => {
  const [username, setUsername] = useState('');
  const [usermail, setUsermail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {

  }, []);

  const joinChat = () => {
    console.log(username,usermail, "Ya tut")
    if (username.trim() !== '') {
      socket.emit('join_user', username.trim(), usermail.trim());
    }
    // if (username.trim() !== '' && usermail.trim() !== '') {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //       position => {
    //         const location = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
    //         // Отправляем данные на сервер
    //         socket.emit('join', username.trim(), usermail.trim(), location);
    //       },
    //       error => {
    //         console.error('Ошибка получения геолокации', error);
    //         alert(
    //           'Не удалось получить местоположение. Пожалуйста, разрешите доступ к местоположению.'
    //         );
    //       }
    //     );
    //   } else {
    //     alert('Геолокация не поддерживается вашим браузером.');
    //   }
    // }
  };

  const sendMessage = () => {
    // if (message.trim() !== '' && managerSocketId) {
    //   socket.emit('private_message', {
    //     recipient: managerSocketId,
    //     message: message.trim(),
    //     sender: username,
    //   });
    //   setMessages(prevMessages => [
    //     ...prevMessages,
    //     { sender: username, message },
    //   ]);
    //   setMessage('');
    // }
  };
  return (
    <WidgetCon>
      <ChatName>Приватный чат</ChatName>
      {!isJoined ? (
        <JoinWrap>
          <WidgetInputName
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Введите ваше имя"
          />
          <WidgetInputName
            value={usermail}
            onChange={e => setUsermail(e.target.value)}
            placeholder="Введите ваш email"
          />
          <JoinButton onClick={joinChat}>Присоединиться</JoinButton>
        </JoinWrap>
      ) : (
        <div>
          <TextArea>
            {messages.map(({ sender, message, timestamp }, index) => (
              <ChatDiv key={index} isClient={sender === username}>
                <MessageWrap isClient={sender === username}>
                  {/* {!uPhoto && (
                    <UserImg
                      src={userPhoto}
                      alt="UserImg"
                      isClient={sender === username}
                    />
                  )}
                  {uPhoto && (
                    <UserImg
                      src={`http${
                        process.env.REACT_APP_SECURE === 'true' ? 's' : ''
                      }://${process.env.REACT_APP_BACKEND_URL}${uPhoto}`}
                      alt="UserImg"
                      isClient={sender === username}
                    />
                  )} */}
                  <div>
                    {sender}
                    <MessageBox isClient={sender === username}>
                      <ChatText>{message}</ChatText>
                      <MessageTime>{timestamp}</MessageTime>
                    </MessageBox>
                  </div>
                </MessageWrap>
              </ChatDiv>
            ))}
          </TextArea>
          <div style={{ display: 'flex' }}>
            <input
              style={{
                flex: '1',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
              }}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Введите сообщение"
            />
            <SendBtn onClick={sendMessage}>
              {/* <IconButton src={Vec} alt="Vec" /> */}
              <p>asdasdads</p>
            </SendBtn>
          </div>
        </div>
      )}
    </WidgetCon>
  );
};

export default Widget;
