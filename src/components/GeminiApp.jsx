import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleGenAI } from '@google/genai';

export default function GeminiApp({ onClose, setBgImage }) {
  const [userToken, setUserToken] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setUserToken(tokenResponse.access_token);
      setError(null);
    },
    scope: 'https://www.googleapis.com/auth/cloud-platform',
    onError: (err) => setError('Login Failed'),
  });

  const handleGeneration = async () => {
    if (!userToken) return;
    if (!prompt.trim()) {
      setError("Podaj opis obrazka.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({
        apiKey: 'OAuth-Token-Mode',
        extraHeaders: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
        }
      });

      const imageBytes = response?.generatedImages?.[0]?.image?.imageBytes;
      if (imageBytes) {
        const dataUrl = `data:image/jpeg;base64,${imageBytes}`;

        // We set it as background image, scaling it correctly later
        // Just providing basic bgImage structure
        setBgImage(prev => ({
          ...prev,
          url: dataUrl,
          opacity: 1,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          scale: 1,
          angle: 0
        }));

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setBgImage(prev => ({
            ...prev,
            width: img.width,
            height: img.height,
            url: dataUrl
          }));
        };
        img.src = dataUrl;

        onClose();
      } else {
        setError("Nie udało się wygenerować obrazu.");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError("Błąd generowania. Sprawdź konsolę przeglądarki.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden">
        <div className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="font-bold text-lg">AI Image Generator</h2>
          <button onClick={onClose} className="text-indigo-200 hover:text-white text-xl font-bold">&times;</button>
        </div>

        <div className="p-6">
          {!userToken ? (
            <div className="text-center">
              <p className="text-slate-600 mb-6">Zaloguj się kontem Google, aby wygenerować tło przy użyciu Imagen.</p>
              <button
                onClick={() => login()}
                className="bg-white border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-slate-50 transition-colors w-full flex justify-center items-center gap-2"
              >
                Log in with Google
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                ✓ Authenticated via your Google Quota
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Opis (Prompt)</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic city in cyberpunk style..."
                  rows={4}
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm outline-none focus:ring-2 ring-indigo-500"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleGeneration}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow transition-colors disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate Image"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
