import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import Clowns from './Components/Clowns';
import { jwtDecode } from 'jwt-decode';
import Lions from './Components/Lions';
import Login from './Components/Login';
import NotFound from './Components/NotFound';
import './App.css'; // Import your CSS file
import clownpic from './clown.png';
import Register from './Components/Register';


const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
 
  
const AppContent = () => {  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = localStorage.getItem('userRole');
        setUser({ username: decodedToken.sub, role });
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Invalid token:', error);
        // Optionally, handle invalid token (e.g., remove it from localStorage)
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        setIsLoggedIn(false);
      }
    }
    else {
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };


  const handleLogout = async () => {
    console.log("logging out");
    if(isLoggedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      setIsLoggedIn(false);
      console.log("logged out");
      window.location.reload();
    }
    else {
      console.error("Cannot logout without first logging in.")
    }
};


  return (
      <div className="container">
        <header className="header">
          <h1>Welcome to the Circus!</h1>
          <div className="userInfo">
          {user ? (
                    <span>{`${user.role}: ${user.username}`}</span>
                ) : (
                    <a href="/login">Login</a>
                )}
            
          </div>

        </header>
        <div className="content">
          <nav className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            <button onClick={toggleSidebar} className="toggle-button">
              {isSidebarCollapsed ? '>' : '<'}
            </button>
            {!isSidebarCollapsed && (
              <ul>
                <li>
                  <div className="sidebar-button">
                    <Link to="/" className="sidebar-link">Home</Link>
                  </div>
                </li>
                <li>
                  <div className="sidebar-button">
                    <Link to="/clowns" className="sidebar-link">Clowns</Link>
                  </div>
                </li>
                <li>
                  <div className="sidebar-button">
                    <Link to="/lions" className="sidebar-link">Lions</Link>
                  </div>
                </li>
                {isLoggedIn && (
                            <li>
                                {/* <div className="sidebar-button"> */}
                                    <button onClick={handleLogout} className="sidebar-link">Logout</button>
                                {/* </div> */}
                            </li>
                        )}
              </ul>
            )}
          </nav>
          <main className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path ="/login" element={<Login />} />
              <Route path ="/register" element={<Register />} />
              <Route path="/clowns" element={<Clowns />} />
              <Route path="/lions" element={<Lions />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
  );
};

const Home = () => {
  return (
    <div>
      <img src={clownpic} alt="Clown" style={{ width: '400px', height: 'auto' }} />
      <p>Welcome to our circus! Choose from the sidebar links to explore.</p>
    </div>
  );
};

export default App;
