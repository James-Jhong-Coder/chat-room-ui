<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[baseClass, variantClass, disabledClass]"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  disabled: false,
  type: 'button',
})

const baseClass = 'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none'

const variantClass = computed(() => ({
  primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300',
  ghost: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100',
}[props.variant]))

const disabledClass = computed(() => props.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '')
</script>
