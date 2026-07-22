import type {
  DevicesQuery,
  DevicesResponse,
} from '../../shared/schemas/device'
import {
  getAvailableBrands,
  getAvailablePriceRange,
  getDevices,
} from './devices'

export function getFilteredDevices(query: DevicesQuery): DevicesResponse {
  const allDevices = getDevices()

  let items = [...allDevices]

  if (query.brand.length) {
    items = items.filter(device => query.brand.includes(device.brand))
  }

  if (typeof query.minPrice === 'number') {
    items = items.filter(device => device.priceMDL >= query.minPrice!)
  }

  if (typeof query.maxPrice === 'number') {
    items = items.filter(device => device.priceMDL <= query.maxPrice!)
  }

  if (query.sort === 'price-asc') {
    items.sort((a, b) => a.priceMDL - b.priceMDL)
  }

  if (query.sort === 'price-desc') {
    items.sort((a, b) => b.priceMDL - a.priceMDL)
  }

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / query.perPage))
  const page = Math.min(query.page, totalPages)

  const startIndex = (page - 1) * query.perPage
  const paginatedItems = items.slice(startIndex, startIndex + query.perPage)

  return {
    items: paginatedItems,
    total,
    page,
    perPage: query.perPage,
    totalPages,
    availableFilters: {
      brands: getAvailableBrands(),
      price: getAvailablePriceRange(),
    },
  }
}