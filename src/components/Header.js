import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout, getUserData } from '../auth';

const Header = () => {
  const navigate = useNavigate();
  const userData = getUserData();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My PowerBI App
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/reports')}>
            Reports
          </Button>
          <Button color="inherit" onClick={() => navigate('/help')}>
            Help
          </Button>
          <Button color="inherit" onClick={() => navigate('/performance')}>
            Performance
          </Button>
          {userData?.picture && (
            <Avatar
              src={userData.picture}
              alt={userData.name}
              sx={{ width: 32, height: 32 }}
            />
          )}
          <Button color="inherit" onClick={logout}>
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
