import './app.css';
import Header from './components/header/header';
import AboutPage from './pages/about/about';
import SideProjectsPage from './pages/side-projects/side-projects';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import BlogPage from './pages/blog/blog';
import PostPage from './pages/post/post';

export function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<BlogPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/side-projects" element={<SideProjectsPage />} />
        </Routes>
      </main>
    </Router>
  )
}
