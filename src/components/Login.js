import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Container, Paper, Typography, Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    
    // Store the token and user data
    localStorage.setItem('user_token', credentialResponse.credential);
    localStorage.setItem('user_data', JSON.stringify({
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture
    }));
    
    navigate('/home');
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign in to PowerBI App
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
