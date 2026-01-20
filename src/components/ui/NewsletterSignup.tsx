import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL, DEFAULT_HEADERS } from '../../config';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  variant?: 'default' | 'compact'; // compact = inline pill with icon button, no heading/description
  className?: string;
};

const NewsletterSignup: React.FC<Props> = ({ variant='default', className }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [error, setError] = useState<string>('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
  if(!emailRegex.test(email)) { setError(t('newsletter.invalid','Invalid address')); setStatus('error'); return; }
    setStatus('loading'); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/newsletter/subscribe`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('subscribe-failed');
      setStatus('success');
    } catch(err:any){
  setStatus('error'); setError(t('newsletter.failure','Failed, please retry'));
    }
  };

  const compact = variant==='compact';

  return (
    <div className={className}>
      {!compact && (
        <>
          <h4 className="font-bold text-sm mb-2" style={{color:'var(--slate-900)'}}>{t('newsletter.title','Newsletter')}</h4>
          <p className="text-[13px] mb-3" style={{color:'var(--slate-600)'}}>{t('newsletter.description','Sign up for monthly updates.')}</p>
        </>
      )}
      {status==='success' ? (
        <div className="text-sm font-medium text-[var(--rose-600)]">{t('newsletter.success','Thank you! Check your email.')}</div>
      ) : (
        <form onSubmit={submit} className={`w-full ${compact? '':'flex flex-col gap-2'}`}>
          <div className={`min-w-0 w-full overflow-hidden ${compact? 'flex items-center':'flex items-center'}`}>
            <input
              type="email"
              value={email}
              onChange={e=> setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder','you@example.com')}
              className={`flex-1 min-w-0 w-0 h-10 px-4 border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--rose-300)] ${compact? 'rounded-l-full rounded-r-none':'rounded-l-md rounded-r-none'} `}
              style={{borderColor:'var(--rose-200)',background:'#fff'}}
              disabled={status==='loading'}
              aria-label="Email"
            />
            <button
              type="submit"
              disabled={status==='loading'}
              aria-label={t('newsletter.cta','Subscribe')}
              className={`-ml-px inline-flex items-center justify-center ${compact? 'rounded-r-full':'rounded-r-md'} rounded-l-none h-10 w-11 bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white disabled:opacity-50`}
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          {error && <div className="text-xs text-[var(--rose-600)]">{error}</div>}
        </form>
      )}
      {!compact && (
        <div className="mt-2 text-[11px] leading-snug" style={{color:'var(--slate-500)'}}>{t('newsletter.privacy','Data protection: unsubscribe with one click in every email.')}</div>
      )}
    </div>
  );
};

export default NewsletterSignup;
