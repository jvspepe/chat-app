import ThemeProvider from '@/contexts/theme/provider';
import SignUpForm from '@/components/sign-up-form';

export default function App() {
  return (
    <div>
      <ThemeProvider>
        <SignUpForm />
      </ThemeProvider>
    </div>
  );
}
