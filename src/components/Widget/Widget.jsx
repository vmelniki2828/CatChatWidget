import React, { useState, useEffect } from 'react';

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
  InfoWrap,
  CloseButton,
  CollapseButton,
} from './Widget.styled';
import { socket } from 'services/API'; // Убедитесь, что у вас правильно настроен путь

const Widget = () => {
  const [username, setUsername] = useState('');
  const [usermail, setUsermail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    console.log('Socket:', socket);

    if (!socket) return;

    const savedUsername = sessionStorage.getItem('username');
    const savedUsermail = sessionStorage.getItem('usermail');
    const savedRoomId = sessionStorage.getItem('roomId');
    const savedMessages = JSON.parse(sessionStorage.getItem('messages')) || [];

    if (savedRoomId) {
      console.log('Rejoining room:', savedRoomId);
      setUsername(savedUsername);
      setUsermail(savedUsermail);
      setRoomId(savedRoomId);
      setMessages(savedMessages);
      setIsJoined(true);

      socket.emit('rejoin_user', { roomId: savedRoomId });

      socket.on('roomRejoined', () => {
        console.log('Successfully rejoined room:', savedRoomId);
      });
    }

    socket.on('receive_message', message => {
      console.log('Received new message:', message);
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, message];
        sessionStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => {
      socket.off('receive_message');
      socket.off('roomRejoined');
    };
  }, [socket]);

  const getUserData = async () => {
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const referrer = document.referrer;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timestamp = new Date().toLocaleString();

    // Fetch IP and location using an external API (e.g., ipify, ipinfo)
    const response = await fetch('https://ipapi.co/json/'); // Example using ipapi
    const { ip, city, region, country, latitude, longitude } =
      await response.json();

    return {
      userAgent,
      language,
      referrer,
      timezone,
      timestamp,
      ip,
      location: `${city}, ${region}, ${country}`,
      coordinates: { latitude, longitude },
    };
  };

  const joinChat = async () => {
    if (username.trim() !== '') {
      const userData = await getUserData();
      console.log(userData);
      socket.emit('join_user', {
        username: username.trim(),
        email: usermail.trim(),
        otherInfo: userData,
      });

      // Убедитесь, что идентификатор комнаты получен и сохранен правильно
      socket.on('roomCreated', roomId => {
        console.log('Room created:', roomId);
        setRoomId(roomId); // Установите идентификатор комнаты в состоянии
        setIsJoined(true); // Устанавливаем состояние присоединения
        sessionStorage.setItem('username', username.trim());
        sessionStorage.setItem('usermail', usermail.trim());
        sessionStorage.setItem('roomId', roomId);
        sessionStorage.setItem('messages', JSON.stringify([]));
      });
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send_message', {
        roomId: roomId, // Используйте правильный идентификатор комнаты
        sender: username,
        messageText: message,
      });
      setMessage(''); // Очищаем поле ввода
    }
  };

  const handleDisconnectChat = async () => {
    if (roomId) {
      socket.emit('disconnect_chat', roomId);

      sessionStorage.clear();
      setIsJoined(false);
      setMessages([]);
      setRoomId('');
    }
  };

  const handleCollapse = () => {
    setIsCollapsed(prevState => !prevState);
  };
  

  return (
    <WidgetCon  style={{
      height: isCollapsed ? '0' : 'auto',
      overflow: 'hidden',
      transition: 'height 0.3s ease',
    }} >
      <InfoWrap>
        {' '}
        <ChatName>Приватный чат</ChatName>
        <div>
          <CollapseButton onClick={handleCollapse} />
          <CloseButton onClick={handleDisconnectChat} />
        </div>
      </InfoWrap>

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
                  {/* Замените этот блок с учетом вашей логики для отображения фотографий */}
                  <div>
                    {sender}
                    <MessageBox isClient={sender === username}>
                      <ChatText>{message}</ChatText>
                      <MessageTime>
                        {new Date(timestamp).toLocaleTimeString()}
                      </MessageTime>
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
              <IconButton />
            </SendBtn>
          </div>
        </div>
      )}
    </WidgetCon>
  );
};

export default Widget;
