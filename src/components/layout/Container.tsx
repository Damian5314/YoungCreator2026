import type { HTMLAttributes } from 'react';

/** Gecentreerde paginabreedte (max ~1440px) met ruime zijmarges op desktop. */
export function Container({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 ${className}`}
      {...props}
    />
  );
}
