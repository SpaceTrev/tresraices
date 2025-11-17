#!/usr/bin/env node
/**
 * Test Firebase Admin SDK connection
 * Run: node scripts/test-firebase.mjs
 */

import 'dotenv/config';
import admin from 'firebase-admin';

async function testFirebase() {
  try {
    console.log('🔥 Testing Firebase Admin SDK connection...\n');
    
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable not set');
    }
    
    const creds = JSON.parse(raw);
    const app = admin.initializeApp({
      credential: admin.credential.cert(creds),
    });
    
    const db = app.firestore();
    
    console.log('✅ Firebase Admin initialized successfully');
    console.log(`   Project: ${creds.project_id}\n`);
    
    // Test Firestore write
    const testDoc = db.collection('_test').doc('connection-test');
    await testDoc.set({
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test successful'
    });
    console.log('✅ Firestore write test passed');
    
    // Test Firestore read
    const snapshot = await testDoc.get();
    console.log('✅ Firestore read test passed');
    console.log(`   Data:`, snapshot.data());
    
    // Cleanup
    await testDoc.delete();
    console.log('✅ Cleanup complete\n');
    
    console.log('🎉 Firebase is fully configured and ready for WhatsApp API!\n');
    console.log('Next steps:');
    console.log('1. Create admin user in Firebase Console → Authentication');
    console.log('2. Test login at http://localhost:5173/admin');
    console.log('3. Ready to build WhatsApp webhook!\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    process.exit(1);
  }
}

testFirebase();
