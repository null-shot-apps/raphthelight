import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for messages (replace with actual database)
const messages: Array<{ id: string; message: string; timestamp: string }> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { message?: string };
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message exceeds 500 characters' },
        { status: 400 }
      );
    }

    // Store message (in production, save to database)
    const newMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    messages.push(newMessage);

    // Log to console for now (in production, save to database)
    console.log('New message received:', newMessage);

    return NextResponse.json(
      { success: true, id: newMessage.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return all messages (for admin view)
  return NextResponse.json({ messages }, { status: 200 });
}


