<script setup lang="ts">
import styles from './Pagination.module.scss'

const props = defineProps<{
  page: number
  totalPages: number
}>()

const { updateQuery } = useDeviceQuery()

const pages = computed(() =>
  Array.from({ length: props.totalPages }, (_, index) => index + 1)
)

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === props.page) return

  updateQuery({ page })
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    :class="styles.pagination"
    aria-label="Catalog pagination"
  >
    <button
      :class="styles.pagination__button"
      type="button"
      :disabled="page <= 1"
      @click="goToPage(page - 1)"
    >
      Previous
    </button>

    <div :class="styles.pagination__pages">
      <button
        v-for="pageNumber in pages"
        :key="pageNumber"
        :class="[
          styles.pagination__page,
          pageNumber === page && styles['pagination__page--active'],
        ]"
        type="button"
        :aria-current="pageNumber === page ? 'page' : undefined"
        @click="goToPage(pageNumber)"
      >
        {{ pageNumber }}
      </button>
    </div>

    <button
      :class="styles.pagination__button"
      type="button"
      :disabled="page >= totalPages"
      @click="goToPage(page + 1)"
    >
      Next
    </button>
  </nav>
</template>