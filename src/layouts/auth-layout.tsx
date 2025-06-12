import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <Outlet />
    </div>
  );
}
