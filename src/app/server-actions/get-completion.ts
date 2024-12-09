'use server';
import { createChat, updateChat } from '@/db';
import { auth as getServerSession } from '@/auth';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface IMessageHistory {
  role: 'user' | 'assistant';
  content: string;
}

export async function getCompletion(
  id: number | null,
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
    {
      role: 'assistant',
      content: text,
    },
  ];

  const session = await getServerSession();

  if (!session?.user?.name) {
    throw new Error('No user session found');
  }

  let chatId = id;
  try {
    if (!chatId) {
      chatId = await createChat(
        session.user.name,
        messageHistory[0].content.substring(0, 255),
        messages
      );
    } else {
      await updateChat(chatId, messages);
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }

  return {
    messages,
    id: chatId,
  };
}
