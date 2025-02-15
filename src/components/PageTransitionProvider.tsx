import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface PageTransitionProviderProps {
  children: ReactNode;
}

export function PageTransitionProvider({
  children,
}: PageTransitionProviderProps) {
  const location = useLocation();

  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
