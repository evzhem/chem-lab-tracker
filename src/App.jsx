import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Calculator from './pages/Calculator'
import Experiment from './pages/Experiment'
import Journal from './pages/Journal'
import PeriodicTable from './pages/PeriodicTable'
import Reactions from './pages/Reactions'
import Safety from './pages/Safety'
import Schemes from './pages/Schemes'
import Settings from './pages/Settings'
import Solubility from './pages/Solubility'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Reactions />} />
          <Route path="table" element={<PeriodicTable />} />
          <Route path="solubility" element={<Solubility />} />
          <Route path="calc" element={<Calculator />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="journal" element={<Journal />} />
          <Route path="exp/:id" element={<Experiment />} />
          <Route path="settings" element={<Settings />} />
          <Route path="install" element={<Navigate to="/settings" replace />} />
          <Route path="safety" element={<Safety />} />
          <Route path="ref" element={<Navigate to="/schemes" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
