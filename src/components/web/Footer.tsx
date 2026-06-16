import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, Github } from "lucide-react";

export function Footer() {
  const cols = [
    {
      title: "Company",
      links: [
        { label: "About Us", to: "#" },
        { label: "Contact", to: "#" },
        { label: "Careers", to: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms & Conditions", to: "#" },
        { label: "Privacy Policy", to: "#" },
        { label: "Refund Policy", to: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help & Support", to: "#" },
        { label: "Report an Issue", to: "#" },
        { label: "Merchant Onboarding", to: "/apply" },
      ],
    },
  ];

  return (
    <footer className="bg-zinc-900 text-zinc-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/home" className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-zinc-50 text-zinc-900 grid place-items-center font-mono font-bold">B</div>
            <span className="text-xl font-bold tracking-tight text-zinc-50">BookIt</span>
          </Link>
          <p className="mt-4 text-sm text-zinc-400 max-w-xs">Skip the queue. Pre-order from canteens and barbers across campus.</p>
          <div className="mt-5 flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="size-9 rounded-full bg-zinc-800 hover:bg-zinc-700 grid place-items-center"><Instagram className="size-4" /></a>
            <a href="#" aria-label="Twitter" className="size-9 rounded-full bg-zinc-800 hover:bg-zinc-700 grid place-items-center"><Twitter className="size-4" /></a>
            <a href="#" aria-label="Facebook" className="size-9 rounded-full bg-zinc-800 hover:bg-zinc-700 grid place-items-center"><Facebook className="size-4" /></a>
            <a href="#" aria-label="Github" className="size-9 rounded-full bg-zinc-800 hover:bg-zinc-700 grid place-items-center"><Github className="size-4" /></a>
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h4 className="text-zinc-50 font-semibold text-sm mb-3 tracking-wide uppercase">{c.title}</h4>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <a href={l.to} className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} BookIt Campus. All rights reserved.</p>
          <p>Made with care for students, by students.</p>
        </div>
      </div>
    </footer>
  );
}
