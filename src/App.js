import { HashRouter  as Router, Routes, Route } from 'react-router-dom';
import DmgCalcPage from './pages/DmgCalcPage';
import SpodSimPage from './pages/SpodSimPage';
import 'assets/styles/header.css';
import 'assets/styles/common.css';
import 'assets/styles/micromodal.css';
import 'assets/styles/damage.css';
import 'assets/styles/simulator.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DmgCalcPage />} />
        <Route path="/simulator" element={<SpodSimPage />} />
      </Routes>
    </Router>
  );
}

export default App;
