'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCompletion } from '@/app/server-actions/get-completion';
import Transcript from './Transcript';
import { Message } from '@/types';

interface MessageState {
  role: 'user' | 'assistant';
  content: string;
}

export function Chat({
  id = null,
  messages: initialMessages = [],
}: {
  id?: number | null;
  messages?: Message[];
}) {
  const [messages, setMessages] =
    useState<MessageState[]>(initialMessages);
  const [message, setMessage] = useState('');
  const chatId = useRef<number | null>(id);

  const router = useRouter();

  const onClick = async () => {
    const completions = await getCompletion(chatId.current, [
      ...messages,
      {
        role: 'user',
        content: message,
      },
    ]);
    if (!chatId.current) {
      router.push(`/chats/${completions.id}`);
      router.refresh();
    }
    setMessage('');

    const validMessages: MessageState[] = completions.messages.filter(
      (msg): msg is MessageState =>
        msg.role === 'user' || msg.role === 'assistant'
    );

    setMessages(validMessages);
  };

  return (
    <div className="flex flex-col">
      <Transcript messages={messages} truncate={false} />
      <div className="flex border-t-2 border-t-gray-500 pt-3 mt-3">
        <Input
          className="flex-grow text-xl"
          placeholder="Question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              onClick();
            }
          }}
        />
        <Button onClick={onClick}>Send</Button>
      </div>
    </div>
  );
}
