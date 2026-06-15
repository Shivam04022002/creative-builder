import express from 'express'
import { createImpression } from '../controllers/impression.controller.js'

const router = express.Router()

router.post('/', createImpression)

export default router
