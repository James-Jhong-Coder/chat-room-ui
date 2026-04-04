<template>
  <form class="message-input" @submit.prevent="submit">
    <input v-model="text" :disabled="disabled" placeholder="輸入訊息..." />
    <button type="submit" :disabled="disabled || !text.trim()">送出</button>
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
