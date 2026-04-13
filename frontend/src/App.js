import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// User pages
import Home from './pages/user/Home';
import NewsPage from './pages/user/NewsPage';
import NewsDetail from './pages/user/NewsDetail';
import MatchesPage from './pages/user/MatchesPage';
import MatchDetail from './pages/user/MatchDetail';
import VideosPage from './pages/user/VideosPage';
import VideoDetail from './pages/user/VideoDetail';
import StarsPage from './pages/user/StarsPage';
import StarDetail from './pages/user/StarDetail';
import ArticlesPage from './pages/user/ArticlesPage';
import ArticleDetail from './pages/user/ArticleDetail';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Feedback from './pages/user/Feedback';
import Profile from './pages/user/Profile';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminMatches from './pages/admin/AdminMatches';
import AdminVideos from './pages/admin/AdminVideos';
import AdminStars from './pages/admin/AdminStars';
import AdminArticles from './pages/admin/AdminArticles';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProfile from './pages/admin/AdminProfile';
import AdminFeedback from './pages/admin/AdminFeedback';

const PublicLayout = ({ children }) => (
  <div className="app-shell">
    <Navbar />
    <main className="app-main">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/news" element={<PublicLayout><NewsPage /></PublicLayout>} />
          <Route path="/news/:id" element={<PublicLayout><NewsDetail /></PublicLayout>} />
          <Route path="/matches" element={<PublicLayout><MatchesPage /></PublicLayout>} />
          <Route path="/matches/:id" element={<PublicLayout><MatchDetail /></PublicLayout>} />
          <Route path="/videos" element={<PublicLayout><VideosPage /></PublicLayout>} />
          <Route path="/videos/:id" element={<PublicLayout><VideoDetail /></PublicLayout>} />
          <Route path="/stars" element={<PublicLayout><StarsPage /></PublicLayout>} />
          <Route path="/stars/:id" element={<PublicLayout><StarDetail /></PublicLayout>} />
          <Route path="/articles" element={<PublicLayout><ArticlesPage /></PublicLayout>} />
          <Route path="/articles/:id" element={<PublicLayout><ArticleDetail /></PublicLayout>} />
          <Route path="/feedback" element={<PublicLayout><Feedback /></PublicLayout>} />
          <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="stars" element={<AdminStars />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
