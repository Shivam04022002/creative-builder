import Creative from '../models/Creative.js'

export const getCreatives = async (req, res) => {
  try {
    const creatives = await Creative.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: creatives })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getCreativeById = async (req, res) => {
  try {
    const creative = await Creative.findById(req.params.id)
    if (!creative) {
      return res.status(404).json({ success: false, message: 'Creative not found' })
    }
    res.status(200).json({ success: true, data: creative })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createCreative = async (req, res) => {
  try {
    const { name, canvas, layers } = req.body
    if (!name || !canvas) {
      return res.status(400).json({ success: false, message: 'Name and canvas are required' })
    }
    const creative = await Creative.create({ name, canvas, layers: layers || [] })
    res.status(201).json({ success: true, data: creative })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateCreative = async (req, res) => {
  try {
    const creative = await Creative.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!creative) {
      return res.status(404).json({ success: false, message: 'Creative not found' })
    }
    res.status(200).json({ success: true, data: creative })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteCreative = async (req, res) => {
  try {
    const creative = await Creative.findByIdAndDelete(req.params.id)
    if (!creative) {
      return res.status(404).json({ success: false, message: 'Creative not found' })
    }
    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
