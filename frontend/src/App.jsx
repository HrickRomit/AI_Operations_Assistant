import { Navigate, Route, Routes } from 'react-router-dom';
import Documents from './pages/Documents';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/documents" replace />} />
      <Route path="/documents" element={<Documents />} />
    </Routes>
  );
}

export default App;
