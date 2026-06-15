import express from 'express'
import { exportCreative } from '../controllers/export.controller.js'

const router = express.Router()

router.get('/:id', exportCreative)

export default router
