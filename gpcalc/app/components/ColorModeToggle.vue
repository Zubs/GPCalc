<template>
  <button class="color-toggle" @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'" :aria-label="`Switch to ${$colorMode.value === 'dark' ? 'light' : 'dark'} mode`">
    <svg v-if="$colorMode.value === 'dark'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </button>
</template>

<style scoped>
.color-toggle {
  width: 34px; height: 34px; border-radius: var(--radius-md);
  background: var(--bg-elevated); border: 1px solid var(--border);
  color: var(--text-secondary);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.color-toggle:hover { color: var(--text-primary); background: var(--bg-overlay); }
</style>
