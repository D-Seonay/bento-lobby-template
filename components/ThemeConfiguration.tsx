'use client';

import { Theme } from '@/types/lobby';

export function ThemeConfiguration({ theme }: { theme: Theme }) {
  return (
    <style jsx global>{`
      :root {
        --accent: ${theme.primary};
        --radius-3xl: ${theme.radius};
        ${theme.font ? `--font-sans: ${theme.font};` : ''}
      }
    `}</style>
  );
}
