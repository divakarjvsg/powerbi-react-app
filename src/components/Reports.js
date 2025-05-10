import React from 'react';
import { Container, Paper } from '@mui/material';
import Header from './Header';

const Reports = () => {
  return (
    <Container maxWidth="lg">
      <Header />
      <Paper elevation={3} sx={{ mt: 4, p: 2, minHeight: '70vh', position: 'relative' }}>
        <iframe 
          title="Sample Report Demo"
          width="100%"
          height="541.25"
          src="https://playground.powerbi.com/sampleReportEmbed"
          frameBorder="0"
          allowFullScreen={true}
          style={{
            border: 'none',
            display: 'block',
            margin: '0 auto'
          }}
        />
      </Paper>
    </Container>
  );
};

export default Reports;
