import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import "./AdminChats.css";

import devverseLogo from "../../assets/devverse-logo.png";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/chat`;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

function AdminChats() {
  const { token, logout } = useAuth();

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState("");

  /* ==============================
     LOAD ALL CONVERSATIONS
  ============================== */

  const loadConversations = async () => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/conversations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load conversations"
        );
      }

      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Load conversations error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadConversations();
    }
  }, [token]);

  /* ==============================
     SOCKET CONNECTION
  ============================== */

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Admin socket connected:", socket.id);
    });

    socket.on("conversation_updated", () => {
      loadConversations();
    });

    return () => {
      socket.off("conversation_updated");
      socket.disconnect();
    };
  }, [token]);

  /* ==============================
     OPEN CONVERSATION
  ============================== */

  const openConversation = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      setMessagesLoading(true);
      setMessages([]);
      setError("");

      socketRef.current?.emit(
        "join_conversation",
        conversation._id
      );

      const response = await fetch(
        `${API_URL}/messages/${conversation._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load messages"
        );
      }

      setMessages(data.messages || []);
    } catch (err) {
      console.error("Load messages error:", err);
      setError(err.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  /* ==============================
     MOBILE BACK
  ============================== */

  const closeConversation = () => {
    setSelectedConversation(null);
    setMessages([]);
    setMessage("");
    setError("");
  };

  /* ==============================
     RECEIVE LIVE MESSAGE
  ============================== */

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket) return;

    const receiveMessage = (newMessage) => {
      if (
        String(newMessage.conversationId) ===
        String(selectedConversation?._id)
      ) {
        setMessages((previousMessages) => {
          const alreadyExists = previousMessages.some(
            (item) => item._id === newMessage._id
          );

          if (alreadyExists) {
            return previousMessages;
          }

          return [...previousMessages, newMessage];
        });
      }
    };

    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, [selectedConversation]);

  /* ==============================
     SEND ADMIN MESSAGE
  ============================== */

  const handleSendMessage = (e) => {
    e.preventDefault();

    const cleanMessage = message.trim();

    if (
      !cleanMessage ||
      !selectedConversation ||
      !socketRef.current
    ) {
      return;
    }

    socketRef.current.emit("send_message", {
      conversationId: selectedConversation._id,
      sender: "admin",
      message: cleanMessage,
    });

    setMessage("");
  };

  /* ==============================
     AUTO SCROLL
  ============================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* ==============================
     FORMAT DATE
  ============================== */

  const formatConversationDate = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);
    const today = new Date();

    const isToday =
      messageDate.toDateString() === today.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return messageDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <main
      className={`admin-chats-page ${selectedConversation ? "chat-open" : ""
        }`}
    >
      {/* ==============================
          SIDEBAR
      ============================== */}

      <aside className="admin-chat-sidebar">
        {/* BRAND */}

        <div className="admin-chat-brand">
          <div className="admin-brand-logo-wrapper">
            <img
              src={devverseLogo}
              alt="DevVerse"
              className="admin-brand-logo"
            />
          </div>

          <div className="admin-brand-content">
            <h1>DevVerse</h1>
            <p>Admin Inbox</p>
          </div>

          <div className="admin-online-indicator">
            <span></span>
          </div>
        </div>

        {/* INBOX HEADER */}

        <div className="admin-chat-sidebar-title">
          <div>
            <p className="admin-sidebar-label">
              CUSTOMER MESSAGES
            </p>

            <h2>Conversations</h2>
          </div>

          <span className="admin-conversation-count">
            {conversations.length}
          </span>
        </div>

        {/* CONVERSATION LIST */}

        <div className="admin-conversation-list">
          {loading && (
            <div className="admin-chat-state">
              <div className="admin-loading-spinner"></div>
              <p>Loading conversations...</p>
            </div>
          )}

          {!loading && conversations.length === 0 && (
            <div className="admin-empty-conversations">
              <div className="admin-empty-conversations-icon">
                💬
              </div>

              <h3>No conversations yet</h3>

              <p>
                New customer conversations will appear here.
              </p>
            </div>
          )}

          {conversations.map((conversation) => (
            <button
              key={conversation._id}
              type="button"
              className={`admin-conversation-item ${selectedConversation?._id === conversation._id
                  ? "active"
                  : ""
                }`}
              onClick={() => openConversation(conversation)}
            >
              <div className="admin-customer-avatar">
                {conversation.customerName
                  ?.charAt(0)
                  .toUpperCase() || "U"}

                <span className="admin-avatar-status"></span>
              </div>

              <div className="admin-conversation-info">
                <div className="admin-conversation-top">
                  <h3>
                    {conversation.customerName || "Customer"}
                  </h3>

                  <span>
                    {formatConversationDate(
                      conversation.updatedAt
                    )}
                  </span>
                </div>

                <p>
                  {conversation.lastMessage ||
                    conversation.customerEmail ||
                    "Start conversation"}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* SIDEBAR FOOTER */}

        <div className="admin-sidebar-footer">
          <div className="admin-profile">
            <div className="admin-profile-avatar">
              A
            </div>

            <div className="admin-profile-info">
              <h3>Administrator</h3>
              <p>DevVerse Team</p>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={logout}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ==============================
          MAIN CHAT AREA
      ============================== */}

      <section className="admin-chat-main">
        {!selectedConversation ? (
          /* EMPTY STATE */

          <div className="admin-chat-empty">
            <div className="admin-chat-empty-logo">
              <img
                src={devverseLogo}
                alt="DevVerse"
              />
            </div>

            <span className="admin-empty-badge">
              DEVVERSE INBOX
            </span>

            <h2>Your conversations, all in one place</h2>

            <p>
              Select a customer conversation from the inbox
              to view messages and reply in real time.
            </p>

            <div className="admin-empty-status">
              <span></span>
              Ready to receive messages
            </div>
          </div>
        ) : (
          <>

            {/* CUSTOMER INFO CARD */}

            <div className="customer-profile-card">

              <div className="customer-top">

                <div className="customer-left">

                  <div className="customer-avatar-large">
                    {selectedConversation.customerName?.charAt(0).toUpperCase()}
                  </div>

                  <div>

                    <h2>
                      {selectedConversation.customerName}
                    </h2>

                    <p>
                      {selectedConversation.customerEmail}
                    </p>

                  </div>

                </div>

                <div className="customer-badges">

                  <span className="online-badge">
                    🟢 Online
                  </span>

                </div>

              </div>

              <div className="customer-details-grid">

                <div className="customer-detail">

                  <span>📱 Phone</span>

                  <strong>
                    {selectedConversation.phone || "-"}
                  </strong>

                </div>

                <div className="customer-detail">

                  <span>💼 Project</span>

                  <strong>
                    {selectedConversation.projectType || "-"}
                  </strong>

                </div>

                <div className="customer-detail">

                  <span>💰 Budget</span>

                  <strong>
                    {selectedConversation.budget || "-"}
                  </strong>

                </div>

                <div className="customer-detail">

                  <span>📅 Joined</span>

                  <strong>
                    {new Date(
                      selectedConversation.createdAt
                    ).toLocaleDateString()}
                  </strong>

                </div>

              </div>

            </div>

            {/* MESSAGES */}

            <div className="admin-chat-messages">
              {messagesLoading ? (
                <div className="admin-chat-state message-loading">
                  <div className="admin-loading-spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : (
                <>
                  <div className="admin-chat-date-divider">
                    <span>Conversation</span>
                  </div>

                  {messages.length === 0 && (
                    <div className="admin-no-messages">
                      <p>
                        No messages in this conversation yet.
                      </p>
                    </div>
                  )}

                  {messages.map((item) => (
                    <div
                      key={item._id}
                      className={`admin-message-row ${item.sender === "admin"
                          ? "admin"
                          : "customer"
                        }`}
                    >
                      <div className="admin-message-content">
                        <span className="admin-message-sender">
                          {item.sender === "admin"
                            ? "You"
                            : selectedConversation.customerName}
                        </span>

                        <div className="admin-message-bubble">
                          {item.message.startsWith("🚀 New Project Enquiry") ? (
                            <div className="enquiry-card">
                              <div className="enquiry-header">
                                🚀 <span>New Project Enquiry</span>
                              </div>

                              <div className="enquiry-row">
                                <span>👤 Name</span>
                                <strong>{selectedConversation.customerName}</strong>
                              </div>

                              <div className="enquiry-row">
                                <span>📧 Email</span>
                                <strong>{selectedConversation.customerEmail}</strong>
                              </div>

                              <div className="enquiry-row">
                                <span>📱 Phone</span>
                                <strong>{selectedConversation.phone}</strong>
                              </div>

                              <div className="enquiry-row">
                                <span>💼 Project</span>
                                <strong>{selectedConversation.projectType}</strong>
                              </div>

                              <div className="enquiry-row">
                                <span>💰 Budget</span>
                                <strong>{selectedConversation.budget}</strong>
                              </div>

                              <div className="enquiry-description">
                                <span>📝 Description</span>

                                <p>
                                  {item.message
                                    .split("________________________________")[0]
                                    .split("Testing")[1]
                                    ?.trim()}
                                </p>
                              </div>

                              <div className="enquiry-footer">
                                Submitted from DevVerse Contact Form
                              </div>
                            </div>
                          ) : (
                            <p>{item.message}</p>
                          )}

                          <span className="admin-message-time">
                            {item.edited && "Edited · "}

                            {item.createdAt
                              ? new Date(
                                item.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* ERROR */}

            {error && (
              <div className="admin-chat-error">
                {error}
              </div>
            )}

            {/* INPUT */}

            <form
              className="admin-chat-input-wrapper"
              onSubmit={handleSendMessage}
            >
              <div className="admin-chat-input">
                <input
                  type="text"
                  placeholder={`Message ${selectedConversation.customerName ||
                    "customer"
                    }...`}
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={!message.trim()}
                  aria-label="Send message"
                >
                  <span className="admin-send-text">
                    Send
                  </span>

                  <span className="admin-send-icon">
                    ➜
                  </span>
                </button>
              </div>

              <p className="admin-input-hint">
                Press Enter to send
              </p>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminChats;