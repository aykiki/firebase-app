import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm, SubmitHandler } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { pushCurrentUser } from '../currentUserStore';
import { IUserAuthInfo, userSchema } from '../yupInterfaces';
import { appAuth } from './App';
import { NavLink } from 'react-router-dom';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';

export const Login: React.FC = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserAuthInfo>({
    resolver: yupResolver(userSchema),
  });

  const onSubmit: SubmitHandler<IUserAuthInfo> = (data) => {
    setLoader(true);
    signInWithEmailAndPassword(appAuth, data.email, data.password)
      .then((userCredential) => {
        pushCurrentUser(userCredential.user);
      })
      .catch((error) => {
        setErrorType(error.code);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            {...register('email')}
            helperText={errors.email?.message}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            {...register('password')}
            helperText={errors.password?.message}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <NavLink to="/registration">
                {"Don't have an account? Sign Up"}
              </NavLink>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={errorType === 'auth/invalid-email'}
        autoHideDuration={4000}
        onClose={() => setErrorType(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Invalid email address
        </Alert>
      </Snackbar>
      <Snackbar
        open={errorType === 'auth/user-disabled'}
        autoHideDuration={4000}
        onClose={() => setErrorType(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          User has been disabled
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorType === 'auth/user-not-found'}
        autoHideDuration={4000}
        onClose={() => setErrorType(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          User with email is not exist
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorType === 'auth/wrong-password'}
        autoHideDuration={4000}
        onClose={() => setErrorType(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Wrong password!
        </Alert>
      </Snackbar>

      {loader && (
        <Backdrop
          open={true}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Container>
  );
};
