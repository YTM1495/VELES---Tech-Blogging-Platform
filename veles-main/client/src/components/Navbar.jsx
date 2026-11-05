import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { to: "/", label: "Home", match: (path) => path === "/" },
  { to: "/posts?sort=trending", label: "Trending" },
  { to: "/posts?sort=popular", label: "Most Popular", short: "Popular" },
  { to: "/channels", label: "Channels", match: (path) => path.startsWith("/channels") },
  { to: "/about", label: "About", match: (path) => path.startsWith("/about") },
];

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const AdminIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path
      fillRule="evenodd"
      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ProfileButton = ({ isAdmin }) => (
  <UserButton
    afterSignOutUrl="/"
    appearance={{
      elements: {
        userButtonPopoverCard: { pointerEvents: "initial" },
        userButtonAvatarBox: { width: "2rem", height: "2rem" },
      },
    }}
  >
    <UserButton.MenuItems>
      <UserButton.Link label="Dashboard" labelIcon={<DashboardIcon />} href="/dashboard" />
      {isAdmin ? (
        <UserButton.Link label="Admin Panel" labelIcon={<AdminIcon />} href="/admin" />
      ) : null}
    </UserButton.MenuItems>
  </UserButton>
);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false
  );
  const { user } = useUser();
  const location = useLocation();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      setIsDesktop(mq.matches);
      if (mq.matches) setOpen(false);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const linkClass = (active) =>
    `whitespace-nowrap px-1.5 xl:px-2 py-1 transition-colors shrink-0 ${
      active
        ? "text-green-800 dark:text-[#7BC98C] font-semibold"
        : "text-gray-800 dark:text-[#E5E9E4] hover:text-black dark:hover:text-[#7BC98C]"
    }`;

  const isActive = (link) => {
    if (link.match) return link.match(location.pathname);
    return false;
  };

  const drawer = (
    <div
      className={`lg:hidden fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`}
      inert={open ? undefined : true}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close menu"
        className={`absolute inset-0 z-0 bg-[#0c1611]/55 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        id="mobile-nav"
        className={`absolute top-0 right-0 z-10 flex h-[100dvh] w-[min(100%,20rem)] flex-col gap-1 overflow-y-auto bg-[#13221b] px-5 pb-8 pt-[4.5rem] text-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setOpen(false)}
            className="rounded-xl px-3 py-3 text-lg font-medium hover:bg-white/10 hover:text-emerald-300 transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/write"
          onClick={() => setOpen(false)}
          className="rounded-xl px-3 py-3 text-lg font-medium hover:bg-white/10 hover:text-emerald-300 transition-colors"
        >
          Write
        </Link>
        <SignedIn>
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="rounded-xl px-3 py-3 text-lg font-medium hover:bg-white/10 hover:text-emerald-300 transition-colors"
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-lg font-medium hover:bg-white/10 hover:text-emerald-300 transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </SignedIn>
        <div className="mt-4 px-1">
          <SignedOut>
            <Link to="/login" onClick={() => setOpen(false)} className="block">
              <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-green-700 px-6 py-2.5 text-base font-medium text-white hover:bg-green-600 transition-colors">
                Login
              </span>
            </Link>
          </SignedOut>
        </div>
      </div>
    </div>
  );

  return (
    <nav className="relative z-40 mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 text-black dark:text-[#E5E9E4]">
      <Link to="/" className="flex min-w-0 items-center gap-2 tracking-tight shrink-0">
        <img
          src="/logo.png"
          alt="Veles Logo"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        <span className="font-[Cinzel] text-2xl font-bold text-black dark:text-[#E5E9E4] lg:text-3xl">
          Veles
        </span>
      </Link>

      <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 font-medium text-gray-800 dark:text-[#E5E9E4] lg:flex xl:gap-4 text-sm xl:text-base">
        <div className="flex min-w-0 items-center gap-1 xl:gap-3">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={linkClass(isActive(link))}>
              {link.short ? (
                <>
                  <span className="xl:hidden">{link.short}</span>
                  <span className="hidden xl:inline">{link.label}</span>
                </>
              ) : (
                link.label
              )}
            </Link>
          ))}
          <SignedIn>
            <Link to="/dashboard" className={`${linkClass(location.pathname.startsWith("/dashboard"))} hidden xl:inline`}>
              Dashboard
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`${linkClass(location.pathname.startsWith("/admin"))} hidden xl:inline`}>
                Admin
              </Link>
            )}
          </SignedIn>
        </div>
        <div className="flex shrink-0 items-center gap-2 pl-1">
          <ThemeToggle compact />
          <SignedOut>
            <Link to="/login">
              <span className="inline-flex items-center whitespace-nowrap rounded-full bg-green-700 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-600 dark:border dark:border-[#35443A] dark:bg-[#25382B] dark:hover:bg-[#2e4736]">
                Login
              </span>
            </Link>
          </SignedOut>
          {isDesktop && (
            <SignedIn>
              <ProfileButton isAdmin={isAdmin} />
            </SignedIn>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 lg:hidden">
        <ThemeToggle compact />
        {!isDesktop && (
          <SignedIn>
            <span className="inline-flex h-11 w-11 items-center justify-center">
              <ProfileButton isAdmin={isAdmin} />
            </span>
          </SignedIn>
        )}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-green-800/40"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <span className="flex w-6 flex-col gap-[5px]">
            <span
              className={`h-[2.5px] w-6 origin-center rounded-md bg-gray-900 transition-transform duration-200 dark:bg-[#E5E9E4] ${
                open ? "translate-y-[7.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2.5px] w-6 rounded-md bg-gray-900 transition-opacity duration-200 dark:bg-[#E5E9E4] ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-[2.5px] w-6 origin-center rounded-md bg-gray-900 transition-transform duration-200 dark:bg-[#E5E9E4] ${
                open ? "-translate-y-[7.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {typeof document !== "undefined" ? createPortal(drawer, document.body) : null}
    </nav>
  );
};

export default Navbar;
