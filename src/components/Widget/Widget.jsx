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
} from './Widget.styled';
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
      onClose();
    }
  };

  const handleCollapse = () => {
    onClose();
  };

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files); // Преобразуем FileList в массив
  //   setFiles(selectedFiles);
  
  //   // Создаем URL для предварительного просмотра каждого файла
  //   const fileURLs = selectedFiles.map((file) => URL.createObjectURL(file));
  //   setPreviewURLs(fileURLs);
  // };
  
  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewURLs = previewURLs.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviewURLs(newPreviewURLs);
  };
  

  // const handleFileUpload = async () => {
  //   for (const file of files) {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append('roomId', roomId);
  
  //     try {
  //       const response = await axios.post(
  //         'http://localhost:8000/api/upload-file',
  //         formData,
  //         {
  //           headers: {
  //             'Content-Type': 'multipart/form-data',
  //           },
  //         }
  //       );
  //       console.log('Файл успешно загружен:', response.data);
  //     } catch (err) {
  //       console.error('Ошибка при загрузке файла:', err);
  //     }
  //   }
  
  //   // Очистить файлы и предварительный просмотр после успешной загрузки
  //   setFiles([]);
  //   setPreviewURLs([]);
  // };
  const sendFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      socket.emit('send_file', { roomId, fileName: file.name, fileData: arrayBuffer });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const fileURLs = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewURLs(fileURLs);
    selectedFiles.forEach(file => sendFile(file)); // Отправляем файлы сразу после выбора
  };

  const handleSend = () => {
    if (message.trim() !== '') {
      sendMessage();
    }
    setFiles([]);
    setPreviewURLs([]);
  };

  

  const handlePaste = (e) => {
    const clipboardItems = e.clipboardData.items;
  
    // Проходим по элементам буфера обмена
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
  
      // Проверяем, является ли элемент изображением
      if (item.type.includes('image')) {
        const file = item.getAsFile();
        if (file) {
          // Добавляем изображение в список файлов
          const newFiles = [...files, file];
          setFiles(newFiles);
  
          // Создаем URL для предварительного просмотра
          const fileURL = URL.createObjectURL(file);
          setPreviewURLs([...previewURLs, fileURL]);
        }
      }
    }
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
            {messages?.messages?.map(({ sender, message, fileUrl,timestamp }, index) => (
              <ChatDiv key={index} isClient={sender === username}>
                <MessageWrap isClient={sender === username}>
                  <div>
                    <MessageBox isClient={sender === username}>
                    {fileUrl && (
            <>
             
              {fileUrl.match(/\.(jpeg|jpg|gif|png|HEIC)$/) ? (
                <FileImg src={fileUrl} alt="Загруженный файл" />
              ) : (
                /* Если это не картинка, даём ссылку для скачивания */
                <a href={fileUrl} download>
                  Скачать файл
                </a>
              )}
            </>
          )}
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
          {previewURLs.length > 0 && (
  <FileWrap>
    {previewURLs.map((url, index) => (
      <FileCon key={index}>
        <p>{files[index].name}</p>
        <CloseButton onClick={() => handleRemoveFile(index)} />
      </FileCon>
    ))}
  </FileWrap>
)}


          <WidgetInput
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Введите сообщение"
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSend();
                e.preventDefault();
              }
            }}
            onPaste={handlePaste}
          />

          <SendBtnFile
            type="file"
            id="fileUpload"
            name="file"
            multiple
            onChange={handleFileChange}
          />
          <FileInpIconWrapper htmlFor="fileUpload" />
          <SendBtn onClick={handleSend} />
        </WrapArea>
      )}
    </WidgetCon>
  );
};

export default Widget;
