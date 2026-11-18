import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaShieldAlt,
} from "react-icons/fa";

import useChatSession from "../../hooks/useChatSession";
import { useVisitor } from "../../context/VisitorContext";
import devverseLogo from "../../assets/devverse-logo.png";

import "./ChatPage.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const API_URL = `${API_BASE_URL}/chat`;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

function ChatPage() {
  const {
    user,
    token,
    error: sessionError,
    needsEmail,
    resetSession,
  } = useChatSession();
  const { openGate } = useVisitor();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);

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
  console.log("Customer socket connected:", socket.id);

  setIsConnected(true);

  if (user?.role === "customer") {
    socket.emit("customer_online", user.id);
  }
});

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user]);

  /* ==============================
     CREATE / GET CONVERSATION
  ============================== */

  useEffect(() => {
    if (!user || !token) return;

    const loadConversation = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/conversation`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
              userId: user.id,
              name: user.name,
              email: user.email,
            }),
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          resetSession();
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load conversation"
          );
        }

        const id = data.conversation._id;

        setConversationId(id);

        socketRef.current?.emit(
          "join_conversation",
          id
        );

        /* LOAD OLD MESSAGES */

        const messagesResponse = await fetch(
          `${API_URL}/messages/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const messagesData =
          await messagesResponse.json();

        if (messagesResponse.status === 401) {
          resetSession();
          return;
        }

        if (!messagesResponse.ok) {
          throw new Error(
            messagesData.message ||
              "Failed to load messages"
          );
        }

        setMessages(messagesData.messages || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [user, token, resetSession]);

  /* ==============================
     JOIN ROOM AFTER SOCKET CONNECTS
  ============================== */

  useEffect(() => {
    if (!conversationId || !isConnected) return;

    socketRef.current?.emit(
      "join_conversation",
      conversationId
    );
  }, [conversationId, isConnected]);

  /* ==============================
     RECEIVE LIVE MESSAGE
  ============================== */

  useEffect(() => {
    const socket = socketRef.current;

    if (!socket || !conversationId) return;

    const receiveMessage = (newMessage) => {
      if (
        String(newMessage.conversationId) !==
        String(conversationId)
      ) {
        return;
      }

      setMessages((previousMessages) => {
        const alreadyExists =
          previousMessages.some(
            (item) => item._id === newMessage._id
          );

        if (alreadyExists) {
          return previousMessages;
        }

        return [
          ...previousMessages,
          newMessage,
        ];
      });
    };

    socket.on(
      "receive_message",
      receiveMessage
    );

    return () => {
      socket.off(
        "receive_message",
        receiveMessage
      );
    };
  }, [conversationId]);

  /* ==============================
     SEND MESSAGE
  ============================== */

  const handleSendMessage = (e) => {
    e.preventDefault();

    const cleanMessage = message.trim();

    if (
      !cleanMessage ||
      !conversationId ||
      !socketRef.current ||
      !isConnected
    ) {
      return;
    }

    socketRef.current.emit(
      "send_message",
      {
        conversationId,
        sender: "customer",
        message: cleanMessage,
      }
    );

    setMessage("");
  };

  /* ==============================
     FORMAT MESSAGE TIME
  ============================== */

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
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
     UI
  ============================== */

  if (needsEmail || sessionError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ marginBottom: "0.75rem" }}>
            {needsEmail ? "Chat with DevVerse" : "Chat unavailable"}
          </h1>

          <p style={{ marginBottom: "1.25rem", opacity: 0.8 }}>
            {needsEmail
              ? "Enter your email address and you can start chatting with our team."
              : sessionError}
          </p>

          {needsEmail ? (
            <button
              type="button"
              className="chat-gate-btn"
              onClick={openGate}
            >
              Enter your email
            </button>
          ) : (
            <button
              type="button"
              className="chat-gate-btn"
              onClick={() => navigate("/contact")}
            >
              Use the project form
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="chat-page">
      {/* BACKGROUND DECORATION */}

      <div className="chat-bg-glow chat-glow-one" />
      <div className="chat-bg-glow chat-glow-two" />

      <section className="chat-container">
        {/* =========================
            HEADER
        ========================= */}

        <header className="chat-header">
          <button
            type="button"
            className="chat-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>

          <div className="chat-brand">
            <div className="chat-admin-avatar">
              <img
                src={devverseLogo}
                alt="DevVerse"
              />
            </div>

            <div className="chat-header-info">
              <div className="chat-title-row">
                <h1>DevVerse Support</h1>

                <span className="chat-verified">
                  <FaShieldAlt />
                </span>
              </div>

              <div className="chat-status">
                <span
                  className={
                    isConnected
                      ? "status-online"
                      : "status-offline"
                  }
                />

                <p>
                  {isConnected
                    ? "Online • Ready to help"
                    : "Connecting..."}
                </p>
              </div>
            </div>
          </div>

          {/* <div className="chat-header-badge">
            Customer Support
          </div> */}
        </header>

        {/* =========================
            MESSAGES
        ========================= */}

        <div className="chat-messages">
          {loading && (
            <div className="chat-loading">
              <div className="chat-loading-spinner" />

              <p>
                Loading your conversation...
              </p>
            </div>
          )}

          {!loading &&
            messages.length === 0 && (
              <div className="chat-welcome">
                <div className="chat-welcome-logo">
                  <img
                    src={devverseLogo}
                    alt="DevVerse"
                  />
                </div>

                <span className="chat-welcome-label">
                  WELCOME TO DEVVERSE
                </span>

                <h2>
                  Hi {user?.name || "there"} 👋
                </h2>

                <p>
                  Have a project in mind? Tell us
                  what you're looking to build and
                  our team will help you turn your
                  idea into reality.
                </p>

                <div className="chat-secure-note">
                  <FaShieldAlt />

                  <span>
                    Your conversation is private
                    and secure
                  </span>
                </div>
              </div>
            )}

          {!loading &&
            messages.map((item) => {
              const isCustomer =
                item.sender === "customer";

              return (
                <div
                  key={item._id}
                  className={`chat-message-row ${
                    isCustomer
                      ? "customer"
                      : "admin"
                  }`}
                >
                  {!isCustomer && (
                    <div className="message-avatar">
                      <img
                        src={devverseLogo}
                        alt="DevVerse"
                      />
                    </div>
                  )}

                  <div className="message-content">
                    {!isCustomer && (
                      <span className="message-sender">
                        DevVerse Support
                      </span>
                    )}

                    <div className="chat-message-bubble">
                      <p>{item.message}</p>

                      <span className="message-time">
                        {formatTime(
                          item.createdAt
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

          <div ref={messagesEndRef} />
        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="chat-error">
            {error}
          </div>
        )}

        {/* =========================
            INPUT
        ========================= */}

        <div className="chat-footer">
          <form
            className="chat-input-area"
            onSubmit={handleSendMessage}
          >
            <input
              type="text"
              placeholder="Write your message..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              autoComplete="off"
            />

            <button
              type="submit"
              className="chat-send-btn"
              disabled={
                !message.trim() ||
                !conversationId ||
                !isConnected
              }
              aria-label="Send message"
            >
              <span>Send</span>
              <FaPaperPlane />
            </button>
          </form>

          <p className="chat-footer-note">
            Powered by{" "}
            <strong>DevVerse</strong>
          </p>
        </div>
      </section>
    </main>
  );
}

export default ChatPage;