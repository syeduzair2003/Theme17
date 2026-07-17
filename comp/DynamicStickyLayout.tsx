"use client";
import React, { useEffect, useRef } from "react";

interface Props {
  leftTitle?: React.ReactNode;
  leftOffers: React.ReactNode;
  rightSidebar?: React.ReactNode;
  rightBanners?: React.ReactNode;
  hasBanners: boolean;
  hasSidebar: boolean;
  sidebarPosition?: "left" | "right";
  priorityColumn?: "left" | "right";
}

export default function DynamicStickyLayout({
  leftTitle,
  leftOffers,
  rightSidebar,
  rightBanners,
  hasBanners,
  hasSidebar,
  sidebarPosition = "right",
  priorityColumn,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const leftInnerRef = useRef<HTMLDivElement>(null);
  const rightInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setStatic = (el: HTMLDivElement) => {
      el.style.position = "static";
      el.style.top = "auto";
      el.style.bottom = "auto";
      el.style.width = "auto";
    };

    const setAbsoluteBottom = (el: HTMLDivElement) => {
      el.style.position = "absolute";
      el.style.top = "auto";
      el.style.bottom = "0";
      el.style.width = "100%";
    };

    const setFixed = (el: HTMLDivElement, top: number, width: number) => {
      el.style.position = "fixed";
      el.style.top = `${top}px`;
      el.style.bottom = "auto";
      el.style.width = `${width}px`;
    };

    const handleScrollAndSticky = () => {
      if (!parentRef.current || !leftRef.current || !rightRef.current) return;
      if (!leftInnerRef.current || !rightInnerRef.current) return;

      if (window.innerWidth < 1024) {
        setStatic(leftInnerRef.current);
        setStatic(rightInnerRef.current);
        return;
      }

      const parentRect = parentRef.current.getBoundingClientRect();

      const leftContentHeight = leftInnerRef.current.scrollHeight;
      const rightContentHeight = rightInnerRef.current.scrollHeight;

      const leftWidth = leftRef.current.getBoundingClientRect().width;
      const rightWidth = rightRef.current.getBoundingClientRect().width;

      const topOffset = 112;

      if (leftContentHeight === 0 || rightContentHeight === 0) {
        setStatic(leftInnerRef.current);
        setStatic(rightInnerRef.current);
        return;
      }

      const parentTop = parentRect.top;
      const parentBottom = parentRect.bottom;

      let makeLeftSticky = leftContentHeight <= rightContentHeight;

      if (priorityColumn === "left") {
        makeLeftSticky = false;
      } else if (priorityColumn === "right") {
        makeLeftSticky = true;
      }

      if (makeLeftSticky) {
        setStatic(rightInnerRef.current);

        const stickyElementBottom = topOffset + leftContentHeight;

        if (parentTop > topOffset) {
          setStatic(leftInnerRef.current);
        } else if (parentBottom <= stickyElementBottom) {
          setAbsoluteBottom(leftInnerRef.current);
        } else {
          setFixed(leftInnerRef.current, topOffset, leftWidth);
        }
      } else {
        setStatic(leftInnerRef.current);

        const stickyElementBottom = topOffset + rightContentHeight;

        if (parentTop > topOffset) {
          setStatic(rightInnerRef.current);
        } else if (parentBottom <= stickyElementBottom) {
          setAbsoluteBottom(rightInnerRef.current);
        } else {
          setFixed(rightInnerRef.current, topOffset, rightWidth);
        }
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScrollAndSticky();
          ticking = false;
        });
        ticking = true;
      }
    };

    const observer = new ResizeObserver(() => {
      handleScrollAndSticky();
    });

    if (leftInnerRef.current) observer.observe(leftInnerRef.current);
    if (rightInnerRef.current) observer.observe(rightInnerRef.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleScrollAndSticky);

    handleScrollAndSticky();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleScrollAndSticky);
    };
  }, [hasBanners, hasSidebar, sidebarPosition, priorityColumn]);

  const isSidebarLeft = sidebarPosition === "left";

  return (
    <div
      ref={parentRef}
      className="flex flex-col lg:flex-row gap-8 md:gap-12 items-stretch relative w-full"
    >
      {/* LEFT COLUMN */}
      <div
        ref={leftRef}
        className={`w-full relative ${
          isSidebarLeft
            ? "lg:w-[350px] shrink-0 order-2 lg:order-1"
            : "w-full lg:w-2/3 xl:w-3/4 order-1 lg:order-1"
        }`}
      >
        <div
          ref={leftInnerRef}
          className={isSidebarLeft ? "space-y-8 md:space-y-10" : ""}
        >
          {isSidebarLeft ? (
            <>
              {hasSidebar && rightSidebar}
              {hasBanners && rightBanners}
            </>
          ) : (
            <>
              {leftTitle && (
                <div className="mb-8 md:mb-12 text-center lg:text-left">
                  {leftTitle}
                </div>
              )}
              <div>{leftOffers}</div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div
        ref={rightRef}
        className={`w-full relative ${
          isSidebarLeft
            ? "flex-1 min-w-0 order-1 lg:order-2"
            : "w-full lg:w-1/3 xl:w-1/4 order-2 lg:order-2"
        }`}
      >
        <div
          ref={rightInnerRef}
          className={!isSidebarLeft ? "space-y-8 md:space-y-10" : ""}
        >
          {!isSidebarLeft ? (
            <>
              {hasSidebar && rightSidebar}
              {hasBanners && rightBanners}
            </>
          ) : (
            <>
              {leftTitle && (
                <div className="mb-8 md:mb-12 text-center lg:text-left">
                  {leftTitle}
                </div>
              )}
              <div>{leftOffers}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
