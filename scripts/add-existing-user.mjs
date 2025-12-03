#!/usr/bin/env node
/**
 * Add Firestore user document for existing Firebase Auth user
 * Usage: UID=xxx node scripts/add-existing-user.mjs
 */

import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const uid = process.env.UID || "XE3HP2z5hmfbdSY4T6q0XDXNteF2";

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  
  if (!serviceAccountJson) {
    console.error("❌ FIREBASE_SERVICE_ACCOUNT_JSON environment variable is required");
    process.exit(1);
  }

  const serviceAccount = JSON.parse(serviceAccountJson);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = admin.firestore();
const auth = admin.auth();

async function addUser() {
  try {
    console.log(`🔍 Looking up Firebase Auth user ${uid}...`);

    // Get user from Firebase Auth
    const authUser = await auth.getUser(uid);
    console.log(`✅ Found Firebase Auth user: ${authUser.email}`);

    // Check if Firestore user doc exists
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      console.log(`⚠️  Firestore user document already exists`);
      console.log(`Current role: ${userDoc.data()?.role}`);
      return;
    }

    // Create Firestore user document with owner permissions
    const userData = {
      uid: authUser.uid,
      email: authUser.email,
      role: "owner",
      displayName: authUser.displayName || authUser.email?.split("@")[0] || "User",
      permissions: {
        canEditMenu: true,
        canEditTheme: true,
        canEditContent: true,
        canViewAnalytics: true,
        canManageOrders: true,
        canManagePurchases: true,
        canManageInventory: true,
        canManageUsers: true,
      },
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: "system",
      isActive: true,
    };

    await userRef.set(userData);
    console.log(`✅ Created Firestore user document`);
    console.log(`   Email: ${authUser.email}`);
    console.log(`   Role: owner`);
    console.log(`   UID: ${uid}`);

    console.log("\n🎉 User is now ready to use admin features!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding user:", error);
    process.exit(1);
  }
}

addUser();
