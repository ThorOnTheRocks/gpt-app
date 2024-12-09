import { createAnthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { auth } from '@/auth';

export const runtime = 'edge';

async function handler(req: Request) {
  try {
    const { messages } = await req.json();

    const customAnthropic = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

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

export const POST = auth(handler);
