import { Link } from 'react-router-dom';
import { Brain, Github, Linkedin, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-surface-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display">IntelliView</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              AI-powered interview preparation platform. Practice coding, nail behavioral questions, and land your dream job.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Practice', links: [
              { to: '/problems', label: 'Problems' },
              { to: '/behavioral', label: 'Behavioral' },
              { to: '/companies', label: 'Companies' },
              { to: '/leaderboard', label: 'Leaderboard' },
            ]},
            { title: 'Features', links: [
              { to: '/ai-chat', label: 'AI Coach' },
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/', label: 'Study Plans' },
              { to: '/', label: 'Mock Interviews' },
            ]},
            { title: 'Resources', links: [
              { to: '/', label: 'Blog' },
              { to: '/', label: 'Documentation' },
              { to: '/', label: 'API' },
              { to: '/', label: 'Contact' },
            ]},
          ].map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} IntelliView. All rights reserved.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for developers
          </p>
        </div>
      </div>
    </footer>
  );
}
