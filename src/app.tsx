import './app.css';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration, useLocation } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { Loading } from './components/loading/loading';
import BlogPage from './pages/blog/blog';
import NotFoundPage from './pages/not-found/not-found';
import ErrorPage from './pages/not-found/error-page';

// Loaded on demand, so the post list doesn't download the markdown renderer
// and the syntax highlighter.
const PostPage = lazy(() => import('./pages/post/post'));
const AboutPage = lazy(() => import('./pages/about/about'));
const SideProjectsPage = lazy(() => import('./pages/side-projects/side-projects'));

function Layout() {
  const { pathname } = useLocation();

  return (
    <>
      <Header />
      <main>
        {/* Keyed by path so each page gets its own loading state. */}
        <Suspense key={pathname} fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        // Render errors show up inside the layout, below the header.
        errorElement: <ErrorPage />,
        children: [
          { path: '/', element: <BlogPage /> },
          { path: '/blog', element: <BlogPage /> },
          { path: '/post/:slug', element: <PostPage /> },
          { path: '/about', element: <AboutPage /> },
          { path: '/side-projects', element: <SideProjectsPage /> },
          { path: '*', element: <NotFoundPage /> }
        ]
      }
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
