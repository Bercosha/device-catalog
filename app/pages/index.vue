<script setup lang="ts">
import type { DevicesResponse } from '../../shared/schemas/device'
import CatalogState from '../components/catalog/CatalogState.vue'
import DeviceFilters from '../components/catalog/DeviceFilters/DeviceFilters.vue'
import DeviceGrid from '../components/catalog/DeviceGrid/DeviceGrid.vue'
import Pagination from '../components/catalog/Pagination/Pagination.vue'
import ThemeToggle from '../components/theme/ThemeToggle.vue'
import styles from './index.module.scss'

const { query } = useDeviceQuery()

const apiQuery = computed(() => ({
  brand: query.value.brand,
  minPrice: query.value.minPrice,
  maxPrice: query.value.maxPrice,
  sort: query.value.sort,
  page: query.value.page,
  perPage: query.value.perPage,
}))

const { data, pending, error, refresh } = await useAsyncData<DevicesResponse>(
  'devices-catalog',
  () => $fetch('/api/devices', { query: apiQuery.value }),
  {
    watch: [apiQuery],
  }
)

useSeoMeta({
  title: 'Mini Device Catalog',
  description: 'Browse smartphones, wearables and accessories.',
  ogTitle: 'Mini Device Catalog',
  ogDescription: 'Browse smartphones, wearables and accessories.',
})
</script>

<template>
  <main :class="styles['catalog-page']">
    <div :class="styles['catalog-page__container']">
      <header :class="styles['catalog-page__hero']">
        <div>
          <p :class="styles['catalog-page__eyebrow']">
            Mini Catalog
          </p>

          <h1 :class="styles['catalog-page__title']">
            Devices for everyday life
          </h1>

          <p :class="styles['catalog-page__description']">
            Explore smartphones, wearables and accessories with server-side
            filtering, sorting and pagination.
          </p>
        </div>

        <ThemeToggle />
      </header>

      <DeviceFilters
        v-if="data"
        :available-filters="data.availableFilters"
      />

      <CatalogState
        v-if="pending && !data"
        title="Loading devices..."
        description="Please wait while we fetch the catalog."
      />

      <CatalogState
        v-else-if="error"
        title="Something went wrong"
        description="We could not load the catalog. Try again."
      >
        <button
          :class="styles['catalog-page__retry']"
          type="button"
          @click="refresh()"
        >
          Retry
        </button>
      </CatalogState>

      <CatalogState
        v-else-if="data && !data.items.length"
        title="No devices found"
        description="Try changing or resetting your filters."
      />

      <template v-else-if="data">
        <div :class="styles['catalog-page__summary']">
          <p :class="styles['catalog-page__results']">
            Showing {{ data.items.length }} of {{ data.total }} devices
          </p>
        </div>

        <DeviceGrid :items="data.items" />

        <Pagination
          :page="data.page"
          :total-pages="data.totalPages"
        />
      </template>
    </div>
  </main>
</template>