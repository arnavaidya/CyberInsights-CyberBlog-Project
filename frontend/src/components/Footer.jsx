import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-shield-lock fs-3 me-2"></i>
              <span className="fs-4 fw-bold">Cyber<span className="fw-light">Insights</span></span>
            </div>
            <p className="text-muted">Learn cybersecurity through immersive stories and hands-on simulations.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end gap-3 mb-3">
              <a href="#" className="text-white fs-5" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white fs-5" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="text-white fs-5" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a href="#" className="text-white fs-5" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
            <p className="text-muted">© 2025 CyberInsights. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}