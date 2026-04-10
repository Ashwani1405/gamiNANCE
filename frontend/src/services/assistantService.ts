import api from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  reply: string;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  const { data } = await api.post<ChatResponse>('/assistant/chat/', {
    message,
    history,
  });
  return data.reply;
}
