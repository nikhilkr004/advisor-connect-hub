import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              AssociateConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link to="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="accent" size="sm">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/#pricing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-2"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button variant="accent" size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
