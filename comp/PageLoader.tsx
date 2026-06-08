"use client";
import { useState, useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import GlobalLoader from "@components/Theme-17/comp/GlobarLoader";

interface PageLoaderProps {
  logo?: string;
}

function LoaderContent({ logo }: PageLoaderProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700); 
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (loading && mounted) {
      document.body.style.setProperty("overflow", "hidden", "important");
    } else {
      document.body.style.removeProperty("overflow");
    }
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [loading, mounted]);

  if (!mounted || !loading) return null;

  return (
    <div className="fixed inset-0 z-[10000]">
      <GlobalLoader logo={logo} /> 
    </div>
  );
}

export default function PageLoader({ logo }: PageLoaderProps) {
  return (
    <Suspense fallback={null}>
      <LoaderContent logo={logo} />
    </Suspense>
  );
}