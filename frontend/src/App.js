import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ArticlesPage from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import TagArticlesPage from './pages/TagArticlesPage';
import AuthorArticlesPage from './pages/AuthorArticlesPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/tags/:tagSlug" element={<TagArticlesPage />} />
        <Route path="/author/:authorName" element={<AuthorArticlesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
