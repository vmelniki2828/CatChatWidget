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
import { socket } from 'services/API'; // Убедитесь, что у вас правильно настроен путь

const Widget = () => {
  const [username, setUsername] = useState('');
  const [usermail, setUsermail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Подключаемся к WebSocket
    socket.on('receive_message', message => {
      console.log('Получено сообщение:', message);
      // Обновляем состояние сообщений
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Очистка при размонтировании
    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  const joinChat = () => {
    if (username.trim() !== '') {
      socket.emit('join_user', username.trim(), usermail.trim());
      // Убедитесь, что идентификатор комнаты получен и сохранен правильно
      socket.on('roomCreated', roomId => {
        console.log('Room created:', roomId);
        setRoomId(roomId); // Установите идентификатор комнаты в состоянии
      });
      setIsJoined(true);
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
            {messages.map(({ sender, message, timestamp }, index) => {
              return (
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
              );
            })}
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
              <p>Отправить</p>
            </SendBtn>
          </div>
        </div>
      )}
    </WidgetCon>
  );
};

export default Widget;
