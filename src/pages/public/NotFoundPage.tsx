import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageShell from '../../components/layout/PublicPageShell';
import { Button } from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PublicPageShell>
      <div className="max-w-xl mx-auto text-center py-16 space-y-8">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-primary-light)] text-primary text-xs font-semibold tracking-wide">404</span>
        </div>
        <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">{t('notFound.title','Page not found')}</h1>
        <p className="text-secondary text-[14px] leading-[20px] max-w-prose mx-auto">
          {t('notFound.body', "The page you're looking for doesn't exist or was moved. Check the URL or continue browsing.")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button className="rounded-full h-10 px-6 text-sm">
            <Link to="/">{t('nav.home','Home')}</Link>
          </Button>
          <Button variant="secondary" className="rounded-full h-10 px-6 text-sm">
            <Link to="/projects">{t('nav.projects','Projects')}</Link>
          </Button>
          <Button variant="secondary" className="rounded-full h-10 px-6 text-sm">
            <Link to="/donate">{t('nav.donate','Donate')}</Link>
          </Button>
        </div>
        <div className="text-[11px] leading-[18px] text-secondary/70">
          {t('notFound.needHelp','Need help?')} <Link to="/contact" className="underline">{t('notFound.contactUs','Contact us')}</Link>
        </div>
      </div>
    </PublicPageShell>
  );
};

export default NotFoundPage;
