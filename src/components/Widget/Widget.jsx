import React, { useState, useEffect } from 'react';

import {
  WidgetCon,
  JoinWrap,
  WidgetInputName,
  JoinButton,
  TextArea,
  SendBtn,
  ChatText,
  MessageBox,
  ChatDiv,
  MessageWrap,
  MessageTime,
  InfoWrap,
  CloseButton,
  CollapseButton,
  ClientInfoWrap,
  WidgetInput,
  WrapArea,
  WidgetSettingsIcon,
  WidgetUserName,
  WidgetUserInf,
  ClientInfoCont,
  SendBtnFile,
  FileInpIconWrapper,
} from './Widget.styled';
import { socket } from '../../services/API'; 

const Widget = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [usermail, setUsermail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [manager, setManager] = useState('');

  
  
  useEffect(() => {
    if (!socket) return;

    const savedUsername = sessionStorage.getItem('username');
    const savedUsermail = sessionStorage.getItem('usermail');
    const savedRoomId = sessionStorage.getItem('roomId');
    const savedManager = sessionStorage.getItem('manager' || '');

    if (savedRoomId) {
    
      setUsername(savedUsername);
      setUsermail(savedUsermail);
      setRoomId(savedRoomId);
      setManager(savedManager);
      setIsJoined(true);

      // Запрос сообщений из комнаты на сервере
      socket.emit('rejoin_user', { roomId: savedRoomId });

      socket.on('roomRejoined', (messagesFromServer) => {
        console.log('Successfully rejoined room:', savedRoomId);
        setMessages(messagesFromServer); // Устанавливаем сообщения с сервера
        
      });
    }
    return () => {
      socket.off('receive_message');
      socket.off('roomRejoined');
     
    };
  }, [socket]);

  useEffect(() => {
  
    socket.on('receive_message', message => {
      console.log('Получено сообщение:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('receive_message'); // Очистка обработчика при размонтировании
    };
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
  
    const handleManagerAssigned = (managerData) => {
      console.log('Назначен менеджер:', managerData);
      setManager(managerData.username);
      sessionStorage.setItem('manager', managerData.username);
    };
  
    socket.on('manager_assigned', handleManagerAssigned);
  
    return () => {
      socket.off('manager_assigned', handleManagerAssigned);
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
    const { ip, city, region, country, latitude, longitude } = await response.json();

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

      socket.on('roomCreated', (roomId) => {
        console.log('Room created:', roomId, socket);
        setRoomId(roomId); 
        setIsJoined(true); 
        sessionStorage.setItem('username', username.trim());
        sessionStorage.setItem('usermail', usermail.trim());
        sessionStorage.setItem('roomId', roomId);
      });
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      socket.emit('send_message', {
        roomId: roomId, 
        sender: username,
        messageText: message,
      });
      setMessage(''); 
    }
  };

  const handleDisconnectChat = async () => {
    if (roomId) {
      socket.emit('disconnect_chat', roomId);

      sessionStorage.clear();
      setIsJoined(false);
      setMessages([]);
      setRoomId('');
      onClose();
    }else{ onClose();}
  };

  const handleCollapse = () => {
    onClose();
  };

  return (
    <WidgetCon>
      <InfoWrap isJoined={isJoined}>
        <WidgetSettingsIcon />
        {manager}
        <div>
          <CollapseButton onClick={handleCollapse} />
          <CloseButton onClick={handleDisconnectChat} />
        </div>
      </InfoWrap>

      {!isJoined ? (
        <JoinWrap>
          <WidgetInputName
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите ваше имя"
          />
          <WidgetInputName
            value={usermail}
            onChange={(e) => setUsermail(e.target.value)}
            placeholder="Введите ваш email"
          />
          <JoinButton onClick={joinChat}>Присоединиться</JoinButton>
        </JoinWrap>
      ) : (
        <WrapArea>
          <TextArea>
            <ClientInfoWrap>
              <ClientInfoCont>
                <WidgetUserName>Name:</WidgetUserName>
                <WidgetUserInf>{username}</WidgetUserInf>
              </ClientInfoCont>
              <ClientInfoCont>
                <WidgetUserName>E-mail:</WidgetUserName>
                <WidgetUserInf>{usermail}</WidgetUserInf>
              </ClientInfoCont>
            </ClientInfoWrap>
            {messages.map(({ sender, message, timestamp }, index) => (
              <ChatDiv key={index} isClient={sender === username}>
                <MessageWrap isClient={sender === username}>
                  <div>
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

          <WidgetInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Введите сообщение"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
                e.preventDefault();
              }
            }}
          />

          <SendBtnFile type="file" id="fileUpload" name="file" multiple />
          <FileInpIconWrapper htmlFor="fileUpload" />
          <SendBtn onClick={sendMessage} />
        </WrapArea>
      )}
    </WidgetCon>
  );
};

export default Widget;
