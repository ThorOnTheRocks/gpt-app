import { Chat } from '@/components/Chat';
import { Separator } from '@/components/ui/separator';
import { auth as getServerSession } from '@/auth';
import PreviousChats from '@/components/PreviousChat';

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="p-5">
      <h1 className="text-4xl font-bold">Welcome To GPT Chat</h1>
      {!session?.user && (
        <div>You need to log in to use this chat.</div>
      )}
      {session?.user && (
        <>
          <PreviousChats />
          <h4 className="mt-5 text-2xl font-bold">
            New Chat Session
          </h4>

          <Separator className="my-5" />
          <Chat />
        </>
      )}
    </main>
  );
}
