// Amar AI: Gemini through Firebase AI Logic. Keep this file next to index.html.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-ai.js';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app-check.js';

// Paste your reCAPTCHA Enterprise SITE key here (not a Gemini API key).
const RECAPTCHA_SITE_KEY = '6LfNMjQuAAAAABIBaKJQNy4SrTDrCpf8V4OLf8z6';
const MODEL_NAME = 'gemini-4-hydrogen';

if (RECAPTCHA_SITE_KEY.startsWith('PASTE_')) {
  console.warn('Amar AI: reCAPTCHA site key is not set. Using built-in replies.');
} else {
  const app = initializeApp({
    apiKey: 'AIzaSyCeiAsogvltOOYjde5uNL8NDStRT2ddfz4',
    authDomain: 'amar-chat-f9870.firebaseapp.com',
    projectId: 'amar-chat-f9870',
    storageBucket: 'amar-chat-f9870.firebasestorage.app',
    messagingSenderId: '125656305932',
    appId: '1:125656305932:web:c3fabc5da8929a7874f929'
  }, 'amar-ai');

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });

  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, {
    model: MODEL_NAME,
    systemInstruction: 'You are Amar AI, a helpful assistant inside the Amar Chat app. Reply in the same language and script the user writes in (Banglish, Bangla or English). Be clear and short. If you are not sure about something, say so.'
  });

  window.amarAiGenerate = async (history, text, userName) => {
    // The conversation must start with the user and take turns.
    const contents = [];
    for (const m of history || []) {
      if (!m.text || (!contents.length && m.role !== 'user')) continue;
      const last = contents[contents.length - 1];
      if (last && last.role === m.role) last.parts.push({ text: m.text });
      else contents.push({ role: m.role, parts: [{ text: m.text }] });
    }
    if (!contents.length || contents[contents.length - 1].role !== 'user') {
      contents.push({ role: 'user', parts: [{ text }] });
    }
    const result = await model.generateContent({ contents });
    return result.response.text();
  };
  window.amarAiReady = true;
}
