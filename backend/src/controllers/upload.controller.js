import cloudinary from '../config/cloudinary.js'
import fs from 'fs'

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' })
    }

    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedFormats.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Invalid file format. Allowed: jpg, jpeg, png, webp' })
    }

    const maxSize = 5 * 1024 * 1024
    if (req.file.size > maxSize) {
      return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB' })
    }

    console.log('Uploading file:', req.file.path)
    console.log('File exists:', fs.existsSync(req.file.path))

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'creative-builder',
      resource_type: 'image'
    })

    // Clean up temp file
    fs.unlinkSync(req.file.path)

    res.status(200).json({ success: true, url: result.secure_url })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ success: false, message: error.message || 'Upload failed' })
  }
}
