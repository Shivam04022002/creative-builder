import express from 'express'
import {
  getCreatives,
  getCreativeById,
  createCreative,
  updateCreative,
  deleteCreative
} from '../controllers/creative.controller.js'

const router = express.Router()

router.get('/', getCreatives)
router.get('/:id', getCreativeById)
router.post('/', createCreative)
router.put('/:id', updateCreative)
router.delete('/:id', deleteCreative)

export default router
