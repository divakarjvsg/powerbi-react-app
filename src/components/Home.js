import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import Header from './Header';

const Home = () => {
  return (
    <>
      <Header />
      <Container>
        <Paper elevation={3} sx={{ mt: 4, p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to My PowerBI App
          </Typography>
          <Typography variant="body1">
            Use the navigation menu above to explore reports or visit the help section.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default Home;
