"use client";

import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DEFAULT_PALETTES } from "@/lib/theme/palettes";
import { checkContrast } from "@/lib/theme/contrast";
import type { SiteConfig, ThemeConfig, SiteContent, FontConfig } from "@/lib/config/types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

type Tab = "content" | "theme" | "font";

const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Source Sans 3",
  "Nunito",
  "Merriweather",
  "Playfair Display",
  "Crimson Text",
];

export default function ContentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [buildTriggered, setBuildTriggered] = useState(false);
  
  // Track which field is being edited
  const [editingField, setEditingField] = useState<string | null>(null);

  // Content state
  const [content, setContent] = useState<SiteContent>({
    hero: { headline: "", tagline: "", ctaText: "" },
    about: { headline: "", description: "" },
    valueProps: [],
    cta: { headline: "", description: "", buttonText: "" },
    footer: { brandDescription: "", regionsServed: [] },
    contact: { whatsappNumber: "523315126548", phone: "+52 33 1512 6548" },
  });

  // Theme state
  const [theme, setTheme] = useState<ThemeConfig>({
    activePaletteId: "default",
  });

  // Font state
  const [font, setFont] = useState<FontConfig>({
    family: "Inter",
  });

  // Auth check
  useEffect(() => {
    if (!getApps().length) {
      initializeApp(firebaseConfig);
    }
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/admin";
        return;
      }

      // Fetch config
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/config", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setConfig(data.config);
          setContent(data.config.content || content);
          setTheme(data.config.theme || theme);
          setFont(data.config.font || font);
        }
      } catch (error) {
        console.error("Failed to load config:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setBuildTriggered(false);

    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();

      const updates: Partial<SiteConfig> = {};
      if (activeTab === "content") updates.content = content;
      if (activeTab === "theme") updates.theme = theme;
      if (activeTab === "font") updates.font = font;

      const res = await fetch("/api/config", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config: updates, section: activeTab }),
      });

      const data = await res.json();

      if (res.ok) {
        setBuildTriggered(data.buildTriggered);
        alert(data.message);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const selectedPalette = DEFAULT_PALETTES.find((p) => p.id === theme.activePaletteId) || DEFAULT_PALETTES[0];
  
  // Check contrast for current palette
  const contrastWarnings: string[] = [];
  const textBg = checkContrast(selectedPalette.colors.darkPurple, selectedPalette.colors.cream);
  if (!textBg.wcagAA) {
    contrastWarnings.push(
      `Text/Background: ${textBg.ratio.toFixed(2)} (fails WCAG AA)`
    );
  }
  
  const primaryBg = checkContrast(selectedPalette.colors.federalBlue, selectedPalette.colors.cream);
  if (!primaryBg.wcagAA) {
    contrastWarnings.push(
      `Primary/Background: ${primaryBg.ratio.toFixed(2)} (fails WCAG AA)`
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Configuration</h1>
            <p className="text-gray-600 mt-1">Manage content, theme, and typography</p>
          </div>
          <a
            href="/admin"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Admin
          </a>
        </div>

        {buildTriggered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✓ Configuration saved and deployment triggered!
            </p>
            <p className="text-green-700 text-sm mt-1">
              Changes will be live in ~2-3 minutes
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("content")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "content"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab("theme")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "theme"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Theme
              </button>
              <button
                onClick={() => setActiveTab("font")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "font"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Fonts
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Content Tab */}
            {activeTab === "content" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Headline
                      </label>
                      {editingField === "hero.headline" ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={content.hero.headline}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                hero: { ...content.hero, headline: e.target.value },
                              })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingField("hero.headline")}
                          className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          {content.hero.headline || <span className="text-gray-400">Click to edit...</span>}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tagline
                      </label>
                      {editingField === "hero.tagline" ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={content.hero.tagline}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                hero: { ...content.hero, tagline: e.target.value },
                              })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingField("hero.tagline")}
                          className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          {content.hero.tagline || <span className="text-gray-400">Click to edit...</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">About Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Headline
                      </label>
                      {editingField === "about.headline" ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={content.about.headline}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                about: { ...content.about, headline: e.target.value },
                              })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingField("about.headline")}
                          className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          {content.about.headline || <span className="text-gray-400">Click to edit...</span>}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      {editingField === "about.description" ? (
                        <div className="space-y-2">
                          <textarea
                            value={content.about.description}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                about: { ...content.about, description: e.target.value },
                              })
                            }
                            autoFocus
                            rows={4}
                            className="w-full px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingField("about.description")}
                          className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors min-h-[100px]"
                        >
                          {content.about.description ? (
                            <p className="whitespace-pre-wrap">{content.about.description}</p>
                          ) : (
                            <span className="text-gray-400">Click to edit...</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">CTA Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Headline
                      </label>
                      {editingField === "cta.headline" ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={content.cta.headline}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                cta: { ...content.cta, headline: e.target.value },
                              })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingField("cta.headline")}
                          className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          {content.cta.headline || <span className="text-gray-400">Click to edit...</span>}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      {editingField === "cta.description" ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={content.cta.description}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                cta: { ...content.cta, description: e.target.value },
                              })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingField("cta.description")}
                          className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          {content.cta.description || <span className="text-gray-400">Click to edit...</span>}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Button Text
                      </label>
                      {editingField === "cta.buttonText" ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={content.cta.buttonText}
                            onChange={(e) =>
                              setContent({
                                ...content,
                                cta: { ...content.cta, buttonText: e.target.value },
                              })
                            }
                            onBlur={() => setEditingField(null)}
                            autoFocus
                            className="flex-1 px-3 py-2 border border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setEditingField(null)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingField("cta.buttonText")}
                          className="px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                          {content.cta.buttonText || <span className="text-gray-400">Click to edit...</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {activeTab === "theme" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Color Palette
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {DEFAULT_PALETTES.map((palette) => (
                      <button
                        key={palette.id}
                        onClick={() =>
                          setTheme({ ...theme, activePaletteId: palette.id })
                        }
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          theme.activePaletteId === palette.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <p className="font-medium text-gray-900 mb-2">{palette.name}</p>
                        <div className="flex gap-2">
                          {Object.entries(palette.colors).map(([key, value]) => (
                            <div
                              key={key}
                              className="w-8 h-8 rounded border border-gray-300"
                              style={{ backgroundColor: value }}
                              title={key}
                            />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {contrastWarnings.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-yellow-800 mb-2">
                      ⚠️ Contrast Warnings (WCAG AA)
                    </p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {contrastWarnings.map((warning, i) => (
                        <li key={i}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <div
                    className="p-6 rounded-lg border border-gray-300"
                    style={{
                      backgroundColor: selectedPalette.colors.cream,
                      color: selectedPalette.colors.darkPurple,
                    }}
                  >
                    <h2 className="text-2xl font-bold mb-2">Sample Heading</h2>
                    <p className="mb-4">
                      This is sample body text to preview your color scheme.
                    </p>
                    <button
                      className="px-4 py-2 rounded font-medium"
                      style={{
                        backgroundColor: selectedPalette.colors.federalBlue,
                        color: selectedPalette.colors.cream,
                      }}
                    >
                      Primary Button
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Font Tab */}
            {activeTab === "font" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={font.family}
                    onChange={(e) => setFont({ ...font, family: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="system">System Default</option>
                    {GOOGLE_FONTS.map((fontName) => (
                      <option key={fontName} value={fontName}>
                        {fontName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <div className="p-6 bg-gray-100 rounded-lg">
                    <h1
                      className="text-4xl font-bold mb-4"
                      style={{ fontFamily: font.family === 'system' ? 'inherit' : font.family }}
                    >
                      Heading Example
                    </h1>
                    <p className="text-lg" style={{ fontFamily: font.family === 'system' ? 'inherit' : font.family }}>
                      This is body text using {font.family}. It demonstrates how your selected
                      font will appear in paragraphs and content throughout the site.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
