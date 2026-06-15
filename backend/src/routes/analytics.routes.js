import express from 'express'
import {
  getAnalyticsOverview,
  getTotalAnalytics,
  getHourlyAnalytics,
  getDailyAnalytics,
  getRangeAnalytics
} from '../controllers/analytics.controller.js'

const router = express.Router()

router.get('/overview', getAnalyticsOverview)
router.get('/:creativeId/total', getTotalAnalytics)
router.get('/:creativeId/hourly', getHourlyAnalytics)
router.get('/:creativeId/daily', getDailyAnalytics)
router.get('/:creativeId/range', getRangeAnalytics)

export default router
