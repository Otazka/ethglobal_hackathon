import React from 'react';

export const Alert = ({ className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
  };
  
  return (
    <div
      className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variants[variant]} ${className}`}
      {...props}
    />
  );
};

export const AlertDescription = ({ className = '', ...props }) => {
  return (
    <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
  );
}; 