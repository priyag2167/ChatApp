import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../helpers/constants/config';

const DEFAULT_URL = SOCKET_URL;

let currentSocket: Socket | null = null;
let currentToken: string | null = null;

export function connectSocket(token: string | null): Socket {
  // Reuse existing connection if token unchanged
  if (currentSocket && currentToken === token) {
    return currentSocket;
  }

  // If token changed, replace the connection
  if (currentSocket && currentToken !== token) {
    try { currentSocket.removeAllListeners(); } catch {}
    try { currentSocket.disconnect(); } catch {}
    currentSocket = null;
  }

  currentToken = token;
  currentSocket = io(DEFAULT_URL, {
    autoConnect: true,
    transports: ['websocket'],
    auth: token ? { token: `Bearer ${token}` } : undefined,
  });
  return currentSocket;
}

export function getSocket(): Socket | null {
  return currentSocket;
}


