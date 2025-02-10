import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface NavbarProps {
  isHome?: boolean;
}

const Navbar = ({ isHome = false }: NavbarProps) => {
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
          <Link to="/admin" className="hover:text-white">
            Admin
          </Link>
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
