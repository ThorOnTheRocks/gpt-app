import { supabase } from '@/utils/supabase/client';
import type { Chat, ChatWithMessages, Message } from '@/types';

export async function createChat(
  userEmail: string,
  name: string,
  msgs: { role: string; content: string }[]
) {
  const { data: chatData, error: chatError } = await supabase
    .from('chats')
    .insert({
      user_email: userEmail,
      name: name,
    })
    .select()
    .single();

  if (chatError) throw chatError;

  const messagesWithChatId = msgs.map((msg) => ({
    chat_id: chatData.id,
    role: msg.role,
    content: msg.content,
  }));

  const { error: messagesError } = await supabase
    .from('messages')
    .insert(messagesWithChatId);

  if (messagesError) throw messagesError;

  return chatData.id;
}

export async function getChat(
  chatId: number
): Promise<ChatWithMessages | null> {
  const { data, error } = await supabase
    .from('chats')
    .select(
      `
      *,
      messages (*)
    `
    )
    .eq('id', chatId)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    messages: data.messages.map((msg: Message) => ({
      ...msg,
      role: msg.role,
    })),
  };
}

export async function getChats(userEmail: string): Promise<Chat[]> {
  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .eq('user_email', userEmail);

  if (error) throw error;

  return data;
}

export async function getChatsWithMessages(
  userEmail: string
): Promise<ChatWithMessages[]> {
  const { data, error } = await supabase
    .from('chats')
    .select(
      `
      *,
      messages (*)
    `
    )
    .eq('user_email', userEmail)
    .order('timestamp', { ascending: false })
    .limit(3);

  if (error) throw error;

  return data.map((chat) => ({
    ...chat,
    messages: chat.messages.map((msg: Message) => ({
      ...msg,
      role: msg.role,
    })),
  }));
}

export async function getMessages(chatId: number) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId);

  if (error) throw error;

  return data.map((msg) => ({
    ...msg,
    role: msg.role as 'user' | 'assistant',
  }));
}

export async function updateChat(
  chatId: number,
  msgs: { role: string; content: string }[]
) {
  const { error: deleteError } = await supabase
    .from('messages')
    .delete()
    .eq('chat_id', chatId);

  if (deleteError) throw deleteError;

  const messagesWithChatId = msgs.map((msg) => ({
    chat_id: chatId,
    role: msg.role,
    content: msg.content,
  }));

  const { error: insertError } = await supabase
    .from('messages')
    .insert(messagesWithChatId);

  if (insertError) throw insertError;
}
