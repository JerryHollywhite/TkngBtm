import React from 'react';
import { clsx } from 'clsx';

interface MobileContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MobileContainer({ children, className, ...props }: MobileContainerProps) {
  return (
    <div 
      className={clsx("mobile-container flex flex-col pb-20", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
