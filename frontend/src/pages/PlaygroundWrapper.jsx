import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import individual playground components
import HashPlayground from './playgrounds/HashPlayground';
import CaesarCipherPlayground from './playgrounds/CaesarCipherPlayground';
import PasswordAnalyzerPlayground from './playgrounds/PasswordAnalyzerPlayground';

// Playground component mapping
const playgroundComponents = {
  'hash-playground': HashPlayground,
  'caesar-cipher': CaesarCipherPlayground,
  'password-analyzer': PasswordAnalyzerPlayground,
};

export default function PlaygroundWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playground, setPlayground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayground = async () => {
      try {
        const response = await fetch(`https://cyberinsights.onrender.com/api/playground/${id}`);  {/*http://localhost:5000/api/playground/${id}*/}
        if (!response.ok) {
          throw new Error('Playground not found');
        }
        const data = await response.json();
        setPlayground(data);
      } catch (err) {
        console.error('Error fetching playground:', err);
        setError('Playground not found or failed to load');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlayground();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate('/playgrounds');
  };

  if (loading) {
    return (
      <div className="bg-white min-vh-100 d-flex flex-column">
        <Header />
        <div className="container py-5 flex-grow-1 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading playground...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !playground) {
    return (
      <div className="bg-white min-vh-100 d-flex flex-column">
        <Header />
        <div className="container py-5 flex-grow-1 text-center">
          <div className="alert alert-danger">
            <h4>Playground Not Found</h4>
            <p>{error || 'The requested playground could not be found.'}</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleBackClick}
          >
            <ArrowLeft className="me-2" size={16} />
            Back to Playgrounds
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Get the component for this playground
  const PlaygroundComponent = playgroundComponents[id];

  if (!PlaygroundComponent) {
    return (
      <div className="bg-white min-vh-100 d-flex flex-column">
        <Header />
        <div className="container py-5 flex-grow-1">
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary me-3"
              onClick={handleBackClick}
            >
              <ArrowLeft size={16} className="me-2" />
              Back
            </button>
            <div>
              <h1 className="h3 mb-1">{playground.name}</h1>
              <p className="text-muted mb-0">{playground.description}</p>
            </div>
          </div>
          
          <div className="alert alert-info">
            <h4>Coming Soon!</h4>
            <p className="mb-0">
              The <strong>{playground.name}</strong> playground is currently under development. 
              Check back soon for an interactive experience!
            </p>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h5>About this playground:</h5>
              <p>{playground.longDescription}</p>
              <div className="d-flex align-items-center mt-3">
                <span 
                  className="badge rounded-pill me-2"
                  style={{ backgroundColor: playground.color }}
                >
                  {playground.category}
                </span>
                <span className="text-muted">{playground.icon}</span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      <Header />
      <div className="container-fluid py-3">
        <div className="d-flex align-items-center mb-3">
          <button 
            className="btn btn-outline-secondary me-3"
            onClick={handleBackClick}
          >
            <ArrowLeft size={16} className="me-2" />
            Back
          </button>
          <div>
            <h1 className="h4 mb-0">{playground.name}</h1>
            <small className="text-muted">{playground.description}</small>
          </div>
        </div>
      </div>
      
      {/* Render the specific playground component */}
      <div className="flex-grow-1">
        <PlaygroundComponent playground={playground} />
      </div>
      
      <Footer />
    </div>
  );
}
