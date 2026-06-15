import Creative from '../models/Creative.js'
import { generateHTML } from '../services/export.service.js'

export const exportCreative = async (req, res) => {
  try {
    const creative = await Creative.findById(req.params.id)
    if (!creative) {
      return res.status(404).json({ success: false, message: 'Creative not found' })
    }

    const html = generateHTML(creative)
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Content-Disposition', `attachment; filename="creative-${creative._id}.html"`)
    res.send(html)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
