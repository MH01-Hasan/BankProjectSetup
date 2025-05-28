import { authKey } from "@/constants/storageKey";
import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";
import { getBaseUrl } from "@/helpers/config/envConfig";
import { decodedToken } from "@/utils/jwt";
import { getFromLocalStorage, setToLocalStorage } from "@/utils/local-storage";

// Add a global flag to prevent multiple token checks
let isTokenCheckRunning = false;

// Function to check token expiration periodically
const startTokenExpirationCheck = () => {
  if (isTokenCheckRunning) return;
  isTokenCheckRunning = true;

  const checkInterval = setInterval(() => {
    const authToken = getFromLocalStorage(authKey);
    if (!authToken) {
      clearInterval(checkInterval);
      isTokenCheckRunning = false;
      return;
    }

    try {
      const decoded = decodedToken(authToken);
      const currentTime = Date.now() / 1000;
      
      // If token is expired or will expire in the next 30 seconds
      if (decoded.exp < currentTime + 30) {
        clearInterval(checkInterval);
        isTokenCheckRunning = false;
        handleLogout();
      }
    } catch (error) {
      console.error("Token validation error:", error);
      clearInterval(checkInterval);
      isTokenCheckRunning = false;
      handleLogout();
    }
  }, 30000); // Check every 30 seconds
};

export const loginUser = async (credentials) => {
  try {
    // Input validation (existing code remains the same)
    if (!credentials.email || !credentials.password) {
      throw {
        message: "Email and password are required",
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw {
        message: "Please provide a valid email address",
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(credentials.password)) {
      throw {
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number",
        statusCode: 400,
        errorType: "VALIDATION_ERROR",
      };
    }

    const response = await axiosInstance({
      url: `${getBaseUrl()}/auth/login`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: credentials,
    });

    if (!response.data.accessToken) {
      throw {
        message: "Authentication failed - no token received",
        statusCode: 401,
        errorType: "AUTH_ERROR",
      };
    }

    // Store the token securely
    storeUserInfo({ accessToken: response.data.accessToken });

    // Start token expiration check after successful login
    startTokenExpirationCheck();

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: response.data.user,
    };
  } catch (error) {
    // Existing error handling remains the same
    console.error("Login error:", error);

    let errorMessage = "Login failed. Please try again.";
    let statusCode = 500;
    let errorType = "UNKNOWN_ERROR";

    if (error.response) {
      statusCode = error.response.status;
      errorMessage =
        error.response.data?.message || `Server responded with status ${statusCode}`;
      errorType = error.response.data?.errorType || "SERVER_ERROR";

      if (statusCode === 401) {
        errorMessage = "Invalid email or password";
        errorType = "AUTH_ERROR";
      } else if (statusCode === 403) {
        errorMessage = "Account not verified or access denied";
        errorType = "AUTH_ERROR";
      } else if (statusCode === 429) {
        errorMessage = "Too many login attempts. Please try again later.";
        errorType = "RATE_LIMIT_ERROR";
      }
    } else if (error.request) {
      errorMessage = "No response from server. Please check your connection.";
      errorType = "NETWORK_ERROR";
    } else if (error.message) {
      errorMessage = error.message;
      statusCode = error.statusCode || 500;
      errorType = error.errorType || "CLIENT_ERROR";
    }

    const loginError = {
      message: errorMessage,
      statusCode,
      errorType,
    };

    throw loginError;
  }
};

// Enhanced isLoggedIn function with token expiration check
export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  if (!authToken) return false;

  try {
    const decoded = decodedToken(authToken);
    const currentTime = Date.now() / 1000;
    
    // If token is expired
    if (decoded.exp < currentTime) {
      handleLogout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    handleLogout();
    return false;
  }
};

// Enhanced getUserInfo with token expiration check
export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (!authToken) return {};

  try {
    const decodedData = decodedToken(authToken);
    const currentTime = Date.now() / 1000;
    
    // If token is expired
    if (decodedData.exp < currentTime) {
      handleLogout();
      return {};
    }
    
    return decodedData;
  } catch (error) {
    console.error("Token validation error:", error);
    handleLogout();
    return {};
  }
};

// Enhanced getNewAccessToken with auto-logout on failure
export const getNewAccessToken = async () => {
  try {
    const response = await axiosInstance({
      url: `${getBaseUrl()}/auth/refresh-token`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    
    if (response?.data?.accessToken) {
      storeUserInfo({ accessToken: response.data.accessToken });
      
      // Restart token expiration check with new token
      startTokenExpirationCheck();
      
      return response.data.accessToken;
    }
    
    // If no access token received
    handleLogout();
    throw new Error("No access token received");
  } catch (error) {
    console.error("Failed to refresh token:", error);
    handleLogout();
    throw error;
  }
};

// Existing functions remain the same
export const storeUserInfo = ({ accessToken }) => {
  setToLocalStorage(authKey, accessToken);
};

export const removeUserInfo = (key) => {
  localStorage.removeItem(key);
};

export const handleLogout = () => {
  removeUserInfo(authKey);
  window.location.href = "/login"; 
};

// Start token expiration check if token exists when the module loads
if (typeof window !== 'undefined' && getFromLocalStorage(authKey)) {
  startTokenExpirationCheck();
}