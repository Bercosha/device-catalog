<script setup lang="ts">
import styles from './error.module.scss'

const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const isNotFound = computed(() => props.error.statusCode === 404)

const title = computed(() =>
  isNotFound.value ? 'Page not found' : 'Something went wrong'
)

const description = computed(() =>
  isNotFound.value
    ? 'The device or page you are looking for does not exist.'
    : props.error.statusMessage || props.error.message || 'Unexpected error occurred.'
)

function handleBackHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <main :class="styles['error-page']">
    <section :class="styles['error-page__card']">
      <p :class="styles['error-page__code']">
        {{ error.statusCode || 500 }}
      </p>

      <h1 :class="styles['error-page__title']">
        {{ title }}
      </h1>

      <p :class="styles['error-page__description']">
        {{ description }}
      </p>

      <button
        :class="styles['error-page__button']"
        type="button"
        @click="handleBackHome"
      >
        Back to catalog
      </button>
    </section>
  </main>
</template>