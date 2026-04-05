<template>
  <form
    class="bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-3 shrink-0"
    @submit.prevent="submit"
  >
    <input
      v-model="text"
      :disabled="disabled"
      placeholder="輸入訊息..."
      class="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none disabled:opacity-50"
    />
    <CommonButton
      type="submit"
      :disabled="disabled || !text.trim()"
      class="w-9 h-9"
    >
      <svg class="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </CommonButton>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ disabled: boolean }>()
const emit = defineEmits<{ send: [content: string] }>()

const text = ref('')

function submit() {
  if (!text.value.trim() || props.disabled) return
  emit('send', text.value.trim())
  text.value = ''
}
</script>
