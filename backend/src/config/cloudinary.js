import { v2 as cloudinary } from 'cloudinary'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.error('⚠️  Cloudinary credentials missing! Check your .env file:')
  console.error('   CLOUDINARY_CLOUD_NAME:', cloudName ? '✓' : '✗ missing')
  console.error('   CLOUDINARY_API_KEY:', apiKey ? '✓' : '✗ missing')
  console.error('   CLOUDINARY_API_SECRET:', apiSecret ? '✓' : '✗ missing')
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

export default cloudinary
