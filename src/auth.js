// Google OAuth configuration
// Replace this with your Google OAuth Client ID from Google Cloud Console
// Example: export const GOOGLE_CLIENT_ID = '123456789-abcdef.apps.googleusercontent.com';
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('user_token');
  if (!token) return false;
  
  // Check if token is expired
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// Function to get user data
export const getUserData = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

// Function to handle logout
export const logout = () => {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_data');
  window.location.href = '/';
};
