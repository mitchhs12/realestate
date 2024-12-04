import React, { useRef, useEffect } from "react";

interface InfiniteScrollProps {
  children: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollHandler = () => {
      if (container.scrollLeft === 0) {
        container.scrollLeft = container.scrollWidth / 2;
      }
    };

    container.addEventListener("scroll", scrollHandler);
    return () => {
      container.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        overflowX: "scroll",
        scrollBehavior: "smooth",
        width: "100%",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

export default InfiniteScroll;
