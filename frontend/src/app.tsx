import './app.css';
import Header from './components/header/header';
import AboutPage from './pages/about/about';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

export function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/about" index element={<AboutPage />} />
        </Routes>
      </main>
    </Router>
  )
}
