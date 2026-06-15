import fs from 'fs'
import path from 'path'

const ensureUploadsDir = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
}

export default ensureUploadsDir
