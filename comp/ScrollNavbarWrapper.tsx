"use client";

import React, { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const ScrollNavbarWrapper = ({ children }: Props) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const isMobileMenuOpen =
        window.getComputedStyle(document.body).overflow === "hidden";
      if (isMobileMenuOpen) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`w-full transition-transform duration-300 ease-in-out relative z-[10000] ${
        showNavbar ? "" : "-translate-y-full"
      }`}
    >
      {children}
    </div>
  );
};

export default ScrollNavbarWrapper;
