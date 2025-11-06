'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Search, DollarSign, Tag, FileText, Image as ImageIcon, Calendar, PersonStandingIcon } from 'lucide-react';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: 'mail' | 'lock' | 'user' | 'phone' | 'search' | 'dollar-sign' | 'tag' | 'file-text' | 'image' | 'calendar' | 'login';
  className?: string;
  containerClassName?: string;
  maxLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
}

const iconMap = {
  mail: Mail,
  lock: Lock,
  user: User,
  phone: Phone,
  search: Search,
  'dollar-sign': DollarSign,
  tag: Tag,
  'file-text': FileText,
  image: ImageIcon,
  calendar: Calendar,
  login: PersonStandingIcon,
};

export default function Input({
  label,
  type = 'text',
  placeholder,
  value = '',
  onChange,
  error,
  required = false,
  disabled = false,
  icon,
  maxLength,
  autoComplete,
  autoFocus = false,
}: InputProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const IconComponent = icon ? iconMap[icon] : null;
  const inputType = type === 'password' && mostrarSenha ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="label-md text-orange-base mb-2 block">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {IconComponent && type !== 'password' && (
          <IconComponent 
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isFocused || error ? 'text-orange-base' : 'text-gray-200'
            } transition-colors duration-200`} 
          />
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          suppressHydrationWarning
          style={{
            paddingLeft: icon && type !== 'password' ? '2rem' : '0',
            paddingRight: type === 'password' ? '-3rem' : '0'
          }}
          className={`
            input-base 
            ${error ? 'border-danger' : ''} 
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isFocused || error ? 'text-orange-base' : 'text-gray-200'
            } transition-colors duration-200 hover:text-orange-base`}
          >
            {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
      </div>
      
      {error && (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-4 h-4 bg-danger rounded-full flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <span className="body-xs text-danger">{error}</span>
        </div>
      )}
    </div>
  );
}
