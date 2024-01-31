import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Step1 from './pages/Step1'
import Step2 from './pages/Step2'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Step1 />} />
        <Route path="/step2" element={<Step2 />} />
      </Routes>
    </BrowserRouter>
    )

}

export default App
