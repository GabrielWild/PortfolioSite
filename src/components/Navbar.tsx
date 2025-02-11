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
      className="fixed top-0 z-50 w-full bg-transparent px-8 py-6"
    >
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-sm font-medium uppercase tracking-wider text-white"
        >
          G. WILDSMITH
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-white/80"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-12 text-sm font-medium uppercase tracking-wider text-white/80">
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
          className="hidden md:block text-sm font-medium uppercase tracking-wider text-white hover:text-white/80"
        >
          Contact
        </Link>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute left-0 right-0 top-full mt-2 bg-black/90 backdrop-blur-md py-4"
        >
          <div className="flex flex-col items-center gap-4 text-sm font-medium uppercase tracking-wider text-white/80">
            <Link to="/work" className="hover:text-white py-2">
              Work
            </Link>
            <Link to="/about" className="hover:text-white py-2">
              About
            </Link>
            <Link to="/social" className="hover:text-white py-2">
              Social
            </Link>
            {user && (
              <Link to="/admin" className="hover:text-white py-2">
                Admin
              </Link>
            )}
            <Link to="/contact" className="hover:text-white py-2">
              Contact
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
