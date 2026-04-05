<template>
  <div class="min-h-dvh bg-slate-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">選擇聊天室</h1>

      <div v-if="pending" class="text-slate-400 text-sm">載入中...</div>
      <div v-else-if="error" class="text-red-400 text-sm">無法連線到伺服器</div>

      <ul v-else class="flex flex-col gap-3">
        <li v-for="room in rooms" :key="room.id">
          <NuxtLink
            :to="`/room/${room.id}`"
            class="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
              :style="{ backgroundColor: room.avatarColor }"
            >
              {{ room.name[0] }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-slate-800">{{ room.name }}</p>
              <p class="text-sm text-slate-400 truncate">{{ room.description }}</p>
            </div>
            <span class="text-xs text-slate-400 shrink-0">{{ room.memberCount }} 人在線</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: rooms, pending, error } = await useFetch<Room[]>('http://localhost:3001/rooms')

interface Room {
  id: string
  name: string
  description: string
  avatarColor: string
  memberCount: number
}
</script>
