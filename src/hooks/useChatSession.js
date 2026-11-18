import { useCallback, useEffect, useState } from "react";

import { useVisitor } from "../context/VisitorContext";
import { createChatSession } from "../services/leadApi";

/*
 * Gives the chat page a token for the visitor's email, without a login page.
 * Returns { user, token, loading, error, needsEmail, resetSession }.
 */
export default function useChatSession() {
  const { email, getVisitorKey } = useVisitor();

  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!email) return undefined;

    let cancelled = false;

    createChatSession({ email, visitorKey: getVisitorKey() })
      .then((data) => {
        if (!cancelled) {
          setSession({ user: data.user, token: data.token });
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSession(null);
          setError(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [email, attempt, getVisitorKey]);

  // Called when the server rejects the token. Tries once more, then gives up.
  const resetSession = useCallback(() => {
    setSession(null);
    setAttempt((current) => (current < 2 ? current + 1 : current));
  }, []);

  return {
    user: session?.user || null,
    token: session?.token || null,
    error,
    needsEmail: !email,
    loading: Boolean(email) && !session && !error,
    resetSession,
  };
}
