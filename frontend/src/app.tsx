import './app.css';
import Header from './components/header/header';
import AboutPage from './pages/about/about';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import BlogPage from './pages/blog/blog';

export function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<BlogPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" index element={<AboutPage />} />
        </Routes>
      </main>
    </Router>
  )
}
