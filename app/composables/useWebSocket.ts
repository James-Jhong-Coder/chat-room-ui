import type { ChatMessage, AckPayload, OutgoingMessage, WebSocketStatus } from '~/types'

const RECONNECT_DELAYS = [1000, 2000, 5000, 10000] // ms，每次重連等待時間

interface UseWebSocketOptions {
  roomId: string
  senderId: string
}

export function useWebSocket(url: string, options: UseWebSocketOptions) {
  const status = ref<WebSocketStatus>('disconnected')
  const messages = ref<ChatMessage[]>([])

  let ws: WebSocket | null = null
  let reconnectAttempt = 0
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  // 等待 ACK 的 pending 訊息：ackId -> { message, timer, resolve, reject }
  const pendingAcks = new Map<string, {
    message: OutgoingMessage
    timer: ReturnType<typeof setTimeout>
    resolve: (ack: AckPayload) => void
    reject: (reason: string) => void
  }>()

  function connect() {
    status.value = reconnectAttempt > 0 ? 'reconnecting' : 'connecting'
    ws = new WebSocket(url)

    ws.onopen = () => {
      status.value = 'connected'
      reconnectAttempt = 0
      // 連線後自動加入 room
      ws!.send(JSON.stringify({ event: 'join', data: { roomId: options.roomId } }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'ack') {
        handleAck(data.data as AckPayload)
      } else if (data.type === 'message') {
        messages.value.push(data.data as ChatMessage)
      }
    }

    ws.onclose = () => {
      status.value = 'disconnected'
      scheduleReconnect()
    }

    ws.onerror = () => {
      ws?.close()
    }
  }

  function scheduleReconnect() {
    const delay = RECONNECT_DELAYS[Math.min(reconnectAttempt, RECONNECT_DELAYS.length - 1)]
    reconnectAttempt++
    reconnectTimer = setTimeout(connect, delay)
  }

  function handleAck(ack: AckPayload) {
    const pending = pendingAcks.get(ack.ackId)
    if (!pending) return
    clearTimeout(pending.timer)
    pendingAcks.delete(ack.ackId)
    ack.status === 'ok' ? pending.resolve(ack) : pending.reject('server rejected message')
  }

  function sendMessage(content: string): Promise<AckPayload> {
    return new Promise((resolve, reject) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        reject('websocket not connected')
        return
      }

      const payload: OutgoingMessage = {
        ackId: crypto.randomUUID(),
        roomId: options.roomId,
        senderId: options.senderId,
        content,
      }

      // ACK timeout：5 秒內沒收到 ACK 就視為失敗
      const timer = setTimeout(() => {
        pendingAcks.delete(payload.ackId)
        reject('ack timeout')
      }, 5000)

      pendingAcks.set(payload.ackId, { message: payload, timer, resolve, reject })
      // NestJS WsAdapter 格式：{ event, data }
      ws.send(JSON.stringify({ event: 'message', data: payload }))
    })
  }

  function disconnect() {
    if (reconnectTimer) clearTimeout(reconnectTimer)
    reconnectAttempt = 0
    ws?.close()
  }

  onMounted(() => connect())
  onUnmounted(() => disconnect())

  return { status, messages, sendMessage, disconnect }
}
