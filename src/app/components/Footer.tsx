const links = [
  {
    label: "clever-cloud.com",
    href: "https://www.clever-cloud.com",
    style: { color: "#4ADE80", borderColor: "rgba(74,222,128,0.15)", background: "rgba(74,222,128,0.05)" },
    hoverBg: "rgba(74,222,128,0.1)",
    icon: (
      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/clever-cloud/",
    style: { color: "#60A5FA", borderColor: "rgba(96,165,250,0.15)", background: "rgba(96,165,250,0.05)" },
    hoverBg: "rgba(96,165,250,0.1)",
    icon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Static on CC",
    href: "https://developers.clever-cloud.com/doc/applications/static/",
    style: { color: "#4E5468", borderColor: "#1A1D26", background: "rgba(255,255,255,0.02)" },
    hoverBg: "rgba(255,255,255,0.04)",
    icon: (
      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    label: "React Docs",
    href: "https://react.dev",
    style: { color: "#4E5468", borderColor: "#1A1D26", background: "rgba(255,255,255,0.02)" },
    hoverBg: "rgba(255,255,255,0.04)",
    icon: (
      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    label: "Vite Docs",
    href: "https://vitejs.dev",
    style: { color: "#4E5468", borderColor: "#1A1D26", background: "rgba(255,255,255,0.02)" },
    hoverBg: "rgba(255,255,255,0.04)",
    icon: (
      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    label: "Certification Clever Cloud",
    href: "https://academy.clever.cloud/",
    style: { color: "#F5C030", borderColor: "rgba(245,192,48,0.18)", background: "rgba(245,192,48,0.05)" },
    hoverBg: "rgba(245,192,48,0.1)",
    icon: (
      <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <div className="mt-10 space-y-4">
      {/* Cert banner */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl px-5 py-4"
        style={{
          background: "rgba(251,191,36,0.055)",
          border: "1px solid rgba(251,191,36,0.18)",
        }}
      >
        <span className="text-[26px] flex-shrink-0">🎓</span>
        <div className="flex-1">
          <p className="font-semibold text-[14px] mb-1" style={{ color: "#F5C030" }}>
            Envie de maîtriser Clever Cloud ?
          </p>
          <p className="text-[12.5px] leading-relaxed" style={{ color: "#5C5035" }}>
            Validez vos compétences avec la certification officielle — et devenez expert de la plateforme.
          </p>
        </div>
        <a
          href="https://academy.clever.cloud/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg font-bold text-[12px] px-4 py-2.5 transition-all duration-150 whitespace-nowrap flex-shrink-0"
          style={{
            background: "#F5C030",
            color: "#1A1005",
            fontFamily: "var(--font-body)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#E8B428";
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(245,192,48,0.22)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#F5C030";
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Obtenir la certification →
        </a>
      </div>

      {/* Footer links */}
      <footer className="pt-5 pb-2" style={{ borderTop: "1px solid #1A1D26" }}>
        <div className="flex flex-wrap gap-1.5 justify-center mb-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md text-[11px] font-medium px-2.5 py-1.5 border transition-all duration-150"
              style={{ ...link.style, fontFamily: "var(--font-body)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = link.hoverBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = link.style.background; }}
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </div>
        <p className="text-center text-[11px]" style={{ color: "#252830" }}>
          Open source demo &middot; Deployed on Clever Cloud
        </p>
      </footer>
    </div>
  );
}
