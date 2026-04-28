import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "@/lib/tracking";

/**
 * Tracks SPA pageviews on route change.
 * Mount once at app root inside <BrowserRouter>.
 */
export const usePageTracking = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;
    trackEvent("pageview", {
      path: location.pathname,
      metadata: { search: location.search || undefined },
    });
  }, [location.pathname, location.search]);
};