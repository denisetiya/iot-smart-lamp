import { Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import Login  from "./pages/login"
import Notfound from "./pages/notfound"
import Consumption from "./pages/consumption"
import Schedule from "./pages/schedule"
import AboutApp from "./pages/about"

function App() {
  

  return (
    <Routes>
      <Route Component={Home} path="/" />
      <Route Component={Login} path="/login" />
      <Route Component={Consumption} path="/consumption" />
      <Route Component={Schedule} path="/schedule" />
      <Route Component={AboutApp} path="/about" />
      <Route Component={Notfound} path="*" />
    </Routes>
  )
}

export default App
