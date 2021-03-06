import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AnimationIcon from '@mui/icons-material/Animation';
import { appAuth } from '../App';
import { useHistory } from 'react-router';
import { clearCurrentUser } from '../../currUserStore';

const handleSignOut = () => {
  clearCurrentUser();
  appAuth.signOut();
};

export const AuthNavigationBar: React.FC = () => {
  const history = useHistory();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="absolute" style={{ zIndex: 1500 }}>
        <Toolbar>
          <AnimationIcon
            onClick={() => history.push('/profile/info')}
            sx={{ cursor: 'pointer' }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => history.push('/profile/info')}
          >
            Private Cab
          </Typography>

          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
