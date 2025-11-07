import admin from "firebase-admin";

let app: admin.app.App | undefined;

/**
 * Get or initialize the Firebase Admin app.
 * Reads credentials from FIREBASE_SERVICE_ACCOUNT_JSON env var.
 */
export function getAdminApp(): admin.app.App {
  if (app) return app;
  
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON environment variable not set");
  }
  
  try {
    const creds = JSON.parse(raw);
    app = admin.initializeApp({
      credential: admin.credential.cert(creds),
    });
    return app;
  } catch (err) {
    throw new Error(`Failed to initialize Firebase Admin: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Get Firestore database instance (Native mode).
 */
export function getDb(): admin.firestore.Firestore {
  return getAdminApp().firestore();
}
