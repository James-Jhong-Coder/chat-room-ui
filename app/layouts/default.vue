<template>
  <div class="default-layout">
    <slot />
  </div>
</template>

<style scoped>
@reference "#app.css";

.default-layout {
  @apply w-full min-h-dvh;
  @apply flex flex-col;
}

</style>
