import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <Outlet />
    </div>
  );
}
