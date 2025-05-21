import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function CyberNewsPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [topSources, setTopSources] = useState([]);
  const tabsContainerRef = useRef(null);
  
  // Define API key directly for now - in production, use proper environment variable handling
  // This is a temporary solution until environment variables are properly configured
  const API_KEY = "19bab821f96341e9b321dc26de511ebd";
  
  // Tab data with display names and values for better maintainability
  const tabs = [
    { value: 'all', display: 'All News' },
    { value: 'breach', display: 'Data Breaches' },
    { value: 'ransomware', display: 'Ransomware' },
    { value: 'vulnerability', display: 'Vulnerabilities' },
    { value: 'phishing', display: 'Phishing' },
    { value: 'malware', display: 'Malware' },
    { value: 'ai', display: 'AI Security' },
    { value: 'policy', display: 'Policy & Regulation' },
    { value: 'privacy', display: 'Privacy' },
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
    const fetchNews = async () => {
      setLoading(true);
      try {
        // More specific cybersecurity query with multiple terms to ensure relevance
        const query = 'cybersecurity AND (breach OR hack OR vulnerability OR threat OR ransomware OR malware OR phishing)';
        
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${API_KEY}`
        );
        const data = await res.json();
        
        if (data.status === 'ok' && data.articles) {
          // Filter articles server-side to ensure cybersecurity relevance
          const cybersecurityArticles = data.articles.filter(article => {
            const title = (article.title || '').toLowerCase();
            const description = (article.description || '').toLowerCase();
            
            // Keywords that indicate cybersecurity relevance
            const securityKeywords = [
              'cyber', 'security', 'hack', 'breach', 'malware', 'ransomware', 
              'phishing', 'vulnerability', 'exploit', 'threat', 'attack',
              'cve', 'patch', 'data leak', 'privacy', 'encryption'
            ];
            
            // Check if the article contains at least one cybersecurity keyword
            return securityKeywords.some(keyword => 
              title.includes(keyword) || description.includes(keyword)
            );
          });
          
          setArticles(cybersecurityArticles);
          setFilteredArticles(cybersecurityArticles);
          calculateTopSources(cybersecurityArticles);
        } else {
          console.error("API returned an error:", data.message);
          setArticles([]);
          setFilteredArticles([]);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setArticles([]);
        setFilteredArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Calculate the top 5 news sources based on article count
  const calculateTopSources = (articles) => {
    if (!articles || articles.length === 0) {
      setTopSources([]);
      return;
    }
    
    // Count articles per source
    const sourceCounts = {};
    
    articles.forEach(article => {
      const sourceName = article.source.name;
      if (sourceName) {
        sourceCounts[sourceName] = (sourceCounts[sourceName] || 0) + 1;
      }
    });
    
    // Convert to array of objects for sorting
    const sourceArray = Object.keys(sourceCounts).map(name => ({
      name,
      count: sourceCounts[name]
    }));
    
    // Sort by count (descending) and take top 5
    const sortedSources = sourceArray
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setTopSources(sortedSources);
  };

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
      // Map tab values to keywords for searching
      const tabToKeywordMap = {
        'breach': ['breach', 'data leak', 'exposed data', 'database exposed', 'leaked'],
        'ransomware': ['ransomware', 'ransom', 'encrypt files', 'decrypt', 'lockbit', 'ryuk'],
        'vulnerability': ['vulnerability', 'exploit', 'cve', 'patch', 'zero-day', 'flaw', 'security hole'],
        'phishing': ['phishing', 'social engineering', 'email scam', 'spoofing'],
        'malware': ['malware', 'virus', 'trojan', 'backdoor', 'spyware', 'botnet'],
        'ai': ['ai', 'artificial intelligence', 'machine learning', 'deep fake', 'neural network'],
        'policy': ['regulation', 'compliance', 'policy', 'gdpr', 'hipaa', 'ccpa', 'law', 'legislation'],
        'privacy': ['privacy', 'data protection', 'surveillance', 'tracking', 'anonymity']
      };
      
      const keywords = tabToKeywordMap[activeTab];
      
      const filtered = articles.filter(article => {
        const title = (article.title || '').toLowerCase();
        const description = (article.description || '').toLowerCase();
        const content = (article.content || '').toLowerCase();
        
        return keywords.some(keyword => 
          title.includes(keyword) || 
          description.includes(keyword) || 
          content.includes(keyword)
        );
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

  // Format publication date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
                <Link className="nav-link active" to="/news">News</Link>
              </li>
            </ul>
            <button className="btn btn-light rounded-pill px-4">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-4">
        {/* Page Title */}
        <div className="mb-4">
          <h1 className="h3 fw-bold d-flex align-items-center">
            <i className="bi bi-newspaper me-2"></i>
            Cybersecurity News
          </h1>
          <p className="text-muted">Stay updated with the latest cybersecurity news and developments</p>
        </div>
        
        {/* Category Tabs - Medium-style with conditional scroll arrows */}
        <div className="border-bottom mb-4 position-relative">
          <div className="position-relative">
            {/* Left scroll arrow - only visible after scrolling right */}
            {showLeftArrow && (
              <button 
                className="btn position-absolute top-50 z-1 bg-white bg-opacity-75 rounded-circle p-1 shadow-sm border-0 arrow-fade-in"
                style={{ width: "28px", height: "28px", left: "0", transform: "translateY(-50%)" }}
                onClick={scrollLeft}
                aria-label="Scroll left"
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
                className="btn position-absolute top-50 z-1 bg-white bg-opacity-75 rounded-circle p-1 shadow-sm border-0 arrow-fade-in"
                style={{ width: "28px", height: "28px", right: "0", transform: "translateY(-50%)" }}
                onClick={scrollRight}
                aria-label="Scroll right"
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
        
        {/* News Listings */}
        <div className="row">
          <div className="col-lg-8">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading news articles...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-emoji-frown fs-1 text-muted"></i>
                <p className="mt-3">No news articles available in this category.</p>
              </div>
            ) : (
              <div>
                {filteredArticles.map((article, idx) => {
                  return (
                    <article key={idx} className="border-bottom pb-4 mb-4">
                      <div className="row">
                        <div className="col-md-8">
                          <div className="d-flex align-items-center mb-2">
                            <div className="d-flex align-items-center">
                              <a href="#" className="text-decoration-none">
                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: "24px", height: "24px" }}>
                                  <span className="text-white small" style={{ fontSize: "12px" }}>{article.source.name ? article.source.name.charAt(0) : 'N'}</span>
                                </div>
                              </a>
                              <a href="#" className="text-decoration-none text-muted">
                                <span className="small">{article.source.name || 'News Source'}</span>
                              </a>
                            </div>
                            <span className="mx-2 text-muted">·</span>
                            <span className="small text-muted">
                              {article.publishedAt ? formatDate(article.publishedAt) : 'No date'}
                            </span>
                          </div>
                          
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
                            <h2 className="h4 fw-bold mb-2 lh-sm">{article.title}</h2>
                            <p className="text-muted mb-2">{article.description}</p>
                          </a>
                        </div>
                        
                        <div className="col-md-4 mt-3 mt-md-0">
                          {article.urlToImage ? (
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={article.urlToImage}
                                className="img-fluid rounded"
                                alt={article.title}
                                style={{ objectFit: "cover", height: "120px", width: "100%" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                }}
                              />
                            </a>
                          ) : (
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                              <div className="bg-light rounded d-flex align-items-center justify-content-center" 
                                   style={{ height: "120px", width: "100%" }}>
                                <i className="bi bi-image text-muted fs-3"></i>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
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
        .hover-author:hover {
          background-color: rgba(13, 110, 253, 0.05);
          border-radius: 6px;
          padding: 8px;
          margin: -8px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
}