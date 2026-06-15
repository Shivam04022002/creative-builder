import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getTotalAnalytics, getHourlyAnalytics, getDailyAnalytics, getRangeAnalytics } from '../services/analyticsService.js'

const Analytics = () => {
  const { creativeId } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalImpressions, setTotalImpressions] = useState(0)
  const [hourlyData, setHourlyData] = useState([])
  const [dailyData, setDailyData] = useState([])
  const [rangeData, setRangeData] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isRangeLoading, setIsRangeLoading] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        setError('')
        const [totalRes, hourlyRes, dailyRes] = await Promise.all([
          getTotalAnalytics(creativeId),
          getHourlyAnalytics(creativeId),
          getDailyAnalytics(creativeId)
        ])
        setTotalImpressions(totalRes.totalImpressions)
        setHourlyData(hourlyRes.data)
        setDailyData(dailyRes.data)
      } catch (err) {
        const status = err.response?.status
        if (status === 404) {
          setError('Creative not found. It may have been deleted.')
        } else {
          setError(err.message)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [creativeId])

  const handleApplyRange = async () => {
    if (!startDate || !endDate) return
    try {
      setIsRangeLoading(true)
      const response = await getRangeAnalytics(creativeId, startDate, endDate)
      setRangeData(response.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRangeLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <Link to="/creatives" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Back to Creatives</Link>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Impressions</h3>
          <p className="text-4xl font-bold text-primary-600">{totalImpressions.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hourly Impressions (Last 24h)</h3>
          {hourlyData.length === 0 ? <p className="text-gray-500 text-center py-8">No hourly data available</p> : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="impressions" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Impressions (Last 30 days)</h3>
          {dailyData.length === 0 ? <p className="text-gray-500 text-center py-8">No daily data available</p> : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="impressions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Date Range</h3>
        <div className="flex items-end space-x-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={handleApplyRange} disabled={!startDate || !endDate || isRangeLoading} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50">
            {isRangeLoading ? 'Loading...' : 'Apply Filter'}
          </button>
        </div>
        {rangeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rangeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="impressions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">{startDate && endDate ? 'No data for selected range' : 'Select dates to view range analytics'}</p>
        )}
      </div>
    </div>
  )
}

export default Analytics
