import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ArticlesPage from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import TagArticlesPage from './pages/TagArticlesPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetail />} />
        <Route path="/tags/:tagSlug" element={<TagArticlesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
