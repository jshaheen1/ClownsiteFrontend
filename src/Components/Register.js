import { } from 'd3';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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
          console.log(JSON.stringify({username, password}));
          console.log(JSON.stringify({username:username, password:password}));
          const response = await fetch('http://localhost:8080/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  //'X-CSRF-TOKEN': csrfToken // Include CSRF token in headers
              },
              
              body: JSON.stringify({username, password})
              });
          console.log(response);
          if (response.redirected) {
              window.location.href = response.url;
          } else if (response.ok) {
              navigate('/login');
          } else {
              setErrorMessage('Invalid username or password');
          }
      } catch (error) {
          setErrorMessage('An error occurred. Please try again.');
      }
  };

    return (
        <div>
            <h2>Register</h2>
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
