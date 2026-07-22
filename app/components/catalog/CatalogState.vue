<script setup lang="ts">
import styles from './CatalogState.module.scss'

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div :class="styles['catalog-state']" role="status" aria-live="polite">
    <h2 :class="styles['catalog-state__title']">
      {{ title }}
    </h2>

    <p v-if="description" :class="styles['catalog-state__description']">
      {{ description }}
    </p>

    <slot />
  </div>
</template>