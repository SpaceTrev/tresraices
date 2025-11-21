#!/usr/bin/env node
/**
 * Seed default supplier (El Barranqueño)
 * Usage: node scripts/seed-suppliers.mjs
 */

import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

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

const defaultSupplier = {
  id: "el-barranqueno",
  name: "El Barranqueño",
  contactName: "El Barranqueño",
  contactPhone: "",
  contactEmail: "",
  defaultMarkup: 1.20, // 20% markup for Guadalajara
  isActive: true,
  notes: "Proveedor principal de carnes premium",
  createdAt: admin.firestore.Timestamp.now(),
  createdBy: "system",
};

async function seedSuppliers() {
  try {
    console.log("🌱 Seeding default supplier...");

    const supplierRef = db.collection("suppliers").doc(defaultSupplier.id);
    const doc = await supplierRef.get();

    if (doc.exists) {
      console.log("⚠️  Supplier 'El Barranqueño' already exists");
      console.log("   Updating to ensure correct data...");
      await supplierRef.update({
        ...defaultSupplier,
        updatedAt: admin.firestore.Timestamp.now(),
      });
      console.log("✅ Updated supplier");
    } else {
      await supplierRef.set(defaultSupplier);
      console.log("✅ Created supplier: El Barranqueño");
    }

    console.log("\n🎉 Supplier seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding suppliers:", error);
    process.exit(1);
  }
}

seedSuppliers();
