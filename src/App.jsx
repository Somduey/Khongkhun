import Login from './components/Loginpage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Test from './components/KhongKhunHome.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </Router>
  )
}

export default App
