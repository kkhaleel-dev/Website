import React, { useEffect, useState, useRef } from "react";
import "./Messaging.scss";
import { auth, db } from "../../firebase";
import { ref, get, set, push, onValue, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import dummyLogo from "../../assets/person-logo.png";
import { useNavigate } from "react-router-dom";

const Messaging = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [open, setOpen] = useState(false);

  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [chats, setChats] = useState({});
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
  }, []);

  const getChatId = (a, b) => [a, b].sort().join("_");

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    if (!currentUser) return;

    get(ref(db, "users")).then((snap) => {
      if (!snap.exists()) return;

      const users = Object.entries(snap.val())
        .filter(([uid]) => uid !== currentUser.uid)
        .map(([uid, data]) => ({ uid, ...data }));

      setAllUsers(users);
    });
  }, [currentUser]);

  /* ================= LOAD CHATS ================= */
  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = ref(db, "chats");
    return onValue(chatsRef, (snap) => {
      if (!snap.exists()) {
        setChats({});
        return;
      }

      const filtered = {};
      Object.entries(snap.val()).forEach(([id, chat]) => {
        if (chat.members?.[currentUser.uid]) {
          filtered[id] = chat;
        }
      });

      setChats(filtered);
    });
  }, [currentUser]);

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
    if (!selectedChatId) return;

    const msgRef = ref(db, `chats/${selectedChatId}/messages`);
    return onValue(msgRef, (snap) => {
      if (!snap.exists()) {
        setMessages([]);
        return;
      }

      const list = Object.entries(snap.val())
        .map(([id, m]) => ({ id, ...m }))
        .sort((a, b) => a.timestamp - b.timestamp);

      setMessages(list);
    });
  }, [selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
  const handler = async (e) => {
    const uid = e.detail;
    const user = allUsers.find((u) => u.uid === uid);
    if (user) {
      openChat(user);
      setOpen(true);
    }
  };

  window.addEventListener("openChat", handler);
  return () => window.removeEventListener("openChat", handler);

}, [allUsers]);

  /* ================= OPEN CHAT ================= */
  const openChat = async (user) => {
    if (!currentUser) return;

    const chatId = getChatId(currentUser.uid, user.uid);
    setSelectedUser(user);
    setSelectedChatId(chatId);

    const chatRef = ref(db, `chats/${chatId}`);
    const snap = await get(chatRef);

    if (!snap.exists()) {
      await set(chatRef, {
        members: {
          [currentUser.uid]: true,
          [user.uid]: true,
        },
        messages: {},
        userChats: {
          [currentUser.uid]: { unreadCount: 0 },
          [user.uid]: { unreadCount: 0 },
        },
        lastMessage: "",
        lastMessageTime: Date.now(),
      });
    }

    // Reset unread count for current user
    await set(
      ref(db, `chats/${chatId}/userChats/${currentUser.uid}/unreadCount`),
      0
    );
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!message.trim() || !selectedChatId) return;

    const timestamp = Date.now();
    const chatRef = ref(db, `chats/${selectedChatId}`);

    const msgRef = push(ref(db, `chats/${selectedChatId}/messages`));
    await set(msgRef, {
      senderId: currentUser.uid,
      text: message.trim(),
      timestamp,
      seenBy: { [currentUser.uid]: true },
    });

    const chatSnap = await get(chatRef);
    const chat = chatSnap.val();

    await update(chatRef, {
      lastMessage: message.trim(),
      lastMessageTime: timestamp,
      lastMessageSender: currentUser.uid,
    });

    // Update unread count for other members
    Object.keys(chat.members).forEach(async (uid) => {
      const uRef = ref(db, `chats/${selectedChatId}/userChats/${uid}`);
      const uSnap = await get(uRef);
      const old = uSnap.exists() ? uSnap.val().unreadCount || 0 : 0;

      await set(uRef, {
        unreadCount: uid === currentUser.uid ? 0 : old + 1,
        lastMessageTime: timestamp,
      });
    });

    setMessage("");
  };

  /* ================= BACK ================= */
  const handleBack = () => {
    setSelectedChatId(null);
    setSelectedUser(null);
    setSearch("");
  };

  /* ================= FORMAT TIMESTAMP ================= */
  const formatTime = (ts) => {
    const msgDate = new Date(ts);
    const now = new Date();
    const isToday =
      msgDate.getDate() === now.getDate() &&
      msgDate.getMonth() === now.getMonth() &&
      msgDate.getFullYear() === now.getFullYear();

    return isToday
      ? msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : msgDate.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
  };

  /* ================= INBOX ================= */
  const inboxList = Object.entries(chats)
    .map(([id, chat]) => {
      const otherUid = Object.keys(chat.members).find(
        (u) => u !== currentUser.uid
      );

      const user =
        allUsers.find((u) => u.uid === otherUid) || {
          uid: otherUid,
          fullname: otherUid,
          profileImage: dummyLogo,
        };

      return {
        id,
        user,
        lastMsg: chat.lastMessage || "",
        time:
          chat.userChats?.[currentUser.uid]?.lastMessageTime ||
          chat.lastMessageTime ||
          0,
        unread: chat.userChats?.[currentUser.uid]?.unreadCount || 0,
      };
    })
    .sort((a, b) => b.time - a.time);

  /* ================= SEARCH USERS ================= */
  const searchResults =
    search.trim() === ""
      ? []
      : allUsers.filter((u) =>
          u.fullname?.toLowerCase().includes(search.toLowerCase())
        );

  /* ================= UNREAD CHATS COUNT ================= */
  const unreadChatsCount = Object.values(chats).filter(
    (chat) => chat.userChats?.[currentUser?.uid]?.unreadCount > 0
  ).length;

  /* ================= UI ================= */
  return (
    <>
      <div className="messaging-float" onClick={() => setOpen(!open)}>
        💬
        {unreadChatsCount > 0 && (
          <span className="float-badge">{unreadChatsCount}</span>
        )}
      </div>

      <div className={`messaging-panel ${open ? "open" : ""}`}>
        <div className="panel-header">
          <span>Messaging</span>
          <button
            style={{ color: "white", fontWeight: "500" }}
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {!selectedUser && (
          <div className="panel-search">
            <input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}

        <div className="panel-body">
          {!selectedUser && (
            <div className="user-list">
              {search.trim() &&
                searchResults.map((user) => (
                  <div
                    key={user.uid}
                    className="user-item"
                    onClick={() => openChat(user)}
                  >
                    <img src={user.profileImage || dummyLogo} alt="" />
                    <div className="user-info">
                      <p>{user.fullname}</p>
                    </div>
                  </div>
                ))}

              {!search.trim() &&
                inboxList.map(({ id, user, lastMsg, time, unread }) => (
                  <div
                    key={id}
                    className="user-item"
                    onClick={() => openChat(user)}
                  >
                    <img src={user.profileImage || dummyLogo} alt="" />
                    <div className="user-info">
                      <p>{user.fullname}</p>
                      <div className="last-message">
                        {unread > 0 && (
                          <span className="time">{formatTime(time)}</span>
                        )}
                        <span>{lastMsg}</span>
                        {unread > 0 && <span className="badge">{unread}</span>}
                      </div>
                    </div>
                  </div>
                ))}

              {!search.trim() && inboxList.length === 0 && (
                <div className="empty-state">No conversations yet</div>
              )}
            </div>
          )}

          {selectedUser && (
            <div className="chat-window">
              <div className="chat-header">
                <button onClick={handleBack}>←</button>
                <img
                  src={selectedUser.profileImage || dummyLogo}
                  alt=""
                  onClick={() => navigate(`/profile/${selectedUser.uid}`)}
                  style={{ cursor: "pointer" }}
                />
                <p
                  onClick={() => navigate(`/profile/${selectedUser.uid}`)}
                  style={{ cursor: "pointer" }}
                >
                  {selectedUser.fullname}
                </p>
              </div>

              <div className="chat-messages">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`message ${
                      m.senderId === currentUser.uid ? "sent" : "received"
                    }`}
                  >
                    {m.text}
                    <div className="message-meta">
                      <span className="time">{formatTime(m.timestamp)}</span>
                      {m.senderId === currentUser.uid && (
                        <span className="tick">
                          {Object.keys(m.seenBy || {}).length > 1
                            ? "✓✓"
                            : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
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


//working with all mesaging without main messenger logo notiicaiton uncount
// import React, { useEffect, useState, useRef } from "react";
// import "./Messaging.scss";
// import { auth, db } from "../../firebase";
// import { ref, get, set, push, onValue, update } from "firebase/database";
// import { onAuthStateChanged } from "firebase/auth";
// import dummyLogo from "../../assets/person-logo.png";
// import { useNavigate } from "react-router-dom";

// const Messaging = () => {
//   const navigate = useNavigate();

//   const [currentUser, setCurrentUser] = useState(null);
//   const [open, setOpen] = useState(false);

//   const [allUsers, setAllUsers] = useState([]);
//   const [search, setSearch] = useState("");

//   const [chats, setChats] = useState({});
//   const [selectedChatId, setSelectedChatId] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");

//   const messagesEndRef = useRef(null);

//   /* ================= AUTH ================= */
//   useEffect(() => {
//     return onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user || null);
//     });
//   }, []);

//   const getChatId = (a, b) => [a, b].sort().join("_");

//   /* ================= LOAD USERS ================= */
//   useEffect(() => {
//     if (!currentUser) return;

//     get(ref(db, "users")).then((snap) => {
//       if (!snap.exists()) return;

//       const users = Object.entries(snap.val())
//         .filter(([uid]) => uid !== currentUser.uid)
//         .map(([uid, data]) => ({ uid, ...data }));

//       setAllUsers(users);
//     });
//   }, [currentUser]);

//   /* ================= LOAD CHATS ================= */
//   useEffect(() => {
//     if (!currentUser) return;

//     const chatsRef = ref(db, "chats");
//     return onValue(chatsRef, (snap) => {
//       if (!snap.exists()) {
//         setChats({});
//         return;
//       }

//       const filtered = {};
//       Object.entries(snap.val()).forEach(([id, chat]) => {
//         if (chat.members?.[currentUser.uid]) {
//           filtered[id] = chat;
//         }
//       });

//       setChats(filtered);
//     });
//   }, [currentUser]);

//   /* ================= LOAD MESSAGES & MARK SEEN ================= */
//   useEffect(() => {
//     if (!selectedChatId || !currentUser) return;

//     const msgRef = ref(db, `chats/${selectedChatId}/messages`);

//     const unsubscribe = onValue(msgRef, (snap) => {
//       if (!snap.exists()) {
//         setMessages([]);
//         return;
//       }

//       // Mark all messages as seen by current user
//       const updates = {};
//       Object.entries(snap.val()).forEach(([id, m]) => {
//         if (!m.seenBy?.[currentUser.uid]) {
//           updates[`${id}/seenBy/${currentUser.uid}`] = true;
//         }
//       });
//       if (Object.keys(updates).length > 0) {
//         update(msgRef, updates);
//       }

//       const list = Object.entries(snap.val())
//         .map(([id, m]) => ({ id, ...m }))
//         .sort((a, b) => a.timestamp - b.timestamp);

//       setMessages(list);
//     });

//     return () => unsubscribe();
//   }, [selectedChatId, currentUser]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ================= OPEN CHAT ================= */
//   const openChat = async (user) => {
//     if (!currentUser) return;

//     const chatId = getChatId(currentUser.uid, user.uid);
//     setSelectedUser(user);
//     setSelectedChatId(chatId);

//     const chatRef = ref(db, `chats/${chatId}`);
//     const snap = await get(chatRef);

//     if (!snap.exists()) {
//       await set(chatRef, {
//         members: {
//           [currentUser.uid]: true,
//           [user.uid]: true,
//         },
//         messages: {},
//         userChats: {
//           [currentUser.uid]: { unreadCount: 0 },
//           [user.uid]: { unreadCount: 0 },
//         },
//         lastMessage: "",
//         lastMessageTime: Date.now(),
//       });
//     }

//     await set(
//       ref(db, `chats/${chatId}/userChats/${currentUser.uid}/unreadCount`),
//       0
//     );
//   };

//   /* ================= SEND MESSAGE ================= */
//   const sendMessage = async () => {
//     if (!message.trim() || !selectedChatId) return;

//     const timestamp = Date.now();
//     const chatRef = ref(db, `chats/${selectedChatId}`);
//     const msgRef = push(ref(db, `chats/${selectedChatId}/messages`));

//     await set(msgRef, {
//       senderId: currentUser.uid,
//       text: message.trim(),
//       timestamp,
//       seenBy: { [currentUser.uid]: true },
//     });

//     const chatSnap = await get(chatRef);
//     const chat = chatSnap.val();

//     await update(chatRef, {
//       lastMessage: message.trim(),
//       lastMessageTime: timestamp,
//       lastMessageSender: currentUser.uid,
//     });

//     // Update unread count for other members
//     Object.keys(chat.members).forEach(async (uid) => {
//       const uRef = ref(db, `chats/${selectedChatId}/userChats/${uid}`);
//       const uSnap = await get(uRef);
//       const old = uSnap.exists() ? uSnap.val().unreadCount || 0 : 0;

//       await set(uRef, {
//         unreadCount: uid === currentUser.uid ? 0 : old + 1,
//         lastMessageTime: timestamp,
//       });
//     });

//     setMessage("");
//   };

//   /* ================= BACK ================= */
//   const handleBack = () => {
//     setSelectedChatId(null);
//     setSelectedUser(null);
//     setSearch("");
//   };

//   /* ================= FORMAT TIMESTAMP ================= */
//   const formatTime = (ts) => {
//     const msgDate = new Date(ts);
//     const now = new Date();
//     const isToday =
//       msgDate.getDate() === now.getDate() &&
//       msgDate.getMonth() === now.getMonth() &&
//       msgDate.getFullYear() === now.getFullYear();

//     return isToday
//       ? msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//       : msgDate.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
//   };

//   /* ================= INBOX (CHATTED USERS) ================= */
//   const inboxList = Object.entries(chats)
//     .map(([id, chat]) => {
//       const otherUid = Object.keys(chat.members).find(
//         (u) => u !== currentUser.uid
//       );

//       const user =
//         allUsers.find((u) => u.uid === otherUid) || {
//           uid: otherUid,
//           fullname: otherUid,
//           profileImage: dummyLogo,
//         };

//       return {
//         id,
//         user,
//         lastMsg: chat.lastMessage || "",
//         time:
//           chat.userChats?.[currentUser.uid]?.lastMessageTime ||
//           chat.lastMessageTime ||
//           0,
//         unread: chat.userChats?.[currentUser.uid]?.unreadCount || 0,
//       };
//     })
//     .sort((a, b) => b.time - a.time);

//   /* ================= SEARCH USERS ================= */
//   const searchResults =
//     search.trim() === ""
//       ? []
//       : allUsers.filter((u) =>
//           u.fullname?.toLowerCase().includes(search.toLowerCase())
//         );

//   /* ================= UI ================= */
//   return (
//     <>
//       <div className="messaging-float" onClick={() => setOpen(!open)}>
//         💬
//       </div>

//       <div className={`messaging-panel ${open ? "open" : ""}`}>
//         <div className="panel-header">
//           <span>Messaging</span>
//           <button
//             style={{ color: "white", fontWeight: "500" }}
//             onClick={() => setOpen(false)}
//           >
//             ✕
//           </button>
//         </div>

//         {!selectedUser && (
//           <div className="panel-search">
//             <input
//               placeholder="Search users..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         )}

//         <div className="panel-body">
//           {!selectedUser && (
//             <div className="user-list">
//               {/* SEARCH MODE */}
//               {search.trim() &&
//                 searchResults.map((user) => (
//                   <div
//                     key={user.uid}
//                     className="user-item"
//                     onClick={() => openChat(user)}
//                   >
//                     <img src={user.profileImage || dummyLogo} alt="" />
//                     <div className="user-info">
//                       <p>{user.fullname}</p>
//                     </div>
//                   </div>
//                 ))}

//               {/* INBOX MODE */}
//               {!search.trim() &&
//                 inboxList.map(({ id, user, lastMsg, time, unread }) => (
//                   <div
//                     key={id}
//                     className="user-item"
//                     onClick={() => openChat(user)}
//                   >
//                     <img src={user.profileImage || dummyLogo} alt="" />
//                     <div className="user-info">
//                       <p>{user.fullname}</p>
//                       <div className="last-message">
//                         {unread > 0 && (
//                           <span className="time">{formatTime(time)}</span>
//                         )}
//                         <span>{lastMsg}</span>
//                         {unread > 0 && <span className="badge">{unread}</span>}
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//               {!search.trim() && inboxList.length === 0 && (
//                 <div className="empty-state">No conversations yet</div>
//               )}
//             </div>
//           )}

//           {selectedUser && (
//             <div className="chat-window">
//               <div className="chat-header">
//                 <button onClick={handleBack}>←</button>
//                 <img
//                   src={selectedUser.profileImage || dummyLogo}
//                   alt=""
//                   onClick={() => navigate(`/profile/${selectedUser.uid}`)}
//                   style={{ cursor: "pointer" }}
//                 />
//                 <p
//                   onClick={() => navigate(`/profile/${selectedUser.uid}`)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   {selectedUser.fullname}
//                 </p>
//               </div>

//               <div className="chat-messages">
//                 {messages.map((m) => (
//                   <div
//                     key={m.id}
//                     className={`message ${
//                       m.senderId === currentUser.uid ? "sent" : "received"
//                     }`}
//                   >
//                     {m.text}
//                     <div className="message-meta">
//                       <span className="time">{formatTime(m.timestamp)}</span>
//                       {m.senderId === currentUser.uid && (
//                         <span className="tick">
//                           {m.seenBy &&
//                           Object.keys(m.seenBy).some(
//                             (uid) => uid !== currentUser.uid
//                           )
//                             ? "✓✓"
//                             : "✓"}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className="chat-input">
//                 <input
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//                   placeholder="Type a message..."
//                 />
//                 <button onClick={sendMessage}>➤</button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Messaging;
