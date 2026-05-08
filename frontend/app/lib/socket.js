import { io } from 'socket.io-client';

let socket = null;

// Backend URL ek jagah define karo
// Backend URL should be configurable for production (Railway/Render)
const rawUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:8000`
  : 'http://localhost:8000');

export const BACKEND_URL = rawUrl.replace(/\/api$/, '');

export const getFullImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${BACKEND_URL}${path}`;
  return `${BACKEND_URL}/uploads/${path}`;
};

export function getSocket() {
  if (!socket) {
    socket = io(BACKEND_URL, { 
      transports: ['polling', 'websocket'] 
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) { 
    socket.disconnect(); 
    socket = null; 
  }
}