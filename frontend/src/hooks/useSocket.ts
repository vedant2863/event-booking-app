import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

let socket: Socket | null = null;

export const useSocket = () => {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    if (!socket) {
      socket = io('/', {
        auth: { token: accessToken },
        autoConnect: true,
      });
    }

    return () => {};
  }, [accessToken]);

  return socket;
};

export const useEventRoom = (eventId: string | undefined, onSeatUpdate: (data: any) => void) => {
  const { accessToken } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!eventId || !accessToken) return;

    socketRef.current = io('/', { auth: { token: accessToken } });
    const sock = socketRef.current;

    sock.emit('join:event', eventId);
    sock.on('seat:locked', onSeatUpdate);
    sock.on('seat:released', onSeatUpdate);
    sock.on('seat:booked', onSeatUpdate);

    return () => {
      sock.emit('leave:event', eventId);
      sock.disconnect();
    };
  }, [eventId, accessToken]);

  return socketRef.current;
};
