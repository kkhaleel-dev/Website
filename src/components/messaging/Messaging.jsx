import React, { useEffect, useState, useRef } from "react";
import "./Messaging.scss";
import { auth, db } from "../../firebase";
import { ref, get, set, push, onValue, update, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import dummyLogo from "../../assets/person-logo.png";

const Messaging = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [chatReady, setChatReady] = useState(false);

  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState({});
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState(false);
  const [userStatus, setUserStatus] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user || null));
    return unsub;
  }, []);

  const getChatId = (uid1, uid2) => [uid1, uid2].sort().join("_");

  /* ================= USERS ================= */
  useEffect(() => {
    if (!currentUser) return;
    get(ref(db, "users")).then((snap) => {
      if (!snap.exists()) return;
      const list = Object.entries(snap.val())
        .filter(([uid]) => uid !== currentUser.uid)
        .map(([uid, data]) => ({ uid, ...data }));
      setAllUsers(list);
    });
  }, [currentUser]);

  /* ================= CHAT LIST ================= */
  useEffect(() => {
    if (!currentUser) return;
    const chatsRef = ref(db, "chats");
    return onValue(chatsRef, (snap) => {
      const all = snap.exists() ? snap.val() : {};
      const cutoff = Date.now() - 45 * 24 * 60 * 60 * 1000;
      const filtered = {};

      Object.entries(all).forEach(([id, c]) => {
        if (c.members?.[currentUser.uid]) {
          // Remove old messages
          const messages45 = {};
          if (c.messages) {
            Object.entries(c.messages).forEach(([mid, m]) => {
              if (m.timestamp >= cutoff) messages45[mid] = m;
              else remove(ref(db, `chats/${id}/messages/${mid}`));
            });
          }
          filtered[id] = { ...c, messages: messages45 };
        }
      });

      setChats(filtered);
    });
  }, [currentUser]);

  /* ================= MESSAGES ================= */
  useEffect(() => {
    if (!chatId || !currentUser || !chatReady) return;
    const messagesRef = ref(db, `chats/${chatId}/messages`);
    return onValue(messagesRef, (snap) => {
      const cutoff = Date.now() - 45 * 24 * 60 * 60 * 1000;
      const list = snap.exists()
        ? Object.entries(snap.val())
            .filter(([_, m]) => m.timestamp >= cutoff)
            .map(([id, m]) => ({ id, ...m }))
        : [];
      setMessages(list);
    });
  }, [chatId, currentUser, chatReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= TYPING ================= */
  useEffect(() => {
    if (!chatId || !selectedUser) return;
    return onValue(ref(db, `chats/${chatId}/typing/${selectedUser.uid}`), (snap) =>
      setTypingUser(snap.val() === true)
    );
  }, [chatId, selectedUser]);

  /* ================= STATUS ================= */
  useEffect(() => {
    if (!chatId || !selectedUser) return;
    return onValue(ref(db, `chats/${chatId}/status/${selectedUser.uid}`), (snap) =>
      setUserStatus(snap.val())
    );
  }, [chatId, selectedUser]);

  /* ================= OPEN CHAT ================= */
  const openChat = async (user) => {
    if (!currentUser) return;
    const id = getChatId(currentUser.uid, user.uid);
    setSelectedUser(user);
    setChatId(id);
    setChatReady(false);
    setSearch("");
    setSearchActive(false);

    const chatRef = ref(db, `chats/${id}`);
    const snap = await get(chatRef);
    if (!snap.exists()) {
      await set(chatRef, {
        members: { [currentUser.uid]: true, [user.uid]: true },
        messages: {},
        typing: {},
        status: {},
        userChats: { [currentUser.uid]: { unreadCount: 0 }, [user.uid]: { unreadCount: 0 } },
        lastMessage: "",
        lastMessageTime: Date.now(),
      });
    }

    await set(ref(db, `chats/${id}/userChats/${currentUser.uid}/unreadCount`), 0);

    const msgSnap = await get(ref(db, `chats/${id}/messages`));
    if (msgSnap.exists()) {
      Object.keys(msgSnap.val()).forEach(async (mid) => {
        await set(ref(db, `chats/${id}/messages/${mid}/seenBy/${currentUser.uid}`), true);
      });
    }

    setChatReady(true);
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!message.trim() || !chatId || !currentUser || !chatReady) return;

    const chatRef = ref(db, `chats/${chatId}`);
    const chatSnap = await get(chatRef);
    if (!chatSnap.exists()) return;

    const timestamp = Date.now();
    const newMsgRef = push(ref(db, `chats/${chatId}/messages`));

    await set(newMsgRef, {
      senderId: currentUser.uid,
      text: message.trim(),
      timestamp,
      seenBy: { [currentUser.uid]: true },
    });

    await update(chatRef, { lastMessage: message.trim(), lastMessageTime: timestamp });

    const chat = chatSnap.val();
    Object.keys(chat.members).forEach(async (uid) => {
      const userChatRef = ref(db, `chats/${chatId}/userChats/${uid}`);
      const userChatSnap = await get(userChatRef);

      if (uid === currentUser.uid) {
        await set(userChatRef, { unreadCount: 0 });
      } else {
        const oldCount = userChatSnap.exists() ? userChatSnap.val().unreadCount || 0 : 0;
        await set(userChatRef, { unreadCount: oldCount + 1 });
      }
    });

    setMessage("");
    await set(ref(db, `chats/${chatId}/typing/${currentUser.uid}`), false);
  };

  /* ================= HANDLE TYPING ================= */
  const handleTyping = (e) => {
    if (!chatId || !currentUser) return;
    setMessage(e.target.value);
    const typingRef = ref(db, `chats/${chatId}/typing/${currentUser.uid}`);
    set(typingRef, true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => set(typingRef, false), 1200);
  };

  /* ================= SEARCH FILTER ================= */
  const filteredUsers =
    search.trim() === ""
      ? []
      : allUsers.filter(
          (u) =>
            u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
            u.membershipId?.toLowerCase().includes(search.toLowerCase())
        );

  /* ================= CHAT LIST BELOW SEARCH BAR ================= */
  const chatList = Object.entries(chats)
    .map(([id, c]) => {
      if (!c.members?.[currentUser.uid]) return null;

      const otherUid = Object.keys(c.members).find((uid) => uid !== currentUser.uid);
      const user = allUsers.find((u) => u.uid === otherUid) || {
        uid: otherUid,
        fullname: otherUid,
        profileImage: dummyLogo,
        membershipId: "N/A",
      };

      const lastMsg = c.lastMessage || "";
      const unread = c.userChats?.[currentUser.uid]?.unreadCount || 0;
      const lastMessageTime = c.lastMessageTime || 0;

      return { id, user, lastMsg, unread, lastMessageTime };
    })
    .filter(Boolean)
    .sort((a, b) => b.lastMessageTime - a.lastMessageTime);

  /* ================= UI ================= */
  return (
    <>
      <div className="messaging-float" onClick={() => setOpen(!open)}>💬</div>

      <div className={`messaging-panel ${open ? "open" : ""}`}>
        <div className="panel-header">
          <span>Messaging</span>
          <button onClick={() => setOpen(false)} className="customX">✕</button>
        </div>

        <div className="panel-search">
          <input
            placeholder="Search users..."
            value={search}
            onFocus={() => setSearchActive(true)}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="panel-body">
          {/* SEARCH RESULTS */}
          {!selectedUser && searchActive && search && (
            <div className="user-list">
              {filteredUsers.map((u) => (
                <div key={u.uid} className="user-item" onClick={() => openChat(u)}>
                  <img src={u.profileImage || dummyLogo} alt="" />
                  <div className="user-info">
                    <p>{u.fullname}</p>
                    <span>{u.membershipId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INBOX BELOW SEARCH BAR */}
          {!selectedUser && (
            <div className="user-list">
              {chatList.length === 0 ? (
                <div className="empty-state">
                  <p>No chats yet</p>
                  <span>Search and message someone to get started</span>
                </div>
              ) : (
                chatList.map(({ id, user, lastMsg, unread }) => (
                  <div key={id} className="user-item" onClick={() => openChat(user)}>
                    <img src={user.profileImage || dummyLogo} alt="" />
                    <div className="user-info">
                      <p>{user.fullname}</p>
                      <div className="last-message">
                        <span>{lastMsg.length > 25 ? lastMsg.slice(0, 25) + "..." : lastMsg}</span>
                        {unread > 0 ? <span className="badge">{unread}</span> : <span className="tickread">✓✓</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ACTIVE CHAT WINDOW */}
          {selectedUser && (
            <div className="chat-window">
              <div className="chat-header">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setSearch("");
                    setSearchActive(false);
                  }}
                >
                  ←
                </button>
                <img src={selectedUser.profileImage || dummyLogo} alt="" />
                <div>
                  <p>{selectedUser.fullname}</p>
                  <span className="status">
                    {userStatus?.online
                      ? "Online"
                      : userStatus?.lastSeen
                      ? `Last seen ${new Date(userStatus.lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : ""}
                  </span>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((m) => (
                  <div key={m.id} className={`message ${m.senderId === currentUser.uid ? "sent" : "received"}`}>
                    {m.text}
                    <div className="message-meta">
                      <span className="time">{new Date(m.timestamp).toLocaleString()}</span>
                      {m.senderId === currentUser.uid && (
                        <span className="tick">{Object.keys(m.seenBy || {}).length > 1 ? "✓✓" : "✓"}</span>
                      )}
                    </div>
                  </div>
                ))}
                {typingUser && <div className="typing">{selectedUser.fullname} is typing...</div>}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <input
                  value={message}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button onClick={sendMessage}>➤</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Messaging;
