import Impression from '../models/Impression.js'
import Creative from '../models/Creative.js'

export const createImpression = async (req, res) => {
  try {
    const { creativeId } = req.body
    if (!creativeId) {
      return res.status(400).json({ success: false, message: 'creativeId is required' })
    }

    const creative = await Creative.findById(creativeId)
    if (!creative) {
      return res.status(404).json({ success: false, message: 'Creative not found' })
    }

    const impression = await Impression.create({ creativeId })
    res.status(201).json({ success: true, data: impression })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
