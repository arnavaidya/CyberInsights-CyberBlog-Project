import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PlaygroundPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTools = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tools');
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setTools(data);
    } catch (err) {
      console.error("Error fetching tools:", err);
      setError("Failed to load tools. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      <Header />

      <div className="container py-4 flex-grow-1">
        <div className="mb-4 text-center">
          <h1 className="h3 fw-bold">🔧 Interactive Security Playground</h1>
          <p className="text-muted">Experiment with cybersecurity concepts in our interactive playground</p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="row g-4">
            {tools.length === 0 ? (
              <div className="text-center text-muted">
                No playgrounds available at the moment.
              </div>
            ) : (
              tools.map(tool => (
                <div key={tool.id} className="col-12 col-sm-6 col-lg-3">
                  <div 
                    className="card border-0 h-100 shadow-sm hover-shadow transition-all"
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body p-3 text-center">
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" 
                        style={{ 
                          width: "60px", 
                          height: "60px", 
                          backgroundColor: tool.color || '#007bff',
                          boxShadow: `0 8px 16px ${tool.color || '#007bff'}30`
                        }}
                      >
                        <span className="text-white" style={{ fontSize: "1.5rem" }}>{tool.icon}</span>
                      </div>
                      <h3 className="h6 fw-bold mb-2">{tool.name}</h3>
                      <p className="text-muted small mb-3">{tool.description}</p>
                      <button className="btn btn-sm btn-outline-primary rounded-pill px-3">
                        Try it
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}} />
    </div>
  );
}
