import api from './api.js'

export const getCreatives = async () => {
  const response = await api.get('/creatives')
  return response.data.data
}

export const getCreativeById = async (id) => {
  const response = await api.get(`/creatives/${id}`)
  return response.data.data
}

export const createCreative = async (creativeData) => {
  const response = await api.post('/creatives', creativeData)
  return response.data.data
}

export const updateCreative = async (id, creativeData) => {
  const response = await api.put(`/creatives/${id}`, creativeData)
  return response.data.data
}

export const deleteCreative = async (id) => {
  const response = await api.delete(`/creatives/${id}`)
  return response.data.data
}
