import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets window scroll position to the top on every route change.
 * Works with HashRouter and BrowserRouter. Kept simple/instant to avoid odd animations.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Wait a tick to ensure new content has mounted, then jump to top
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, [pathname, search]);

  return null;
}
