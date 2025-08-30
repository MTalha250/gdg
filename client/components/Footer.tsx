import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="px-8 md:px-16 lg:px-24 xl:px-32 py-10 border-t border-border bg-background">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
        <p>© {year} GDG on Campus ITU</p>
        <nav className="flex items-center gap-4">
          <Link href="#about" className="hover:text-white">
            About
          </Link>
          <Link href="#events" className="hover:text-white">
            Events
          </Link>
          <Link href="#contact" className="hover:text-white">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
