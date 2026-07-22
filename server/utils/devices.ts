import rawDevices from '../../shared/data/devices.json'
import {
  DeviceSchema,
  DevicesSchema,
  type Device,
} from '../../shared/schemas/device'

let cachedDevices: Device[] | null = null

export function getDevices(): Device[] {
  if (!cachedDevices) {
    cachedDevices = DevicesSchema.parse(rawDevices)
  }

  return cachedDevices
}

export function getDeviceBySlug(slug: string): Device | null {
  const device = getDevices().find(device => device.slug === slug)

  if (!device) return null

  return DeviceSchema.parse(device)
}

export function getAvailableBrands(): string[] {
  return Array.from(new Set(getDevices().map(device => device.brand))).sort(
    (a, b) => a.localeCompare(b)
  )
}

export function getAvailablePriceRange() {
  const prices = getDevices().map(device => device.priceMDL)

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}