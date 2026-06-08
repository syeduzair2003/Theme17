"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

interface GlobalLoaderProps {
  logo?: string;
}

const GlobalLoader = ({ logo }: GlobalLoaderProps) => {
  // Function to ensure path is always absolute
  const formatLogoPath = (path?: string) => {
    if (!path) return "/logo.png";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
      return path;
    }
    return `/${path}`; // Prepend slash if it's a relative path
  };

  const [imgSrc, setImgSrc] = useState<string>(formatLogoPath(logo));

  // Sync state if the logo prop changes dynamically
  useEffect(() => {
    setImgSrc(formatLogoPath(logo));
  }, [logo]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#FDFCF0]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_40%,_rgba(128,0,0,0.03)_100%)] pointer-events-none" />

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-36 h-36 md:w-48 md:h-48 flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.05, 0.12, 0.05],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-[#800000] rounded-full blur-[50px] -z-10"
          />

          <div className="relative w-28 h-28 md:w-36 md:h-36 z-10">
            {imgSrc && (
              <Image
                src={imgSrc}
                alt="Logo"
                fill
                className="object-contain brightness-[1.02]"
                priority
                unoptimized
                onError={() => {
                  // If the provided logo fails to load, fallback to default immediately
                  setImgSrc("/logo.png");
                }}
              />
            )}
          </div>
        </motion.div>

        <div className="mt-8 relative overflow-hidden">
          <div className="w-24 h-[1px] bg-[#800000]/10 rounded-full" />
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 h-full w-full bg-gradient-to-r from-transparent via-[#800000] to-transparent"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-10 w-px h-12 bg-gradient-to-b from-transparent via-[#800000]/20 to-transparent"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-10 w-px h-12 bg-gradient-to-t from-transparent via-[#800000]/20 to-transparent"
      />
    </motion.div>
  );
};

export default GlobalLoader;