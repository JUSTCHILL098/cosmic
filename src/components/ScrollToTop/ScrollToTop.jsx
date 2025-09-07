import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Wait a tick so it runs after render
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // change to "smooth" if you want animation
      });
    }, 0);
  }, [pathname]);

  return null;
}
