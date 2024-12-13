import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "../../styles/Login.css"; // Importing the custom CSS file
import logo from '../../Assets/Images/logo.png'; // Replace with the path to your logo file

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Input validation
        if (!username || !password) {
            setErrorMessage("Username and password are required.");
            return;
        }

        try {
            // Send login request to the backend
            const response = await axios.post("http://localhost:5050/api/auth/login", { username, password });

            // On success, save the JWT token to localStorage
            const { token } = response.data;
            localStorage.setItem("authToken", token);

            // Redirect to the protected page (e.g., dashboard)
            navigate("/dashboard");

        } catch (error) {
            if (error.response) {
                // Handle backend error response
                setErrorMessage(error.response.data.error);
            } else if (error.request) {
                // Handle network error
                setErrorMessage("Network error. Please check your connection.");
            } else {
                // Handle other errors
                setErrorMessage("Something went wrong. Please try again later.");
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-container">
                    {/* Replace with your company logo image */}
                    <img src={logo} alt="Logo" className="logo-image" />
                </div>
                <h2 className="login-title">Login</h2>
                
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="Loginbtn Loginbtn-primary Loginbtn-block">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
