import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import JessicaNav from '../../components/jessica/JessicaNav';
import JessicaFooter from '../../components/jessica/JessicaFooter';
import JessicaChatAssistant from '../../components/jessica/JessicaChatAssistant';
import { API_BASE_URL } from '../../config';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp, FaUser } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', type: 'general' });
  const [sending, setSending] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.message || res.statusText || 'Failed to send message';
        alert(t('contact.form.error', { defaultValue: 'Failed to send message: {{msg}}', msg }));
      } else {
        alert(t('contact.form.sent', 'Message sent!'));
        setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
      }
    } catch (err) {
      console.error('Contact submit error', err);
      alert(t('contact.form.error', 'Failed to send message'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf7f5] to-[#f9f1ef]">
      <JessicaNav />
      <JessicaChatAssistant />
      
  <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Header */}
        <header className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#5a4a47] mb-4">
            Connect with <span className="text-[#f4a6a9]">Jessica</span>
          </h1>
          <p className="text-lg text-[#7a6a67] max-w-2xl mx-auto">
            Questions about menstrual health, projects, partnerships, or support? 
            Let's start a conversation that creates positive change.
          </p>
        </header>

        {/* Main grid */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-[#f4a6a9]/20 p-8 shadow-xl">
          <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5a4a47] flex items-center gap-2">
                    <FaUser className="w-4 h-4 text-[#f4a6a9]" />
                    {t('contact.form.name','Name *')}
                  </label>
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder={t('contact.form.placeholders.name','Your full name')} 
                    className="w-full h-12 px-4 rounded-xl border border-[#f4a6a9]/30 text-[#5a4a47] focus:outline-none focus:ring-2 focus:ring-[#f4a6a9] focus:border-[#f4a6a9] bg-white/90" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5a4a47] flex items-center gap-2">
                    <FaEnvelope className="w-4 h-4 text-[#f4a6a9]" />
                    {t('contact.form.email','Email *')}
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    placeholder={t('contact.form.placeholders.email','you@example.com')} 
                    className="w-full h-12 px-4 rounded-xl border border-[#f4a6a9]/30 text-[#5a4a47] focus:outline-none focus:ring-2 focus:ring-[#f4a6a9] focus:border-[#f4a6a9] bg-white/90" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5a4a47]">{t('contact.form.inquiryType','Inquiry Type')}</label>
                <select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleInputChange} 
                  className="w-full h-12 px-4 rounded-xl border border-[#f4a6a9]/30 text-[#5a4a47] focus:outline-none focus:ring-2 focus:ring-[#f4a6a9] focus:border-[#f4a6a9] bg-white/90"
                >
                    <option value="general">{t('contact.form.types.general','General Inquiry')}</option>
                    <option value="partnership">{t('contact.form.types.partnership','Partnership')}</option>
                    <option value="volunteer">{t('contact.form.types.volunteer','Volunteering')}</option>
                    <option value="donation">{t('contact.form.types.donation','Donation')}</option>
                    <option value="media">{t('contact.form.types.media','Media')}</option>
                  </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5a4a47]">{t('contact.form.subject','Subject *')}</label>
                <input 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleInputChange} 
                  required 
                  placeholder={t('contact.form.placeholders.subject','Brief subject')} 
                  className="w-full h-12 px-4 rounded-xl border border-[#f4a6a9]/30 text-[#5a4a47] focus:outline-none focus:ring-2 focus:ring-[#f4a6a9] focus:border-[#f4a6a9] bg-white/90" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5a4a47]">{t('contact.form.message','Message *')}</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleInputChange} 
                  required 
                  rows={6} 
                  placeholder={t('contact.form.placeholders.message','Your message...')} 
                  className="w-full px-4 py-3 rounded-xl border border-[#f4a6a9]/30 text-[#5a4a47] focus:outline-none focus:ring-2 focus:ring-[#f4a6a9] focus:border-[#f4a6a9] resize-none bg-white/90" 
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className={
                  `w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#f4a6a9] to-[#e8b4b8] text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ` +
                  (sending ? 'opacity-70 cursor-not-allowed' : 'hover:from-[#e89396] hover:to-[#d4a5a8] hover:shadow-xl')
                }
              >
                <FaPaperPlane className="w-4 h-4" />
                {sending ? t('contact.form.sending', 'Sending...') : t('contact.form.send','Send Message')}
              </button>
              </form>

            {/* Side Info */}
            <aside className="space-y-8">
              <div className="bg-gradient-to-br from-[#f4a6a9]/10 to-[#e8b4b8]/10 rounded-2xl p-6 border border-[#f4a6a9]/20">
                <h2 className="text-xl font-bold text-[#5a4a47] mb-6 flex items-center gap-2">
                  <FaEnvelope className="w-5 h-5 text-[#f4a6a9]" />
                  Contact Jessica
                </h2>
                <div className="space-y-4 text-sm text-[#7a6a67]">
                  <div className="flex items-start gap-3">
                    <FaUser className="w-5 h-5 text-[#f4a6a9] mt-1" />
                    <div>
                      <div className="font-semibold text-[#5a4a47]">Jessica Luiru</div>
                      <div className="text-[#7a6a67]">Founder & Program Director</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="w-5 h-5 text-[#f4a6a9] mt-1" />
                    <div>
                      <div className="font-semibold text-[#5a4a47]">Email</div>
                      <a href="mailto:luirujessica@gmail.com" className="text-[#f4a6a9] hover:text-[#e89396] transition-colors">
                        luirujessica@gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaPhone className="w-5 h-5 text-[#f4a6a9] mt-1" />
                    <div>
                      <div className="font-semibold text-[#5a4a47]">Phone</div>
                      <a href="tel:+14439751470" className="text-[#f4a6a9] hover:text-[#e89396] transition-colors">
                        +1 443-975-1470
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-[#f4a6a9] mt-1" />
                    <div>
                      <div className="font-semibold text-[#5a4a47]">Location</div>
                      <div className="text-[#7a6a67]">
                        Dunkirk, Maryland, USA<br/>
                        Operating in Burundi
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaWhatsapp className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <div className="font-semibold text-[#5a4a47]">WhatsApp Support</div>
                      <div className="text-[#7a6a67]">
                        Personal menstrual health guidance available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Office Hours */}
              <div className="bg-gradient-to-br from-[#e8b4b8]/10 to-[#d4a5a8]/10 rounded-2xl p-6 border border-[#f4a6a9]/20">
                <h3 className="text-lg font-bold text-[#5a4a47] mb-4">Office Hours</h3>
                <ul className="space-y-2 text-sm text-[#7a6a67]">
                  <li className="flex justify-between">
                    <span>Monday–Friday</span>
                    <span className="font-semibold text-[#5a4a47]">09:00–18:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold text-[#5a4a47]">10:00–16:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold text-[#f4a6a9]">Closed</span>
                  </li>
                </ul>
              </div>
              
              {/* Social Media */}
              <div className="bg-gradient-to-br from-[#f4a6a9]/10 to-[#e8b4b8]/10 rounded-2xl p-6 border border-[#f4a6a9]/20">
                <h3 className="text-lg font-bold text-[#5a4a47] mb-4">Follow Jessica</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 p-3 rounded-xl border border-[#f4a6a9]/30 hover:bg-[#f4a6a9]/10 transition-colors group"
                  >
                    <FaFacebook className="w-5 h-5 text-[#f4a6a9] group-hover:text-[#e89396]" />
                    <span className="text-xs font-medium text-[#7a6a67]">Facebook</span>
                  </a>
                  
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 p-3 rounded-xl border border-[#f4a6a9]/30 hover:bg-[#f4a6a9]/10 transition-colors group"
                  >
                    <FaInstagram className="w-5 h-5 text-[#f4a6a9] group-hover:text-[#e89396]" />
                    <span className="text-xs font-medium text-[#7a6a67]">Instagram</span>
                  </a>
                  
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 p-3 rounded-xl border border-[#f4a6a9]/30 hover:bg-[#f4a6a9]/10 transition-colors group"
                  >
                    <FaTwitter className="w-5 h-5 text-[#f4a6a9] group-hover:text-[#e89396]" />
                    <span className="text-xs font-medium text-[#7a6a67]">Twitter</span>
                  </a>
                  
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 p-3 rounded-xl border border-[#f4a6a9]/30 hover:bg-[#f4a6a9]/10 transition-colors group"
                  >
                    <FaLinkedin className="w-5 h-5 text-[#f4a6a9] group-hover:text-[#e89396]" />
                    <span className="text-xs font-medium text-[#7a6a67]">LinkedIn</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12">
          <div className="bg-gradient-to-r from-[#f4a6a9] to-[#e8b4b8] rounded-2xl p-8 text-center text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Partner with Jessica</h2>
            <p className="text-lg mb-6">Support menstrual dignity and education initiatives across Burundi</p>
            <Link 
              to="/donate" 
              className="inline-block bg-white text-[#f4a6a9] px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Support My Work
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <JessicaFooter />
    </div>
  );
};

export default ContactPage;
