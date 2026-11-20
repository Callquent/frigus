"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FridgeIcon from "@/components/ui/FridgeIcon";
import Logo from "@/components/ui/Logo";

const icon = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const links = [
  {
    href: "/fridge",
    label: "Frigo",
    svg: <FridgeIcon />,
  },
  {
    href: "/shopping",
    label: "Courses",
    svg: (
      <svg {...icon}>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
  },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="topbar">
      <div className="inner">
        <Link href="/fridge" className="brand">
          <Logo size={34} />
          <span>Mon frigo</span>
        </Link>
        <nav className="tabs" aria-label="Navigation principale">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`tab ${pathname.startsWith(l.href) ? "active" : ""}`}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
            >
              {l.svg}
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
