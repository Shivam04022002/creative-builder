import Creative from '../models/Creative.js'

export const findAllCreatives = async () => {
  return await Creative.find().sort({ createdAt: -1 })
}

export const findCreativeById = async (id) => {
  return await Creative.findById(id)
}

export const createNewCreative = async (data) => {
  return await Creative.create(data)
}

export const updateCreativeById = async (id, data) => {
  return await Creative.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}

export const deleteCreativeById = async (id) => {
  return await Creative.findByIdAndDelete(id)
}
