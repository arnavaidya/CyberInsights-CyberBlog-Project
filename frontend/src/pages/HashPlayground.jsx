import React, { useState } from 'react';
import { Hash, Shield, AlertTriangle, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HashPlayground = () => {
  const [hashInput, setHashInput] = useState('');
  const [hashResult, setHashResult] = useState(null);
  const [hashLoading, setHashLoading] = useState(false);
  const [reverseInput, setReverseInput] = useState('');
  const [reverseResult, setReverseResult] = useState(null);
  const [reverseLoading, setReverseLoading] = useState(false);
  const [senderMessage, setSenderMessage] = useState('');
  const [senderResult, setSenderResult] = useState(null);
  const [mitm, setMitm] = useState('');
  const [receiverMessage, setReceiverMessage] = useState('');
  const [integrityResult, setIntegrityResult] = useState(null);
  const [integrityLoading, setIntegrityLoading] = useState(false);

  // API Base URL - adjust if your backend runs on a different port
  const API_BASE = 'http://localhost:5000/api/playground/hash-playground';

  // Real API call for hashing
  const hashText = async (text) => {
    try {
      const response = await fetch(`${API_BASE}/hash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Hash API error:', error);
      throw error;
    }
  };

  // Real API call for reverse lookup
  const reverseHash = async (hash) => {
    try {
      const response = await fetch(`${API_BASE}/reverse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hash }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reverse lookup API error:', error);
      throw error;
    }
  };

  // Real API call for integrity setup
  const integritySend = async (message) => {
    try {
      const response = await fetch(`${API_BASE}/integrity/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Integrity send API error:', error);
      throw error;
    }
  };

  // Real API call for integrity verification
  const integrityVerify = async (originalMessage, originalHash, receivedMessage) => {
    try {
      const response = await fetch(`${API_BASE}/integrity/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          originalMessage, 
          originalHash, 
          receivedMessage 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Integrity verify API error:', error);
      throw error;
    }
  };

  const handleHash = async () => {
    if (!hashInput.trim()) return;
    
    setHashLoading(true);
    try {
      const data = await hashText(hashInput);
      setHashResult(data);
    } catch (error) {
      alert('Error generating hash. Please check your connection and try again.');
      console.error('Hash error:', error);
    }
    setHashLoading(false);
  };

  const handleReverse = async () => {
    if (!reverseInput.trim()) return;
    
    setReverseLoading(true);
    try {
      const data = await reverseHash(reverseInput);
      setReverseResult({
        found: data.success,
        originalText: data.originalText,
        message: data.note,
        method: data.success ? 'Session storage lookup' : 'Hash not found'
      });
    } catch (error) {
      alert('Error performing reverse lookup. Please check your connection and try again.');
      console.error('Reverse lookup error:', error);
    }
    setReverseLoading(false);
  };

  const handleSenderSetup = async () => {
    if (!senderMessage.trim()) return;
    
    try {
      const data = await integritySend(senderMessage);
      setSenderResult({
        originalMessage: data.originalMessage,
        originalHash: data.originalHash
      });
      setMitm(senderMessage);
      setReceiverMessage(senderMessage);
      setIntegrityResult(null);
    } catch (error) {
      alert('Error setting up integrity check. Please check your connection and try again.');
      console.error('Integrity setup error:', error);
    }
  };

  const handleIntegrityCheck = async () => {
    if (!senderResult || !receiverMessage.trim()) return;
    
    setIntegrityLoading(true);
    try {
      const data = await integrityVerify(
        senderResult.originalMessage, 
        senderResult.originalHash, 
        receiverMessage
      );
      setIntegrityResult({
        originalMessage: data.originalMessage,
        originalHash: data.originalHash,
        receivedMessage: data.receivedMessage,
        receivedHash: data.receivedHash,
        isValid: data.integrityMaintained,
        hashMatch: data.integrityMaintained,
        status: data.status
      });
    } catch (error) {
      alert('Error verifying integrity. Please check your connection and try again.');
      console.error('Integrity verification error:', error);
    }
    setIntegrityLoading(false);
  };

  const resetIntegrityDemo = () => {
    setSenderMessage('');
    setSenderResult(null);
    setMitm('');
    setReceiverMessage('');
    setIntegrityResult(null);
  };

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      <Header />
      <div className="container py-4 flex-grow-1">
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold d-flex justify-content-center align-items-center">
            <Hash size={32} className="me-2" /> SHA-256 Cryptographic Demo
          </h1>
          <p className="text-muted">Explore hashing, reverse lookup simulation, and integrity verification</p>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Hash size={20} className="me-2" /> Text to SHA-256 Hash
                </h5>
              </div>
              <div className="card-body">
                <input 
                  type="text" 
                  className="form-control mb-2" 
                  value={hashInput} 
                  onChange={(e) => setHashInput(e.target.value)} 
                  placeholder="Type your message here..." 
                  onKeyPress={(e) => e.key === 'Enter' && handleHash()}
                />
                <button 
                  className="btn btn-success w-100 mb-2" 
                  onClick={handleHash} 
                  disabled={hashLoading || !hashInput.trim()}
                >
                  {hashLoading ? 'Converting...' : 'Convert to Hash'}
                </button>
                {hashResult && (
                  <div className="bg-light p-2 rounded">
                    <small className="text-muted">Original Text:</small>
                    <div className="font-monospace small border rounded p-1 mb-2">{hashResult.originalText}</div>
                    <small className="text-muted">SHA-256 Hash:</small>
                    <div className="font-monospace small border rounded p-1 text-primary" style={{wordBreak: 'break-all'}}>
                      {hashResult.hash}
                    </div>
                    <div className="small text-muted mt-1">
                      Generated at: {new Date(hashResult.timestamp).toLocaleString()}
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
                  <RotateCcw size={20} className="me-2" /> Hash Reverse Lookup
                </h5>
              </div>
              <div className="card-body">
                <input 
                  type="text" 
                  className="form-control mb-2 font-monospace" 
                  value={reverseInput} 
                  onChange={(e) => setReverseInput(e.target.value)} 
                  placeholder="Paste hash here (64 characters)..." 
                  style={{fontSize: '0.8rem'}}
                  onKeyPress={(e) => e.key === 'Enter' && handleReverse()}
                />
                <button 
                  className="btn btn-primary w-100 mb-2" 
                  onClick={handleReverse} 
                  disabled={reverseLoading || !reverseInput.trim()}
                >
                  {reverseLoading ? 'Searching...' : 'Find Original Text'}
                </button>
                {reverseResult && (
                  reverseResult.found ?
                    <div className="alert alert-success">
                      <CheckCircle size={16} className="me-1" /> Match Found!<br />
                      <strong>Original Text:</strong> {reverseResult.originalText}<br />
                      <strong>Method:</strong> {reverseResult.method}
                    </div>
                    : <div className="alert alert-warning">
                        <AlertTriangle size={16} className="me-1" /> {reverseResult.message}
                      </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-purple text-white d-flex justify-content-between align-items-center" style={{backgroundColor: '#6f42c1'}}>
            <h5 className="mb-0 d-flex align-items-center">
              <Shield size={20} className="me-2" /> Message Integrity Verification
            </h5>
            <button className="btn btn-sm btn-light" onClick={resetIntegrityDemo}>Reset Demo</button>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small text-muted">1. Sender's Message</label>
                <textarea 
                  className="form-control mb-2" 
                  rows="3" 
                  value={senderMessage} 
                  onChange={(e) => setSenderMessage(e.target.value)} 
                  placeholder="Enter your message..."
                ></textarea>
                <button 
                  className="btn btn-success w-100" 
                  onClick={handleSenderSetup} 
                  disabled={!senderMessage.trim()}
                >
                  Generate Hash
                </button>
                {senderResult && (
                  <div className="small text-muted mt-2">
                    <strong>Hash:</strong><br />
                    <span className="font-monospace" style={{fontSize: '0.7rem', wordBreak: 'break-all'}}>
                      {senderResult.originalHash}
                    </span>
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">2. Message in Transit (Edit to simulate tampering)</label>
                <textarea 
                  className="form-control mb-2" 
                  rows="3" 
                  value={mitm} 
                  onChange={(e) => { 
                    setMitm(e.target.value); 
                    setReceiverMessage(e.target.value); 
                  }} 
                  placeholder="Message during transmission..." 
                  disabled={!senderResult}
                ></textarea>
                <div className="small text-muted">
                  <AlertTriangle size={12} className="me-1" />
                  Modify message to simulate tampering.
                </div>
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">3. Receiver's Message</label>
                <textarea 
                  className="form-control mb-2" 
                  rows="3" 
                  value={receiverMessage} 
                  placeholder="Message received..." 
                  disabled={true}
                  readOnly
                ></textarea>
                <button 
                  className="btn btn-primary w-100" 
                  onClick={handleIntegrityCheck} 
                  disabled={integrityLoading || !senderResult || !receiverMessage.trim()}
                >
                  {integrityLoading ? 'Verifying...' : 'Verify Integrity'}
                </button>
              </div>
            </div>
            {integrityResult && (
              <div className={`mt-3 alert ${integrityResult.isValid ? 'alert-success' : 'alert-danger'}`}>
                <div className="d-flex align-items-center mb-2">
                  {integrityResult.isValid ? 
                    <CheckCircle size={20} className="me-2" /> : 
                    <AlertTriangle size={20} className="me-2" />
                  }
                  <strong>{integrityResult.status}</strong>
                </div>
                <div className="small">
                  <strong>Original Hash:</strong><br />
                  <span className="font-monospace" style={{fontSize: '0.7rem', wordBreak: 'break-all'}}>
                    {integrityResult.originalHash}
                  </span><br />
                  <strong>Received Hash:</strong><br />
                  <span className="font-monospace" style={{fontSize: '0.7rem', wordBreak: 'break-all'}}>
                    {integrityResult.receivedHash}
                  </span>
                </div>
                {!integrityResult.isValid && (
                  <div className="mt-2 small">
                    <strong>Analysis:</strong> The message has been modified during transmission. 
                    Even a single character change results in a completely different hash.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HashPlayground;