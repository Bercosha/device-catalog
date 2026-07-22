<script setup lang="ts">
import type { PropType } from 'vue'
import type { Device } from '../../../../shared/schemas/device'
import styles from './DeviceCard.module.scss'

const props = defineProps({
  device: {
    type: Object as PropType<Device>,
    required: true,
  },
})

const device = computed(() => props.device)

const deviceHref = computed(() => `/devices/${device.value.slug}`)
const title = computed(() => `${device.value.brand} ${device.value.model}`)

const badgeLabelMap = {
  top: 'Top',
  new: 'New',
  sale: 'Sale',
} as const
</script>

<template>
  <article :class="styles['device-card']">
    <NuxtLink
      :class="styles['device-card__link']"
      :to="deviceHref"
      :aria-label="title"
    >
      <div :class="styles['device-card__media']">
        <span
          v-if="device.badge"
          :class="styles['device-card__badge']"
        >
          {{ badgeLabelMap[device.badge] }}
        </span>

        <img
          :class="styles['device-card__image']"
          :src="device.image"
          :alt="title"
          loading="lazy"
        />
      </div>

      <div :class="styles['device-card__content']">
        <div :class="styles['device-card__top']">
          <p :class="styles['device-card__brand']">
            {{ device.brand }}
          </p>

          <h2 :class="styles['device-card__title']">
            {{ device.model }}
          </h2>
        </div>

        <ul :class="styles['device-card__specs']">
          <li
            v-for="(value, key) in device.specs"
            :key="key"
            :class="styles['device-card__spec']"
          >
            <span :class="styles['device-card__spec-key']">
              {{ key }}
            </span>

            <span :class="styles['device-card__spec-value']">
              {{ value }}
            </span>
          </li>
        </ul>

        <div :class="styles['device-card__bottom']">
          <div :class="styles['device-card__price-box']">
            <span :class="styles['device-card__price']">
              {{ device.priceMDL.toLocaleString('en-US') }} MDL
            </span>

            <span
              v-if="device.oldPriceMDL"
              :class="styles['device-card__old-price']"
            >
              {{ device.oldPriceMDL.toLocaleString('en-US') }} MDL
            </span>
          </div>

          <span
            :class="[
              styles['device-card__stock'],
              !device.inStock && styles['device-card__stock--out'],
            ]"
          >
            {{ device.inStock ? 'In stock' : 'Out of stock' }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>