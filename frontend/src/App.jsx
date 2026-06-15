import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Home from './pages/Home'
import Creatives from './pages/Creatives'
import Editor from './pages/Editor'
import Preview from './pages/Preview'
import Analytics from './pages/Analytics'
import AnalyticsDashboard from './pages/AnalyticsDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="creatives" element={<Creatives />} />
        <Route path="editor/:creativeId" element={<Editor />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="analytics/:creativeId" element={<Analytics />} />
      </Route>
      <Route path="/preview/:creativeId" element={<Preview />} />
    </Routes>
  )
}

export default App
