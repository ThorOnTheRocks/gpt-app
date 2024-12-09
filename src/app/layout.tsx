import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Link from 'next/link';
import { SessionProvider } from 'next-auth/react';
import { signIn, auth } from '@/auth';
import UserButton from '@/components/UserButton';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// });

export const metadata: Metadata = {
  title: 'Welcome to GPT Chat',
  description: 'Your personal GPT',
};

export default async function RootLayout({
  children,
  chats,
}: Readonly<{
  children: React.ReactNode;
  chats: React.ReactNode;
}>) {
  const session = await auth();

  if (session?.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    };
  }

  return (
    <SessionProvider basePath="/api/auth" session={session}>
      <html lang="en">
        <body className={`${geistSans.className} px-2 md:px-5`}>
          <header className="text-white font-bold bg-green-900 text-2xl p-2 mb-3 rounded-b-lg shadow-gray-700 shadow-lg flex">
            <div className="flex flex-grow">
              <Link href="/">GPT Chat</Link>
              <Link href="/about" className="ml-5 font-light">
                About
              </Link>
            </div>
            <div>
              <UserButton
                onSignIn={async () => {
                  'use server';
                  await signIn();
                }}
              />
            </div>
          </header>
          <div className="flex flex-col md:flex-row">
            {chats}
            <div className="flex-grow">{children}</div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
