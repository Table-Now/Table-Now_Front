export enum MessageType {
  CHAT = "CHAT",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
}

export interface ChatMessage {
  user: string | null;
  content: string;
  type: MessageType;
}
