import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from '@/routes/index.tsx';
import { ThemeProvider } from '@/contexts/theme/provider';
import { AuthProvider } from '@/contexts/auth';
import { Toaster } from '@/components/ui/sonner';
import '@/configs/localization';
import '@/index.css';

const root = document.getElementById('root');

if (!root) throw new Error('No #root element found');

createRoot(root).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster richColors />
        </AuthProvider>
      </ThemeProvider>
    </Suspense>
  </StrictMode>,
);
