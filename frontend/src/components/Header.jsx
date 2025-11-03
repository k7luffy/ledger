import { useState } from "react";
import { Menu, X, BarChart3, Settings, User } from "lucide-react";
import styles from "./Header.module.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo and Title */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <BarChart3 size={28} />
          </div>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>Personal Ledger</h1>
            <p className={styles.subtitle}>Simple accounting tool</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <a href="#dashboard" className={styles.navLink}>
            <BarChart3 size={18} />
            Dashboard
          </a>
          <a href="#reports" className={styles.navLink}>
            <BarChart3 size={18} />
            Reports
          </a>
          <a href="#settings" className={styles.navLink}>
            <Settings size={18} />
            Settings
          </a>
          <a href="#profile" className={styles.navLink}>
            <User size={18} />
            Profile
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className={styles.mobileNav}>
          <a href="#dashboard" className={styles.mobileNavLink}>
            <BarChart3 size={18} />
            Dashboard
          </a>
          <a href="#reports" className={styles.mobileNavLink}>
            <BarChart3 size={18} />
            Reports
          </a>
          <a href="#settings" className={styles.mobileNavLink}>
            <Settings size={18} />
            Settings
          </a>
          <a href="#profile" className={styles.mobileNavLink}>
            <User size={18} />
            Profile
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
