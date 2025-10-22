import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import useConversation from '../../zustand/useConversation';

const Message = React.forwardRef(({ message }, ref) => {
  // Local state for optimistic UI
  const [localReactions, setLocalReactions] = useState(message.reactions || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.message || '');

  // Determine current user id from ChatApp or jwt fallback
  let myId = null;
  try {
    const raw = localStorage.getItem('ChatApp');
    const auth = raw ? JSON.parse(raw) : null;
    const storedUser = auth?.user ? auth.user : auth;
    if (storedUser && storedUser._id) myId = String(storedUser._id);
  } catch (e) {
    // ignore
  }
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

  // Normalize sender id
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

  // Time formatting
  const time = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : '';

  // Styles
  const bubbleBase = 'text-sm md:text-base max-w-[85%] md:max-w-[70%] p-3 rounded-2xl break-words inline-block';
  const myBubble = 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
  const otherBubble = 'bg-slate-700 text-white';

  // Keep localReactions in sync whenever the message object updates
  useEffect(() => {
    const incoming = message?.reactions || [];
    // normalize userId to string to avoid comparison issues
    const norm = incoming.map(r => ({ userId: String(r.userId), reaction: r.reaction }));
    setLocalReactions(norm);
  }, [message]);

  const { activeAction, setActiveAction, setMessage } = useConversation();

  // Reaction picker state and long-press handling (controlled by global activeAction)
  const showPicker = activeAction?.type === 'reaction' && activeAction?.id === String(message._id);
  const longPressTimer = React.useRef(null);
  const bubbleRef = React.useRef(null);
  const popoverRef = React.useRef(null);
  const [pickerPos, setPickerPos] = useState(null);
  const [popperVisible, setPopperVisible] = useState(false);

  const startLongPress = () => {
    longPressTimer.current = setTimeout(() => setActiveAction({ type: 'reaction', id: String(message._id) }), 500);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Compute picker position when it becomes visible
  React.useEffect(() => {
    if (!showPicker) return;
    const compute = () => {
      const bubble = bubbleRef.current;
      if (!bubble) return;
  const rect = bubble.getBoundingClientRect();
  try { console.debug('compute picker pos rect for', message._id, rect); } catch (e) {}
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      // Estimate popover size (will adjust after mount if needed)
      const popW = 220; const popH = 48;
      let left = rect.left + rect.width / 2 - popW / 2;
      let top = rect.top - popH - 8; // above bubble

      // If there's not enough space above, place below
      if (top < 8) {
        top = rect.bottom + 8;
      }

      // Clamp to viewport
      left = Math.max(8, Math.min(left, vw - popW - 8));
      top = Math.max(8, Math.min(top, vh - popH - 8));

      setPickerPos({ left, top });
    };

    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [showPicker]);

  // Debug: log activeAction changes for this message
  React.useEffect(() => {
    try { console.debug('activeAction changed for message', message._id, activeAction); } catch (e) {}
  }, [activeAction]);

  // trigger small entrance animation for popover
  React.useEffect(() => {
    if (showPicker) {
      setPopperVisible(false);
      // next tick
      const id = setTimeout(() => setPopperVisible(true), 20);
      return () => clearTimeout(id);
    } else {
      setPopperVisible(false);
    }
  }, [showPicker]);

  // Close picker on outside click
  React.useEffect(() => {
    const handleOutside = (e) => {
      const inPicker = e.target.closest && e.target.closest('.msg-reaction-picker');
      const inBubble = e.target.closest && e.target.closest('.msg-bubble');
      if (!inPicker && !inBubble) setActiveAction(null);
    };
    if (showPicker) document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, [showPicker]);

  const API_URL = import.meta.env.VITE_API_URL;

  const toggleReaction = async (emoji) => {
    const haveLocalId = !!myId;
    if (!haveLocalId) {
      try { console.debug('toggleReaction: no local myId; will send request using cookie auth and update from server response'); } catch (e) {}
    }
    // find if this user already reacted (by userId) so we can replace/remove instead of blindly appending
    const existingByUser = haveLocalId ? localReactions.findIndex(r => String(r.userId) === String(myId)) : -1;
    let optimistic = [];
    if (existingByUser !== -1) {
      // user already reacted: if same emoji -> remove, else replace
      if (localReactions[existingByUser].reaction === emoji) {
        optimistic = localReactions.filter((_, idx) => idx !== existingByUser);
      } else {
        optimistic = localReactions.map((r, idx) => idx === existingByUser ? { ...r, reaction: emoji } : r);
      }
    } else {
      optimistic = [...localReactions, { userId: myId, reaction: emoji }];
    }

    // normalize optimistic reaction objects
    const optimisticNorm = optimistic.map(r => ({ userId: String(r.userId), reaction: r.reaction }));
    if (haveLocalId) {
      try { console.debug('optimistic reactions for', message._id, optimisticNorm); } catch (e) {}
      setLocalReactions(optimisticNorm);
      try {
        setMessage(prev => prev.map(m => (String(m._id) === String(message._id) ? { ...m, reactions: optimisticNorm } : m)));
      } catch (e) {
        console.debug('Failed to optimistically set global message for reaction', e);
      }
    }

    // persist to server (send Authorization per-request to avoid timing issues)
    try {
      const jwtLocal = localStorage.getItem('jwt');
      const headers = {};
      if (jwtLocal) headers['Authorization'] = `Bearer ${jwtLocal}`;
      try { console.debug('sending reaction request', { url: `${API_URL}/api/message/react/${message._id}`, body: { reaction: emoji }, headers }); } catch (e) {}
      const res = await axios.post(`${API_URL}/api/message/react/${message._id}`, { reaction: emoji }, { withCredentials: true, headers });
      try { console.debug('reaction response', res.status, res.data); } catch (e) {}
      const updated = (res.data.reactions || []).map(r => ({ userId: String(r.userId), reaction: r.reaction }));
      try { console.debug('server reactions for', message._id, updated); } catch (e) {}
      setLocalReactions(updated);
      try {
        setMessage(prev => prev.map(m => (String(m._id) === String(message._id) ? { ...m, reactions: updated } : m)));
      } catch (e) {
        console.debug('Failed to set global message after reaction', e);
      }
    } catch (e) {
      console.warn('Reaction API failed, reverting', e?.response?.data || e.message || e);
      // rollback to server-backed message.reactions
      setLocalReactions(message.reactions || []);
      try {
        setMessage(prev => prev.map(m => (String(m._id) === String(message._id) ? { ...m, reactions: message.reactions || [] } : m)));
      } catch (er) {
        console.debug('Failed to rollback global message after reaction error', er);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!itsMe) return;
    try {
      const jwtLocal = localStorage.getItem('jwt');
      if (jwtLocal) axios.defaults.headers.common['Authorization'] = `Bearer ${jwtLocal}`;
      const res = await axios.put(`${API_URL}/api/message/edit/${message._id}`, { message: editText }, { withCredentials: true });
      if (res.status === 200) {
        // update local display optimistically; backend will emit messageEdited to others
        message.message = editText;
        message.edited = true;
        setIsEditing(false);
        setActiveAction(null);
      }
    } catch (e) {
      console.warn('Edit failed', e);
    }
  };

  // If activeAction moves away from this message's edit, cancel edit and revert text
  React.useEffect(() => {
    const isThisEditActive = activeAction?.type === 'edit' && activeAction?.id === String(message._id);
    if (!isThisEditActive && isEditing) {
      // revert local edit text to original message
      setIsEditing(false);
      setEditText(message.message || '');
    }
    // if activeAction becomes edit for this message, ensure isEditing is true
    if (isThisEditActive && !isEditing) {
      setIsEditing(true);
    }
  }, [activeAction]);

  const reactionCounts = localReactions.reduce((acc, r) => {
    acc[r.reaction] = (acc[r.reaction] || 0) + 1;
    return acc;
  }, {});

  const reactionList = Object.entries(reactionCounts);

  return (
    <div ref={ref} className="px-2 md:px-4 py-1">
      <div className="w-full">
        <div className={`w-full flex ${itsMe ? 'justify-end' : 'justify-start'}`}>
    <div ref={bubbleRef} className={`relative group ${bubbleBase} ${itsMe ? myBubble : otherBubble} msg-bubble ${showPicker ? 'ring-2 ring-indigo-400' : ''}`} style={{ whiteSpace: 'pre-wrap' }}
               onMouseDown={(e) => {
                 // set early to avoid popover capturing the initiating click
                 e.stopPropagation();
                 try { console.debug('bubble mousedown for message', message._id); } catch {};
                 setActiveAction(prev => prev && prev.id === String(message._id) && prev.type === 'reaction' ? null : { type: 'reaction', id: String(message._id) });
               }}
               onClick={(e) => { e.stopPropagation(); }}
      onTouchStart={() => startLongPress()}
      onTouchEnd={() => endLongPress()}>
            <div className="flex items-end justify-between gap-3">
              <div className="whitespace-pre-wrap">
                {!isEditing ? (
                  <>
                    {message.message}
                    {message.edited ? <span className='text-xs opacity-70 ml-2'>(edited)</span> : null}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-transparent placeholder-gray-200 text-white outline-none"
                    />
                    <button className="px-2 py-1 bg-blue-600 rounded text-xs" onClick={() => { handleSaveEdit(); setActiveAction(null); }}>Save</button>
                    <button className="px-2 py-1 bg-gray-600 rounded text-xs" onClick={() => { setIsEditing(false); setEditText(message.message || ''); setActiveAction(null); }}>Cancel</button>
                  </div>
                )}
              </div>
              <div className="ml-2 text-[11px] text-gray-200 opacity-80 flex-shrink-0 flex items-center gap-2" style={{ minWidth: '40px', textAlign: 'right' }}>
                {itsMe && (
                  <button type="button" onClick={(e) => { e.stopPropagation(); setActiveAction({ type: 'edit', id: String(message._id) }); }} className="text-[10px] text-gray-300 hover:text-white">Edit</button>
                )}
                <div>{time}</div>
              </div>
            </div>

            {/* Edit input */}
            {/* inline edit handled above inside the bubble */}

            {/* Reaction picker rendered inside bubble so bubble click/long-press opens it */}
              {/* Always render the picker but show it on hover or when explicitly active. Rendering it persistently avoids mount/unmount races that can steal clicks. */}
              <div
                className={`msg-reaction-picker absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-2 justify-center items-center p-1 rounded-full bg-slate-800/90 shadow-lg z-50 transition-all duration-150 ${showPicker ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'} group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto`}
                role="dialog"
                aria-label="Reaction picker"
                onClick={(e) => e.stopPropagation()}
              >
                {['👍', '❤️', '😂', '😮', '😢'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(ev) => { ev.stopPropagation(); try { console.debug('reaction button clicked', emoji, message._id); } catch {} ; toggleReaction(emoji); setActiveAction(null); }}
                    className="p-2 rounded-full transition-all duration-200 hover:scale-110 bg-slate-700/40"
                    aria-label={`React ${emoji}`}
                  >
                    <span className="text-lg leading-none">{emoji}</span>
                  </button>
                ))}
              </div>
          </div>
        </div>

        {/* Reactions display: compact pills, wrap if overflow, aligned just below/right of bubble */}
        {reactionList.length > 0 && (
          <div className={`w-full flex ${itsMe ? 'justify-end' : 'justify-start'} mt-2 px-2`}>
            <div className="flex flex-wrap gap-2 items-center text-xs text-gray-200 max-w-[90%]">
              {reactionList.map(([emoji, count]) => (
                <div
                  key={emoji}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 backdrop-blur-sm rounded-full text-[12px] transition-all duration-300 ease-in-out hover:scale-105"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="text-sm leading-none">{emoji}</span>
                  <span className="opacity-90">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

          {/* reaction picker removed from separate trigger (picker is rendered inside the bubble) */}
      </div>
    </div>
  );
});

export default Message;