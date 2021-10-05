import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import { userSchemaWithConfirmationPassword, IUser } from '../interfaces';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { pushCurrentUser } from '../currentUserStore';
import { useEffect, useState } from 'react';
import { appAuth } from './App';
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material';

const theme = createTheme();

export const Registration: React.FC = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    resolver: yupResolver(userSchemaWithConfirmationPassword),
  });
  const [errorType, setErrorType] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IUser> = (data) => {
    setLoader(true);

    createUserWithEmailAndPassword(appAuth, data.email, data.password)
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

  useEffect(() => {
    console.log(errorType);
  }, [errorType]);

  return (
    <ThemeProvider theme={theme}>
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
          <Typography>Sign up</Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register('email')}
                  error={Boolean(errors.email?.message)}
                  helperText={errors.email?.message}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('password')}
                  error={Boolean(errors.password?.message)}
                  helperText={errors.password?.message}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register('confirmPassword')}
                  error={Boolean(errors.confirmPassword?.message)}
                  helperText={errors.confirmPassword?.message}
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <NavLink to="/login">Already have an account? Sign in</NavLink>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Snackbar
          open={errorType === 'auth/email-already-in-use'}
          autoHideDuration={4000}
          onClose={() => setErrorType(null)}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            Email is already in use
          </Alert>
        </Snackbar>

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
          open={errorType === 'auth/weak-password'}
          autoHideDuration={4000}
          onClose={() => setErrorType(null)}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            Password is not strong
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
    </ThemeProvider>
  );
};
