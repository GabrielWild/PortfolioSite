import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  isHome?: boolean;
}

const Navbar = ({ isHome = false }: NavbarProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };
    checkUser();
  }, []);
  return (
    <motion.nav
      initial={isHome ? { y: -100 } : { opacity: 0 }}
      animate={isHome ? { y: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full bg-transparent px-8 py-6"
    >
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-sm font-medium uppercase tracking-wider text-white"
        >
          G. WILDSMITH
        </Link>
        <div className="flex items-center gap-12 text-sm font-medium uppercase tracking-wider text-white/80">
          <Link to="/work" className="hover:text-white">
            Work
          </Link>
          <Link to="/about" className="hover:text-white">
            About
          </Link>
          <Link to="/social" className="hover:text-white">
            Social
          </Link>
          {user && (
            <Link to="/admin" className="hover:text-white">
              Admin
            </Link>
          )}
        </div>
        <Link
          to="/contact"
          className="text-sm font-medium uppercase tracking-wider text-white hover:text-white/80"
        >
          Contact
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
