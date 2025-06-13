import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticles } from '../api/getArticle';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AuthorArticlesPage() {
  const { authorName } = useParams();
  const [articles, setArticles] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [topAuthors, setTopAuthors] = useState([]);
  
  useEffect(() => {
    // Add transition styles to document head
    const style = document.createElement('style');
    style.innerHTML = `
      .page-transition {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.4s ease, transform 0.4s ease;
      }
      .page-transition.loaded {
        opacity: 1;
        transform: translateY(0);
      }
      .article-item {
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .article-item.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .hover-author {
        transition: all 0.2s ease;
        padding: 8px;
      }
      .hover-author:hover {
        transform: translateX(5px);
        background-color: rgba(0,0,0,0.03);
        border-radius: 5px;
      }
      .image-hover-effect {
        display: block;
        overflow: hidden;
        border-radius: 0.25rem;
      }
      .image-hover-effect img, 
      .image-hover-effect div {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .image-hover-effect:hover img,
      .image-hover-effect:hover div {
        transform: scale(1.03);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      .transition-all {
        transition: all 0.3s ease;
      }
      .hover-zoom:hover h3 {
        color: #0d6efd;
        transition: color 0.2s ease;
      }
    `;
    document.head.appendChild(style);
    
    // Set page as loaded after a small delay for transition effect
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 100);
    
    return () => {
      document.head.removeChild(style);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const fetchArticlesByAuthor = async () => {
      setLoading(true);
      // Reset page loaded state when changing authors
      setPageLoaded(false);
      
      try {
        const allArticles = await getArticles();
        
        // Filter articles by the author name from URL params
        const authorArticles = allArticles.filter(
          article => article.fields?.authorName === authorName
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

        // Get top authors from all articles
        const authorsMap = {};
        allArticles.forEach(article => {
          if (article.fields?.authorName) {
            const authorName = article.fields.authorName;
            if (!authorsMap[authorName]) {
              authorsMap[authorName] = {
                name: authorName,
                role: article.fields.authorRole || 'Security Researcher',
                count: 1
              };
            } else {
              authorsMap[authorName].count += 1;
            }
          }
        });

        // Convert to array and sort by article count
        const topAuthorsList = Object.values(authorsMap)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5); // Get top 5 authors
        
        setTopAuthors(topAuthorsList);
      } catch (err) {
        console.error("Error fetching author articles:", err);
        setArticles([]);
      } finally {
        setLoading(false);
        // Set page as loaded after a slight delay for the animation
        setTimeout(() => {
          setPageLoaded(true);
        }, 100);
      }
    };

    if (authorName) {
      fetchArticlesByAuthor();
    }
  }, [authorName]);

  return (
    <div className="bg-white">
      <Header />

      {/* Main Content */}
      <div className="container py-5">
        {loading ? (
          <div className="text-center py-5 page-transition loaded">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading articles...</p>
          </div>
        ) : (
          <div className={`page-transition ${pageLoaded ? 'loaded' : ''}`}>
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
                      const { title, slug, subtitle, coverImage, publishedDate, readTime, tags } = article.fields || {};
                      return (
                        <article 
                          key={idx} 
                          className={`article-item border-bottom pb-4 mb-4 ${pageLoaded ? 'visible' : ''}`} 
                          style={{ transitionDelay: `${idx * 100}ms` }}
                        >
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
                              
                              <Link to={`/articles/${slug || ''}`} className="text-decoration-none text-dark hover-zoom">
                                <h3 className="h5 fw-bold mb-2 lh-sm">{title || 'Untitled Article'}</h3>
                                <p className="text-muted mb-2">{subtitle || ''}</p>
                              </Link>
                              
                              <div className="d-flex align-items-center flex-wrap">
                                <span className="badge bg-light text-dark me-2 mb-2">{readTime || '5'} min read</span>
                                {tags && Array.isArray(tags) && tags.map((tag, index) => (
                                  <span className="badge bg-primary text-light me-2 mb-2" key={index}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="col-md-4 mt-3 mt-md-0">
                              {coverImage && coverImage.fields && coverImage.fields.file ? (
                                <Link to={`/articles/${slug || ''}`} className="image-hover-effect">
                                  <img
                                    src={`https:${coverImage.fields.file.url}`}
                                    className="img-fluid rounded shadow-sm transition-all"
                                    alt={title || 'Article image'}
                                    style={{ objectFit: "cover", height: "120px", width: "100%" }}
                                  />
                                </Link>
                              ) : (
                                <Link to={`/articles/${slug || ''}`} className="image-hover-effect">
                                  <div className="bg-light rounded d-flex align-items-center justify-content-center shadow-sm transition-all" 
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
                  <div className="mb-4 page-transition loaded">
                    <h5 className="fw-bold mb-3">Top writers</h5>
                    <div className="d-flex flex-column gap-2">
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
                          <Link 
                            key={idx} 
                            to={`/author/${author.name}`} 
                            className={`d-flex align-items-center text-decoration-none ${author.name === authorName ? 'fw-bold' : 'text-dark'} transition-all hover-author`}
                            style={{ 
                              transitionDelay: `${idx * 50}ms`,
                              opacity: pageLoaded ? 1 : 0,
                              transform: pageLoaded ? 'translateX(0)' : 'translateX(20px)'
                            }}
                          >
                            <div className={`${author.name === authorName ? 'bg-success' : 'bg-primary'} rounded-circle d-flex align-items-center justify-content-center me-2`} 
                                 style={{ width: "32px", height: "32px" }}>
                              <span className="text-white">{author.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="mb-0 fw-medium">{author.name}</p>
                              <div className="d-flex align-items-center">
                                <small className="text-muted">{author.role}</small>
                                <span className="mx-1 text-muted"></span>
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
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
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}