import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props { className?: string }

const NewsletterInline: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent){
    e.preventDefault();
    if(!emailRegex.test(email)) { setError(t('newsletter.invalid','Invalid address')); setStatus('error'); return; }
    setStatus('loading'); setError('');
    await new Promise(r=> setTimeout(r, 600));
    setStatus('success');
  }

  return (
    <form onSubmit={submit} className={`w-full ${className||''}`}>
      <div className="flex items-center min-w-0 w-full overflow-hidden">
        <input
          type="email"
          value={email}
          onChange={e=> setEmail(e.target.value)}
          placeholder={t('newsletter.placeholder','you@example.com')}
          className="flex-1 min-w-0 w-0 h-10 px-4 border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--rose-300)] rounded-l-full rounded-r-none"
          style={{borderColor:'var(--rose-200)',background:'#fff'}}
          disabled={status==='loading'}
          aria-label="Email"
        />
        <button type="submit" disabled={status==='loading'} aria-label={t('newsletter.cta','Subscribe')} className="-ml-px inline-flex items-center justify-center rounded-r-full rounded-l-none h-10 w-11 bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </div>
      {error && <div className="text-xs text-[var(--rose-600)] mt-1">{error}</div>}
      {status==='success' && <div className="text-xs text-[var(--rose-700)] mt-1">{t('newsletter.success','Thank you! Check your email.')}</div>}
    </form>
  );
};

export default NewsletterInline;
