import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';

const Help = () => {
  return (
    <Container>
      <Paper elevation={3} sx={{ mt: 4, p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Help Center
        </Typography>
        <Box sx={{ mt: 4 }}>
          <img 
            src="/coming-soon.jpg" 
            alt="Amazing content coming soon" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Amazing content coming soon!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Help;
