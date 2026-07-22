<script setup lang="ts">
import type { Device } from '../../../shared/schemas/device'
import styles from './[slug].module.scss'

const route = useRoute()

const slug = computed(() => String(route.params.slug || ''))
const imageSrc = ref('')

const badgeLabelMap = {
  top: 'Top',
  new: 'New',
  sale: 'Sale',
} as const

const { data: device, error } = await useAsyncData<Device>(
  `device-${slug.value}`,
  () => $fetch(`/api/devices/${slug.value}`)
)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 404,
    statusMessage: error.value.statusMessage || 'Device not found',
    fatal: true,
  })
}

const title = computed(() =>
  device.value ? `${device.value.brand} ${device.value.model}` : 'Device'
)

const badgeLabel = computed(() => {
  if (!device.value?.badge) return null

  return badgeLabelMap[device.value.badge]
})

watchEffect(() => {
  imageSrc.value = device.value?.image || '/img/device-placeholder.webp'
})

function handleImageError() {
  imageSrc.value = '/img/device-placeholder.webp'
}

const description = computed(() => {
  if (!device.value) return 'Device details'

  const specs = Object.values(device.value.specs).join(', ')

  return `${title.value}: ${specs}. Price ${device.value.priceMDL.toLocaleString(
    'en-US'
  )} MDL.`
})

useSeoMeta({
  title: () => `${title.value} | Mini Device Catalog`,
  description: () => description.value,
  ogTitle: () => `${title.value} | Mini Device Catalog`,
  ogDescription: () => description.value,
  ogImage: () => device.value?.image,
})
</script>

<template>
  <main v-if="device" :class="styles['device-page']">
    <div :class="styles['device-page__container']">
      <NuxtLink :class="styles['device-page__back']" to="/">
        ← Back to catalog
      </NuxtLink>

      <article :class="styles['device-page__card']">
        <div :class="styles['device-page__media']">
          <span
            v-if="device.badge"
            :class="styles['device-page__badge']"
          >
            {{ badgeLabel }}
          </span>

          <img
            :class="styles['device-page__image']"
            :src="imageSrc"
            :alt="title"
            loading="eager"
            @error="handleImageError"
          />
        </div>

        <div :class="styles['device-page__content']">
          <p :class="styles['device-page__brand']">
            {{ device.brand }}
          </p>

          <h1 :class="styles['device-page__title']">
            {{ device.model }}
          </h1>

          <p :class="styles['device-page__category']">
            {{ device.category }}
          </p>

          <div :class="styles['device-page__price-row']">
            <span :class="styles['device-page__price']">
              {{ device.priceMDL.toLocaleString('en-US') }} MDL
            </span>

            <span
              v-if="device.oldPriceMDL"
              :class="styles['device-page__old-price']"
            >
              {{ device.oldPriceMDL.toLocaleString('en-US') }} MDL
            </span>
          </div>

          <p
            :class="[
              styles['device-page__stock'],
              !device.inStock && styles['device-page__stock--out'],
            ]"
          >
            {{ device.inStock ? 'Available in stock' : 'Currently out of stock' }}
          </p>

          <section
            :class="styles['device-page__specs-section']"
            aria-labelledby="device-specs-title"
          >
            <h2
              id="device-specs-title"
              :class="styles['device-page__section-title']"
            >
              Specifications
            </h2>

            <dl :class="styles['device-page__specs']">
              <div
                v-for="(value, key) in device.specs"
                :key="key"
                :class="styles['device-page__spec']"
              >
                <dt :class="styles['device-page__spec-key']">
                  {{ key }}
                </dt>

                <dd :class="styles['device-page__spec-value']">
                  {{ value }}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </article>
    </div>
  </main>
</template>