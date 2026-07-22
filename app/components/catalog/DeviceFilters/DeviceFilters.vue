<script setup lang="ts">
import styles from './DeviceFilters.module.scss'

type SortSelectValue = '' | 'price-asc' | 'price-desc'

defineProps<{
  availableFilters: {
    brands: string[]
    price: {
      min: number
      max: number
    }
  }
}>()

const { query, updateQuery, resetFilters } = useDeviceQuery()
function isSortSelectValue(value: string): value is SortSelectValue {
  return value === '' || value === 'price-asc' || value === 'price-desc'
}

const selectedBrands = computed({
  get: () => query.value.brand,
  set: brand => updateQuery({ brand, page: 1 }),
})

const minPrice = computed({
  get: () => query.value.minPrice,
  set: minPrice => updateQuery({ minPrice, page: 1 }),
})

const maxPrice = computed({
  get: () => query.value.maxPrice,
  set: maxPrice => updateQuery({ maxPrice, page: 1 }),
})

const sort = computed({
  get: () => query.value.sort || '',
  set: value =>
    updateQuery({
      sort: value === 'price-asc' || value === 'price-desc' ? value : undefined,
      page: 1,
    }),
})

const perPage = computed({
  get: () => query.value.perPage,
  set: value => updateQuery({ perPage: Number(value), page: 1 }),
})

function toggleBrand(brand: string) {
  const nextBrands = selectedBrands.value.includes(brand)
    ? selectedBrands.value.filter(item => item !== brand)
    : [...selectedBrands.value, brand]

  selectedBrands.value = nextBrands
}

function updateMinPrice(event: Event) {
  const value = (event.target as HTMLInputElement).value

  minPrice.value = value ? Number(value) : undefined
}

function updateMaxPrice(event: Event) {
  const value = (event.target as HTMLInputElement).value

  maxPrice.value = value ? Number(value) : undefined
}

function updateSort(event: Event) {
  const value = (event.target as HTMLSelectElement).value

  if (!isSortSelectValue(value)) return

  sort.value = value
}

function updatePerPage(event: Event) {
  perPage.value = Number((event.target as HTMLSelectElement).value)
}
</script>

<template>
  <section :class="styles.filters" aria-labelledby="catalog-filters-title">
    <div :class="styles.filters__header">
      <div>
        <h2 id="catalog-filters-title" :class="styles.filters__title">
          Filters
        </h2>

        <p :class="styles.filters__description">
          Narrow down devices by brand, price and sorting.
        </p>
      </div>

      <button
        :class="styles.filters__reset"
        type="button"
        @click="resetFilters"
      >
        Reset
      </button>
    </div>

    <div :class="styles.filters__content">
      <fieldset :class="styles.filters__group">
        <legend :class="styles.filters__legend">
          Brand
        </legend>

        <div :class="styles.filters__brands">
          <label
            v-for="brand in availableFilters.brands"
            :key="brand"
            :class="[
              styles.filters__brand,
              selectedBrands.includes(brand) && styles['filters__brand--active'],
            ]"
          >
            <input
              :class="styles.filters__checkbox"
              type="checkbox"
              :value="brand"
              :checked="selectedBrands.includes(brand)"
              @change="toggleBrand(brand)"
            />

            <span>{{ brand }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset :class="styles.filters__group">
        <legend :class="styles.filters__legend">
          Price, MDL
        </legend>

        <div :class="styles.filters__price">
          <label :class="styles.filters__field">
            <span :class="styles.filters__label">Min</span>

            <input
              :class="styles.filters__input"
              type="number"
              inputmode="numeric"
              :min="availableFilters.price.min"
              :max="availableFilters.price.max"
              :placeholder="String(availableFilters.price.min)"
              :value="minPrice"
              @input="updateMinPrice"
            />
          </label>

          <label :class="styles.filters__field">
            <span :class="styles.filters__label">Max</span>

            <input
              :class="styles.filters__input"
              type="number"
              inputmode="numeric"
              :min="availableFilters.price.min"
              :max="availableFilters.price.max"
              :placeholder="String(availableFilters.price.max)"
              :value="maxPrice"
              @input="updateMaxPrice"
            />
          </label>
        </div>
      </fieldset>

      <label :class="styles.filters__field">
        <span :class="styles.filters__legend">Sort</span>

        <select
          :class="styles.filters__select"
          :value="sort"
          @change="updateSort"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </label>

      <label :class="styles.filters__field">
        <span :class="styles.filters__legend">Per page</span>

        <select
          :class="styles.filters__select"
          :value="perPage"
          @change="updatePerPage"
        >
          <option :value="4">4</option>
          <option :value="8">8</option>
          <option :value="12">12</option>
        </select>
      </label>
    </div>
  </section>
</template>