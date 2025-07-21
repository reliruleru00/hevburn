import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DamageCalc from './pages/DamageCalculation';
import SpodSim from './pages/SpodSimulation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DamageCalc />} />
        <Route path="/spod_sim" element={<SpodSim />} />
      </Routes>
    </Router>
  );
}

export default App;
