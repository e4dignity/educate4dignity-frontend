// Jessica Footer Minimal - Newsletter + Copyright + Partner Logos

import React, { useState } from 'react';
import { FaPaperPlane, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { API_BASE_URL, DEFAULT_HEADERS } from '../../config';
const JessicaFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setError('Invalid email address');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/public/newsletter/subscribe`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('subscribe-failed');
      setStatus('success');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setError('Failed to subscribe, please try again');
    }
  };

  // Partner logos qui soutiennent Jessica
  const partnerLogos = [
    { src: '/photos/partener/deerfield_academy_green_black_lock_up_horizontal.jpg', alt: 'Deerfield Academy' },
    { src: '/photos/partener/LE CRES.png', alt: 'LE CRES' },
    { src: '/photos/partener/images.png', alt: 'UNICEF' }
  ];

  return (
    <footer className="bg-gradient-to-br from-white/80 via-[#f4a6a9]/5 to-[#e8b4b8]/10 border-t border-[#f4a6a9]/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Partner Logos - En premier */}
        <div className="text-center mb-8 md:mb-12">
          <h4 className="text-xs sm:text-sm font-medium text-[#7a6a67] mb-4 md:mb-6">
            Proudly supported by
          </h4>
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
            {partnerLogos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-12 sm:h-14 md:h-16 px-3 sm:px-4 md:px-6 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>



        {/* Newsletter Section - Join My Mission */}
        <div className="text-center mb-6 md:mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-[#5a4a47] mb-2 md:mb-3">
            Join My Mission
          </h3>
          <p className="text-xs sm:text-sm text-[#7a6a67] mb-3 md:mb-4 max-w-md mx-auto leading-relaxed">
            Get monthly updates on menstrual health impact, new stories from the field, and ways to make a difference.
          </p>
          
          {status === 'success' ? (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl max-w-md mx-auto">
              <p className="text-sm font-medium">✨ Thank you! Check your email for confirmation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                disabled={status === 'loading'}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-[#f4a6a9]/30 focus:border-[#f4a6a9] focus:outline-none focus:ring-2 focus:ring-[#f4a6a9]/20 text-xs sm:text-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email.trim()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#f4a6a9] to-[#e8b4b8] text-white rounded-xl font-medium hover:from-[#e89396] hover:to-[#d9a5a8] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                {status === 'loading' ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaPaperPlane className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span>Join Mission</span>
              </button>
            </form>
          )}
          
          {status === 'error' && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Bottom Section - Social + Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-4 md:pt-6 border-t border-[#f4a6a9]/20">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 md:mb-0">
            <a
              href="https://instagram.com/jessicaluiru"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f4a6a9]/10 hover:bg-[#f4a6a9]/20 flex items-center justify-center text-[#f4a6a9] hover:text-[#e89396] transition-colors"
            >
              <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="https://linkedin.com/in/jessicaluiru"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#f4a6a9]/10 hover:bg-[#f4a6a9]/20 flex items-center justify-center text-[#f4a6a9] hover:text-[#e89396] transition-colors"
            >
              <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <a
              href="https://wa.me/25761234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-600 hover:text-green-700 transition-colors"
            >
              <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-xs sm:text-sm text-[#7a6a67]">
              © 2025 <span className="font-semibold text-[#5a4a47]">ikiotahub-DRC</span>
            </p>
            <p className="text-xs text-[#8a7a77] mt-1">
              Breaking menstrual health taboos through education and dignity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default JessicaFooter;