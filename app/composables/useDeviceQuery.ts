import type { LocationQueryRaw } from 'vue-router'

export type SortValue = 'price-asc' | 'price-desc' | undefined

export interface DeviceCatalogQuery {
  brand: string[]
  minPrice?: number
  maxPrice?: number
  sort?: SortValue
  page: number
  perPage: number
}

function normalizeArrayParam(value: unknown): string[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
      .flatMap(item => String(item).split(','))
      .map(item => item.trim())
      .filter(Boolean)
  }

  return String(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

function normalizeNumberParam(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined

  const parsed = Number(value)

  if (Number.isNaN(parsed)) return undefined

  return parsed
}

export function useDeviceQuery() {
  const route = useRoute()
  const router = useRouter()

  const query = computed<DeviceCatalogQuery>(() => ({
    brand: normalizeArrayParam(route.query.brand),
    minPrice: normalizeNumberParam(route.query.minPrice),
    maxPrice: normalizeNumberParam(route.query.maxPrice),
    sort: (route.query.sort as SortValue) || undefined,
    page: normalizeNumberParam(route.query.page) || 1,
    perPage: normalizeNumberParam(route.query.perPage) || 8,
  }))

  function updateQuery(patch: Partial<DeviceCatalogQuery>) {
    const nextQuery: DeviceCatalogQuery = {
      ...query.value,
      ...patch,
    }

    const rawQuery: LocationQueryRaw = {
      ...(nextQuery.brand.length ? { brand: nextQuery.brand } : {}),
      ...(typeof nextQuery.minPrice === 'number'
        ? { minPrice: String(nextQuery.minPrice) }
        : {}),
      ...(typeof nextQuery.maxPrice === 'number'
        ? { maxPrice: String(nextQuery.maxPrice) }
        : {}),
      ...(nextQuery.sort ? { sort: nextQuery.sort } : {}),
      ...(nextQuery.page > 1 ? { page: String(nextQuery.page) } : {}),
      ...(nextQuery.perPage !== 8 ? { perPage: String(nextQuery.perPage) } : {}),
    }

    return router.replace({ query: rawQuery })
  }

  function resetFilters() {
    return router.replace({
      query: {
        perPage: String(query.value.perPage),
      },
    })
  }

  return {
    query,
    updateQuery,
    resetFilters,
  }
}