import { createBrowserRouter } from 'react-router';
import { paths } from '@/configs/paths';
import { AuthLayout, MainLayout } from '@/layouts';
import { Home } from '@/pages/home';
import { SignIn } from '@/pages/sign-in';
import { SignUp } from '@/pages/sign-up';
import { ForgotPassword } from '@/pages/forgot-password';
import { ResetPassword } from '@/pages/reset-password';
import { Chats } from '@/pages/chats';
import { ProtectedRoute } from './protected-route';

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: paths.home,
        element: <Home />,
      },
      {
        path: paths.signIn,
        element: <SignIn />,
      },
      {
        path: paths.signUp,
        element: <SignUp />,
      },
      {
        path: paths.forgotPassword,
        element: <ForgotPassword />,
      },
      {
        path: paths.resetPassword,
        element: <ResetPassword />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/chats',
            element: <Chats />,
          },
        ],
      },
    ],
  },
]);

export default router;
