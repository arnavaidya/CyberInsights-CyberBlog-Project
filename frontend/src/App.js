import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import TagArticlesPage from './pages/TagArticlesPage';
import AuthorArticlesPage from './pages/AuthorArticlesPage';
import CyberNewsPage from "./pages/CyberNews";
import PlaygroundPage from "./pages/Playgrounds";
import HashPlayground from "./pages/HashPlayground";
import CaesarCipherPlayground from "./pages/CaesarCipherPlayground";
import PasswordAnalyzer from "./pages/PasswrdAnalyzePlayground";
import DiffieHellmanPlayground from "./pages/DiffHellPlayground";
import RegistrationPage from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/tags/:tagSlug" element={<TagArticlesPage />} />
        <Route path="/author/:authorName" element={<AuthorArticlesPage />} />
        <Route path="/news" element={<CyberNewsPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/playground/hash-playground" element={<HashPlayground />} />
        <Route path="/playground/caesar-cipher" element={<CaesarCipherPlayground />} />
        <Route path="/playground/password-analyzer" element={<PasswordAnalyzer />} />
        <Route path="/playground/diffie-hellman" element={<DiffieHellmanPlayground />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;