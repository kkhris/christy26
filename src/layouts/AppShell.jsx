import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import useScrollManager from "../hooks/useScrollManager";

export default function AppShell() {
  const mainRef = useRef(null);
  const firstLoadRef = useRef(true);
  const location = useLocation();
  const navigationType = useNavigationType();

  useScrollManager(mainRef);

  useEffect(() => {
    firstLoadRef.current = false;
  }, [location.key]);

  const transition = {
    navigationType,
    isInitialLoad: firstLoadRef.current,
    routeKey: location.key || location.pathname,
  };

  return (
    <div className="app-shell">
      <span className="font-prewarm" aria-hidden="true">
        ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
      </span>
      <Sidebar />
      <main ref={mainRef} className="app-main">
        <Outlet context={{ scrollRootRef: mainRef, transition }} />
      </main>
    </div>
  );
}
