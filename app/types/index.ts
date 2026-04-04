export interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  content: string
  timestamp: number
}

export interface AckPayload {
  ackId: string
  messageId: string
  status: 'ok' | 'error'
}

export interface OutgoingMessage {
  ackId: string
  roomId: string
  senderId: string
  content: string
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
