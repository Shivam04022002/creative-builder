import api from './api.js'

export const getAnalyticsOverview = async () => {
  const response = await api.get('/analytics/overview')
  return response.data.data
}

export const getTotalAnalytics = async (creativeId) => {
  const response = await api.get(`/analytics/${creativeId}/total`)
  return response.data
}

export const getHourlyAnalytics = async (creativeId) => {
  const response = await api.get(`/analytics/${creativeId}/hourly`)
  return response.data
}

export const getDailyAnalytics = async (creativeId) => {
  const response = await api.get(`/analytics/${creativeId}/daily`)
  return response.data
}

export const getRangeAnalytics = async (creativeId, startDate, endDate) => {
  const response = await api.get(`/analytics/${creativeId}/range`, {
    params: { startDate, endDate }
  })
  return response.data
}
