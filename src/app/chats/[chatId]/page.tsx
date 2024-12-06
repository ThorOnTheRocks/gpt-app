import { redirect, notFound } from 'next/navigation';
import { auth as getServerSession } from '@/auth';

import { Chat } from '@/components/Chat';

import { getChat } from '@/db';

export default async function ChatDetail({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  const chat = await getChat(+chatId);
  if (!chat) {
    return notFound();
  }

  const session = await getServerSession();
  if (!session || chat?.user_email !== session?.user?.name) {
    return redirect('/');
  }

  return (
    <main className="pt-5">
      <Chat
        id={+chatId}
        messages={chat?.messages || []}
        key={chatId}
      />
    </main>
  );
}