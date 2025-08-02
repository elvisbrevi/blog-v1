import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './page-transition.css';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`page-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {children}
    </div>
  );
};