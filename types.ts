export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  quickActions?: string[];
}
