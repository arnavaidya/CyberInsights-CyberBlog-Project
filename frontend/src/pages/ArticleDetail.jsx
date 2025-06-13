import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from '../lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    async function getArticle() {
      setLoading(true);
      try {
        const res = await client.getEntries({
          content_type: 'blogPost',
          'fields.slug': slug,
        });
        
        if (res.items.length > 0) {
          setArticle(res.items[0]);
          
          // Fetch related articles with any matching tag
          if (res.items[0].fields.tags && res.items[0].fields.tags.length > 0) {
            const currentArticleTags = res.items[0].fields.tags;
            
            // Create a query to find articles that share any tag with the current article
            const tagQueries = currentArticleTags.map(tag => `fields.tags=${tag}`).join('&');
            
            // Using the Contentful Search API with multiple tag conditions
            const relatedRes = await client.getEntries({
              content_type: 'blogPost',
              'fields.slug[ne]': slug, // Exclude current article
              limit: 10, // Fetch more to ensure we get enough after filtering
            });
            
            // Filter the results to find articles with at least one matching tag
            const filteredRelated = relatedRes.items.filter(item => {
              if (!item.fields.tags) return false;
              
              // Check if any tag in the current article matches any tag in this potential related article
              return item.fields.tags.some(tag => currentArticleTags.includes(tag));
            });
            
            // Take the first 3 articles after filtering
            setRelatedArticles(filteredRelated.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    }
    
    getArticle();
    // Scroll to top when article changes
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white min-vh-100">
        <Header />
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-white min-vh-100">
        <Header />
        <div className="container text-center py-5">
          <i className="bi bi-emoji-frown fs-1 text-muted"></i>
          <h2 className="mt-3">Article not found</h2>
          <p className="text-muted">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn btn-primary mt-3">Back to Articles</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const {
    title,
    subtitle,
    coverImage,
    content,
    authorName,
    authorRole,
    authorImage,
    publishedDate,
    tags,
    readTime,
  } = article.fields;

  // Format published date nicely
  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="bg-white">
      <Header />

      <div className="container py-4">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            {/* Article metadata and author info */}
            <div className="d-flex align-items-center mb-4">
              <div className="d-flex align-items-center">
                <Link to={`/author/${authorName}`} className="text-decoration-none">
                  {authorImage ? (
                    <img 
                      src={authorImage.fields.file.url} 
                      alt={authorName}
                      className="rounded-circle me-2"
                      width="42"
                      height="42"
                    />
                  ) : (
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                         style={{ width: "42px", height: "42px" }}>
                      <span className="text-white">{authorName ? authorName.charAt(0) : 'A'}</span>
                    </div>
                  )}
                </Link>
                <div>
                  <Link to={`/author/${authorName}`} className="text-decoration-none text-dark">
                    <span className="fw-bold">{authorName || 'Anonymous'}</span>
                  </Link>
                  {authorRole && (
                    <div className="small text-muted">{authorRole}</div>
                  )}
                </div>
              </div>
              <span className="mx-2 text-muted">·</span>
              <span className="text-muted small">
                {formattedDate}
              </span>
              {readTime && (
                <>
                  <span className="mx-2 text-muted">·</span>
                  <span className="text-muted small">{readTime} min read</span>
                </>
              )}
            </div>

            {/* Article Title */}
            <h1 className="fw-bold mb-3 lh-sm">{title}</h1>

            {/* Article Subtitle */}
            {subtitle && (
              <h2 className="fs-4 fw-normal text-muted mb-4 lh-base">{subtitle}</h2>
            )}

            {/* Article Tags */}
            {tags && tags.length > 0 && (
              <div className="mb-4">
                {tags.map((tag) => (
                  <Link 
                    key={tag} 
                    to={`/?tag=${tag}`}
                    className="badge bg-primary text-light text-decoration-none me-2 p-2"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Cover Image */}
            {coverImage && (
              <div className="mb-5">
                <img
                  src={`https:${coverImage.fields.file.url}`}
                  alt={title}
                  className="img-fluid rounded w-100"
                  style={{ 
                    maxHeight: '500px',
                    objectFit: 'cover'
                  }}
                />
                {coverImage.fields.description && (
                  <figcaption className="small text-muted mt-2 text-center">
                    {coverImage.fields.description}
                  </figcaption>
                )}
              </div>
            )}

            {/* Article Content */}
            <div className="article-content fs-5">
              {documentToReactComponents(content)}
            </div>

            {/* Article Footer */}
            <div className="border-top border-bottom py-4 my-5">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Link to={`/author/${authorName}`} className="text-decoration-none">
                    {authorImage ? (
                      <img 
                        src={authorImage.fields.file.url} 
                        alt={authorName}
                        className="rounded-circle me-3"
                        width="60"
                        height="60"
                      />
                    ) : (
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                           style={{ width: "60px", height: "60px" }}>
                        <span className="text-white fs-4">{authorName ? authorName.charAt(0) : 'A'}</span>
                      </div>
                    )}
                  </Link>
                  <div>
                    <p className="text-muted mb-1">Written by</p>
                    <Link to={`/author/${authorName}`} className="text-decoration-none text-dark">
                      <h5 className="fw-bold mb-0">{authorName || 'Anonymous'}</h5>
                    </Link>
                    {authorRole && (
                      <span className="text-muted small">{authorRole}</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="d-flex gap-2">
                    <a href="#" className="btn btn-outline-dark rounded-circle" aria-label="Share on Twitter">
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href="#" className="btn btn-outline-dark rounded-circle" aria-label="Share on LinkedIn">
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a href="#" className="btn btn-outline-dark rounded-circle" aria-label="Share on Facebook">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#" className="btn btn-outline-dark rounded-circle" aria-label="Copy link">
                      <i className="bi bi-link-45deg"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-5">
                <h3 className="fw-bold mb-4">Related Articles</h3>
                <div className="row">
                  {relatedArticles.map((relArticle, idx) => {
                    const { title, slug, coverImage, authorName, readTime, tags } = relArticle.fields;
                    
                    // Find matching tags between current article and related article
                    const matchingTags = article.fields.tags?.filter(tag => 
                      tags?.includes(tag)
                    ) || [];
                    
                    return (
                      <div key={idx} className="col-md-4 mb-4">
                        <div className="card border-0 h-100 shadow-sm transition-all hover-shadow">
                          <Link to={`/articles/${slug}`} className="text-decoration-none">
                            {coverImage && coverImage.fields ? (
                              <img
                                src={`https:${coverImage.fields.file.url}`}
                                className="card-img-top"
                                alt={title}
                                style={{ height: "160px", objectFit: "cover" }}
                              />
                            ) : (
                              <div className="bg-light d-flex align-items-center justify-content-center" 
                                   style={{ height: "160px" }}>
                                <i className="bi bi-image text-muted fs-3"></i>
                              </div>
                            )}
                          </Link>
                          <div className="card-body">
                            <Link to={`/articles/${slug}`} className="text-decoration-none text-dark">
                              <h5 className="card-title fw-bold">{title}</h5>
                            </Link>
                            
                            {/* Display matching tags */}
                            {matchingTags.length > 0 && (
                              <div className="mb-2">
                                {matchingTags.slice(0, 2).map((tag, i) => (
                                  <span key={i} className="badge bg-primary text-light me-1">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="d-flex align-items-center mt-3">
                              <Link to={`/author/${authorName}`} className="text-decoration-none">
                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                                     style={{ width: "24px", height: "24px" }}>
                                  <span className="text-white small" style={{ fontSize: "12px" }}>{authorName ? authorName.charAt(0) : 'A'}</span>
                                </div>
                              </Link>
                              <Link to={`/author/${authorName}`} className="text-decoration-none text-muted small">
                                {authorName || 'Anonymous'}
                              </Link>
                              {readTime && (
                                <>
                                  <span className="mx-2 text-muted small">·</span>
                                  <span className="text-muted small">{readTime} min read</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        /* Medium-like article styling */
        .article-content {
          font-family: 'Georgia', serif;
          line-height: 1.8;
          color: #292929;
        }
        .article-content p {
          margin-bottom: 1.5rem;
        }
        .article-content h2, .article-content h3 {
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
        }
        .article-content img {
          max-width: 100%;
          border-radius: 5px;
          margin: 1.5rem 0;
        }
        .article-content blockquote {
          border-left: 4px solid #0d6efd;
          padding-left: 1.5rem;
          margin-left: 0;
          font-style: italic;
          margin: 2rem 0;
        }
        .article-content code {
          background-color: #f5f5f5;
          padding: 2px 5px;
          border-radius: 3px;
          font-family: monospace;
        }
        .article-content pre {
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 5px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .article-content a {
          color: #0d6efd;
          text-decoration: underline;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        .article-content hr {
          margin: 2rem 0;
          border-top: 1px solid #e5e5e5;
        }
      `}} />
    </div>
  );
}