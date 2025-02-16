import { BrowserRouter, Routes, Route } from "react-router-dom"
import Timer from "./pages/Timer"
import Auth from "./pages/Auth"
import TimerResult from "./pages/TimerResult"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Timer />} />
        <Route path="/login" element={<Auth />}></Route>
        <Route path="/result" element={<TimerResult />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

