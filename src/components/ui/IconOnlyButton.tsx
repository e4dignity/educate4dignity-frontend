import React from 'react';

type Props = {
  ariaLabel: string;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const IconOnlyButton: React.FC<Props> = ({ ariaLabel, icon, className = '', disabled, title, type = 'button', onClick }) => {
  return (
    <button
      type={type}
      title={title || ariaLabel}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center w-10 h-10 rounded-full',
        'text-[0] leading-none whitespace-nowrap overflow-hidden',
        'bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white disabled:opacity-50 shrink-0',
        className
      ].join(' ')}
      style={{ fontSize: 0, lineHeight: 0 }}
    >
      {icon}
    </button>
  );
};

export default IconOnlyButton;
