import { HashRouter  as Router, Routes, Route } from 'react-router-dom';
import DmgCalcPage from './pages/DmgCalcPage';
import SpodSimPage from './pages/SpodSimPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DmgCalcPage />} />
        <Route path="/spod_sim" element={<SpodSimPage />} />
      </Routes>
    </Router>
  );
}

export default App;
