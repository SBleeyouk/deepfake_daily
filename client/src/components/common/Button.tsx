import type { CSSProperties, ReactNode } from 'react';
import { colors } from '../../theme';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit';
  style?: CSSProperties;
}

export default function Button({ children, onClick, variant = 'primary', disabled = false, type = 'button', style }: ButtonProps) {
  const baseStyle: CSSProperties = {
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.9rem',
    border: 'none',
    transition: 'all 0.2s',
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const variants: Record<string, CSSProperties> = {
    primary: {
      background: colors.accentPrimary,
      color: colors.bgPrimary,
    },
    outline: {
      background: 'transparent',
      color: colors.accentPrimary,
      border: `1px solid ${colors.accentPrimary}`,
    },
    ghost: {
      background: 'transparent',
      color: colors.textSecondary,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}
