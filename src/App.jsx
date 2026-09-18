import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Calculator from './pages/Calculator'
import Experiment from './pages/Experiment'
import Journal from './pages/Journal'
import Reference from './pages/Reference'
import Safety from './pages/Safety'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Journal />} />
          <Route path="exp/:id" element={<Experiment />} />
          <Route path="calc" element={<Calculator />} />
          <Route path="ref" element={<Reference />} />
          <Route path="safety" element={<Safety />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
