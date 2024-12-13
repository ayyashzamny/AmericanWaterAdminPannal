// src/components/PrivateRoute.js
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const PrivateRoute = ({ element }) => {
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setIsValidToken(false);
      return;
    }

    try {
      // Decode the token to check its validity
      const decodedToken = jwtDecode(authToken);

      // Check if the token has expired
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();

      if (isTokenExpired) {
        localStorage.removeItem("authToken"); // Clear invalid token
        setIsValidToken(false);
      } else {
        setIsValidToken(true);
      }
    } catch (error) {
      console.error("Invalid token:", error.message);
      localStorage.removeItem("authToken"); // Clear malformed token
      setIsValidToken(false);
    }
  }, []);

  // Render nothing until the token validation check is complete
  if (isValidToken === null) {
    return null; // Or a loading spinner, if preferred
  }

  // Navigate to login if token is invalid, otherwise render the protected element
  return isValidToken ? element : <Navigate to="/" />;
};

export default PrivateRoute;
