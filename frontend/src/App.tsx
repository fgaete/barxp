import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import GroupsPage from './pages/GroupsPage.tsx';
import AddDrinkPage from './pages/AddDrinkPage.tsx';
import AchievementsPage from './pages/AchievementsPage.tsx';
import DrinkHistoryPage from './pages/DrinkHistoryPage.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import BottomNavigation from './components/BottomNavigation.tsx';
import InviteHandler from './components/InviteHandler';

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 mobile-safe">
      <InviteHandler />
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/add-drink" element={<AddDrinkPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/history" element={<DrinkHistoryPage />} />
        </Routes>
      </main>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
