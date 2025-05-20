import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          FormFlow
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ mr: 2 }}
        >
          <DashboardIcon />
        </IconButton>

        <Button
          color="inherit"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/create"
        >
          Create Form
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
