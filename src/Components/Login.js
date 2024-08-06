import { } from 'd3';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    //const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();

    /*useEffect(() => {
        // Fetch CSRF token
        const fetchCsrfToken = async () => {
            const response = await fetch('http://localhost:8080/csrf', {
                credentials: 'include' // Include cookies in the request
            });
            const data = await response.json();
            setCsrfToken(data.token);
        };

        fetchCsrfToken();
    }, []);*/

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          const response = await fetch('http://localhost:8080/login', {
              method: 'POST',
              headers: {
                    'Accept' : 'application/json',
                  'Content-Type': 'application/json'
                  //'X-CSRF-TOKEN': csrfToken // Include CSRF token in headers
              },
              
              body: JSON.stringify({username, password})
              })
              const helper = await response.json();
          if (response.ok) {
            console.log("OK!")
            localStorage.setItem('token', helper.accessToken);
            localStorage.setItem('username', helper.username);
            localStorage.setItem('userRole', helper.roles);
            navigate('/');
            window.location.reload();
          } else {
              setErrorMessage('Invalid username or password');
          }
      } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred. Please try again.');
      }
  };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <button type="submit">Login</button>
                <Link to="/register" >Register</Link>
            </form>
        </div>
    );
};

export default Login;
