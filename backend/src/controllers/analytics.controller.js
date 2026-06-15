import Impression from '../models/Impression.js'
import Creative from '../models/Creative.js'

export const getAnalyticsOverview = async (req, res) => {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const [totalCreatives, totalImpressions, recentImpressions, mostViewed] = await Promise.all([
      Creative.countDocuments(),
      Impression.countDocuments(),
      Impression.countDocuments({ createdAt: { $gte: since24h } }),
      Impression.aggregate([
        { $group: { _id: '$creativeId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'creatives',
            localField: '_id',
            foreignField: '_id',
            as: 'creative'
          }
        },
        { $unwind: { path: '$creative', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1, count: 1, name: '$creative.name' } }
      ])
    ])

    const mostViewedCreative = mostViewed.length > 0
      ? { id: mostViewed[0]._id, name: mostViewed[0].name || 'Unknown', impressions: mostViewed[0].count }
      : null

    res.status(200).json({
      success: true,
      data: { totalCreatives, totalImpressions, mostViewedCreative, recentImpressions }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getTotalAnalytics = async (req, res) => {
  try {
    const { creativeId } = req.params
    const totalImpressions = await Impression.countDocuments({ creativeId })
    res.status(200).json({ success: true, totalImpressions })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getHourlyAnalytics = async (req, res) => {
  try {
    const { creativeId } = req.params
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const impressions = await Impression.find({
      creativeId,
      createdAt: { $gte: since }
    })

    const hourlyMap = {}
    for (let i = 0; i < 24; i++) {
      const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
      const key = `${hour.getHours()}:00`
      hourlyMap[key] = 0
    }

    impressions.forEach(imp => {
      const key = `${new Date(imp.createdAt).getHours()}:00`
      if (hourlyMap[key] !== undefined) hourlyMap[key]++
    })

    const data = Object.entries(hourlyMap).map(([hour, impressions]) => ({ hour, impressions }))
    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getDailyAnalytics = async (req, res) => {
  try {
    const { creativeId } = req.params
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const impressions = await Impression.find({
      creativeId,
      createdAt: { $gte: since }
    })

    const dailyMap = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      dailyMap[key] = 0
    }

    impressions.forEach(imp => {
      const key = new Date(imp.createdAt).toISOString().split('T')[0]
      if (dailyMap[key] !== undefined) dailyMap[key]++
    })

    const data = Object.entries(dailyMap).map(([date, impressions]) => ({ date, impressions }))
    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getRangeAnalytics = async (req, res) => {
  try {
    const { creativeId } = req.params
    const { startDate, endDate } = req.query

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'startDate and endDate are required' })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59, 999)

    const impressions = await Impression.find({
      creativeId,
      createdAt: { $gte: start, $lte: end }
    })

    const dailyMap = {}
    const current = new Date(start)
    while (current <= end) {
      const key = current.toISOString().split('T')[0]
      dailyMap[key] = 0
      current.setDate(current.getDate() + 1)
    }

    impressions.forEach(imp => {
      const key = new Date(imp.createdAt).toISOString().split('T')[0]
      if (dailyMap[key] !== undefined) dailyMap[key]++
    })

    const data = Object.entries(dailyMap).map(([date, impressions]) => ({ date, impressions }))
    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
