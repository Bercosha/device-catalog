<script setup lang="ts">
import styles from './ThemeToggle.module.scss'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    :class="styles['theme-toggle']"
    type="button"
    :aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleTheme"
  >
    <span :class="styles['theme-toggle__icon']">
      {{ theme === 'dark' ? '☾' : '☀' }}
    </span>

    <span :class="styles['theme-toggle__text']">
      {{ theme === 'dark' ? 'Dark' : 'Light' }}
    </span>
  </button>
</template>