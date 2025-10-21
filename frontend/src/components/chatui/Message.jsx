import React from 'react';

const Message = React.forwardRef(({ message }, ref) => {
  // Read ChatApp from localStorage when available (fallbacks handled elsewhere)
  let auth = null;
  try {
    const raw = localStorage.getItem('ChatApp');
    auth = raw ? JSON.parse(raw) : null;
  } catch (e) {
    auth = null;
  }

  // Support multiple possible shapes for stored auth data
  const storedUser = auth?.user ? auth.user : auth; // auth may be { user } or user directly
  let myId = storedUser?._id ? String(storedUser._id) : null;

  // Fallback: if ChatApp/user isn't available but we have a JWT in localStorage, decode it to get userId
  if (!myId) {
    try {
      const rawJwt = localStorage.getItem('jwt');
      if (rawJwt) {
        const parts = rawJwt.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          if (payload && payload.userId) myId = String(payload.userId);
        }
      }
    } catch (e) {
      // ignore decoding errors
    }
  }

  // Normalize sender id (could be ObjectId string or populated object)
  const senderId = (() => {
    if (!message) return null;
    const s = message.senderId;
    if (!s) return null;
    if (typeof s === 'string') return s;
    if (s._id) return String(s._id);
    if (s.toString) return String(s.toString());
    return null;
  })();

  const itsMe = senderId && myId ? String(senderId) === String(myId) : false;

  // Dev debug: log ids when running locally to diagnose alignment issues
  try {
    if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
      // eslint-disable-next-line no-console
      console.debug('Message debug:', { senderId, myId, itsMe, message });
    }
  } catch (e) {
    // ignore
  }

  // Format time like 03:22 AM/PM
  const time = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : '';

  // Styles
  const bubbleBase = 'text-sm md:text-base max-w-[85%] md:max-w-[70%] p-3 rounded-2xl break-words inline-block';
  const myBubble = 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
  const otherBubble = 'bg-slate-700 text-white';

  return (
    <div ref={ref} className="px-2 md:px-4 py-1">
      <div className="w-full">
        <div className={`w-full flex ${itsMe ? 'justify-end' : 'justify-start'}`}>
          <div className={`${bubbleBase} ${itsMe ? myBubble : otherBubble}`} style={{ whiteSpace: 'pre-wrap' }}>
            <div className="flex items-end justify-between gap-3">
              <div className="whitespace-pre-wrap">{message.message}</div>
              <div className="ml-2 text-[11px] text-gray-200 opacity-80 flex-shrink-0" style={{ minWidth: '40px', textAlign: 'right' }}>{time}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Message;