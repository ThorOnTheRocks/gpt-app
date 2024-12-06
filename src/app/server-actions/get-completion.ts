'use server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_SECRET_KEY,
});

interface IMessageHistory {
  role: 'user' | 'assistant';
  content: string;
}

export async function getCompletion(
  messageHistory: IMessageHistory[]
) {
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    messages: messageHistory,
  });

  const text = (response.content[0] as Anthropic.TextBlock).text;

  const messages = [
    ...messageHistory,
    text as unknown as IMessageHistory,
  ];

  return {
    messages,
  };
}
