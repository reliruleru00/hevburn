import { HashRouter  as Router, Routes, Route } from 'react-router-dom';
import DmgCalcPage from './pages/DmgCalcPage';
import SpodSimPage from './pages/SpodSimPage';
import StyleCheckerPage from './pages/StyleCheckerPage';
import 'assets/styles/header.css';
import 'assets/styles/common.css';
import 'assets/styles/micromodal.css';
import 'assets/styles/damage.css';
import 'assets/styles/simulator.css';
import 'assets/styles/checker.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/damage" element={<DmgCalcPage />} />
        <Route path="/simulator" element={<SpodSimPage />} />
        <Route path="/checker" element={<StyleCheckerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
