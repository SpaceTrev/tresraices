/**
 * Suppliers API


























































































































































































































































































































































































































































































































}  );    </div>      </div>        </div>          </div>            </div>              </button>                {saving ? "Saving..." : "Save Changes"}              >                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400"                disabled={saving}                onClick={handleSave}              <button            <div className="mt-8 pt-6 border-t border-gray-200">            {/* Save Button */}            )}              </div>                </div>                  </div>                    </p>                      font will appear in paragraphs and content throughout the site.                      This is body text using {font.family}. It demonstrates how your selected                    <p className="text-lg" style={{ fontFamily: font.family }}>                    </h1>                      Heading Font                    >                      style={{ fontFamily: font.headingFamily }}                      className="text-4xl font-bold mb-4"                    <h1                  <div className="p-6 bg-gray-100 rounded-lg">                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>                <div>                </div>                  </select>                    ))}                      </option>                        {fontName}                      <option key={fontName} value={fontName}>                    {GOOGLE_FONTS.map((fontName) => (                  >                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                    onChange={(e) => setFont({ ...font, headingFamily: e.target.value })}                    value={font.headingFamily}                  <select                  </label>                    Heading Font                  <label className="block text-sm font-medium text-gray-700 mb-2">                <div>                </div>                  </select>                    ))}                      </option>                        {fontName}                      <option key={fontName} value={fontName}>                    {GOOGLE_FONTS.map((fontName) => (                  >                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                    onChange={(e) => setFont({ ...font, family: e.target.value })}                    value={font.family}                  <select                  </label>                    Body Font                  <label className="block text-sm font-medium text-gray-700 mb-2">                <div>              <div className="space-y-6">            {activeTab === "font" && (            {/* Font Tab */}            )}              </div>                </div>                  </div>                    </button>                      Primary Button                    >                      }}                        color: currentColors.background,                        backgroundColor: currentColors.primary,                      style={{                      className="px-4 py-2 rounded font-medium"                    <button                    </p>                      This is sample body text to preview your color scheme.                    <p className="mb-4">                    <h2 className="text-2xl font-bold mb-2">Sample Heading</h2>                  >                    }}                      color: currentColors.text,                      backgroundColor: currentColors.background,                    style={{                    className="p-6 rounded-lg border border-gray-300"                  <div                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>                <div>                )}                  </div>                    </ul>                      ))}                        <li key={i}>• {warning}</li>                      {contrastWarnings.map((warning, i) => (                    <ul className="text-sm text-yellow-700 space-y-1">                    </p>                      ⚠️ Contrast Warnings (WCAG AA)                    <p className="font-medium text-yellow-800 mb-2">                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">                {contrastWarnings.length > 0 && (                </div>                  </div>                    ))}                      </button>                        </div>                          ))}                            />                              title={key}                              style={{ backgroundColor: value }}                              className="w-8 h-8 rounded border border-gray-300"                              key={key}                            <div                          {Object.entries(palette.colors).map(([key, value]) => (                        <div className="flex gap-2">                        <p className="font-medium text-gray-900 mb-2">{palette.name}</p>                      >                        }`}                            : "border-gray-200 hover:border-gray-300"                            ? "border-blue-600 bg-blue-50"                          theme.colorPalette === palette.id                        className={`p-4 border-2 rounded-lg text-left transition-all ${                        }                          setTheme({ ...theme, colorPalette: palette.id, customColors: {} })                        onClick={() =>                        key={palette.id}                      <button                    {DEFAULT_PALETTES.map((palette) => (                  <div className="grid grid-cols-2 gap-4">                  </label>                    Color Palette                  <label className="block text-sm font-medium text-gray-700 mb-3">                <div>              <div className="space-y-6">            {activeTab === "theme" && (            {/* Theme Tab */}            )}              </div>                </div>                  </div>                    </div>                      />                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                        }                          })                            cta: { ...content.cta, buttonText: e.target.value },                            ...content,                          setContent({                        onChange={(e) =>                        value={content.cta.buttonText}                        type="text"                      <input                      </label>                        Button Text                      <label className="block text-sm font-medium text-gray-700 mb-1">                    <div>                    </div>                      />                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                        }                          })                            cta: { ...content.cta, subtitle: e.target.value },                            ...content,                          setContent({                        onChange={(e) =>                        value={content.cta.subtitle}                        type="text"                      <input                      </label>                        Subtitle                      <label className="block text-sm font-medium text-gray-700 mb-1">                    <div>                    </div>                      />                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                        }                          })                            cta: { ...content.cta, title: e.target.value },                            ...content,                          setContent({                        onChange={(e) =>                        value={content.cta.title}                        type="text"                      <input                      </label>                        Title                      <label className="block text-sm font-medium text-gray-700 mb-1">                    <div>                  <div className="space-y-4">                  <h3 className="text-lg font-semibold mb-4">CTA Section</h3>                <div>                </div>                  </div>                    </div>                      />                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                        rows={4}                        }                          })                            about: { ...content.about, description: e.target.value },                            ...content,                          setContent({                        onChange={(e) =>                        value={content.about.description}                      <textarea                      </label>                        Description                      <label className="block text-sm font-medium text-gray-700 mb-1">                    <div>                    </div>                      />                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                        }                          })                            about: { ...content.about, title: e.target.value },                            ...content,                          setContent({                        onChange={(e) =>                        value={content.about.title}                        type="text"                      <input                      </label>                        Title                      <label className="block text-sm font-medium text-gray-700 mb-1">                    <div>                  <div className="space-y-4">                  <h3 className="text-lg font-semibold mb-4">About Section</h3>                <div>                </div>                  </div>                    </div>                      />                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                        }                          })                            hero: { ...content.hero, subtitle: e.target.value },                            ...content,                          setContent({                        onChange={(e) =>                        value={content.hero.subtitle}                        type="text"                      <input                      </label>                        Subtitle                      <label className="block text-sm font-medium text-gray-700 mb-1">                    <div>                    </div>                      />                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"                        }                          })                            hero: { ...content.hero, title: e.target.value },                            ...content,                          setContent({                        onChange={(e) =>                        value={content.hero.title}                        type="text"                      <input                      </label>                        Title                      <label className="block text-sm font-medium text-gray-700 mb-1">                    <div>                  <div className="space-y-4">                  <h3 className="text-lg font-semibold mb-4">Hero Section</h3>                <div>              <div className="space-y-6">            {activeTab === "content" && (            {/* Content Tab */}          <div className="p-6">          </div>            </nav>              </button>                Fonts              >                }`}                    : "text-gray-600 hover:text-gray-900"                    ? "border-b-2 border-blue-600 text-blue-600"                  activeTab === "font"                className={`px-6 py-3 text-sm font-medium transition-colors ${                onClick={() => setActiveTab("font")}              <button              </button>                Theme              >                }`}                    : "text-gray-600 hover:text-gray-900"                    ? "border-b-2 border-blue-600 text-blue-600"                  activeTab === "theme"                className={`px-6 py-3 text-sm font-medium transition-colors ${                onClick={() => setActiveTab("theme")}              <button              </button>                Content              >                }`}                    : "text-gray-600 hover:text-gray-900"                    ? "border-b-2 border-blue-600 text-blue-600"                  activeTab === "content"                className={`px-6 py-3 text-sm font-medium transition-colors ${                onClick={() => setActiveTab("content")}              <button            <nav className="flex">          <div className="border-b border-gray-200">        <div className="bg-white rounded-lg shadow-sm overflow-hidden">        {/* Tabs */}        )}          </div>            </p>              Changes will be live in ~2-3 minutes            <p className="text-green-700 text-sm mt-1">            </p>              ✓ Configuration saved and deployment triggered!            <p className="text-green-800 font-medium">          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">        {buildTriggered && (        </div>          </a>            ← Back to Admin          >            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"            href="/admin"          <a          </div>            <p className="text-gray-600 mt-1">Manage content, theme, and typography</p>            <h1 className="text-3xl font-bold text-gray-900">Site Configuration</h1>          <div>        <div className="flex items-center justify-between mb-8">      <div className="max-w-5xl mx-auto">    <div className="min-h-screen bg-gray-50 p-8">  return (  }    }      contrastWarnings.push(`Text/Background: ${textBg.ratio.toFixed(2)} (fails WCAG AA)`);    if (!textBg.wcagAA) {    const textBg = checkContrast(currentColors.text, currentColors.background);  if (currentColors.text && currentColors.background) {  }    }      );        `Primary/Background: ${primaryBg.ratio.toFixed(2)} (fails WCAG AA)`      contrastWarnings.push(    if (!primaryBg.wcagAA) {    const primaryBg = checkContrast(currentColors.primary, currentColors.background);  if (currentColors.primary && currentColors.background) {  const contrastWarnings: string[] = [];  // Check contrast for current palette  };    ...theme.customColors,    ...selectedPalette?.colors,  const currentColors = {  const selectedPalette = DEFAULT_PALETTES.find((p) => p.id === theme.colorPalette);  }    );      </div>        <p className="text-gray-600">Loading...</p>      <div className="min-h-screen bg-gray-50 flex items-center justify-center">    return (  if (loading) {  };    }      setSaving(false);    } finally {      alert("Failed to save configuration");      console.error("Save error:", error);    } catch (error) {      }        alert(`Error: ${data.error}`);      } else {        alert(data.message);        setBuildTriggered(data.buildTriggered);      if (res.ok) {      const data = await res.json();      });        body: JSON.stringify({ config: updates, section: activeTab }),        },          "Content-Type": "application/json",          Authorization: `Bearer ${token}`,        headers: {        method: "POST",      const res = await fetch("/api/config", {      if (activeTab === "font") updates.font = font;      if (activeTab === "theme") updates.theme = theme;      if (activeTab === "content") updates.content = content;      const updates: Partial<SiteConfig> = {};      const token = await auth.currentUser?.getIdToken();      const auth = getAuth();    try {    setBuildTriggered(false);    setSaving(true);  const handleSave = async () => {  }, []);    return () => unsubscribe();    });      }        setLoading(false);      } finally {        console.error("Failed to load config:", error);      } catch (error) {        }          setFont(data.config.font || font);          setTheme(data.config.theme || theme);          setContent(data.config.content || content);          setConfig(data.config);          const data = await res.json();        if (res.ok) {        });          headers: { Authorization: `Bearer ${token}` },        const res = await fetch("/api/config", {        const token = await user.getIdToken();      try {      // Fetch config      }        return;        window.location.href = "/admin";      if (!user) {    const unsubscribe = onAuthStateChanged(auth, async (user) => {    const auth = getAuth();  useEffect(() => {  // Auth check  });    weights: ["400", "600", "700"],    headingFamily: "Inter",    family: "Inter",  const [font, setFont] = useState<FontConfig>({  // Font state  });    customColors: {},    colorPalette: "default",  const [theme, setTheme] = useState<ThemeConfig>({  // Theme state  });    footer: { copyright: "", socialLinks: [] },    cta: { title: "", subtitle: "", buttonText: "" },    },      variety: { title: "", description: "" },      delivery: { title: "", description: "" },      quality: { title: "", description: "" },    valueProps: {    about: { title: "", description: "" },    hero: { title: "", subtitle: "" },  const [content, setContent] = useState<SiteContent>({  // Content state  const [buildTriggered, setBuildTriggered] = useState(false);  const [config, setConfig] = useState<SiteConfig | null>(null);  const [activeTab, setActiveTab] = useState<Tab>("content");  const [saving, setSaving] = useState(false);  const [loading, setLoading] = useState(true);export default function ContentPage() {];  "Crimson Text",  "Playfair Display",  "Merriweather",  "Nunito",  "Source Sans 3",  "Raleway",  "Poppins",  "Montserrat",  "Lato",  "Open Sans",  "Roboto",  "Inter",const GOOGLE_FONTS = [type Tab = "content" | "theme" | "font";import type { SiteConfig, ThemeConfig, SiteContent, FontConfig } from "@/lib/config/types";import { checkContrast } from "@/lib/theme/contrast";import { DEFAULT_PALETTES } from "@/lib/theme/palettes";import { getAuth, onAuthStateChanged } from "firebase/auth";import { useState, useEffect } from "react"; * Manages supplier CRUD operations
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebaseAdmin";
import { verifyAuthAndPermission } from "@/lib/auth/rbac";
import { logAudit, getClientIp, getUserAgent } from "@/lib/audit/logger";
import { Timestamp } from "firebase-admin/firestore";
import type { Supplier } from "@/lib/suppliers/types";

// GET: List all suppliers
export async function GET(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canEditMenu"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    let query = db.collection("suppliers").orderBy("name");

    if (activeOnly) {
      query = query.where("isActive", "==", true) as any;
    }

    const snapshot = await query.get();
    const suppliers = snapshot.docs.map((doc) => doc.data() as Supplier);

    return NextResponse.json({ suppliers });
  } catch (error) {
    console.error("[API/Suppliers] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

// POST: Create new supplier
export async function POST(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canEditMenu"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, contactName, contactPhone, contactEmail, defaultMarkup, notes } = body;

    if (!name || !defaultMarkup) {
      return NextResponse.json(
        { error: "Missing required fields: name, defaultMarkup" },
        { status: 400 }
      );
    }

    if (defaultMarkup <= 0 || defaultMarkup > 3) {
      return NextResponse.json(
        { error: "defaultMarkup must be between 0 and 3" },
        { status: 400 }
      );
    }

    const db = getDb();
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const supplierRef = db.collection("suppliers").doc(id);

    // Check if exists
    const doc = await supplierRef.get();
    if (doc.exists) {
      return NextResponse.json(
        { error: "Supplier with this name already exists" },
        { status: 400 }
      );
    }

    const supplier: Supplier = {
      id,
      name,
      contactName,
      contactPhone,
      contactEmail,
      defaultMarkup,
      notes,
      isActive: true,
      createdAt: Timestamp.now(),
      createdBy: authResult.uid,
    };

    await supplierRef.set(supplier);

    await logAudit({
      userId: authResult.uid!,
      action: "create",
      resourceType: "supplier",
      resourceId: id,
      changes: { ...supplier } as Record<string, unknown>,
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ success: true, supplier });
  } catch (error) {
    console.error("[API/Suppliers] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}

// PATCH: Update supplier
export async function PATCH(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canEditMenu"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing supplier id" }, { status: 400 });
    }

    const db = getDb();
    const supplierRef = db.collection("suppliers").doc(id);
    const doc = await supplierRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }

    const allowedUpdates = [
      "name",
      "contactName",
      "contactPhone",
      "contactEmail",
      "defaultMarkup",
      "notes",
      "isActive",
    ];

    const validUpdates: any = { updatedAt: Timestamp.now() };

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        validUpdates[key] = updates[key];
      }
    }

    await supplierRef.update(validUpdates);

    await logAudit({
      userId: authResult.uid!,
      action: "update",
      resourceType: "supplier",
      resourceId: id,
      changes: validUpdates,
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ success: true, updates: validUpdates });
  } catch (error) {
    console.error("[API/Suppliers] PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 }
    );
  }
}

// DELETE: Deactivate supplier (soft delete)
export async function DELETE(request: NextRequest) {
  const authResult = await verifyAuthAndPermission(
    request.headers.get("authorization"),
    "canEditMenu"
  );

  if (!authResult.authorized) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing supplier id" }, { status: 400 });
    }

    const db = getDb();
    await db.collection("suppliers").doc(id).update({
      isActive: false,
      updatedAt: Timestamp.now(),
    });

    await logAudit({
      userId: authResult.uid!,
      action: "delete",
      resourceType: "supplier",
      resourceId: id,
      ipAddress: getClientIp(request.headers),
      userAgent: getUserAgent(request.headers),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API/Suppliers] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate supplier" },
      { status: 500 }
    );
  }
}
