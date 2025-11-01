import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/detail" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
