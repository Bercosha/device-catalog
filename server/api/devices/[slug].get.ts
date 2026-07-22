import { createError, getRouterParam } from 'h3'
import { getDeviceBySlug } from '../../utils/devices'

export default defineEventHandler(event => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Device slug is required',
    })
  }

  const device = getDeviceBySlug(slug)

  if (!device) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Device not found',
    })
  }

  return device
})