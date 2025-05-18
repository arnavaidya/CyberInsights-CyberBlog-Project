import { useEffect, useState } from 'react';
import { getArticles } from '../api/getArticle';
import { Link } from 'react-router-dom';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data = await getArticles();
        console.log("Fetched Articles:", data);
        setArticles(data || []);
        setFilteredArticles(data || []);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setArticles([]);
        setFilteredArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Filter articles based on selected tab
  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredArticles(articles);
    } else {
      // Map tab names to expected tag values
      const tabToTagMap = {
        'network': 'Network Security',
        'web': 'Web Security',
        'cloud': 'Cloud Security',
        'app': 'Application Security',
        'ai': 'AI Security'
      };
      
      const selectedTag = tabToTagMap[activeTab];
      
      const filtered = articles.filter(article => {
        const tags = article.fields.tags || [];
        return tags.some(tag => tag === selectedTag);
      });
      
      setFilteredArticles(filtered);
    }
  }, [activeTab, articles]);

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
                <a className="nav-link" href="#">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Playground</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">News</a>
              </li>
            </ul>
            <button className="btn btn-light rounded-pill px-4">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4">
        {/* Category Tabs - Updated with highlighting instead of border */}
        <div className="border-bottom mb-4">
          <div className="d-flex flex-nowrap overflow-auto hide-scrollbar pb-2" style={{ gap: "1rem" }}>
            <button 
              className={`btn btn-link text-decoration-none fw-medium px-2 ${activeTab === 'all' ? 'text-dark fw-bold' : 'text-muted'}`}
              onClick={() => setActiveTab('all')}
            >
              All Articles
            </button>
            <button 
              className={`btn btn-link text-decoration-none fw-medium px-2 ${activeTab === 'network' ? 'text-dark fw-bold' : 'text-muted'}`}
              onClick={() => setActiveTab('network')}
            >
              Network Security
            </button>
            <button 
              className={`btn btn-link text-decoration-none fw-medium px-2 ${activeTab === 'web' ? 'text-dark fw-bold' : 'text-muted'}`}
              onClick={() => setActiveTab('web')}
            >
              Web Security
            </button>
            <button 
              className={`btn btn-link text-decoration-none fw-medium px-2 ${activeTab === 'cloud' ? 'text-dark fw-bold' : 'text-muted'}`}
              onClick={() => setActiveTab('cloud')}
            >
              Cloud Security
            </button>
            <button 
              className={`btn btn-link text-decoration-none fw-medium px-2 ${activeTab === 'app' ? 'text-dark fw-bold' : 'text-muted'}`}
              onClick={() => setActiveTab('app')}
            >
              Application Security
            </button>
            <button 
              className={`btn btn-link text-decoration-none fw-medium px-2 ${activeTab === 'ai' ? 'text-dark fw-bold' : 'text-muted'}`}
              onClick={() => setActiveTab('ai')}
            >
              AI Security
            </button>
          </div>
        </div>
        
        {/* Article Listings - Medium-style vertical layout */}
        <div className="row">
          <div className="col-lg-8">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading articles...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-emoji-frown fs-1 text-muted"></i>
                <p className="mt-3">No articles available in this category.</p>
              </div>
            ) : (
              <div>
                {filteredArticles.map((article, idx) => {
                  const { title, slug, subtitle, coverImage, publishedDate, readTime, tags, authorName } = article.fields;
                  return (
                    <article key={idx} className="border-bottom pb-4 mb-4">
                      <div className="row">
                        <div className="col-md-8">
                          <div className="d-flex align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "24px", height: "24px" }}>
                                <span className="text-white small" style={{ fontSize: "12px" }}>{authorName.charAt(0)}</span>
                              </div>
                              <span className="small text-muted">{authorName}</span>
                            </div>
                            <span className="mx-2 text-muted">·</span>
                            <span className="small text-muted">{new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          
                          <Link to={`/articles/${slug}`} className="text-decoration-none text-dark">
                            <h2 className="h4 fw-bold mb-2 lh-sm">{title}</h2>
                            <p className="text-muted mb-2">{subtitle}</p>
                          </Link>
                          
                          <div className="d-flex align-items-center">
                            <span className="badge bg-light text-dark me-2">{readTime} min read</span>
                            {tags && tags.slice(0, 2).map((tag, index) => (
                              <span className="badge bg-primary text-light me-2" key={index}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="col-md-4 mt-3 mt-md-0">
                          {coverImage && coverImage.fields && (
                            <Link to={`/articles/${slug}`}>
                              <img
                                src={`https:${coverImage.fields.file.url}`}
                                className="img-fluid rounded"
                                alt={title}
                                style={{ objectFit: "cover", height: "120px", width: "100%" }}
                              />
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
          <div className="col-lg-4 d-none d-lg-block">
            <div className="ps-4">
              <div className="sticky-top" style={{ top: "20px" }}>
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Discover more</h5>
                  <div className="d-flex flex-wrap gap-2">
                    <a href="#" className="badge bg-light text-dark text-decoration-none p-2">Ransomware</a>
                    <a href="#" className="badge bg-light text-dark text-decoration-none p-2">Zero Trust</a>
                    <a href="#" className="badge bg-light text-dark text-decoration-none p-2">Encryption</a>
                    <a href="#" className="badge bg-light text-dark text-decoration-none p-2">OWASP Top 10</a>
                    <a href="#" className="badge bg-light text-dark text-decoration-none p-2">Threat Intel</a>
                    <a href="#" className="badge bg-light text-dark text-decoration-none p-2">Security Testing</a>
                    <a href="#" className="badge bg-light text-dark text-decoration-none p-2">Cloud Security</a>
                    <a href="#" className="badge bg-light text-dark text-decoration-none p-2">Social Engineering</a>
                  </div>
                </div>
                
                <div className="card border-0 bg-light mb-4">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">Stay updated</h5>
                    <p className="card-text text-muted">Get the latest cybersecurity insights delivered to your inbox</p>
                    <div className="input-group mb-3">
                      <input type="email" className="form-control" placeholder="Enter your email" />
                      <button className="btn btn-primary" type="button">Subscribe</button>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="fw-bold mb-3">Top writers</h5>
                  <div className="d-flex flex-column gap-3">
                    {["Sarah Connor", "John Smith", "Ada Lovelace", "Bruce Schneier"].map((writer, idx) => (
                      <div key={idx} className="d-flex align-items-center">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "32px", height: "32px" }}>
                          <span className="text-white">{writer.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="mb-0 fw-medium">{writer}</p>
                          <small className="text-muted">Security Researcher</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                <a href="#" className="text-white fs-5"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-white fs-5"><i className="bi bi-linkedin"></i></a>
                <a href="#" className="text-white fs-5"><i className="bi bi-github"></i></a>
                <a href="#" className="text-white fs-5"><i className="bi bi-youtube"></i></a>
              </div>
              <p className="text-muted">© 2025 CyberInsights. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Import Bootstrap Icons CSS */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
      
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}