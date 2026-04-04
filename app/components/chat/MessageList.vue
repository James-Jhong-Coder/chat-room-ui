<template>
  <ul class="message-list">
    <li v-for="msg in messages" :key="msg.id" class="message-item">
      <span class="sender">{{ msg.senderId }}</span>
      <span class="content">{{ msg.content }}</span>
      <span class="time">{{ formatTime(msg.timestamp) }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ChatMessage } from '~/types'

defineProps<{ messages: ChatMessage[] }>()

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString()
}
</script>
