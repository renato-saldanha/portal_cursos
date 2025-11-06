'use client';

import { ReactNode } from 'react';
import {
  ArrowRight, Plus, Check, X, Filter, Edit, Trash2, Package,
  LogOut, Settings, Bell, User, Grid, List, Save, Eye, Search,
  RefreshCw, Home, Lock, Download, DoorOpenIcon,
  ArrowLeft
} from 'lucide-react';

interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: 'arrow-right' | 'plus' | 'check' | 'x' | 'filter' | 'edit' | 'trash' | 'package' | 'logout' | 'settings' | 'bell' | 'user' | 'grid' | 'list'
  | 'save' | 'eye' | 'search' | 'refresh' | 'home' | 'lock' | 'download' | 'exit' | 'arrow-left';
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  type?: 'button' | 'submit' | 'reset';
  desabilitado?: boolean;
  carregando?: boolean;
  className?: string;
  'aria-label'?: string;
}

const iconMap = {
  'arrow-right': ArrowRight,
  'plus': Plus,
  'check': Check,
  'x': X,
  'filter': Filter,
  'edit': Edit,
  'trash': Trash2,
  'package': Package,
  'logout': LogOut,
  'settings': Settings,
  'bell': Bell,
  'user': User,
  'grid': Grid,
  'list': List,
  'save': Save,
  'eye': Eye,
  'search': Search,
  'refresh': RefreshCw,
  'home': Home,
  'lock': Lock,
  'download': Download,
  'exit': DoorOpenIcon,
  'arrow-left': ArrowLeft,
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  onMouseOver,
  onMouseOut,
  type = 'button',
  desabilitado = false,
  carregando = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const IconComponent = icon ? iconMap[icon] : null;
  const classeBase = `flex items-center justify-between bg-gradient-to-br from-orange-light to-orange-base border-1 
                               border-orange-mid text-orange-vivo transition-all duration-300 
                      hover:text-orange-dark hover:bg-gradient-to-br hover:from-orange-base hover:to-orange-light hover:border-orange-base`;

  const classesVariantes = {
    primary: 'btn-primary focus:ring-orange-base',
    secondary: 'btn-secondary focus:ring-orange-base',
    outline: 'bg-white text-gray-400 border border-gray-100 hover:bg-shape focus:ring-gray-100',
  };

  const classesTamanho = {
    sm: 'px-4 py-2 text-action-sm min-h-[44px]',
    md: 'px-6 py-3 text-action-md min-h-[44px]',
    lg: 'px-8 py-4 text-action-md min-h-[48px]',
  };

  const classeDesabilitado = desabilitado || carregando ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      disabled={desabilitado || carregando}
      aria-label={ariaLabel}
      className={`${classeBase} ${classesVariantes[variant]} ${classesTamanho[size]} ${classeDesabilitado} ${className}`}
      {...props}
    >
      {children}
      {carregando ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      ) : (
        IconComponent && <IconComponent className="w-5 h-5" />
      )}
    </button>
  );
}
