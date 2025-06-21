import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, RefreshCw, Key, AlertTriangle, CheckCircle, Info, Copy, BarChart3, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PasswordAnalyzer = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [generatorOptions, setGeneratorOptions] = useState({
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSpecialChars: true,
    excludeSimilar: true
  });
  const [comparePasswords, setComparePasswords] = useState(['', '', '']);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  // Mock API simulation since we can't use external APIs
  const analyzePassword = async (passwordToAnalyze) => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
    
    const length = passwordToAnalyze.length;
    const hasLower = /[a-z]/.test(passwordToAnalyze);
    const hasUpper = /[A-Z]/.test(passwordToAnalyze);
    const hasNumbers = /\d/.test(passwordToAnalyze);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordToAnalyze);
    
    let score = 0;
    let feedback = [];
    
    if (length >= 12) score += 25;
    else if (length >= 8) score += 15;
    else feedback.push("Use at least 12 characters for better security");
    
    if (hasLower) score += 10;
    else feedback.push("Include lowercase letters");
    
    if (hasUpper) score += 10;
    else feedback.push("Include uppercase letters");
    
    if (hasNumbers) score += 15;
    else feedback.push("Include numbers");
    
    if (hasSpecial) score += 20;
    else feedback.push("Include special characters (!@#$%^&*)");
    
    // Check for common patterns
    if (/(.)\1{2,}/.test(passwordToAnalyze)) {
      score -= 10;
      feedback.push("Avoid repeating characters");
    }
    
    if (/123|abc|qwerty|password/i.test(passwordToAnalyze)) {
      score -= 20;
      feedback.push("Avoid common patterns and words");
    }
    
    let strength;
    if (score >= 80) strength = "Very Strong";
    else if (score >= 60) strength = "Strong";
    else if (score >= 40) strength = "Fair";
    else if (score >= 20) strength = "Weak";
    else strength = "Very Weak";
    
    const timeToCrack = calculateTimeToCrack(passwordToAnalyze);
    
    return {
      strength,
      score,
      feedback,
      timeToCrack,
      entropy: Math.floor(length * Math.log2(getCharsetSize(passwordToAnalyze))),
      characteristics: {
        length,
        hasLowercase: hasLower,
        hasUppercase: hasUpper,
        hasNumbers,
        hasSpecialChars: hasSpecial,
        uniqueChars: new Set(passwordToAnalyze).size
      }
    };
  };

  const getCharsetSize = (pwd) => {
    let size = 0;
    if (/[a-z]/.test(pwd)) size += 26;
    if (/[A-Z]/.test(pwd)) size += 26;
    if (/\d/.test(pwd)) size += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) size += 32;
    return size || 1;
  };

  const calculateTimeToCrack = (pwd) => {
    const charsetSize = getCharsetSize(pwd);
    const combinations = Math.pow(charsetSize, pwd.length);
    const guessesPerSecond = 1000000000; // 1 billion guesses per second
    const secondsToCrack = combinations / (2 * guessesPerSecond);
    
    if (secondsToCrack < 60) return "Less than a minute";
    if (secondsToCrack < 3600) return `${Math.ceil(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400) return `${Math.ceil(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000) return `${Math.ceil(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000000) return `${Math.ceil(secondsToCrack / 31536000)} years`;
    return "Centuries";
  };

  const generatePassword = async (options) => {
    let charset = '';
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSpecialChars) charset += '!@#$%^&*(),.?":{}|<>';
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }
    
    let password = '';
    for (let i = 0; i < options.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return { password };
  };

  const comparePasswordsAPI = async (passwords) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const analyses = await Promise.all(passwords.map(pwd => analyzePassword(pwd)));
    const comparison = analyses.map((analysis, index) => ({
      password: passwords[index],
      ...analysis
    })).sort((a, b) => b.score - a.score);
    
    return { comparison };
  };

  // Auto-analyze password as user types
  useEffect(() => {
    if (password.trim()) {
      const timer = setTimeout(async () => {
        setLoading(true);
        try {
          const result = await analyzePassword(password);
          setAnalysis(result);
        } catch (error) {
          console.error('Analysis failed:', error);
          setAnalysis(null);
        }
        setLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setAnalysis(null);
    }
  }, [password]);

  const handleGeneratePassword = async () => {
    try {
      const result = await generatePassword(generatorOptions);
      setGeneratedPassword(result.password);
    } catch (error) {
      alert('Error generating password. Please try again.');
      console.error('Password generation error:', error);
    }
  };

  const handleComparePasswords = async () => {
    const validPasswords = comparePasswords.filter(p => p.trim());
    if (validPasswords.length < 2) {
      alert('Please enter at least 2 passwords to compare.');
      return;
    }

    setCompareLoading(true);
    try {
      const result = await comparePasswordsAPI(validPasswords);
      setComparisonResult(result);
    } catch (error) {
      alert('Error comparing passwords. Please try again.');
      console.error('Password comparison error:', error);
    }
    setCompareLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const getStrengthClass = (strength) => {
    switch (strength) {
      case 'Very Weak': return 'alert-danger';
      case 'Weak': return 'alert-warning';
      case 'Fair': return 'alert-info';
      case 'Strong': return 'alert-success';
      case 'Very Strong': return 'alert-primary';
      default: return 'alert-secondary';
    }
  };

  const getStrengthIcon = (strength) => {
    switch (strength) {
      case 'Very Weak': 
      case 'Weak': return <AlertTriangle size={16} />;
      case 'Fair': return <Info size={16} />;
      case 'Strong': 
      case 'Very Strong': return <CheckCircle size={16} />;
      default: return <Shield size={16} />;
    }
  };

  return (
    <>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' }}>
        <Header/>
        <div className="container py-4">
          {/* Password Analysis and Generator Row */}
          <div className="row mb-4">
            {/* Password Analysis Section */}
            <div className="col-lg-8 mb-4">
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="card-title d-flex align-items-center mb-4">
                    <Shield className="me-2 text-primary" size={20} />
                    Password Strength Analysis
                  </h2>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Enter Password to Analyze
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Type your password here..."
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {loading && (
                    <div className="text-center py-4">
                      <div className="d-inline-flex align-items-center">
                        <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Analyzing password...
                      </div>
                    </div>
                  )}

                  {analysis && !loading && (
                    <div>
                      <div className={`alert ${getStrengthClass(analysis.strength)} d-flex align-items-center`}>
                        {getStrengthIcon(analysis.strength)}
                        <div className="ms-3">
                          <div className="fw-bold">Strength: {analysis.strength}</div>
                          <div className="small">Score: {analysis.score}/100</div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="bg-light p-3 rounded">
                            <h5 className="d-flex align-items-center mb-3">
                              <BarChart3 size={16} className="me-2" />
                              Password Metrics
                            </h5>
                            <div className="small">
                              <div>Length: {analysis.characteristics.length} characters</div>
                              <div>Entropy: {analysis.entropy} bits</div>
                              <div>Unique characters: {analysis.characteristics.uniqueChars}</div>
                              <div>Time to crack: {analysis.timeToCrack}</div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="bg-light p-3 rounded">
                            <h5 className="mb-3">Character Types</h5>
                            <div className="small">
                              <div className={`d-flex align-items-center mb-1 ${analysis.characteristics.hasLowercase ? 'text-success' : 'text-danger'}`}>
                                {analysis.characteristics.hasLowercase ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                <span className="ms-2">Lowercase letters</span>
                              </div>
                              <div className={`d-flex align-items-center mb-1 ${analysis.characteristics.hasUppercase ? 'text-success' : 'text-danger'}`}>
                                {analysis.characteristics.hasUppercase ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                <span className="ms-2">Uppercase letters</span>
                              </div>
                              <div className={`d-flex align-items-center mb-1 ${analysis.characteristics.hasNumbers ? 'text-success' : 'text-danger'}`}>
                                {analysis.characteristics.hasNumbers ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                <span className="ms-2">Numbers</span>
                              </div>
                              <div className={`d-flex align-items-center mb-1 ${analysis.characteristics.hasSpecialChars ? 'text-success' : 'text-danger'}`}>
                                {analysis.characteristics.hasSpecialChars ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                                <span className="ms-2">Special characters</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {analysis.feedback.length > 0 && (
                        <div className="alert alert-warning">
                          <h6 className="d-flex align-items-center mb-2">
                            <Info size={16} className="me-2" />
                            Recommendations
                          </h6>
                          <ul className="mb-0 small">
                            {analysis.feedback.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Password Generator */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="card-title d-flex align-items-center mb-4">
                    <Key className="me-2 text-success" size={20} />
                    Password Generator
                  </h2>

                  <div className="mb-3">
                    <label className="form-label">
                      Length: {generatorOptions.length}
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min="8"
                      max="32"
                      value={generatorOptions.length}
                      onChange={(e) => setGeneratorOptions({...generatorOptions, length: parseInt(e.target.value)})}
                    />
                  </div>

                  <div className="mb-3">
                    {[
                      { key: 'includeLowercase', label: 'Lowercase letters' },
                      { key: 'includeUppercase', label: 'Uppercase letters' },
                      { key: 'includeNumbers', label: 'Numbers' },
                      { key: 'includeSpecialChars', label: 'Special characters' },
                      { key: 'excludeSimilar', label: 'Exclude similar characters' }
                    ].map(option => (
                      <div key={option.key} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={generatorOptions[option.key]}
                          onChange={(e) => setGeneratorOptions({...generatorOptions, [option.key]: e.target.checked})}
                          id={option.key}
                        />
                        <label className="form-check-label small" htmlFor={option.key}>
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleGeneratePassword}
                    className="btn btn-success w-100 d-flex align-items-center justify-content-center"
                  >
                    <RefreshCw size={16} className="me-2" />
                    Generate Password
                  </button>

                  {generatedPassword && (
                    <div className="mt-3">
                      <div className="bg-light p-3 rounded">
                        <div className="d-flex align-items-center justify-content-between">
                          <code className="small flex-grow-1 me-2" style={{wordBreak: 'break-all'}}>{generatedPassword}</code>
                          <button
                            onClick={() => copyToClipboard(generatedPassword)}
                            className="btn btn-sm btn-outline-secondary"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => setPassword(generatedPassword)}
                          className="btn btn-link btn-sm p-0 mt-2 text-decoration-none"
                        >
                          Use this password for analysis
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Password Comparison */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <h2 className="card-title d-flex align-items-center mb-4">
                <Users className="me-2 text-info" size={20} />
                Password Comparison
              </h2>

              <div className="row mb-3">
                {comparePasswords.map((pwd, index) => (
                  <div key={index} className="col-md-4 mb-3">
                    <label className="form-label">
                      Password {index + 1}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={pwd}
                      onChange={(e) => {
                        const newPasswords = [...comparePasswords];
                        newPasswords[index] = e.target.value;
                        setComparePasswords(newPasswords);
                      }}
                      placeholder={`Enter password ${index + 1}...`}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleComparePasswords}
                disabled={compareLoading}
                className="btn btn-info d-flex align-items-center"
              >
                {compareLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Comparing...
                  </>
                ) : (
                  <>
                    <BarChart3 size={16} className="me-2" />
                    Compare Passwords
                  </>
                )}
              </button>

              {comparisonResult && (
                <div className="mt-4">
                  <h5 className="mb-3">Comparison Results (Ranked by Strength)</h5>
                  <div>
                    {comparisonResult.comparison.map((result, index) => {
                      // Find which password number this result corresponds to
                      const originalIndex = comparePasswords.findIndex(pwd => pwd === result.password);
                      return (
                        <div key={index} className={`alert ${getStrengthClass(result.strength)}`}>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <div className="d-flex align-items-center">
                              <span className="badge bg-dark me-3">#{index + 1}</span>
                              {getStrengthIcon(result.strength)}
                              <span className="ms-2 fw-bold">{result.strength}</span>
                              <span className="ms-2 text-muted small">
                                (Password {originalIndex + 1})
                              </span>
                            </div>
                            <div className="small">
                              Score: {result.score}/100 | Time to crack: {result.timeToCrack}
                            </div>
                          </div>
                          <div className="small text-muted">
                            Password: {"*".repeat(result.password.length)} ({result.password.length} chars)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security Tips */}
          <div className="card shadow border-primary">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title mb-0 d-flex align-items-center">
                <Info className="me-2" size={20} />
                Password Security Tips
              </h2>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h5 className="text-success">Best Practices:</h5>
                  <ul className="list-unstyled">
                    <li>✓ Use at least 12 characters</li>
                    <li>✓ Mix uppercase, lowercase, numbers, and symbols</li>
                    <li>✓ Avoid personal information</li>
                    <li>✓ Use unique passwords for each account</li>
                    <li>✓ Consider using passphrases</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h5 className="text-danger">Avoid These:</h5>
                  <ul className="list-unstyled">
                    <li>✗ Common words and patterns</li>
                    <li>✗ Sequential characters (123, abc)</li>
                    <li>✗ Repeating characters (aaa, 111)</li>
                    <li>✗ Personal dates or names</li>
                    <li>✗ Dictionary words</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default PasswordAnalyzer;