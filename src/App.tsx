import { BrowserRouter, Routes, Route } from "react-router-dom";
import Timer from "./pages/Timer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Timer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
