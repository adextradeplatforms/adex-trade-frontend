import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// ---------------- Auth Pages ----------------
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// ---------------- Dashboard ----------------
import DashboardPage from './pages/dashboard/DashboardPage';

// ---------------- Investments ----------------
import InvestmentsPage from './pages/investments/InvestmentsPage';
import PlanDetailsPage from './pages/investments/PlanDetailsPage';
import MyInvestmentsPage from './pages/investments/MyInvestmentsPage';
import InvestmentDetailPage from './pages/investments/InvestmentDetailPage';

// ---------------- Wallet ----------------
import WithdrawPage from './pages/wallet/WithdrawPage';
import DepositPage from './pages/wallet/DepositPage';
import TransactionsPage from './pages/wallet/TransactionsPage';

// ---------------- Profile ----------------
import ProfilePage from './pages/profile/ProfilePage';
import EditProfilePage from './pages/profile/EditProfilePage';
import SecurityPage from './pages/profile/SecurityPage';

// ---------------- Referral ----------------
import ReferralPage from './pages/referral/ReferralPage';

// ---------------- Notifications ----------------
import NotificationsPage from './pages/notifications/NotificationsPage';

// ---------------- Admin ----------------
import AdminDashboard from './pages/admin/AdminDashboard';

/* ---------------- Protected Route ---------------- */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/* ---------------- Admin Route ---------------- */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/* ---------------- App Component ---------------- */
function App() {
  return (
    <BrowserRouter>
      {/* Global Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />

      <Routes>
        {/* ---------------- Public Routes ---------------- */}
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* ---------------- Protected Routes ---------------- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Investments */}
        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <InvestmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments/:planId"
          element={
            <ProtectedRoute>
              <PlanDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments/my-investments"
          element={
            <ProtectedRoute>
              <MyInvestmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments/:investmentId/details"
          element={
            <ProtectedRoute>
              <InvestmentDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Wallet */}
        <Route
          path="/wallet/withdraw"
          element={
            <ProtectedRoute>
              <WithdrawPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet/deposit"
          element={
            <ProtectedRoute>
              <DepositPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/security"
          element={
            <ProtectedRoute>
              <SecurityPage />
            </ProtectedRoute>
          }
        />

        {/* Referral */}
        <Route
          path="/referral"
          element={
            <ProtectedRoute>
              <ReferralPage />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ---------------- Catch All ---------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
