import { useEffect, useState, useRef } from 'react';
import { getArticles } from '../api/getArticle';
import { Link } from 'react-router-dom';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const tabsContainerRef = useRef(null);
  
  // Tab data with display names and values for better maintainability
  const tabs = [
    { value: 'all', display: 'All Articles' },
    { value: 'network', display: 'Network Security' },
    { value: 'web', display: 'Web Security' },
    { value: 'cloud', display: 'Cloud Security' },
    { value: 'app', display: 'Application Security' },
    { value: 'ai', display: 'AI Security' },
    { value: 'iot', display: 'IoT Security' },
    { value: 'mob', display: 'Mobile Security' },
    { value: 'crypto', display: 'Cryptography' },
    { value: 'pentest', display: 'Penetration Testing' },
    { value: 'auth', display: 'Authentication & Authorization' },
    { value: 'malware', display: 'Malware Analysis' },
    { value: 'privacy', display: 'Data Privacy' },
  ];
  
  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    const container = tabsContainerRef.current;
    if (!container) return;
    
    // Show left arrow only if scrolled right
    setShowLeftArrow(container.scrollLeft > 0);
    
    // Show right arrow only if can scroll more to right
    const scrollRightRemaining = container.scrollWidth - (container.scrollLeft + container.clientWidth);
    setShowRightArrow(scrollRightRemaining > 5); // 5px buffer for rounding errors
  };
  
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

  // Initialize and set up scroll event listener
  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      // Check initial scroll state
      checkScrollPosition();
      
      // Add scroll event listener
      container.addEventListener('scroll', checkScrollPosition);
      
      // Clean up
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  // Check arrow visibility after window resize
  useEffect(() => {
    const handleResize = () => {
      checkScrollPosition();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
        'ai': 'AI Security',
        'iot': 'IoT Security',
        'mob': 'Mobile Security',
        'crypto': 'Cryptography',
        'pentest': 'Penetration Testing',
        'auth': 'Authentication & Authorization',
        'malware': 'Malware Analysis',
        'privacy': 'Data Privacy'
      };
      
      const selectedTag = tabToTagMap[activeTab];
      
      const filtered = articles.filter(article => {
        const tags = article.fields.tags || [];
        return tags.some(tag => tag === selectedTag);
      });
      
      setFilteredArticles(filtered);
    }
  }, [activeTab, articles]);
  
  // Handle scrolling functions
  const scrollLeft = () => {
    const container = tabsContainerRef.current;
    if (container) {
      container.scrollLeft -= 200;
    }
  };
  
  const scrollRight = () => {
    const container = tabsContainerRef.current;
    if (container) {
      container.scrollLeft += 200;
    }
  };

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
        {/* Category Tabs - Medium-style with conditional scroll arrows */}
        <div className="border-bottom mb-4 position-relative">
          <div className="position-relative">
            {/* Left scroll arrow - only visible after scrolling right */}
            {showLeftArrow && (
              <button 
                className="btn position-absolute top-50 translate-middle-y z-1 bg-white bg-opacity-75 rounded-circle p-1 shadow-sm border-0 arrow-fade-in"
                style={{ width: "28px", height: "28px", left: "0"}}
                onClick={scrollLeft}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
            )}
            
            {/* Tabs container - with scroll monitoring */}
            <div 
              ref={tabsContainerRef}
              className="d-flex flex-nowrap overflow-auto hide-scrollbar pb-2 px-3" 
              style={{ gap: "1.5rem", scrollBehavior: "smooth" }}
            >
              {tabs.map((tab) => (
                <button 
                  key={tab.value}
                  className={`btn btn-link text-decoration-none fw-medium px-2 text-nowrap ${activeTab === tab.value ? 'text-dark fw-bold' : 'text-muted'}`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.display}
                </button>
              ))}
            </div>
            
            {/* Right scroll arrow - only visible when there's more content to scroll */}
            {showRightArrow && (
              <button 
                className="btn position-absolute top-50 translate-middle-y z-1 bg-white bg-opacity-75 rounded-circle p-1 shadow-sm border-0 arrow-fade-in"
                style={{ width: "28px", height: "28px", right: "0"}}
                onClick={scrollRight}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            )}
            
            {/* Slimmer gradient fade effects on sides - conditionally showing based on arrows */}
            {showLeftArrow && (
              <div className="position-absolute start-0 top-0 h-100" 
                   style={{ width: "30px", background: "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))" }}>
              </div>
            )}
            {showRightArrow && (
              <div className="position-absolute end-0 top-0 h-100" 
                   style={{ width: "30px", background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }}>
              </div>
            )}
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
                    <a href="#" className="badge bg-light text-dark text-decoration-none p-2">GRC</a>
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
        .arrow-fade-in {
          animation: fadeIn 0.2s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
}