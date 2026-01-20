import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  className?: string;
  imgClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean; // if we want to display brand text next to image (optional)
  textClassName?: string;
  'aria-label'?: string;
}

const sizeMap = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-12'
};

export const Logo: React.FC<LogoProps> = ({
  to = '/',
  className = 'flex items-center font-bold',
  imgClassName = '',
  size = 'md',
  withText = false,
  textClassName = 'ml-2 text-base font-extrabold tracking-tight',
  'aria-label': ariaLabel = 'Educate4Dignity'
}) => {
  const imgSize = sizeMap[size];
  const content = (
    <span className={className} aria-label={ariaLabel}>
      <img src="/logo.png" alt="Educate4Dignity" className={`${imgSize} w-auto ${imgClassName}`} />
      {withText && <span className={textClassName}>Educate4Dignity</span>}
    </span>
  );
  // Use Link if internal navigation
  return to ? <Link to={to}>{content}</Link> : content;
};

export default Logo;
