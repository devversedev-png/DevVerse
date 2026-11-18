import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { recordVisit } from "../services/leadApi";

const EMAIL_KEY = "devverse_visitor_email";
const VISITOR_KEY = "devverse_visitor_key";
const COUNTED_KEY = "devverse_visit_counted";
const SKIPPED_KEY = "devverse_email_skipped";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Storage is looked up inside try/catch because browsers can block it
// (private mode, strict settings). The site keeps working without it.
const LOCAL = "localStorage";
const SESSION = "sessionStorage";

function readStorage(area, key) {
  try {
    return window[area].getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(area, key, value) {
  try {
    window[area].setItem(key, value);
  } catch {
    // ignore
  }
}

function removeStorage(area, key) {
  try {
    window[area].removeItem(key);
  } catch {
    // ignore
  }
}

// Random per-browser key. Used to keep a chat tied to this browser.
function getVisitorKey() {
  let key = readStorage(LOCAL, VISITOR_KEY);

  if (!key) {
    key =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, "") + Date.now().toString(36)
        : Math.random().toString(36).slice(2) +
          Math.random().toString(36).slice(2) +
          Date.now().toString(36);

    writeStorage(LOCAL, VISITOR_KEY, key);
  }

  return key;
}

const VisitorContext = createContext(null);

export function VisitorProvider({ children }) {
  const [email, setEmail] = useState(
    () => readStorage(LOCAL, EMAIL_KEY) || ""
  );
  const [skipped, setSkipped] = useState(
    () => readStorage(SESSION, SKIPPED_KEY) === "1"
  );
  const [gateForced, setGateForced] = useState(false);

  // Count one visit per browser session for a known email.
  useEffect(() => {
    if (!email) return;
    if (readStorage(SESSION, COUNTED_KEY) === email) return;

    writeStorage(SESSION, COUNTED_KEY, email);

    recordVisit(email, window.location.pathname).catch(() => {
      // allow a retry on the next page load if the server was unreachable
      removeStorage(SESSION, COUNTED_KEY);
    });
  }, [email]);

  const saveEmail = useCallback(async (value) => {
    const clean = String(value || "").trim().toLowerCase();

    if (!EMAIL_PATTERN.test(clean)) {
      throw new Error("Please enter a valid email address.");
    }

    try {
      await recordVisit(clean, window.location.pathname);
      writeStorage(SESSION, COUNTED_KEY, clean);
    } catch (err) {
      // A rejected email (400) is shown to the visitor. If the server is
      // unreachable, keep the email and count the visit on a later page load.
      if (err.status === 400) throw err;
      removeStorage(SESSION, COUNTED_KEY);
    }

    writeStorage(LOCAL, EMAIL_KEY, clean);

    setEmail(clean);
    setGateForced(false);
  }, []);

  const skip = useCallback(() => {
    writeStorage(SESSION, SKIPPED_KEY, "1");
    setSkipped(true);
    setGateForced(false);
  }, []);

  const openGate = useCallback(() => setGateForced(true), []);

  const value = useMemo(
    () => ({
      email,
      skipped,
      gateForced,
      saveEmail,
      skip,
      openGate,
      getVisitorKey,
    }),
    [email, skipped, gateForced, saveEmail, skip, openGate]
  );

  return (
    <VisitorContext.Provider value={value}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitor() {
  const context = useContext(VisitorContext);

  if (!context) {
    throw new Error("useVisitor must be used inside VisitorProvider");
  }

  return context;
}
