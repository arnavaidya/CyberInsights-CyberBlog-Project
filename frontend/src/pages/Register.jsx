import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profession: '',
    company: '',
    experience: '',
    interests: []
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const experienceLevels = [
    'Student/Beginner',
    '1-2 years',
    '3-5 years',
    '6-10 years',
    '10+ years'
  ];

  const interestAreas = [
    'Network Security',
    'Application Security',
    'Cloud Security',
    'Incident Response',
    'Penetration Testing',
    'Security Architecture',
    'Compliance & Governance',
    'Threat Intelligence',
    'Digital Forensics',
    'Security Awareness'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // API call to submit registration data
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          registrationDate: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }

      const result = await response.json();
      console.log('Registration successful:', result);
      
      setSuccess(true);
      
      // Redirect to success page or back to home after 3 seconds
      setTimeout(() => {
        navigate('/', { 
          state: { message: 'Welcome to the CyberInsights community!' }
        });
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-light min-vh-100">
        <Header />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card border-0 shadow-lg">
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success text-white mb-3" 
                         style={{ width: "80px", height: "80px" }}>
                      <i className="bi bi-check-lg fs-1"></i>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-3">Welcome to CyberInsights!</h2>
                  <p className="text-muted mb-4">
                    Thank you for joining our community. You'll receive a welcome email shortly with next steps.
                  </p>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Redirecting...</span>
                  </div>
                  <p className="text-muted mt-2">Redirecting you to the homepage...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-primary bg-gradient text-white py-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-3">Join the CyberInsights Community</h1>
              <p className="lead">Connect with cybersecurity professionals, share knowledge, and stay ahead of emerging threats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Become a member!</h2>
                  <p className="text-muted">Tell us about yourself to get started</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label fw-semibold">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label fw-semibold">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Professional Information */}
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="profession" className="form-label fw-semibold">
                        Current Role/Designation <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Security Analyst, CISO, Student"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="company" className="form-label fw-semibold">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="mb-4">
                    <label htmlFor="experience" className="form-label fw-semibold">
                      Experience Level <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select your experience level</option>
                      {experienceLevels.map((level, index) => (
                        <option key={index} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {/* Areas of Interest */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-3">
                      Areas of Interest (select all that apply)
                    </label>
                    <div className="row">
                      {interestAreas.map((interest, index) => (
                        <div key={index} className="col-md-6 col-lg-4 mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`interest-${index}`}
                              checked={formData.interests.includes(interest)}
                              onChange={() => handleInterestChange(interest)}
                            />
                            <label className="form-check-label" htmlFor={`interest-${index}`}>
                              {interest}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms and Privacy */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                        required
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to the <Link to="/terms" className="text-primary text-decoration-none">Terms of Service</Link> and <Link to="/privacy" className="text-primary text-decoration-none">Privacy Policy</Link>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        'Join CyberInsights Community'
                      )}
                    </button>
                    <Link to="/" className="btn btn-outline-secondary">
                      Back to Home
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Benefits */}
      <section className="bg-white py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">What You'll Get</h2>
            <p className="text-muted">Benefits of joining our community</p>
          </div>
          <div className="row g-4">
            {[
              {
                icon: "bi-people",
                title: "Expert Network",
                description: "Connect with cybersecurity professionals worldwide"
              },
              {
                icon: "bi-book",
                title: "Content Publishing",
                description: "Publish articles, ideas, experiences with the community"
              },
              {
                icon: "bi-calendar-event",
                title: "Events & Webinars",
                description: "Participate in live sessions and workshops"
              },
              {
                icon: "bi-trophy",
                title: "Skill Development",
                description: "Interactive tools and practical challenges"
              }
            ].map((benefit, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3"
                       style={{ width: "60px", height: "60px" }}>
                    <i className={`${benefit.icon} fs-4`}></i>
                  </div>
                  <h5 className="fw-bold">{benefit.title}</h5>
                  <p className="text-muted">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}