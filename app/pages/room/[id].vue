<template>
  <div class="min-h-dvh bg-slate-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden" style="height: 90dvh">

      <!-- Header -->
      <header class="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <NuxtLink to="/" class="text-slate-400 hover:text-slate-600 transition-colors mr-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </NuxtLink>
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
          :style="{ backgroundColor: room?.avatarColor ?? '#94a3b8' }"
        >
          {{ room?.name[0] }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-slate-800 leading-tight">{{ room?.name }}</p>
          <p class="text-xs text-slate-400">{{ members.length }} 位成員在線上</p>
        </div>
        <span :class="['w-2 h-2 rounded-full shrink-0', statusDotClass]" />
      </header>

      <!-- Members bar -->
      <div v-if="members.length" class="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <span
          v-for="member in members"
          :key="member"
          class="text-xs bg-white border border-slate-200 rounded-full px-2 py-0.5 text-slate-600 shrink-0"
          :class="{ 'font-semibold text-blue-500 border-blue-200': member === senderId }"
        >
          {{ member === senderId ? '我' : member }}
        </span>
      </div>

      <!-- Messages -->
      <div ref="messageListEl" class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="['flex gap-2', msg.senderId === senderId ? 'flex-row-reverse' : 'flex-row']"
        >
          <!-- Avatar -->
          <div
            v-if="msg.senderId !== senderId"
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            :style="{ backgroundColor: avatarColor(msg.senderId) }"
          >
            {{ msg.senderId[0] }}
          </div>

          <div :class="['flex flex-col gap-1 max-w-[70%]', msg.senderId === senderId ? 'items-end' : 'items-start']">
            <div class="flex items-baseline gap-2" :class="msg.senderId === senderId ? 'flex-row-reverse' : 'flex-row'">
              <span v-if="msg.senderId !== senderId" class="text-xs text-slate-500">{{ msg.senderId }}</span>
              <span class="text-xs text-slate-400">{{ formatTime(msg.timestamp) }}</span>
            </div>
            <div
              :class="[
                'px-3 py-2 rounded-2xl text-sm',
                msg.senderId === senderId
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              ]"
            >
              {{ msg.content }}
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <ChatInput :disabled="status !== 'connected'" @send="handleSend" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from '~/composables/useWebSocket'

const route = useRoute()
const roomId = route.params.id as string

const config = useRuntimeConfig()
const senderId = 'user-' + Math.random().toString(36).slice(2, 7)

const { data: room } = await useFetch<{ id: string; name: string; description: string; avatarColor: string }>(
  `${config.public.apiBase}/rooms/${roomId}`
)

const { status, messages, members, sendMessage } = useWebSocket(`${config.public.wsBase}/chat`, { roomId, senderId })

const messageListEl = ref<HTMLElement | null>(null)

watch(messages, async () => {
  await nextTick()
  if (messageListEl.value) {
    messageListEl.value.scrollTop = messageListEl.value.scrollHeight
  }
}, { deep: true })

const statusDotClass = computed(() => ({
  connected: 'bg-green-400',
  connecting: 'bg-yellow-400',
  reconnecting: 'bg-yellow-400',
  disconnected: 'bg-slate-300',
}[status.value]))

const colorPalette = ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899']

function avatarColor(id: string) {
  let hash = 0
  for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
  return colorPalette[Math.abs(hash) % colorPalette.length]
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
}

async function handleSend(content: string) {
  try {
    await sendMessage(content)
  } catch (err) {
    console.error('訊息發送失敗：', err)
  }
}
</script>
