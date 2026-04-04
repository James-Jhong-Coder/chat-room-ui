<template>
  <div class="chat-room">
    <header>
      <span>聊天室</span>
      <span :class="`status status--${status}`">{{ status }}</span>
    </header>

    <ChatMessageList :messages="messages" />
    <ChatMessageInput :disabled="status !== 'connected'" @send="handleSend" />
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from "~/composables/useWebSocket";

const WS_URL = "ws://localhost:3001/chat";
const ROOM_ID = "room-1";
const SENDER_ID = "user-" + Math.random().toString(36).slice(2, 7);

const { status, messages, sendMessage } = useWebSocket(WS_URL, {
  roomId: ROOM_ID,
  senderId: SENDER_ID,
});

async function handleSend(content: string) {
  try {
    await sendMessage(content);
  } catch (err) {
    console.error("訊息發送失敗：", err);
  }
}
</script>
