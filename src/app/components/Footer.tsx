const links = [
  {
    label: "clever-cloud.com",
    href: "https://www.clever-cloud.com",
    className: "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-300 hover:bg-emerald-500/10",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/clever-cloud/",
    className: "border-blue-400/20 bg-blue-400/[0.06] text-blue-300 hover:bg-blue-400/10",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Static on CC",
    href: "https://developers.clever-cloud.com/doc/applications/static/",
    className: "border-zinc-700 bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-300",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    label: "React Docs",
    href: "https://react.dev",
    className: "border-zinc-700 bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-300",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: "Vite Docs",
    href: "https://vitejs.dev",
    className: "border-zinc-700 bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-300",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: "Certification Clever Cloud",
    href: "https://academy.clever.cloud/",
    className: "border-amber-400/25 bg-amber-400/[0.07] text-amber-300 hover:bg-amber-400/14",
    icon: (
      <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-800 pt-6 pb-2">
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 border rounded-lg text-[11px] font-medium px-3 py-1.5 transition-all duration-200 ${link.className}`}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>
      <p className="text-center text-zinc-700 text-[11px]">
        Open source demo &middot; Deployed on Clever Cloud
      </p>
    </footer>
  );
}
