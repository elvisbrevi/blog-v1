import './app.css';
import Header from './components/header/header';
import AboutPage from './pages/about/about';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import BlogPage from './pages/blog/blog';
import Post from './pages/post/post';

export function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" index element={<BlogPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </Router>
  )
}
