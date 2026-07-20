import { ArrowUpRight } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'text';
  external?: boolean;
  className?: string;
};

export function ActionLink({ to, children, variant = 'dark', external = false, className = '' }: Props) {
  const classes = `action-link action-link--${variant} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      <span className="action-link__icon" aria-hidden="true">
        <ArrowUpRight size={16} weight="light" />
      </span>
    </>
  );

  if (external) {
    return (
      <a className={classes} href={to} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link className={classes} to={to}>
      {content}
    </Link>
  );
}

