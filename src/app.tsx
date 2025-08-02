import './app.css';
import Header from './components/header/header';
import AboutPage from './pages/about/about';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import BlogPage from './pages/blog/blog';
import PostPage from './pages/post/post';
import { ParticleBackground } from './components/particle-background/particle-background';
import { PageTransition } from './components/page-transition/page-transition';

export function App() {
  return (
    <Router>
      <ParticleBackground />
      <Header />
      <PageTransition>
        <main>
          <Routes>
            <Route path="/" element={<BlogPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/post/:slug" element={<PostPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </PageTransition>
    </Router>
  )
}
