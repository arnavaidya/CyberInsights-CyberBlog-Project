import React, { useState } from 'react';
import { Key, Users, Shield, ArrowRight, RefreshCw, Play, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DiffieHellmanPlayground = () => {
  const [parameters, setParameters] = useState(null);
  const [paramsLoading, setParamsLoading] = useState(false);
  
  const [alicePrivate, setAlicePrivate] = useState(null);
  const [alicePublic, setAlicePublic] = useState(null);
  const [aliceShared, setAliceShared] = useState(null);
  const [aliceLoading, setAliceLoading] = useState(false);
  
  const [bobPrivate, setBobPrivate] = useState(null);
  const [bobPublic, setBobPublic] = useState(null);
  const [bobShared, setBobShared] = useState(null);
  const [bobLoading, setBobLoading] = useState(false);
  
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationLoading, setSimulationLoading] = useState(false);

  // Mock implementation for demo purposes
  const generateRandomPrime = () => {
    const primes = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    return primes[Math.floor(Math.random() * primes.length)];
  };

  const findPrimitiveRoot = (p) => {
    for (let g = 2; g < p; g++) {
      let powers = new Set();
      for (let i = 1; i < p; i++) {
        powers.add(Math.pow(g, i) % p);
      }
      if (powers.size === p - 1) return g;
    }
    return 2;
  };

  const modPow = (base, exp, mod) => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  };

  const generateParameters = async () => {
    setParamsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const prime = generateRandomPrime();
    const generator = findPrimitiveRoot(prime);
    
    setParameters({ prime, generator });
    resetKeys();
    setParamsLoading(false);
  };

  const generatePrivateKey = async (participant) => {
    if (!parameters) return;
    
    const setLoading = participant === 'Alice' ? setAliceLoading : setBobLoading;
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const privateKey = Math.floor(Math.random() * (parameters.prime - 2)) + 1;
    
    if (participant === 'Alice') {
      setAlicePrivate(privateKey);
      setAlicePublic(null);
      setAliceShared(null);
    } else {
      setBobPrivate(privateKey);
      setBobPublic(null);
      setBobShared(null);
    }
    setLoading(false);
  };

  const calculatePublicKey = async (participant) => {
    if (!parameters) return;
    
    const privateKey = participant === 'Alice' ? alicePrivate : bobPrivate;
    if (!privateKey) return;
    
    const setLoading = participant === 'Alice' ? setAliceLoading : setBobLoading;
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const publicKey = modPow(parameters.generator, privateKey, parameters.prime);
    const calculation = `${parameters.generator}^${privateKey} mod ${parameters.prime} = ${publicKey}`;
    
    const result = { publicKey, calculation };
    
    if (participant === 'Alice') {
      setAlicePublic(result);
      setAliceShared(null);
    } else {
      setBobPublic(result);
      setBobShared(null);
    }
    setLoading(false);
  };

  const calculateSharedSecret = async (participant) => {
    if (!parameters) return;
    
    const myPrivateKey = participant === 'Alice' ? alicePrivate : bobPrivate;
    const otherPublicKey = participant === 'Alice' ? bobPublic?.publicKey : alicePublic?.publicKey;
    
    if (!myPrivateKey || !otherPublicKey) return;
    
    const setLoading = participant === 'Alice' ? setAliceLoading : setBobLoading;
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const sharedSecret = modPow(otherPublicKey, myPrivateKey, parameters.prime);
    const calculation = `${otherPublicKey}^${myPrivateKey} mod ${parameters.prime} = ${sharedSecret}`;
    
    const result = { sharedSecret, calculation };
    
    if (participant === 'Alice') {
      setAliceShared(result);
    } else {
      setBobShared(result);
    }
    setLoading(false);
  };

  const runSimulation = async () => {
    setSimulationLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const prime = generateRandomPrime();
    const generator = findPrimitiveRoot(prime);
    const alicePriv = Math.floor(Math.random() * (prime - 2)) + 1;
    const bobPriv = Math.floor(Math.random() * (prime - 2)) + 1;
    
    const alicePub = modPow(generator, alicePriv, prime);
    const bobPub = modPow(generator, bobPriv, prime);
    
    const aliceSharedSec = modPow(bobPub, alicePriv, prime);
    const bobSharedSec = modPow(alicePub, bobPriv, prime);
    
    const result = {
      parameters: { prime, generator },
      success: aliceSharedSec === bobSharedSec,
      alice: {
        privateKey: alicePriv,
        publicKey: alicePub,
        publicCalculation: `${generator}^${alicePriv} mod ${prime} = ${alicePub}`,
        sharedSecret: aliceSharedSec,
        sharedCalculation: `${bobPub}^${alicePriv} mod ${prime} = ${aliceSharedSec}`
      },
      bob: {
        privateKey: bobPriv,
        publicKey: bobPub,
        publicCalculation: `${generator}^${bobPriv} mod ${prime} = ${bobPub}`,
        sharedSecret: bobSharedSec,
        sharedCalculation: `${alicePub}^${bobPriv} mod ${prime} = ${bobSharedSec}`
      }
    };
    
    setSimulationResult(result);
    setSimulationLoading(false);
  };

  const resetKeys = () => {
    setAlicePrivate(null);
    setAlicePublic(null);
    setAliceShared(null);
    setBobPrivate(null);
    setBobPublic(null);
    setBobShared(null);
    setSimulationResult(null);
  };

  const resetAll = () => {
    setParameters(null);
    resetKeys();
  };

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Header/>
        
        <div className="container py-4 flex-grow-1">
          {/* Parameters Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title h4 d-flex align-items-center mb-0">
                  <Shield className="me-2 text-primary" size={24} />
                  Public Parameters
                </h2>
                <div className="d-flex gap-2">
                  <button
                    onClick={generateParameters}
                    disabled={paramsLoading}
                    className="btn btn-primary d-flex align-items-center"
                  >
                    <RefreshCw className={`me-2 ${paramsLoading ? 'spinner-border spinner-border-sm' : ''}`} size={16} />
                    {paramsLoading ? 'Generating...' : 'Generate Parameters'}
                  </button>
                  <button
                    onClick={resetAll}
                    className="btn btn-secondary"
                  >
                    Reset All
                  </button>
                </div>
              </div>
              
              {parameters ? (
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="bg-primary bg-opacity-10 p-4 rounded">
                      <h3 className="h5 fw-bold text-primary mb-2">Prime Number (p)</h3>
                      <div className="display-6 font-monospace text-primary">{parameters.prime}</div>
                      <p className="small text-primary-emphasis mt-2">A large prime number for the finite field</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-success bg-opacity-10 p-4 rounded">
                      <h3 className="h5 fw-bold text-success mb-2">Generator (g)</h3>
                      <div className="display-6 font-monospace text-success">{parameters.generator}</div>
                      <p className="small text-success-emphasis mt-2">Primitive root modulo p</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <Shield size={64} className="opacity-50 mb-3" />
                  <p className="lead">Generate parameters to start the key exchange</p>
                </div>
              )}
            </div>
          </div>

          {/* Key Exchange Section */}
          {parameters && (
            <div className="row g-4 mb-4">
              {/* Alice Section */}
              <div className="col-lg-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h2 className="card-title h4 d-flex align-items-center text-purple mb-4">
                      <Users className="me-2" size={24} />
                      Alice
                    </h2>
                    
                    {/* Alice's Private Key */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="h6 fw-medium text-dark">1. Private Key (a)</h3>
                        <button
                          onClick={() => generatePrivateKey('Alice')}
                          disabled={aliceLoading}
                          className="btn btn-outline-purple btn-sm"
                          style={{backgroundColor: aliceLoading ? '#6f42c1' : '', color: aliceLoading ? 'white' : '#6f42c1', borderColor: '#6f42c1'}}
                        >
                          {aliceLoading ? 'Generating...' : 'Generate'}
                        </button>
                      </div>
                      {alicePrivate && (
                        <div className="border border-purple rounded p-3" style={{backgroundColor: '#f8f5ff'}}>
                          <div className="h5 font-monospace" style={{color: '#6f42c1'}}>{alicePrivate}</div>
                          <p className="small mb-0" style={{color: '#6f42c1'}}>Secret - never shared</p>
                        </div>
                      )}
                    </div>

                    {/* Alice's Public Key */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="h6 fw-medium text-dark">2. Public Key (A)</h3>
                        <button
                          onClick={() => calculatePublicKey('Alice')}
                          disabled={aliceLoading || !alicePrivate}
                          className="btn btn-outline-purple btn-sm"
                          style={{backgroundColor: aliceLoading ? '#6f42c1' : '', color: aliceLoading ? 'white' : '#6f42c1', borderColor: '#6f42c1'}}
                        >
                          {aliceLoading ? 'Calculating...' : 'Calculate'}
                        </button>
                      </div>
                      {alicePublic && (
                        <div className="border border-purple rounded p-3" style={{backgroundColor: '#f8f5ff'}}>
                          <div className="h5 font-monospace" style={{color: '#6f42c1'}}>{alicePublic.publicKey}</div>
                          <p className="small" style={{color: '#9575cd'}}>{alicePublic.calculation}</p>
                          <p className="small mb-0" style={{color: '#6f42c1'}}>Public - shared with Bob</p>
                        </div>
                      )}
                    </div>

                    {/* Alice's Shared Secret */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="h6 fw-medium text-dark">3. Shared Secret</h3>
                        <button
                          onClick={() => calculateSharedSecret('Alice')}
                          disabled={aliceLoading || !alicePrivate || !bobPublic}
                          className="btn btn-outline-purple btn-sm"
                          style={{backgroundColor: aliceLoading ? '#6f42c1' : '', color: aliceLoading ? 'white' : '#6f42c1', borderColor: '#6f42c1'}}
                        >
                          {aliceLoading ? 'Calculating...' : 'Calculate'}
                        </button>
                      </div>
                      {aliceShared && (
                        <div className="border border-purple rounded p-3" style={{backgroundColor: '#f8f5ff'}}>
                          <div className="h5 font-monospace" style={{color: '#6f42c1'}}>{aliceShared.sharedSecret}</div>
                          <p className="small" style={{color: '#9575cd'}}>{aliceShared.calculation}</p>
                          <p className="small mb-0" style={{color: '#6f42c1'}}>Shared secret - matches Bob's</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bob Section */}
              <div className="col-lg-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h2 className="card-title h4 d-flex align-items-center text-warning mb-4">
                      <Users className="me-2" size={24} />
                      Bob
                    </h2>
                    
                    {/* Bob's Private Key */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="h6 fw-medium text-dark">1. Private Key (b)</h3>
                        <button
                          onClick={() => generatePrivateKey('Bob')}
                          disabled={bobLoading}
                          className="btn btn-outline-warning btn-sm"
                        >
                          {bobLoading ? 'Generating...' : 'Generate'}
                        </button>
                      </div>
                      {bobPrivate && (
                        <div className="bg-warning bg-opacity-10 border border-warning rounded p-3">
                          <div className="h5 font-monospace text-warning-emphasis">{bobPrivate}</div>
                          <p className="small text-warning-emphasis mb-0">Secret - never shared</p>
                        </div>
                      )}
                    </div>

                    {/* Bob's Public Key */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="h6 fw-medium text-dark">2. Public Key (B)</h3>
                        <button
                          onClick={() => calculatePublicKey('Bob')}
                          disabled={bobLoading || !bobPrivate}
                          className="btn btn-outline-warning btn-sm"
                        >
                          {bobLoading ? 'Calculating...' : 'Calculate'}
                        </button>
                      </div>
                      {bobPublic && (
                        <div className="bg-warning bg-opacity-10 border border-warning rounded p-3">
                          <div className="h5 font-monospace text-warning-emphasis">{bobPublic.publicKey}</div>
                          <p className="small text-warning">{bobPublic.calculation}</p>
                          <p className="small text-warning-emphasis mb-0">Public - shared with Alice</p>
                        </div>
                      )}
                    </div>

                    {/* Bob's Shared Secret */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="h6 fw-medium text-dark">3. Shared Secret</h3>
                        <button
                          onClick={() => calculateSharedSecret('Bob')}
                          disabled={bobLoading || !bobPrivate || !alicePublic}
                          className="btn btn-outline-warning btn-sm"
                        >
                          {bobLoading ? 'Calculating...' : 'Calculate'}
                        </button>
                      </div>
                      {bobShared && (
                        <div className="bg-warning bg-opacity-10 border border-warning rounded p-3">
                          <div className="h5 font-monospace text-warning-emphasis">{bobShared.sharedSecret}</div>
                          <p className="small text-warning">{bobShared.calculation}</p>
                          <p className="small text-warning-emphasis mb-0">Shared secret - matches Alice's</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Key Match Verification */}
          {aliceShared && bobShared && (
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className={`text-center p-4 rounded ${
                  aliceShared.sharedSecret === bobShared.sharedSecret 
                    ? 'bg-success bg-opacity-10 border border-success' 
                    : 'bg-danger bg-opacity-10 border border-danger'
                }`}>
                  {aliceShared.sharedSecret === bobShared.sharedSecret ? (
                    <div className="d-flex align-items-center justify-content-center text-success">
                      <CheckCircle className="me-3" size={32} />
                      <div>
                        <h3 className="h4 fw-bold">Success! Keys Match</h3>
                        <p className="mb-0">Alice and Bob have established the same shared secret: <strong>{aliceShared.sharedSecret}</strong></p>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center text-danger">
                      <AlertCircle className="me-3" size={32} />
                      <div>
                        <h3 className="h4 fw-bold">Error! Keys Don't Match</h3>
                        <p className="mb-0">Something went wrong in the key exchange process</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Auto Simulation */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title h4 mb-0">Complete Simulation</h2>
                <button
                  onClick={runSimulation}
                  disabled={simulationLoading}
                  className="btn btn-success d-flex align-items-center"
                >
                  <Play className={`me-2 ${simulationLoading ? 'spinner-border spinner-border-sm' : ''}`} size={20} />
                  {simulationLoading ? 'Running...' : 'Run Auto Simulation'}
                </button>
              </div>
              
              {simulationResult && (
                <div>
                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <div className="bg-primary bg-opacity-10 p-4 rounded">
                        <h4 className="h5 fw-bold text-primary mb-3">Parameters</h4>
                        <p className="mb-1"><strong>Prime (p):</strong> {simulationResult.parameters.prime}</p>
                        <p className="mb-0"><strong>Generator (g):</strong> {simulationResult.parameters.generator}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className={`p-4 rounded ${simulationResult.success ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                        <h4 className={`h5 fw-bold mb-3 ${simulationResult.success ? 'text-success' : 'text-danger'}`}>
                          Result
                        </h4>
                        <p className={`mb-2 ${simulationResult.success ? 'text-success' : 'text-danger'}`}>
                          {simulationResult.success ? 'Key exchange successful' : 'Key exchange failed'}
                        </p>
                        {simulationResult.success && (
                          <p className="text-success mb-0"><strong>Shared Secret:</strong> {simulationResult.alice.sharedSecret}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row g-4">
                    <div className="col-lg-6">
                      <div className="border border-purple rounded p-4" style={{backgroundColor: '#f8f5ff'}}>
                        <h4 className="h5 fw-bold mb-3" style={{color: '#6f42c1'}}>Alice's Calculation</h4>
                        <div className="small" style={{color: '#6f42c1'}}>
                          <p className="mb-1"><strong>Private key (a):</strong> {simulationResult.alice.privateKey}</p>
                          <p className="mb-1"><strong>Public key:</strong> {simulationResult.alice.publicCalculation}</p>
                          <p className="mb-0"><strong>Shared secret:</strong> {simulationResult.alice.sharedCalculation}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="bg-warning bg-opacity-10 border border-warning rounded p-4">
                        <h4 className="h5 fw-bold text-warning-emphasis mb-3">Bob's Calculation</h4>
                        <div className="small text-warning-emphasis">
                          <p className="mb-1"><strong>Private key (b):</strong> {simulationResult.bob.privateKey}</p>
                          <p className="mb-1"><strong>Public key:</strong> {simulationResult.bob.publicCalculation}</p>
                          <p className="mb-0"><strong>Shared secret:</strong> {simulationResult.bob.sharedCalculation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Educational Information */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title h4 mb-4">How It Works</h2>
              <div className="row g-4">
                <div className="col-md-6">
                  <h3 className="h5 fw-bold text-primary mb-3">The Process</h3>
                  <ol className="list-group list-group-numbered">
                    <li className="list-group-item border-0 ps-0">Alice and Bob agree on public parameters (p, g)</li>
                    <li className="list-group-item border-0 ps-0">Each generates a private key (a, b)</li>
                    <li className="list-group-item border-0 ps-0">Each calculates their public key: g^private mod p</li>
                    <li className="list-group-item border-0 ps-0">They exchange public keys over an insecure channel</li>
                    <li className="list-group-item border-0 ps-0">Each calculates the shared secret using the other's public key</li>
                  </ol>
                </div>
                <div className="col-md-6">
                  <h3 className="h5 fw-bold text-success mb-3">Security</h3>
                  <ul className="list-group">
                    <li className="list-group-item border-0 ps-0">Private keys are never transmitted</li>
                    <li className="list-group-item border-0 ps-0">Security relies on the discrete logarithm problem</li>
                    <li className="list-group-item border-0 ps-0">Eavesdroppers see only public values (p, g, A, B)</li>
                    <li className="list-group-item border-0 ps-0">Computing private keys from public keys is computationally hard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>

      <style jsx>{`
        .text-purple {
          color: #6f42c1 !important;
        }
        .border-purple {
          border-color: #6f42c1 !important;
        }
        .btn-outline-purple {
          color: #6f42c1;
          border-color: #6f42c1;
        }
        .btn-outline-purple:hover {
          background-color: #6f42c1;
          border-color: #6f42c1;
          color: white;
        }
        .btn-outline-purple:disabled {
          opacity: 0.65;
        }
        .gap-2 {
          gap: 0.5rem;
        }
        .gap-4 {
          gap: 1.5rem;
        }
      `}</style>
    </>
  );
};

export default DiffieHellmanPlayground;