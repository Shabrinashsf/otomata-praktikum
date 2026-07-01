"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/praktikum-1", label: "Praktikum 1" },
  { href: "/praktikum-2", label: "Praktikum 2" },
  { href: "/praktikum-3", label: "Praktikum 3" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="20" height="20" rx="5" fill="url(#ng)" />
              <path
                d="M6 8l3.5 3.5L6 15M11.5 15h4.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="ng" x1="1" y1="1" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <span className={styles.brandName}>OtomataLab</span>
            <span className={styles.brandSub}>Teori Otomata</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className={styles.nav} aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
