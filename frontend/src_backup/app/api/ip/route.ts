import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  // Since we are running locally in dev mode, this will likely be ::1 or 127.0.0.1
  // We'll fall back to '127.0.0.1' if nothing is found
  const ip = forwardedFor?.split(',')[0] || realIp || '127.0.0.1';

  return NextResponse.json({ ip });
}
