import { io } from 'socket.io-client';

export const socket = io('http://95.164.33.221:8000', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
  reconnection: true, // Включает автоматическое восстановление соединения
  reconnectionAttempts: 5, // Максимальное количество попыток восстановления
  reconnectionDelay: 1000, // Задержка между попытками восстановления (в миллисекундах)
});
