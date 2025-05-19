import { useEffect, useState, useRef } from 'react';
import { getArticles } from '../api/getArticle';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function TagArticlesPage() {
  const { tagSlug } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTag, setCurrentTag] = useState('');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [topAuthors, setTopAuthors] = useState([]);
  const tabsContainerRef = useRef(null);
  
  // Define all available tags for navigation with proper casing
  const discoverTags = [
    'Ransomware',
    'Zero Trust',
    'Encryption',
    'OWASP Top 10',
    'Threat Intel',
    'Security Testing',
    'GRC',
    'Social Engineering'
  ];
  
  // Create a mapping between slug and proper display name
  const slugToTagMap = {};
  discoverTags.forEach(tag => {
    slugToTagMap[tag.toLowerCase().replace(/\s+/g, '-')] = tag;
  });
  
  // Convert URL slug to display name preserving original casing
  const slugToDisplayName = (slug) => {
    if (!slug) return '';
    
    // Use the mapping to get the proper cased tag name
    return slugToTagMap[slug] || 
      // Fallback to capitalize each word if not found in map
      slug.split('-')
         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
         .join(' ');
  };
  
  // Convert display name to slug
  const displayNameToSlug = (displayName) => {
    if (!displayName) return '';
    return displayName.toLowerCase().replace(/\s+/g, '-');
  };
  
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
    // Find the properly cased tag from the slug
    const properCasedTag = slugToDisplayName(tagSlug);
    setCurrentTag(properCasedTag);
    
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const data = await getArticles();
        setArticles(data || []);
        
        // Calculate top 5 authors based on number of articles
        calculateTopAuthors(data);
      } catch (err) {
        console.error("Error fetching articles:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [tagSlug]);

  // Calculate the top 5 authors based on publication count
  const calculateTopAuthors = (articles) => {
    if (!articles || articles.length === 0) {
      setTopAuthors([]);
      return;
    }
    
    // Count publications per author
    const authorCounts = {};
    
    articles.forEach(article => {
      const authorName = article.fields.authorName;
      if (authorName) {
        authorCounts[authorName] = (authorCounts[authorName] || 0) + 1;
      }
    });
    
    // Convert to array of objects for sorting
    const authorArray = Object.keys(authorCounts).map(name => ({
      name,
      count: authorCounts[name],
      // Extract role from the first article by this author
      role: articles.find(a => a.fields.authorName === name)?.fields.authorRole || 'Security Researcher'
    }));
    
    // Sort by count (descending) and take top 5
    const sortedAuthors = authorArray
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setTopAuthors(sortedAuthors);
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

  // Filter articles based on selected tag
  useEffect(() => {
    if (!articles.length || !currentTag) return;
    
    const filtered = articles.filter(article => {
      const tags = article.fields.tags || [];
      // Case-insensitive comparison to handle tags with different casings
      return tags.some(tag => tag.toLowerCase() === currentTag.toLowerCase());
    });
    
    setFilteredArticles(filtered);
  }, [currentTag, articles]);
  
  // Handle tag selection
  const handleTagChange = (tagName) => {
    navigate(`/tags/${displayNameToSlug(tagName)}`);
  };
  
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

  // Helper function to check if a tag matches the current tag (case insensitive)
  const isCurrentTag = (tag) => {
    return tag.toLowerCase() === currentTag.toLowerCase();
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
                <Link className="nav-link" to="/articles">Articles</Link>
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
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="h3 fw-bold">{currentTag || 'Tagged Articles'}</h1>
          <p className="text-muted">Discover the latest insights on {currentTag}</p>
        </div>
        
        {/* Category Tabs - Medium-style with conditional scroll arrows */}
        <div className="border-bottom mb-4 position-relative">
          <div className="position-relative">
            {/* Left scroll arrow - only visible after scrolling right */}
            {showLeftArrow && (
              <button 
                className="btn position-absolute top-50 translate-middle-y z-1 bg-white bg-opacity-75 rounded-circle p-1 shadow-sm border-0 arrow-fade-in"
                style={{ width: "28px", height: "28px", left: "0", transform: "translateY(-65%)" }}
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
              {discoverTags.map((tag) => (
                <button 
                  key={tag}
                  className={`btn btn-link text-decoration-none fw-medium px-2 text-nowrap ${isCurrentTag(tag) ? 'text-dark fw-bold' : 'text-muted'}`}
                  onClick={() => handleTagChange(tag)}
                >
                  {tag}
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
                <p className="mt-3">No articles available for {currentTag}.</p>
                <Link to="/articles" className="btn btn-outline-primary mt-2">
                  Explore all articles
                </Link>
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
                              <span 
                                className={`badge me-2 ${isCurrentTag(tag) ? 'bg-primary text-light' : 'bg-light text-dark'}`} 
                                key={index}
                              >
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
                  <h5 className="fw-bold mb-3">Browse by topic</h5>
                  <div className="d-flex flex-wrap gap-2">
                    <Link to="/articles" className="badge bg-light text-dark text-decoration-none p-2">All Articles</Link>
                    {discoverTags.map((tag, index) => (
                      <Link 
                        key={index} 
                        to={`/tags/${displayNameToSlug(tag)}`} 
                        className={`badge text-decoration-none p-2 ${isCurrentTag(tag) ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                      >
                        {tag}
                      </Link>
                    ))}
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
                    {loading ? (
                      <div className="text-center py-2">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : topAuthors.length === 0 ? (
                      <p className="text-muted">No authors available</p>
                    ) : (
                      topAuthors.map((author, idx) => (
                        <div key={idx} className="d-flex align-items-center">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                               style={{ width: "32px", height: "32px" }}>
                            <span className="text-white">{author.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="mb-0 fw-medium">{author.name}</p>
                            <small className="text-muted">{author.role}</small>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                <div className="card border bg-white mb-4">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">Related resources</h5>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <a href="#" className="text-decoration-none d-flex align-items-center">
                          <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                          <span>{currentTag} Guide</span>
                        </a>
                      </li>
                      <li className="mb-2">
                        <a href="#" className="text-decoration-none d-flex align-items-center">
                          <i className="bi bi-play-circle me-2 text-primary"></i>
                          <span>Webinar: {currentTag} Explained</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-decoration-none d-flex align-items-center">
                          <i className="bi bi-tools me-2 text-primary"></i>
                          <span>{currentTag} Tools</span>
                        </a>
                      </li>
                    </ul>
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