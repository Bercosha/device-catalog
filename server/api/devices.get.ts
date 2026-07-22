import { createError, getQuery } from 'h3'
import { DevicesQuerySchema } from '../../shared/schemas/device'
import { getFilteredDevices } from '../utils/device-query'

export default defineEventHandler(event => {
  const query = DevicesQuerySchema.safeParse(getQuery(event))

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid devices query',
      data: query.error.flatten(),
    })
  }

  return getFilteredDevices(query.data)
})