import type {
  DevicesQuery,
  DevicesResponse,
} from '../../shared/schemas/device'
import {
  getAvailableBrands,
  getAvailablePriceRange,
  getDevices,
} from './devices'

function sortByStock(
  a: { inStock: boolean },
  b: { inStock: boolean }
) {
  return Number(b.inStock) - Number(a.inStock)
}

export function getFilteredDevices(query: DevicesQuery): DevicesResponse {
  const allDevices = getDevices()

  const {
    brand,
    minPrice,
    maxPrice,
    sort,
    page: requestedPage,
    perPage,
  } = query

  let items = [...allDevices]

  if (brand.length) {
    items = items.filter(device => brand.includes(device.brand))
  }

  if (typeof minPrice === 'number') {
    items = items.filter(device => device.priceMDL >= minPrice)
  }

  if (typeof maxPrice === 'number') {
    items = items.filter(device => device.priceMDL <= maxPrice)
  }

  if (sort === 'price-asc') {
    items.sort((a, b) => sortByStock(a, b) || a.priceMDL - b.priceMDL)
  } else if (sort === 'price-desc') {
    items.sort((a, b) => sortByStock(a, b) || b.priceMDL - a.priceMDL)
  } else {
    items.sort(sortByStock)
  }

  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const page = Math.min(requestedPage, totalPages)

  const startIndex = (page - 1) * perPage
  const paginatedItems = items.slice(startIndex, startIndex + perPage)

  return {
    items: paginatedItems,
    total,
    page,
    perPage,
    totalPages,
    availableFilters: {
      brands: getAvailableBrands(),
      price: getAvailablePriceRange(),
    },
  }
}