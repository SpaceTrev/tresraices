#!/usr/bin/env node
/**
 * Directly create Firestore user document (without Auth lookup)
 * Usage: EMAIL=user@example.com UID=xxx node scripts/create-firestore-user-direct.mjs
 */

import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const uid = process.env.UID || "XE3HP2z5hmfbdSY4T6q0XDXNteF2";
const email = process.env.EMAIL || "owner@tresraices.com";
const displayName = process.env.DISPLAY_NAME || email.split("@")[0];

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

async function createUser() {
  try {
    console.log(`🔍 Creating Firestore user document for UID: ${uid}...`);

    // Check if Firestore user doc exists
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      console.log(`⚠️  Firestore user document already exists`);
      console.log(`Current role: ${userDoc.data()?.role}`);
      console.log(`Current email: ${userDoc.data()?.email}`);
      
      // Update to ensure owner role
      await userRef.update({
        role: "owner",
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
        updatedAt: admin.firestore.Timestamp.now(),
      });
      console.log(`✅ Updated user to owner role`);
      process.exit(0);
      return;
    }

    // Create Firestore user document with owner permissions
    const userData = {
      uid,
      email,
      role: "owner",
      displayName,
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
    console.log(`   Email: ${email}`);
    console.log(`   Role: owner`);
    console.log(`   UID: ${uid}`);

    console.log("\n🎉 User is now ready to use admin features!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    process.exit(1);
  }
}

createUser();
