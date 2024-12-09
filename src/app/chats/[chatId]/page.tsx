import { redirect, notFound } from 'next/navigation';
import { auth as getServerSession } from '@/auth';

import Chat from '@/components/Chat';

import { getChat } from '@/db';

export const dynamic = 'force-dynamic';

export default async function ChatDetail({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  try {
    const { chatId } = await params;
    const session = await getServerSession();

    if (!session?.user?.name) {
      return redirect('/');
    }

    const chat = await getChat(+chatId);

    if (!chat) {
      return notFound();
    }

    if (chat?.user_email !== session.user.name) {
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
  } catch (error) {
    console.error('Error in ChatDetail:', error);
    return redirect('/');
  }
}
