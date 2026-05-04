import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  // One source of truth for links
  const links = user
  ? [
      { to: "/", label: "Home", type: "link" },
      { to: "/profile", label: "Profile", type: "link" },
      { label: "Logout", type: "button" },
    ]
  : [
      { to: "/", label: "Home", type: "link" },
      { to: "/login", label: "Login", type: "link" },
      { to: "/signup", label: "Signup", type: "link" },
    ];

  const linkBase =
    "block px-3 py-2 text-sm font-medium rounded-md transition-colors";
  const linkClass = ({ isActive }) =>
    isActive
      ? `${linkBase} bg-gray-200 text-gray-900` // active = boxed
      : `${linkBase} text-gray-700 hover:bg-gray-100`;

  return (
    <header className="border-b bg-white">
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Brand (left) */}
          <Link to="/" className="text-base sm:text-lg font-semibold">
            Image colorization
          </Link>

          {/* Desktop links (right) */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((l) =>
  l.type === "link" ? (
    <NavLink
      key={l.label}
      to={l.to}
      className={linkClass}
      onClick={() => setOpen(false)}
    >
      {l.label}
    </NavLink>
  ) : (
    <button
      key={l.label}
      onClick={() => { logout(); setOpen(false); }}
      className={`${linkBase} text-gray-700 hover:bg-gray-100`}
    >
      {l.label}
    </button>
  )
)}

          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {/* Hamburger / Close */}
            <svg
              className={`h-6 w-6 ${open ? "hidden" : "block"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`h-6 w-6 ${open ? "block" : "hidden"}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile panel (same active-box styling) */}
        <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
            open ? "max-h-64" : "max-h-0"
          }`}
        >
          <div className="py-2 border-t space-y-1">
            {links.map((l) =>
  l.type === "link" ? (
    <NavLink
      key={l.label}
      to={l.to}
      className={linkClass}
      onClick={() => setOpen(false)}
    >
      {l.label}
    </NavLink>
  ) : (
    <button
      key={l.label}
      onClick={() => { logout(); setOpen(false); }}
      className={`${linkBase} text-gray-700 hover:bg-gray-100`}
    >
      {l.label}
    </button>
  )
)}

          </div>
        </div>
      </nav>
    </header>
  );
}
