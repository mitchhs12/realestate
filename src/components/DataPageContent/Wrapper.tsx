// Wrapper.tsx
import React from "react";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="flex flex-col items-center justify-center p-4 rounded-lg h-[550px] w-full">{children}</div>;
};

export default Wrapper;
