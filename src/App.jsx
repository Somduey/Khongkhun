import Login from './components/Loginpage.jsx'
import Register from './components/Register.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/KhongKhunHome.jsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Home' element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
