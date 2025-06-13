import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedArticles } from '../api/getArticle.js';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const featuredArticles = await getFeaturedArticles();
        console.log("Featured Articles:", featuredArticles);
        setArticles(featuredArticles || []);
      } catch (err) {
        console.error("Error fetching featured articles:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="bg-light">
      <Header />
      
      {/* Hero Section with Background Pattern */}
      <div className="position-relative overflow-hidden bg-primary bg-gradient text-white" 
           style={{
             backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ffffff\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
           }}>
        
        {/* Hero Content */}
        <div className="container py-5">
          <div className="row align-items-center py-5">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="display-3 fw-bold mb-3">Cybersecurity Through Stories</h1>
              <p className="lead fs-4 mb-4">Immersive narratives and hands-on simulations that make security concepts stick</p>
              <div className="d-flex gap-3">
                <Link to="/articles" className="btn btn-light btn-lg rounded-pill px-4">
                  Start reading
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="position-relative">
                <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 1 }}>
                  <div className="spinner-grow text-light" style={{ width: "4rem", height: "4rem" }}></div>
                </div>
                <div style={{ 
                  width: "400px", 
                  height: "400px", 
                  background: "#000",
                  borderRadius: "20px", 
                  border: "1px solid rgba(255,255,255,0.2)",
                  margin: "0 auto",
                  boxShadow: "0 0 80px rgba(0,0,0,0.15)"
                }}>
                  {/* Terminal-like container */}
                  <div className="text-start p-4 h-100 d-flex flex-column">
                    <div className="d-flex gap-2 mb-3">
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f57" }}></div>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#febc2e" }}></div>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }}></div>
                    </div>
                    <div className="flex-grow-1" style={{ fontFamily: "monospace", fontSize: "14px" }}>
                      <p className="mb-1 text-success">$ initiating security scan...</p>
                      <p className="mb-1">$ scanning network <span className="text-warning">██████████</span> 50%</p>
                      <p className="mb-1 text-danger">$ potential vulnerability detected!</p>
                      <p className="mb-1">$ analyzing threat vector...</p>
                      <p className="mb-0 blinking-cursor">$ _</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Separator */}
        <div className="position-absolute bottom-0 start-0 w-100 overflow-hidden" style={{ lineHeight: 0, transform: "rotate(180deg)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ position: "relative", display: "block", width: "calc(100% + 1.3px)", height: "50px" }}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#f8f9fa"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Featured Stories Section */}
        <section className="py-5">
          <div className="container">
            <h2 className="text-center fw-bold mb-5">Featured Stories</h2>
            {loading ? (
              <div className="text-center">Loading articles...</div>
            ) : articles.length === 0 ? (
              <div className="text-center">No articles available.</div>
            ) : (
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {articles.map(({ fields }) => {
                  const { slug, title, subtitle, authorName, publishedDate, coverImage, tags, readTime } = fields;
                  return (
                    <div key={slug} className="col-lg-4 col-md-6 mb-4">
                      <div className="card h-100">
                        {coverImage && coverImage.fields && (
                          <img
                            src={`https:${coverImage.fields.file.url}`}
                            className="card-img-top"
                            alt={coverImage.fields.title}
                          />
                        )}
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{title}</h5>
                          <p className="card-text">{subtitle}</p>
                          <div>
                            {tags && tags.map((tag, index) => (
                              <span className="badge bg-primary mb-2" key={index} style={{ marginRight: '8px' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="card-text mt-auto">
                            <small className="text-muted">
                              by {authorName} on {new Date(publishedDate).toLocaleDateString()} &middot; {readTime} min read
                            </small>
                          </p>
                          <a href={`/articles/${slug}`} className="btn btn-primary mt-2">Read More</a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Interactive Tools Section with Hexagon Shapes */}
        <section className="mb-5 py-4">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Interactive Security Playground</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Experiment with cybersecurity concepts in our interactive playground
            </p>
          </div>
          <div className="text-end mb-4">
            <a href="#" className="text-primary text-decoration-none">View all</a>
          </div>
          
          <div className="row g-4 justify-content-center">
            {[
              { name: "Caesar Cipher", icon: "bi-lock", color: "#4f46e5", description: "Encrypt and decrypt messages using this classical cipher" },
              { name: "Hash Playground", icon: "bi-hash", color: "#0891b2", description: "See how hashing algorithms transform your input" },
              { name: "SQL Injection", icon: "bi-database", color: "#db2777", description: "Test SQL injection attacks in a safe environment" },
              { name: "Signature Verifier", icon: "bi-key", color: "#ca8a04", description: "Verify digital signatures with public key cryptography" },
            ].map((tool, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="card border-0 text-center h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-center mb-3">
                      <div className="d-flex align-items-center justify-content-center rounded-circle" 
                           style={{ 
                             width: "80px", 
                             height: "80px", 
                             backgroundColor: tool.color,
                             boxShadow: `0 10px 20px rgba(0,0,0,0.1)`
                           }}>
                        <i className={`${tool.icon} text-white fs-2`}></i>
                      </div>
                    </div>
                    <h3 className="h5 fw-bold">{tool.name}</h3>
                    <p className="text-muted">{tool.description}</p>
                    <button className="btn btn-sm btn-outline-primary rounded-pill mt-2">Try it</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-5">
          <div className="p-5 rounded-3 bg-primary text-white">
            <h2 className="display-6 fw-bold mb-3">Want to share your thoughts?</h2>
            <p className="lead mb-4">Join thousands of authors sharing their ideas with the community</p>
            <button className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold">
              Start Writing
            </button>
          </div>
        </section>
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
        .blinking-cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from, to { opacity: 1 }
          50% { opacity: 0 }
        }
      `}} />
    </div>
  );
}