import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticles } from '../api/getArticle';

export default function AuthorArticlesPage() {
  const { authorName } = useParams();
  const [articles, setArticles] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticlesByAuthor = async () => {
      setLoading(true);
      try {
        const allArticles = await getArticles();
        
        // Filter articles by the author name from URL params
        const authorArticles = allArticles.filter(
          article => article.fields.authorName === authorName
        );
        
        setArticles(authorArticles);
        
        // Get author info from first article if available
        if (authorArticles.length > 0) {
          const firstArticle = authorArticles[0];
          setAuthorInfo({
            name: firstArticle.fields.authorName,
            role: firstArticle.fields.authorRole || 'Security Researcher',
            count: authorArticles.length
          });
        }
      } catch (err) {
        console.error("Error fetching author articles:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    if (authorName) {
      fetchArticlesByAuthor();
    }
  }, [authorName]);

  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="bi bi-shield-lock fs-3 me-2"></i>
            <span className="fw-bold">Cyber<span className="fw-light">Insights</span></span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto me-4">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/articles">Articles</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Playground</a>
              </li>
            </ul>
            <button className="btn btn-light rounded-pill px-4">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading articles...</p>
          </div>
        ) : (
          <>
            {/* Author Header */}
            {authorInfo && (
              <div className="mb-5">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "64px", height: "64px" }}>
                    <span className="text-white fs-3">{authorInfo.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h1 className="mb-1">{authorInfo.name}</h1>
                    <p className="text-muted mb-1">{authorInfo.role}</p>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-text me-1"></i>
                      <span>{authorInfo.count} {authorInfo.count === 1 ? 'article' : 'articles'}</span>
                    </div>
                  </div>
                </div>
                <hr className="my-4" />
              </div>
            )}

            {/* Articles Section */}
            <div className="row">
              <div className="col-lg-9">
                {articles.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-emoji-frown fs-1 text-muted"></i>
                    <p className="mt-3">No articles available from this author.</p>
                    <Link to="/articles" className="btn btn-primary mt-2">
                      Back to all articles
                    </Link>
                  </div>
                ) : (
                  <div>
                    <h2 className="h4 fw-bold mb-4">All articles by {authorName}</h2>
                    {articles.map((article, idx) => {
                      const { title, slug, subtitle, coverImage, publishedDate, readTime, tags } = article.fields;
                      return (
                        <article key={idx} className="border-bottom pb-4 mb-4">
                          <div className="row">
                            <div className="col-md-8">
                              <div className="d-flex align-items-center mb-2">
                                <span className="small text-muted">
                                  {publishedDate 
                                    ? new Date(publishedDate).toLocaleDateString('en-US', { 
                                        year: 'numeric',
                                        month: 'short', 
                                        day: 'numeric' 
                                      })
                                    : 'No date'}
                                </span>
                              </div>
                              
                              <Link to={`/articles/${slug}`} className="text-decoration-none text-dark">
                                <h3 className="h5 fw-bold mb-2 lh-sm">{title}</h3>
                                <p className="text-muted mb-2">{subtitle}</p>
                              </Link>
                              
                              <div className="d-flex align-items-center flex-wrap">
                                <span className="badge bg-light text-dark me-2 mb-2">{readTime || '5'} min read</span>
                                {tags && tags.map((tag, index) => (
                                  <span className="badge bg-primary text-light me-2 mb-2" key={index}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="col-md-4 mt-3 mt-md-0">
                              {coverImage && coverImage.fields && coverImage.fields.file ? (
                                <Link to={`/articles/${slug}`}>
                                  <img
                                    src={`https:${coverImage.fields.file.url}`}
                                    className="img-fluid rounded"
                                    alt={title}
                                    style={{ objectFit: "cover", height: "120px", width: "100%" }}
                                  />
                                </Link>
                              ) : (
                                <Link to={`/articles/${slug}`}>
                                  <div className="bg-light rounded d-flex align-items-center justify-content-center" 
                                       style={{ height: "120px", width: "100%" }}>
                                    <i className="bi bi-image text-muted fs-3"></i>
                                  </div>
                                </Link>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="col-lg-3 d-none d-lg-block">
                <div className="sticky-top" style={{ top: "20px" }}>
                  <div className="card border-0 bg-light mb-4">
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-3">Stay updated</h5>
                      <p className="card-text text-muted">Get the latest cybersecurity insights delivered to your inbox</p>
                      <div className="input-group mb-3">
                        <input type="email" className="form-control" placeholder="Enter your email" aria-label="Email address" />
                        <button className="btn btn-primary" type="button">Subscribe</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Link to="/articles" className="btn btn-outline-primary w-100">
                      <i className="bi bi-arrow-left me-2"></i>Back to all articles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-shield-lock fs-3 me-2"></i>
                <span className="fs-4 fw-bold">Cyber<span className="fw-light">Insights</span></span>
              </div>
              <p className="text-muted">Learn cybersecurity through immersive stories and hands-on simulations.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex justify-content-md-end gap-3 mb-3">
                <a href="#" className="text-white fs-5" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-white fs-5" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                <a href="#" className="text-white fs-5" aria-label="GitHub"><i className="bi bi-github"></i></a>
                <a href="#" className="text-white fs-5" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
              </div>
              <p className="text-muted">© 2025 CyberInsights. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Import Bootstrap Icons CSS */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
    </div>
  );
}