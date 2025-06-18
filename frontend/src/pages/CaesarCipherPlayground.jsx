import React, { useState } from 'react';
import { Lock, Unlock, RotateCcw, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CaesarCipherPlayground = () => {
  const [encryptInput, setEncryptInput] = useState('');
  const [encryptShift, setEncryptShift] = useState(3);
  const [encryptResult, setEncryptResult] = useState(null);
  const [encryptLoading, setEncryptLoading] = useState(false);
  
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptShift, setDecryptShift] = useState(3);
  const [decryptResult, setDecryptResult] = useState(null);
  const [decryptLoading, setDecryptLoading] = useState(false);

  // API Base URL - adjust if your backend runs on a different port
  const API_BASE = 'http://localhost:5000/api/playground/caesar-cipher';

  // Real API call for Caesar cipher operations
  const caesarCipher = async (text, shift, operation) => {
    try {
      const response = await fetch(`${API_BASE}/cipher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, shift, operation }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Caesar cipher API error:', error);
      throw error;
    }
  };

  const handleEncrypt = async () => {
    if (!encryptInput.trim()) return;
    
    setEncryptLoading(true);
    try {
      const data = await caesarCipher(encryptInput, encryptShift, 'encrypt');
      setEncryptResult(data);
      // Auto-populate decrypt section
      setDecryptInput(data.result);
      setDecryptShift(encryptShift);
    } catch (error) {
      alert('Error encrypting message. Please check your connection and try again.');
      console.error('Encrypt error:', error);
    }
    setEncryptLoading(false);
  };

  const handleDecrypt = async () => {
    if (!decryptInput.trim()) return;
    
    setDecryptLoading(true);
    try {
      const data = await caesarCipher(decryptInput, decryptShift, 'decrypt');
      setDecryptResult(data);
    } catch (error) {
      alert('Error decrypting message. Please check your connection and try again.');
      console.error('Decrypt error:', error);
    }
    setDecryptLoading(false);
  };

  const resetDemo = () => {
    setEncryptInput('');
    setEncryptResult(null);
    setDecryptInput('');
    setDecryptResult(null);
    setEncryptShift(3);
    setDecryptShift(3);
  };

  const copyToDecrypt = () => {
    if (encryptResult) {
      setDecryptInput(encryptResult.result);
      setDecryptShift(encryptShift);
    }
  };

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
    <Header />
      <div className="container py-4 flex-grow-1">
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold d-flex justify-content-center align-items-center">
            <Lock size={32} className="me-2" /> Caesar Cipher Playground
          </h1>
          <p className="text-muted">Encrypt and decrypt messages using the classical Caesar cipher technique</p>
        </div>

        {/* Main Cipher Operations */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Lock size={20} className="me-2" /> Encryption
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Message to Encrypt:</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    value={encryptInput} 
                    onChange={(e) => setEncryptInput(e.target.value)} 
                    placeholder="Enter your message here..." 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Shift Amount:</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={encryptShift} 
                    onChange={(e) => setEncryptShift(parseInt(e.target.value) || 1)} 
                    min="1" 
                    max="25"
                    style={{maxWidth: '100px'}}
                  />
                  <small className="text-muted">Historical default: 3 (Caesar's original cipher)</small>
                </div>
                <button 
                  className="btn btn-success w-100 mb-2" 
                  onClick={handleEncrypt} 
                  disabled={encryptLoading || !encryptInput.trim()}
                >
                  {encryptLoading ? 'Encrypting...' : 'Encrypt Message'}
                </button>
                {encryptResult && (
                  <div className="bg-light p-3 rounded">
                    <small className="text-muted">Original Text:</small>
                    <div className="font-monospace small border rounded p-2 mb-2">{encryptResult.originalText}</div>
                    <small className="text-muted">Encrypted Result (Shift: {encryptResult.shift}):</small>
                    <div className="font-monospace small border rounded p-2 text-success fw-bold">
                      {encryptResult.result}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Unlock size={20} className="me-2" /> Decryption
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Message to Decrypt:</label>
                  <textarea 
                    className="form-control font-monospace" 
                    rows="3"
                    value={decryptInput} 
                    onChange={(e) => setDecryptInput(e.target.value)} 
                    placeholder="Enter encrypted message here..." 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Shift Amount:</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={decryptShift} 
                    onChange={(e) => setDecryptShift(parseInt(e.target.value) || 1)} 
                    min="1" 
                    max="25"
                    style={{maxWidth: '100px'}}
                  />
                  <small className="text-muted">Must match the encryption shift</small>
                </div>
                <button 
                  className="btn btn-primary w-100 mb-2" 
                  onClick={handleDecrypt} 
                  disabled={decryptLoading || !decryptInput.trim()}
                >
                  {decryptLoading ? 'Decrypting...' : 'Decrypt Message'}
                </button>
                {decryptResult && (
                  <div className="bg-light p-3 rounded">
                    <small className="text-muted">Encrypted Text:</small>
                    <div className="font-monospace small border rounded p-2 mb-2">{decryptResult.originalText}</div>
                    <small className="text-muted">Decrypted Result (Shift: {decryptResult.shift}):</small>
                    <div className="font-monospace small border rounded p-2 text-primary fw-bold">
                      {decryptResult.result}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information and Educational Content */}
        <div className="card shadow-sm mb-4">
          <div className="card-header text-white d-flex justify-content-between align-items-center" style={{backgroundColor: '#6f42c1'}}>
            <h5 className="mb-0 d-flex align-items-center">
              <AlertCircle size={20} className="me-2" /> About Caesar Cipher
            </h5>
            <button className="btn btn-sm btn-light" onClick={resetDemo}>
              <RotateCcw size={16} className="me-1" />
              Reset Demo
            </button>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-6">
                <h6 className="text-primary">Historical Background</h6>
                <p className="small">
                  The Caesar cipher is one of the simplest and most widely known encryption techniques. 
                  It is a type of substitution cipher in which each letter in the plaintext is replaced 
                  by a letter some fixed number of positions down the alphabet.
                </p>
                <p className="small">
                  Named after Julius Caesar, who used it in his private correspondence with a shift of 3. 
                  For example, with a shift of 3, A becomes D, B becomes E, and so on.
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="text-primary">How It Works</h6>
                <div className="bg-light p-3 rounded">
                  <p className="small mb-2"><strong>Encryption Formula:</strong></p>
                  <p className="font-monospace small mb-2">E(x) = (x + shift) mod 26</p>
                  <p className="small mb-2"><strong>Decryption Formula:</strong></p>
                  <p className="font-monospace small mb-2">D(x) = (x - shift) mod 26</p>
                  <p className="small mb-0">Where x is the letter position (A=0, B=1, ...)</p>
                </div>
              </div>
            </div>
            
            <div className="row g-4 mt-3">
              <div className="col-12">
                <div className="alert alert-info">
                  <CheckCircle size={16} className="me-2" />
                  <strong>Security Note:</strong> The Caesar cipher is not secure by modern standards. 
                  With only 25 possible keys, it can be easily broken by brute force. It's primarily 
                  used for educational purposes to understand basic cryptographic concepts.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cipher Analysis Section */}
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h6 className="mb-0">Vulnerability Analysis</h6>
              </div>
              <div className="card-body">
                <ul className="small mb-0">
                  <li>Only 25 possible keys (shifts 1-25)</li>
                  <li>Vulnerable to frequency analysis</li>
                  <li>Preserves letter patterns and word lengths</li>
                  <li>Can be broken by brute force in seconds</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">Educational Value</h6>
              </div>
              <div className="card-body">
                <ul className="small mb-0">
                  <li>Introduces substitution cipher concepts</li>
                  <li>Demonstrates modular arithmetic</li>
                  <li>Shows importance of key space size</li>
                  <li>Foundation for understanding modern cryptography</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    <Footer />
    </div>
  );
};

export default CaesarCipherPlayground;