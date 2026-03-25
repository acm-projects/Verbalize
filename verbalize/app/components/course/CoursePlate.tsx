import { ReactNode } from "react";

type CoursePlateProps = {
  children: ReactNode;
};

export default function CoursePlate({ children }: CoursePlateProps) {
  return (
   <div className="min-h-[calc(100vh-220px)] w-full rounded-xl border border-[#dfeaf5] bg-white px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] transition-all duration-300">
      {children}
    </div>
  );
}