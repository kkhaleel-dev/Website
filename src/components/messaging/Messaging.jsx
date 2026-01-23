import React, { useEffect, useState, useRef } from "react";
import "./Messaging.scss";
import { auth, db } from "../../firebase";
import {
  ref,
  get,
  set,
  push,
  onValue,
  update,
  serverTimestamp,
} from "firebase/database";
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
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return unsub;
  }, []);

  const getChatId = (uid) =>
    currentUser ? [currentUser.uid, uid].sort().join("_") : null;

  /* ================= USERS (SEARCH) ================= */
  useEffect(() => {
    if (!open || !currentUser) return;

    get(ref(db, "users")).then((snap) => {
      if (!snap.exists()) return;
      const list = Object.entries(snap.val())
        .filter(([uid]) => uid !== currentUser.uid)
        .map(([uid, data]) => ({ uid, ...data }));
      setAllUsers(list);
    });
  }, [open, currentUser]);

  /* ================= CHAT LIST ================= */
  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = ref(db, "chats");
    return onValue(chatsRef, (snap) => {
      const all = snap.exists() ? snap.val() : {};
      const filtered = {};
      Object.entries(all).forEach(([id, c]) => {
        if (c.members?.[currentUser.uid]) filtered[id] = c;
      });
      setChats(filtered);
    });
  }, [currentUser]);

  /* ================= MESSAGES ================= */
  useEffect(() => {
    if (!chatId || !currentUser || !chatReady) return;

    const messagesRef = ref(db, `chats/${chatId}/messages`);
    return onValue(messagesRef, (snap) => {
      const list = snap.exists()
        ? Object.entries(snap.val()).map(([id, m]) => ({ id, ...m }))
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

    return onValue(
      ref(db, `chats/${chatId}/typing/${selectedUser.uid}`),
      (snap) => setTypingUser(snap.val() === true)
    );
  }, [chatId, selectedUser]);

  /* ================= STATUS ================= */
  useEffect(() => {
    if (!chatId || !selectedUser) return;

    return onValue(
      ref(db, `chats/${chatId}/status/${selectedUser.uid}`),
      (snap) => setUserStatus(snap.val())
    );
  }, [chatId, selectedUser]);

  /* ================= OPEN CHAT ================= */
  const openChat = async (user) => {
    if (!currentUser) return;

    const id = getChatId(user.uid);
    if (!id) return;

    setSelectedUser(user);
    setChatId(id);
    setChatReady(false);
    setSearch("");
    setSearchActive(false);

    const chatRef = ref(db, `chats/${id}`);
    const snap = await get(chatRef);

    if (!snap.exists()) {
      await set(chatRef, {
        members: {
          [currentUser.uid]: true,
          [user.uid]: true,
        },
        messages: {},
        typing: {},
        status: {},
        userChats: {
          [currentUser.uid]: { unreadCount: 0 },
          [user.uid]: { unreadCount: 0 },
        },
        lastMessage: "",
        lastMessageTime: serverTimestamp(),
      });
    }

    setChatReady(true);
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!message.trim() || !chatId || !currentUser || !chatReady) return;

    const msgRef = push(ref(db, `chats/${chatId}/messages`));

    await set(msgRef, {
      senderId: currentUser.uid,
      text: message.trim(),
      timestamp: Date.now(),
      seenBy: { [currentUser.uid]: true },
    });

    await update(ref(db, `chats/${chatId}`), {
      lastMessage: message.trim(),
      lastMessageTime: Date.now(),
    });

    setMessage("");
    set(ref(db, `chats/${chatId}/typing/${currentUser.uid}`), false);
  };

  /* ================= HANDLE TYPING ================= */
  const handleTyping = (e) => {
    if (!chatId || !currentUser) return;

    setMessage(e.target.value);

    const typingRef = ref(db, `chats/${chatId}/typing/${currentUser.uid}`);
    set(typingRef, true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(
      () => set(typingRef, false),
      1200
    );
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

  /* ================= UI ================= */
  return (
    <>
      <div className="messaging-float" onClick={() => setOpen(!open)}>
        💬
      </div>

      <div className={`messaging-panel ${open ? "open" : ""}`}>
        <div className="panel-header">
          <span>Messaging</span>
          <button onClick={() => setOpen(false)} className="customX">✕</button>
        </div>

        {!selectedUser && (
          <div className="panel-search">
            <input
              placeholder="Search users..."
              value={search}
              onFocus={() => setSearchActive(true)}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        <div className="panel-body">
          {!selectedUser && searchActive && search && (
            <div className="user-list">
              {filteredUsers.map((u) => (
                <div
                  key={u.uid}
                  className="user-item"
                  onClick={() => openChat(u)}
                >
                  <img src={u.profileImage || dummyLogo} alt="" />
                  <div>
                    <p>{u.fullname}</p>
                    <span>{u.membershipId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedUser && (
            <div className="chat-window">
              <div className="chat-header">
                <button onClick={() => setSelectedUser(null)}>←</button>
                <img src={selectedUser.profileImage || dummyLogo} alt="" />
                <div>
                  <p>{selectedUser.fullname}</p>
                  <span className="status">
                    {userStatus?.online
                      ? "Online"
                      : userStatus?.lastSeen
                      ? `Last seen ${new Date(
                          userStatus.lastSeen
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : ""}
                  </span>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`message ${
                      m.senderId === currentUser.uid
                        ? "sent"
                        : "received"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                {typingUser && (
                  <div className="typing">
                    {selectedUser.fullname} is typing...
                  </div>
                )}
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
//pushed working till