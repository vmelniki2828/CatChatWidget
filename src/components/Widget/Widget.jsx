import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  FileWrap,
  FileCon,
  FileImg,
  LoadingCon,
} from './Widget.styled';
import { ThreeDots } from 'react-loader-spinner';
import { socket } from '../../services/API'; // Убедитесь, что у вас правильно настроен путь

const Widget = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [usermail, setUsermail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [manager, setManager] = useState('');
  const [files, setFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [file, setFile] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(false);
  let typingTimeout;
  useEffect(() => {
    if (!socket) return;

    const savedUsername = sessionStorage.getItem('username');
    const savedUsermail = sessionStorage.getItem('usermail');
    const savedRoomId = sessionStorage.getItem('roomId');
    const savedMessages = JSON.parse(sessionStorage.getItem('messages')) || [];
    const savedManager = sessionStorage.getItem('manager' || '');

    if (savedRoomId) {
      console.log('Rejoining room:', savedRoomId);
      setUsername(savedUsername);
      setUsermail(savedUsermail);
      setRoomId(savedRoomId);
      setMessages(savedMessages);
      setIsJoined(true);
      setManager(savedManager);
      socket.emit('rejoin_user', { roomId: savedRoomId });

      socket.on('roomRejoined', () => {
        console.log('Successfully rejoined room:', savedRoomId);
      });
    }

    socket.on('manager_assigned', managerData => {
      console.log('Назначен менеджер:', managerData);
      setManager(managerData.username);
      sessionStorage.setItem('manager', managerData.username);
    });

    socket.on('receive_message', message => {
      console.log('Received new message:', message);
      setMessages(message);

      console.log(message);
      sessionStorage.setItem('messages', JSON.stringify(message));
    });

    return () => {
      socket.off('receive_message');
      socket.off('roomRejoined');
      socket.off('manager_assigned');
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
        console.log('Room created:', roomId, socket);
        setRoomId(roomId); // Установите идентификатор комнаты в состоянии
        setIsJoined(true); // Устанавливаем состояние присоединения
        sessionStorage.setItem('username', username.trim());
        sessionStorage.setItem('usermail', usermail.trim());
        sessionStorage.setItem('roomId', roomId);
        sessionStorage.setItem('messages', JSON.stringify([]));
      });
    }
  };

  const sendMessage = async () => {
    if (message.trim() !== '') {
      const formData = new FormData();
      formData.append('file', file);
      console.log(file)

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Здесь вы получите URL загруженного файла
        // Отправьте сообщение через WebSocket с использованием URL файла
        socket.emit('send_message', {
          roomId: roomId, // Используйте правильный идентификатор комнаты
          sender: username,
          messageText: message,
          fileUrl: data.fileUrl, // Добавьте URL загруженного файла
        });
        setMessage('');
      } else {
        console.error('Ошибка загрузки файла');
      }
    }
  };

  useEffect(() => {
    // Обработка события "user_typing"
    socket.on("user_typing", ({ roomId, username }) => {
      setTypingUser(true);
    });

    // Обработка события "user_stopped_typing"
    socket.on("user_stopped_typing", ({ roomId,username }) => {
      setTypingUser(false);
    });

    return () => {
      socket.off("user_typing");
      socket.off("user_stopped_typing");
    };
  }, []);

  const handleTyping = (e) => {
    setMessage(e.target.value);
  
    // Если пользователь начинает печатать и событие "typing" еще не отправлено
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { roomId:roomId, username:username });
    }
  
    // Очищаем таймер для "stop_typing"
    clearTimeout(typingTimeout);
  
    // Запускаем новый таймер на 2 секунды, после которого отправляется событие "stop_typing"
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop_typing", { roomId:roomId, username:username });
    }, 2000);
  };
  const handleDisconnectChat = async () => {
    if (roomId) {
      socket.emit('disconnect_chat', roomId);

      sessionStorage.clear();
      setIsJoined(false);
      setMessages([]);
      setRoomId('');
      onClose();
    }
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
            {messages?.messages?.map(
              ({ sender, message, fileUrl, timestamp }, index) => (
                <ChatDiv key={index} isClient={sender === username}>
                  <MessageWrap isClient={sender === username}>
                    <div>
                      <MessageBox isClient={sender === username}>
                        {console.log(fileUrl)}
                        <img src={fileUrl} atl="dsad"/>
                        <ChatText>{message}</ChatText>
                        <MessageTime>
                          {new Date(timestamp).toLocaleTimeString()}
                        </MessageTime>
                      </MessageBox>
                    </div>
                  </MessageWrap>
                </ChatDiv>
              )
            )}
          </TextArea>
          {typingUser && (<LoadingCon>
          <ThreeDots
            height="10"
            width="30"
            radius="9"
            color="grey"
            ariaLabel="three-dots-loading"
            visible={true}
          />
          </LoadingCon>)}
          {previewURLs.length > 0 && (
            <FileWrap>
              {/* {previewURLs.map((url, index) => (
                <FileCon key={index}>
                  <p>{files[index].name}</p>
                  <CloseButton onClick={() => handleRemoveFile(index)} />
                </FileCon>
              ))} */}
            </FileWrap>
          )}

          <WidgetInput
            value={message}
            onChange={handleTyping}
            placeholder="Введите сообщение"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            // onPaste={handlePaste}
          />

          <SendBtnFile
            type="file"
            id="fileUpload"
            name="file"
            multiple
            onChange={(e)=>setFile(e.target.files[0])} 
          />
          <FileInpIconWrapper htmlFor="fileUpload" />
          <SendBtn onClick={sendMessage} />
        </WrapArea>
      )}
    </WidgetCon>
  );
};

export default Widget;


// {fileUrl && (
//   <>
//     {fileUrl.match(/\.(jpeg|jpg|gif|png|HEIC)$/) ? (
//       <FileImg src={fileUrl} alt="Загруженный файл" />
//     ) : (
//       /* Если это не картинка, даём ссылку для скачивания */
//       <a href={fileUrl} download>
//         Скачать файл
//       </a>
//     )}
//   </>
// )}