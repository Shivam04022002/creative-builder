import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import errorHandler from './middleware/errorHandler.js'
import healthRoutes from './routes/health.routes.js'
import creativeRoutes from './routes/creative.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import impressionRoutes from './routes/impression.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import exportRoutes from './routes/export.routes.js'
import ensureUploadsDir from './utils/ensureUploadsDir.js'

dotenv.config()

ensureUploadsDir()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

connectDB()

app.use('/api/health', healthRoutes)
app.use('/api/creatives', creativeRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/impressions', impressionRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/export', exportRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
