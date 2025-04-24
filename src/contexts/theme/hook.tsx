import { use } from 'react';
import ThemeProviderContext from '@/contexts/theme/context';

const useTheme = () => {
  const context = use(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

export default useTheme;
