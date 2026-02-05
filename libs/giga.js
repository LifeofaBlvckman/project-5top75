import admin from "firebase-admin";

let _app = null;

/**
 * Initialize Firebase Admin safely (singleton).
 *
 * @param {Object} params
 * @param {string} params.projectId
 * @param {string} params.clientEmail
 * @param {string} params.privateKey
 * @returns {admin.app.App}
 */
export function initFirebaseAdmin(params = {}) {
  if (_app) return _app;
  
  if (admin.apps.length > 0) {
    _app = admin.app();
    return _app;
  }
  
  const {
    projectId,
    clientEmail,
    privateKey,
  } = params;
  
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin init failed: missing credentials");
  }
  
  _app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
  
  return _app;
}

export function createFS() {
  const files = {};
  return {
    write(path, content) {
      files[path] = content;
    },
    read(path) {
      return files[path];
    },
    list() {
      return { ...files };
    }
  };
}

export function createBudget({ maxCalls = 3, maxChars = 25000 }) {
  let calls = 0;
  let chars = 0;

  return {
    track(text) {
      calls++;
      chars += text.length;
      if (calls > maxCalls) throw new Error("AI call budget exceeded");
      if (chars > maxChars) throw new Error("AI output budget exceeded");
    }
  };
}

export async function getAiResponse({ prompt, json = false }) {
  if (!prompt || typeof prompt !== "string") {
    throw new Error("getAiResponse(): prompt must be a non-empty string");
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000); // 20s cap

  try {
    const finalPrompt = json
      ? `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown. No commentary.`
      : prompt;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: finalPrompt }]
            }
          ]
        })
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (json) {
      try {
        return JSON.parse(text);
      } catch {
        throw new Error("Gemini did not return valid JSON");
      }
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

export function assertSafe(flag, reason) {
  if (!flag) throw new Error(`Blocked: ${reason}`);
}

export function store(config) {
  const app = initFirebaseAdmin(config);
  const db = app.firestore();

  return {
  get: async (path) => {
    const snap = await db.doc(path).get();
    return snap.exists ? snap.data() : null; // Handle non-existent docs
  },
  set: (path, data) => db.doc(path).set(data, { merge: true }), 
  update: (path, data) => db.doc(path).update(data),
  // Added: collection helper
  add: (col, data) => db.collection(col).add(data),
};
}