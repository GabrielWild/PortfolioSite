import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";

interface NavbarProps {
  isHome?: boolean;
}

const Navbar = ({ isHome = false }: NavbarProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.nav
      initial={isHome ? { y: -100 } : { opacity: 0 }}
      animate={isHome ? { y: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 right-0 top-0 z-50 flex justify-between px-8 py-6"
    >
      <div className="flex items-center gap-8">
        <Link to="/work" className="text-sm text-white/70 hover:text-white">
          WORKS
        </Link>
        <Link to="/about" className="text-sm text-white/70 hover:text-white">
          ABOUT
        </Link>
        {user && (
          <Link to="/admin" className="text-sm text-white/70 hover:text-white">
            ADMIN
          </Link>
        )}
      </div>
      <Link to="/contact" className="text-sm text-white/70 hover:text-white">
        LET'S TALK
      </Link>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute left-0 right-0 top-full mt-2 bg-black/90 backdrop-blur-md py-4"
        >
          <div className="flex flex-col items-center gap-4 text-sm uppercase tracking-wider">
            <Link to="/work" className="text-white/70 hover:text-white py-2">
              WORKS
            </Link>
            <Link to="/about" className="text-white/70 hover:text-white py-2">
              ABOUT
            </Link>
            {user && (
              <Link to="/admin" className="text-white/70 hover:text-white py-2">
                ADMIN
              </Link>
            )}
            <Link to="/contact" className="text-white/70 hover:text-white py-2">
              LET'S TALK
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
