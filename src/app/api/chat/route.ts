import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

const customAnthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const withAuth = (
  handler: (req: NextRequest) => Promise<Response>
) => {
  return async (req: NextRequest) => {
    const session = await auth();
    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }
    return handler(req);
  };
};

async function handler(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const model = customAnthropic('claude-3-haiku-20240307');

    const result = await streamText({
      model,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: `Failed to process request: ${
          error instanceof Error ? error.message : String(error)
        }`,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export const POST = withAuth(handler);
