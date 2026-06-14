import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Loader from './components/common/Loader';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ChatBot from './components/chat/ChatBot';

const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Programs = lazy(() => import('./pages/public/Programs'));
const PublicEvents = lazy(() => import('./pages/public/Events'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));
const ForgotPassword = lazy(() => import('./pages/public/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/public/ResetPassword'));
const VolunteerRegistration = lazy(() => import('./pages/public/VolunteerRegistration'));
const InternshipApplication = lazy(() => import('./pages/public/InternshipApplication'));

const VolunteerDashboard = lazy(() => import('./pages/volunteer/VolunteerDashboard'));
const VolunteerProfile = lazy(() => import('./pages/volunteer/VolunteerProfile'));
const MyEvents = lazy(() => import('./pages/volunteer/MyEvents'));
const MyCertificates = lazy(() => import('./pages/volunteer/MyCertificates'));
const VolunteerNotifications = lazy(() => import('./pages/volunteer/Notifications'));

const InternDashboard = lazy(() => import('./pages/intern/InternDashboard'));
const ApplicationStatus = lazy(() => import('./pages/intern/ApplicationStatus'));
const TasksPage = lazy(() => import('./pages/intern/TasksPage'));
const InternNotifications = lazy(() => import('./pages/intern/InternNotifications'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const VolunteersPage = lazy(() => import('./pages/admin/VolunteersPage'));
const InternshipsPage = lazy(() => import('./pages/admin/InternshipsPage'));
const AdminEventsPage = lazy(() => import('./pages/admin/AdminEventsPage'));
const CertificatesPage = lazy(() => import('./pages/admin/CertificatesPage'));
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to={`/${user.role}/dashboard`} />;
  return children;
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ChatBot />
    </>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Suspense fallback={<Loader />}><Home /></Suspense></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><Suspense fallback={<Loader />}><About /></Suspense></PublicLayout>} />
      <Route path="/programs" element={<PublicLayout><Suspense fallback={<Loader />}><Programs /></Suspense></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><Suspense fallback={<Loader />}><PublicEvents /></Suspense></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Suspense fallback={<Loader />}><Contact /></Suspense></PublicLayout>} />
      <Route path="/volunteer-registration" element={<PublicLayout><Suspense fallback={<Loader />}><VolunteerRegistration /></Suspense></PublicLayout>} />
      <Route path="/internship-application" element={<PublicLayout><Suspense fallback={<Loader />}><InternshipApplication /></Suspense></PublicLayout>} />
      <Route path="/login" element={<PublicRoute><Suspense fallback={<Loader />}><Login /></Suspense></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Suspense fallback={<Loader />}><Register /></Suspense></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><Suspense fallback={<Loader />}><ForgotPassword /></Suspense></PublicRoute>} />
      <Route path="/reset-password/:token" element={<Suspense fallback={<Loader />}><ResetPassword /></Suspense>} />

      <Route path="/volunteer/dashboard" element={<ProtectedRoute allowedRoles={['volunteer']}><DashboardLayout><Suspense fallback={<Loader />}><VolunteerDashboard /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/volunteer/profile" element={<ProtectedRoute allowedRoles={['volunteer']}><DashboardLayout><Suspense fallback={<Loader />}><VolunteerProfile /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/volunteer/events" element={<ProtectedRoute allowedRoles={['volunteer']}><DashboardLayout><Suspense fallback={<Loader />}><MyEvents /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/volunteer/certificates" element={<ProtectedRoute allowedRoles={['volunteer']}><DashboardLayout><Suspense fallback={<Loader />}><MyCertificates /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/volunteer/notifications" element={<ProtectedRoute allowedRoles={['volunteer']}><DashboardLayout><Suspense fallback={<Loader />}><VolunteerNotifications /></Suspense></DashboardLayout></ProtectedRoute>} />

      <Route path="/intern/dashboard" element={<ProtectedRoute allowedRoles={['intern']}><DashboardLayout><Suspense fallback={<Loader />}><InternDashboard /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/intern/application" element={<ProtectedRoute allowedRoles={['intern']}><DashboardLayout><Suspense fallback={<Loader />}><ApplicationStatus /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/intern/tasks" element={<ProtectedRoute allowedRoles={['intern']}><DashboardLayout><Suspense fallback={<Loader />}><TasksPage /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/intern/notifications" element={<ProtectedRoute allowedRoles={['intern']}><DashboardLayout><Suspense fallback={<Loader />}><InternNotifications /></Suspense></DashboardLayout></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Suspense fallback={<Loader />}><AdminDashboard /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/volunteers" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Suspense fallback={<Loader />}><VolunteersPage /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/internships" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Suspense fallback={<Loader />}><InternshipsPage /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Suspense fallback={<Loader />}><AdminEventsPage /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/certificates" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Suspense fallback={<Loader />}><CertificatesPage /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Suspense fallback={<Loader />}><AnalyticsPage /></Suspense></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><Suspense fallback={<Loader />}><SettingsPage /></Suspense></DashboardLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{
            duration: 4000,
            style: { borderRadius: '12px', padding: '12px 16px' }
          }} />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
