import React, { Fragment, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { isAuthenticate, signout } from "../auth/helper";
import { useTheme } from "../context/ThemeContext";

const Navber = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, isTransitioning, createRipple } = useTheme();
  const [isRotating, setIsRotating] = useState(false);
  const [iconKey, setIconKey] = useState(0);
  const buttonRef = useRef(null);
  
  return (
    <>
      <nav className={`navbar navbar-expand-lg ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item me-3">
                <NavLink className="nav-link " aria-current="page" to="/">
                  Home
                </NavLink>
              </li>

              <li className="nav-item me-3">
                <NavLink className="nav-link" to="/cart">
                  Cart
                </NavLink>
              </li>

              {isAuthenticate() && isAuthenticate().user.role === 1 && (
                <li className="nav-item me-3">
                  <NavLink className="nav-link" to="/admindashboard">
                    A.Dashboard
                  </NavLink>
                </li>
              )}

              {isAuthenticate() && isAuthenticate().user.role === 0 && (
                <li className="nav-item me-3">
                  <NavLink className="nav-link" to="/userdashboard">
                    U.Dashboard
                  </NavLink>
                </li>
              )}

              {!isAuthenticate() && (
                <Fragment>
                  <li className="nav-item me-3">
                    <NavLink className="nav-link" to="/signup">
                      Sign Up
                    </NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink className="nav-link" replace to="/signin">
                      Sign in
                    </NavLink>
                  </li>
                </Fragment>
              )}

              {isAuthenticate() && (
                <li className="nav-item me-3">
                  <span
                    className="nav-link "
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      signout(() => {
                        navigate("/");
                      });
                    }}
                  >
                    Signout
                  </span>
                </li>
              )}
            </ul>
            <button
              ref={buttonRef}
              className={`btn ${theme === "dark" ? "btn-outline-light" : "btn-outline-dark"} ms-auto theme-toggle-btn ripple-container ${isRotating ? "rotating" : ""} ${isTransitioning ? "theme-loading" : ""}`}
              onClick={(e) => {
                if (isTransitioning) return;
                
                // Create ripple effect
                createRipple(e);
                
                // Start rotation animation
                setIsRotating(true);
                
                // Toggle theme with event for ripple positioning
                toggleTheme(e);
                
                // Icon transition effect
                setTimeout(() => {
                  setIconKey(prev => prev + 1);
                }, 300);
                
                // Reset rotation state
                setTimeout(() => {
                  setIsRotating(false);
                }, 600);
              }}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              disabled={isTransitioning}
              style={{
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <span 
                key={iconKey}
                className={`theme-icon ${isTransitioning ? "fade-out" : "fade-in"}`}
                style={{
                  display: 'inline-block',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navber;
