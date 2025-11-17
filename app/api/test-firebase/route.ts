import { NextResponse } from 'next/server';
import { getDb, getAdminApp } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const db = getDb();
    const app = getAdminApp();
    
    // Test write
    const testDoc = db.collection('_test').doc('api-test');
    await testDoc.set({
      timestamp: new Date().toISOString(),
      message: 'Firebase API route test successful'
    });
    
    // Test read
    const snapshot = await testDoc.get();
    const data = snapshot.data();
    
    // Cleanup
    await testDoc.delete();
    
    return NextResponse.json({
      success: true,
      message: 'Firebase is fully configured!',
      projectId: app.options.projectId,
      testData: data
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
