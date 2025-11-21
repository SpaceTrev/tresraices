#!/usr/bin/env node
/**
 * Create initial owner account
 * Usage: OWNER_EMAIL=owner@example.com OWNER_PASSWORD=secure123 node scripts/create-owner.mjs
 */

import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const ownerEmail = process.env.OWNER_EMAIL;
const ownerPassword = process.env.OWNER_PASSWORD || "TresRaices2025!";
const ownerDisplayName = process.env.OWNER_DISPLAY_NAME || "Owner";

if (!ownerEmail) {
  console.error("❌ OWNER_EMAIL environment variable is required");
  process.exit(1);
}

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

async function createOwner() {
  try {
    console.log(`🔍 Checking if user ${ownerEmail} already exists...`);

    let user;
    try {
      user = await auth.getUserByEmail(ownerEmail);
      console.log(`✅ Firebase Auth user already exists: ${user.uid}`);
    } catch (error) {
      // User doesn't exist, create it
      console.log(`📝 Creating Firebase Auth user...`);
      user = await auth.createUser({
        email: ownerEmail,
        password: ownerPassword,
        displayName: ownerDisplayName,
        emailVerified: true,
      });
      console.log(`✅ Created Firebase Auth user: ${user.uid}`);
    }

    // Check if Firestore user doc exists
    const userRef = db.collection("users").doc(user.uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      console.log(`⚠️  Firestore user document already exists`);
      console.log(`Current role: ${userDoc.data()?.role}`);
      
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
    } else {
      // Create Firestore user document
      const userData = {
        uid: user.uid,
        email: ownerEmail,
        role: "owner",
        displayName: ownerDisplayName,
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
    }

    console.log("\n🎉 Owner account ready!");
    console.log(`   Email: ${ownerEmail}`);
    console.log(`   UID: ${user.uid}`);
    console.log(`   Password: ${ownerPassword}`);
    console.log("\n⚠️  Save this password securely and change it after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating owner:", error);
    process.exit(1);
  }
}

createOwner();
