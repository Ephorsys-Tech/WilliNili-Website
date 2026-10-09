import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/backend/config/db';

export async function GET() {
  let dbStatus = 'disconnected';
  try {
    await connectDB();
    dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting';
  } catch (error) {
    dbStatus = 'error';
  }

  const isHealthy = dbStatus === 'connected';

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'willy-nilly-agro-tourism',
      database: dbStatus,
      uptimeSeconds: Math.floor(process.uptime()),
    },
    { status: isHealthy ? 200 : 503 }
  );
}
