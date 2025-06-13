import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PlaygroundPage() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const tabsContainerRef = useRef(null);

  const tools = [
    { 
      id: "caesar-cipher",
      name: "Caesar Cipher", 
      icon: "🔒", 
      color: "#4f46e5", 
      category: "encryption",
      description: "Encrypt and decrypt messages using this classical cipher",
      longDescription: "The Caesar cipher is one of the simplest and most widely known encryption techniques. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet."
    },
    { 
      id: "hash-playground",
      name: "Hash Playground", 
      icon: "#", 
      color: "#0891b2", 
      category: "cryptography",
      description: "See how hashing algorithms transform your input",
      longDescription: "Hash functions are mathematical algorithms that transform input data into fixed-size strings. They are crucial for data integrity, password storage, and digital signatures."
    },
    { 
      id: "sql-injection",
      name: "SQL Injection", 
      icon: "🗄️", 
      color: "#db2777", 
      category: "vulnerabilities",
      description: "Test SQL injection attacks in a safe environment",
      longDescription: "SQL injection is a code injection technique that exploits security vulnerabilities in database-driven applications. Learn how to identify and prevent these attacks."
    },
    { 
      id: "signature-verifier",
      name: "Signature Verifier", 
      icon: "🔑", 
      color: "#ca8a04", 
      category: "cryptography",
      description: "Verify digital signatures with public key cryptography",
      longDescription: "Digital signatures provide authentication, non-repudiation, and data integrity. Learn how public key cryptography enables secure digital communications."
    },
    { 
      id: "xss-demo",
      name: "XSS Demo", 
      icon: "⚡", 
      color: "#dc2626", 
      category: "vulnerabilities",
      description: "Learn about Cross-Site Scripting attacks safely",
      longDescription: "Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web applications. Practice identification and prevention."
    },
    { 
      id: "password-analyzer",
      name: "Password Analyzer", 
      icon: "🛡️", 
      color: "#059669", 
      category: "security",
      description: "Analyze password strength and security",
      longDescription: "Password security is fundamental to cybersecurity. This tool helps you understand what makes passwords strong and secure against various attack methods."
    }
  ];

  // Tab data for filtering tools
  const tabs = [
    { value: 'all', display: 'All Tools' },
    { value: 'encryption', display: 'Encryption' },
    { value: 'cryptography', display: 'Cryptography' },
    { value: 'vulnerabilities', display: 'Vulnerabilities' },
    { value: 'security', display: 'Security Analysis' }
  ];

  // Filter tools based on active tab
  const filteredTools = activeTab === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeTab);

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    const container = tabsContainerRef.current;
    if (!container) return;
    
    setShowLeftArrow(container.scrollLeft > 0);
    const scrollRightRemaining = container.scrollWidth - (container.scrollLeft + container.clientWidth);
    setShowRightArrow(scrollRightRemaining > 5);
  };

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const scrollLeft = () => {
    const container = tabsContainerRef.current;
    if (container) container.scrollLeft -= 200;
  };
  
  const scrollRight = () => {
    const container = tabsContainerRef.current;
    if (container) container.scrollLeft += 200;
  };

  const ToolCard = ({ tool }) => (
    <div 
      className="card border-0 h-100 shadow-sm hover-shadow transition-all"
      onClick={() => setSelectedTool(tool)}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body p-4 text-center">
        <div className="d-flex justify-content-center mb-3">
          <div 
            className="d-flex align-items-center justify-content-center rounded-circle" 
            style={{ 
              width: "60px", 
              height: "60px", 
              backgroundColor: tool.color,
              boxShadow: `0 8px 16px ${tool.color}30`
            }}
          >
            <span className="text-white" style={{ fontSize: "1.5rem" }}>{tool.icon}</span>
          </div>
        </div>
        <h3 className="h6 fw-bold mb-2">{tool.name}</h3>
        <p className="text-muted small mb-3">{tool.description}</p>
        <button className="btn btn-sm btn-outline-primary rounded-pill px-3">
          Try it
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <Header />

      {/* Main Content */}
      <div className="container py-4">
        {/* Page Title */}
        <div className="mb-4 text-center">
          <h1 className="h3 fw-bold d-inline-flex align-items-center justify-content-center">
                Interactive Security Playground
          </h1>
          <p className="text-muted">Experiment with cybersecurity concepts in our interactive playground</p>
      </div>
        {/* Category Tabs */}
        <div className="border-bottom mb-4 position-relative">
          <div className="position-relative">
            {showLeftArrow && (
              <button 
                className="btn position-absolute top-50 z-1 bg-white bg-opacity-75 rounded-circle p-1 shadow-sm border-0 arrow-fade-in"
                style={{ width: "28px", height: "28px", left: "0", transform: "translateY(-50%)" }}
                onClick={scrollLeft}
                aria-label="Scroll left"
              >
                <span>‹</span>
              </button>
            )}
            
            <div 
              ref={tabsContainerRef}
              className="d-flex flex-nowrap overflow-auto hide-scrollbar pb-2 px-3" 
              style={{ gap: "1.5rem", scrollBehavior: "smooth" }}
            >
              {tabs.map((tab) => (
                <button 
                  key={tab.value}
                  className={`btn btn-link text-decoration-none fw-medium px-2 text-nowrap ${activeTab === tab.value ? 'text-dark fw-bold' : 'text-muted'}`}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.display}
                </button>
              ))}
            </div>
            
            {showRightArrow && (
              <button 
                className="btn position-absolute top-50 z-1 bg-white bg-opacity-75 rounded-circle p-1 shadow-sm border-0 arrow-fade-in"
                style={{ width: "28px", height: "28px", right: "0", transform: "translateY(-50%)" }}
                onClick={scrollRight}
                aria-label="Scroll right"
              >
                <span>›</span>
              </button>
            )}

            {showLeftArrow && (
              <div className="position-absolute start-0 top-0 h-100" 
                   style={{ width: "30px", background: "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))" }}>
              </div>
            )}
            {showRightArrow && (
              <div className="position-absolute end-0 top-0 h-100" 
                   style={{ width: "30px", background: "linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))" }}>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Tools Grid */}
           <div className="row g-3">
              {filteredTools.map((tool) => (
                <div key={tool.id} className="col-6 col-md-4 col-lg-3">
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          </div>
      </div>

      <Footer />

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .arrow-fade-in {
          animation: fadeIn 0.2s ease-in;
        }
        .sticky-top {
          position: sticky;
          top: 20px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
}