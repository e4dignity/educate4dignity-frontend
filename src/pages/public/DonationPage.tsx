import React, { useState, useEffect } from 'react';
import { Lock, Users, Megaphone, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { trackEvent } from '../../utils/analytics';
// import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from '../../services/checkoutSession';
import { donorStore } from '../../services/donorStore';
import PublicPageShell from '../../components/layout/PublicPageShell';
import JessicaChatAssistant from '../../components/jessica/JessicaChatAssistant';

const DonationPage: React.FC = () => {
  const { t } = useTranslation();
  // Temporary redirect requirement: while donation flow is paused, send users to home
  // Preserve existing code for future reactivation. Controlled by env flag VITE_DONATIONS_DISABLED or hard-coded fallback.
  const donationsDisabled = (import.meta as any).env?.VITE_DONATIONS_DISABLED === 'true';
  useEffect(() => {
    if (donationsDisabled) {
      // Small delay so we can optionally show a message (could be enhanced later)
      const timer = setTimeout(() => {
        window.location.replace('/#/');
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [donationsDisabled]);
  const [donationType, setDonationType] = useState<'one-time' | 'recurring'>('one-time');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('general');
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    anonymous: false
  });

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const projects = [
    { id: 'kits', name: t('projectCard.supportCtaLong','Advance menstrual health & dignity'), description: t('donation.impactTiers.kit','1 menstrual hygiene kit for 6 months') },
    { id: 'education', name: t('nav_mh.elearning','E-learning (Menstrual Health)'), description: t('donation.impactTiers.training','Full training for a class of 30 students') },
    { id: 'wash', name: 'WASH & Privacy', description: t('donation.impactTiers.facilities','Equip a school with adapted facilities') },
    { id: 'monitoring', name: 'Monitoring & Data', description: 'Evidence collection to improve impact & scale' }
  ];

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDonorInfo({
      ...donorInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // When toggling anonymous, clear personally identifiable fields for clarity
  const handleAnonymousToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDonorInfo(info => ({
      ...info,
      anonymous: checked,
      firstName: checked ? '' : info.firstName,
      lastName: checked ? '' : info.lastName,
      email: checked ? '' : info.email,
    }));
  };

  const getFinalAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDonation = async () => {
    const amount = getFinalAmount();
    if (amount <= 0) {
      alert('Please select or enter a valid donation amount');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // If a backend base URL is configured, prefer it. Otherwise allow a test URL shortcut.
      const apiBase = (import.meta as any).env?.VITE_API_URL as string | undefined;
      const testUrl = import.meta.env.VITE_STRIPE_CHECKOUT_TEST_URL as string | undefined;
      if (!apiBase && testUrl) {
        // Demo mode: record a local donor + donation to feed Admin Donors.
        const name = donorInfo.anonymous ? 'Anonyme' : `${donorInfo.firstName} ${donorInfo.lastName}`.trim() || 'Supporter';
        const donorId = donorStore.addDonor({ name, email: donorInfo.anonymous ? undefined : donorInfo.email, country: donorInfo.country, language: 'EN', anonymous: donorInfo.anonymous });
        const id = 'tx_'+Math.random().toString(36).slice(2,9);
        const date = new Date().toISOString();
        donorStore.addDonation({ id, donorId, projectId: selectedProject==='general' ? 'GEN' : selectedProject, projectTitle: selectedProject==='general'? 'Fonds général' : projects.find(p=> p.id===selectedProject)?.name, amount, currency: 'USD', method: 'card', status:'succeeded', date });
        trackEvent({ name: 'donation_test_recorded', properties: { amount, donorId, anonymous: donorInfo.anonymous } });
        window.location.href = testUrl as string;
        return;
      }
      trackEvent({ name: 'donation_initiated', properties: { amount, donationType, project: selectedProject } });
      try {
        sessionStorage.setItem('pending_donation', JSON.stringify({ amount, currency: 'usd', type: donationType, project: selectedProject }));
      } catch {}
      const session = await createCheckoutSession({
        amountCents: Math.round(amount * 100),
        currency: 'usd',
        donationType,
        projectId: selectedProject,
        donor: {
          firstName: donorInfo.firstName,
            lastName: donorInfo.lastName,
            email: donorInfo.email,
            anonymous: donorInfo.anonymous,
            phone: donorInfo.phone,
            address: donorInfo.address,
            city: donorInfo.city,
            country: donorInfo.country
        }
      });
      if (session.error) {
        throw new Error(session.error);
      }
      // Prefer URL-based redirect. If backend gave a URL, use it.
      let checkoutUrl = session.url as string | undefined;
      if (!checkoutUrl) {
        // If no direct URL, but we have a dev test URL, use that.
        const envTestUrl = import.meta.env.VITE_STRIPE_CHECKOUT_TEST_URL as string | undefined;
        if (envTestUrl) checkoutUrl = envTestUrl;
      }
      if (!checkoutUrl) {
        // As a last resort, construct a Dashboard-hosted pay link or show an error.
        // Since redirectToCheckout is removed in new Stripe.js, we require a direct URL now.
        throw new Error('Checkout URL not provided by backend. Please configure backend to return session.url.');
      }
  // Stash for fallback and navigate to our redirect page
      try { sessionStorage.setItem('checkout_url', checkoutUrl); } catch {}
      const encoded = encodeURIComponent(checkoutUrl);
      window.location.href = `/#/checkout-session?url=${encoded}`;
      return;
    } catch (e: any) {
      trackEvent({ name: 'donation_failed', properties: { amount, error: e.message } });
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (donationsDisabled) {
    return (
      <PublicPageShell>
        <div className="max-w-xl mx-auto text-center py-24">
          <h1 className="text-3xl font-bold mb-4 text-primary">{t('donation.temporarilyDisabled','Donations Temporarily Redirected')}</h1>
          <p className="text-sm text-secondary mb-6">{t('donation.redirectMessage','We are updating our donation flow. You are being redirected to the home page.')}</p>
          <p className="text-xs text-secondary/70">{t('donation.keepCodeIntact','(Underlying Stripe integration code is preserved for later reactivation)')}</p>
        </div>
        <JessicaChatAssistant />
      </PublicPageShell>
    );
  }

  return (
    <>
    <PublicPageShell>
      {/* Header */}
      <header className="mb-8 space-y-2 text-center">
        <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">{t('donation.title','Keep girls learning every month')}</h1>
        <p className="text-[14px] leading-[20px] text-secondary max-w-prose mx-auto">{t('donation.subtitle','Your gift funds menstrual kits, school sessions and basic WASH improvements so no girl misses class because of her period.')}</p>
      </header>

      <div className="max-w-4xl mx-auto w-full space-y-10">

        {/* Impact Tiers (updated Euro amounts) */}
        <section className="rounded-xl border border-base bg-white p-6" aria-labelledby="impact-tiers-heading">
          <h2 id="impact-tiers-heading" className="sr-only">{t('donation.yourDonation','Your Donation')}</h2>
          <dl className="flex flex-col md:flex-row md:divide-x md:divide-base">
            <div className="flex-1 text-center py-4 md:py-0 md:px-6">
              <dt className="text-[22px] leading-[26px] font-extrabold tracking-tight text-primary">$15</dt>
              <dd className="mt-1 text-[12px] leading-[18px] text-secondary max-w-[240px] mx-auto">{t('donation.impactTiers.kit','1 menstrual hygiene kit for 6 months')}</dd>
            </div>
            <div className="flex-1 text-center py-4 md:py-0 md:px-6 border-t md:border-t-0 border-base">
              <dt className="text-[22px] leading-[26px] font-extrabold tracking-tight text-primary">$50</dt>
              <dd className="mt-1 text-[12px] leading-[18px] text-secondary max-w-[240px] mx-auto">{t('donation.impactTiers.training','Full training for a class of 30 students')}</dd>
            </div>
            <div className="flex-1 text-center py-4 md:py-0 md:px-6 border-t md:border-t-0 border-base">
              <dt className="text-[22px] leading-[26px] font-extrabold tracking-tight text-primary">$100</dt>
              <dd className="mt-1 text-[12px] leading-[18px] text-secondary max-w-[240px] mx-auto">{t('donation.impactTiers.facilities','Equip a school with adapted facilities')}</dd>
            </div>
          </dl>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <Card className="rounded-xl border border-base bg-white">
            <CardHeader>
              <CardTitle className="text-[16px] leading-[22px] font-semibold text-primary">{t('donation.yourDonation','Your Donation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Donation Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  {t('donation.donationType','Donation Type')}
                </label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setDonationType('one-time')}
                    className={`flex-1 h-10 px-3 rounded-full border text-[13px] transition-colors ${ donationType === 'one-time' ? 'border-primary bg-[var(--color-primary-light)] text-primary' : 'border-base bg-white hover:bg-[var(--color-primary-light)]'}`}
                  >
                    {t('donation.oneTime','One-time')}
                  </button>
                  <button
                    onClick={() => setDonationType('recurring')}
                    className={`flex-1 h-10 px-3 rounded-full border text-[13px] transition-colors ${ donationType === 'recurring' ? 'border-primary bg-[var(--color-primary-light)] text-primary' : 'border-base bg-white hover:bg-[var(--color-primary-light)]'}`}
                  >
                    {t('donation.monthly','Monthly')}
                    <Badge variant="primary" size="sm" className="ml-2">
                      {t('donation.mostImpact','Most Impact')}
                    </Badge>
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  {t('donation.amountLabel','Amount (USD) – supports kits & education')}
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountClick(amount)}
                      className={`h-10 px-3 rounded-full border text-[13px] transition-colors ${ selectedAmount === amount && !customAmount ? 'border-primary bg-[var(--color-primary-light)] text-primary' : 'border-base bg-white hover:bg-[var(--color-primary-light)]'}`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder={t('donation.enterCustomAmount','Enter custom amount')}
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Project Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  {t('donation.focusArea','Focus Area')}
                </label>
                <div className="space-y-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-colors ${ selectedProject === project.id ? 'border-primary bg-[var(--color-primary-light)]' : 'border-base bg-white hover:bg-[var(--color-primary-light)]'}`}
                    >
                      <div className="font-medium text-primary text-[13px]">{project.name}</div>
                      <div className="text-secondary text-[12px] leading-[18px]">{project.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Donation Summary */}
              <div className="p-4 rounded-xl border border-base bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-primary text-[13px]">
                    {t('donation.donationSummary', { type: donationType === 'recurring' ? t('donation.monthly','Monthly') : t('donation.oneTime','One-time') })}
                  </span>
                  <span className="text-[20px] font-semibold text-primary">
                    ${getFinalAmount()}
                  </span>
                </div>
                <div className="text-secondary text-[11px] leading-[18px] mt-1">
                  {t('donation.focusPrefix','Focus:')} {projects.find(p => p.id === selectedProject)?.name}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donor Information */}
          <Card className="rounded-xl border border-base bg-white">
            <CardHeader>
              <CardTitle className="text-[16px] leading-[22px] font-semibold text-primary">{t('donation.donorInformation','Donor Information')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    {t('donation.fields.firstName','First Name *')}
                  </label>
                  <Input
                    name="firstName"
                    value={donorInfo.firstName}
                    onChange={handleInputChange}
                    required={!donorInfo.anonymous}
                    disabled={donorInfo.anonymous}
                    placeholder={donorInfo.anonymous? t('donation.fields.anonPlaceholder','Anonymous'):''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    {t('donation.fields.lastName','Last Name *')}
                  </label>
                  <Input
                    name="lastName"
                    value={donorInfo.lastName}
                    onChange={handleInputChange}
                    required={!donorInfo.anonymous}
                    disabled={donorInfo.anonymous}
                    placeholder={donorInfo.anonymous? t('donation.fields.anonDash','—'):''}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  {t('donation.fields.email','Email *')}
                </label>
                <Input
                  type="email"
                  name="email"
                  value={donorInfo.email}
                  onChange={handleInputChange}
                  required={!donorInfo.anonymous}
                  disabled={donorInfo.anonymous}
                  placeholder={donorInfo.anonymous? t('donation.fields.emailOptionalNoReceipt','Optional (no receipt will be emailed)'):t('donation.fields.emailForReceipt','For donation receipt')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  {t('donation.fields.phoneOptional','Phone (Optional)')}
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={donorInfo.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  {t('donation.fields.addressOptional','Address (Optional)')}
                </label>
                <Input
                  name="address"
                  value={donorInfo.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    {t('donation.fields.city','City')}
                  </label>
                  <Input
                    name="city"
                    value={donorInfo.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    {t('donation.fields.country','Country')}
                  </label>
                  <Input
                    name="country"
                    value={donorInfo.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    name="anonymous"
                    checked={donorInfo.anonymous}
                    onChange={handleAnonymousToggle}
                    className="rounded border-border focus:ring-primary"
                  />
                  <label htmlFor="anonymous" className="text-sm text-text-secondary">
                    {t('donation.anonymousLabel','Make this donation anonymous')}
                  </label>
                </div>
                {donorInfo.anonymous && (
                  <div className="text-[11px] leading-[16px] text-secondary ml-6">
                    {t('donation.anonymousHint','We won’t store your name or email. If you enter an email, we’ll only use it to send a receipt.')}
                  </div>
                )}
              </div>

              {/* Tax Information */}
              <div className="p-4 rounded-xl border border-base bg-white">
                <div className="text-[12px] leading-[18px] text-secondary">
                  <strong>{t('donation.taxTitle','Tax Deductible:')}</strong> {t('donation.taxBody','Your donation is tax-deductible to the full extent allowed by law. You will receive a receipt via email for your records.')}
                </div>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handleDonation}
                className="w-full text-lg py-3"
                disabled={getFinalAmount() <= 0 || loading}
              >
                {loading ? t('donation.preparingCheckout','Preparing secure checkout...') : t('donation.payButton','Donate ${{amount}} with Stripe', { amount: getFinalAmount() })}
              </Button>

              {error && (
                <div className="text-[12px] leading-[18px] text-red-600 text-center">
                  {error}
                </div>
              )}

              <div className="text-center text-[11px] leading-[18px] text-secondary">
                {t('donation.secureProcessing','Secure payment processing by Stripe')}<br />
                <span className="inline-flex items-center gap-1"><Lock size={14} /> {t('donation.infoSafe','Your information is safe and encrypted')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dev popup removed: button now triggers Stripe directly */}

        {/* Other Ways to Help */}
        <div className="mt-12">
          <h2 className="text-[18px] leading-[24px] font-semibold text-primary text-center mb-6">{t('donation.otherWaysTitle','Other Ways to Support Dignity')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center rounded-xl border border-base bg-white">
              <CardContent className="py-6 px-4 space-y-3">
                <div className="text-primary/70"><Users className="w-8 h-8 mx-auto" /></div>
                <h3 className="font-semibold text-[15px] text-primary">{t('donation.volunteerTitle','Volunteer')}</h3>
                <p className="text-secondary text-[12px] leading-[18px]">{t('donation.volunteerDesc','Assist during distribution days or education sessions.')}</p>
                <Button variant="secondary" className="h-8 px-3 text-[12px] rounded-full">{t('common.learnMore','Learn More')}</Button>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl border border-base bg-white">
              <CardContent className="py-6 px-4 space-y-3">
                <div className="text-primary/70"><Megaphone className="w-8 h-8 mx-auto" /></div>
                <h3 className="font-semibold text-[15px] text-primary">{t('donation.spreadTitle','Spread the Word')}</h3>
                <p className="text-secondary text-[12px] leading-[18px]">{t('donation.spreadDesc','Normalize menstrual health conversations in your network.')}</p>
                <Button variant="secondary" className="h-8 px-3 text-[12px] rounded-full">{t('common.share','Share')}</Button>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl border border-base bg-white">
              <CardContent className="py-6 px-4 space-y-3">
                <div className="text-primary/70"><Building2 className="w-8 h-8 mx-auto" /></div>
                <h3 className="font-semibold text-[15px] text-primary">{t('donation.corporateTitle','Corporate Partnership')}</h3>
                <p className="text-secondary text-[12px] leading-[18px]">{t('donation.corporateDesc','Sponsor kits or fund a school WASH improvement cluster.')}</p>
                <Button variant="secondary" className="h-8 px-3 text-[12px] rounded-full">{t('donation.contactUs','Contact Us')}</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transparency Note */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto rounded-xl border border-base bg-white">
            <CardContent className="py-6 px-6 space-y-3">
              <h3 className="font-semibold text-[15px] text-primary">{t('donation.transparencyTitle','Transparency Promise')}</h3>
              <p className="text-secondary text-[12px] leading-[18px]">
                {t('donation.transparencyDesc','We believe in transparency. Track how your donation is used through detailed reports and impact tracking.')}
              </p>
              <Button variant="secondary" className="h-8 px-4 text-[12px] rounded-full">{t('donation.viewReports','View Reports')}</Button>
              <div className="text-[11px] leading-[16px] text-secondary mt-4">
                {t('donation.noticeLoginRequired','For more details on your donations or to request a refund, please log in or create an account.')}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicPageShell>
    {/* Chat Assistant */}
    <JessicaChatAssistant />
    </>
  );
};

export default DonationPage;
