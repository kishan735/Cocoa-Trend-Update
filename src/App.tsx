import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { DetailView } from './pages/DetailView';
import { NewsList } from './pages/NewsList';
import { FactorsList } from './pages/FactorsList';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/detail/:type/:id?" element={<DetailView />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/factors" element={<FactorsList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
