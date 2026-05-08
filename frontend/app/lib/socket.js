import { io } from 'socket.io-client';

let socket = null;

// Backend URL ek jagah define karo
// Backend URL should be configurable for production (Railway/Render)
const rawUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:8005`
  : 'http://localhost:8005');

export const BACKEND_URL = rawUrl.replace(/\/api$/, '');

export const getFullImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Normalize path by removing leading slash if it exists
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If it already starts with uploads/, just prepend backend URL
  if (cleanPath.startsWith('uploads/')) {
    return `${BACKEND_URL}/${cleanPath}`;
  }
  
  // Otherwise, add uploads/ prefix
  return `${BACKEND_URL}/uploads/${cleanPath}`;
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