<script setup lang="ts">
import type { Device } from '../../../../shared/schemas/device'
import DeviceCard from '../DeviceCard/DeviceCard.vue'
import styles from './DeviceGrid.module.scss'

defineProps<{
  items: Device[]
}>()
</script>

<template>
  <div :class="styles['device-grid']">
    <DeviceCard
      v-for="device in items"
      :key="device.id"
      :device="device"
    />
  </div>
</template>