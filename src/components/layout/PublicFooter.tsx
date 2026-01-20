import React from 'react';
import Logo from '../ui/Logo';
import NewsletterSignup from '../ui/NewsletterSignup';
import { Facebook, Twitter, Instagram, Linkedin, MessageCircle } from 'lucide-react';

// TikTok + WhatsApp do not have Lucide native icons; using placeholders (MessageCircle for WhatsApp, a musical note fallback for TikTok via simple span)
const SocialBar: React.FC = () => {
  const links = [
    { href:'https://facebook.com', label:'Facebook', icon:<Facebook className="w-4 h-4" /> },
    { href:'https://twitter.com', label:'Twitter / X', icon:<Twitter className="w-4 h-4" /> },
    { href:'https://wa.me/123456789', label:'WhatsApp', icon:<MessageCircle className="w-4 h-4" /> },
    { href:'https://instagram.com', label:'Instagram', icon:<Instagram className="w-4 h-4" /> },
    { href:'https://tiktok.com/@youraccount', label:'TikTok', icon:<span className="text-[11px] font-semibold">♫</span> },
    { href:'https://linkedin.com/company/yourpage', label:'LinkedIn', icon:<Linkedin className="w-4 h-4" /> },
  ];
  return (
    <nav aria-label="Social media" className="mt-4">
      <ul className="flex flex-wrap gap-2">
        {links.map(l=>(
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-[var(--rose-300)] bg-white text-[var(--rose-700)] hover:bg-[var(--rose-100)] transition">
              {l.icon}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

interface PublicFooterProps {
  withNewsletter?: boolean; // show newsletter column (landing/blog etc.)
  topMargin?: boolean; // add top margin spacing variant
}

const PublicFooter: React.FC<PublicFooterProps> = ({ withNewsletter = true, topMargin = true }) => {
  return (
    <footer className={`${topMargin ? 'mt-20' : ''} px-4 sm:px-6 lg:px-8 pb-12`} id="footer" style={{background:'var(--rose-50)',borderTop:'1px solid var(--rose-200)'}}>
      <div className={`max-w-7xl mx-auto grid gap-8 ${withNewsletter ? 'md:grid-cols-5' : 'md:grid-cols-4'} pt-10`}>
        <div className="text-sm" style={{color:'var(--slate-600)'}}>
          <Logo size="sm" className="font-extrabold mb-2 inline-flex items-center" />
          <div className="text-[13px] mb-2">EN/FR — SSL — Compliance</div>
          <div className="text-[13px]">© 2025 Educate4Dignity</div>
          <SocialBar />
        </div>
        <div>
          <h4 className="font-bold text-sm mb-2" style={{color:'var(--slate-900)'}}>Programme</h4>
          <ul className="space-y-1 text-[13px]" style={{color:'var(--slate-600)'}}>
            <li>Projects</li><li>Transparency</li><li>E-learning</li><li>Resources</li><li>R&D</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-2" style={{color:'var(--slate-900)'}}>Partnerships & Help</h4>
          <ul className="space-y-1 text-[13px]" style={{color:'var(--slate-600)'}}>
            <li>Partner with us</li><li>Become distributor</li><li>FAQ</li><li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm mb-2" style={{color:'var(--slate-900)'}}>Support</h4>
          <ul className="space-y-1 text-[13px]" style={{color:'var(--slate-600)'}}>
            <li>Donate</li><li>Monthly giving</li><li>Corporate</li><li>Reports & audits</li>
          </ul>
        </div>
        {withNewsletter && (
          <div>
            <NewsletterSignup />
          </div>
        )}
      </div>
    </footer>
  );
};

export default PublicFooter;
