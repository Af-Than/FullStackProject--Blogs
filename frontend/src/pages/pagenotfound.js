import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./pagenotfound.css";

function PageNotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Handle the countdown timer
    const intervalId = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Handle the actual redirection
    const timeoutId = setTimeout(() => {
      navigate('/auth/login');
    }, 5000);

    // Cleanup intervals and timeouts on unmount
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <div className="not-found-wrapper">
      <div className="stars-background"></div>
      <div className="planet-background"></div>
      
      <div className="not-found-content">
        <h1 className="glitch-text" data-text="404">404</h1>
        <h2 className="not-found-subtitle">LOST IN SPACE</h2>
        <p className="not-found-description">
          The page you are looking for has drifted beyond the event horizon or is temporarily unavailable.
        </p>
        
        <div className="redirect-container">
          <div className="ultra-spinner">
            <div className="ultra-spinner-inner"></div>
            <div className="ultra-spinner-core"></div>
          </div>
          <p className="redirect-message">
            Warping to login in <span className="countdown-timer">{countdown}</span> seconds...
          </p>
        </div>
      </div>

      <div className="astronaut-container">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/123/123397.png" 
          alt="Lost Astronaut Floating" 
          className="astronaut-image" 
        />
      </div>
    </div>
  );
}

export default PageNotFound;