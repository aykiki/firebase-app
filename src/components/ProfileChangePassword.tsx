import React, { useEffect, useState } from 'react';
import { appAuth, db } from './App';
import { updatePassword } from '@firebase/auth';
import { $currentUser, pushCurrentUser } from '../currentUserStore';
import { useStore } from 'effector-react';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
  CircularProgress,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  IPassword,
  IUser,
  passwordSchema,
  userSchemaWithConfirmationPassword,
} from '../yupInterfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { query, ref, onValue, limitToFirst } from 'firebase/database';

export const ProfileChangePassword: React.FC = () => {
  const user = useStore($currentUser);
  const [reveal, setReveal] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [successEdit, setSuccessEdit] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPassword>({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit: SubmitHandler<IPassword> = (data) => {
    setLoader(true);
    updatePassword(user!, data.password)
      .then(() => setSuccessEdit(true))
      .catch((error) => setErrorType(error.code))
      .finally(() => setLoader(false));
  };

  // useEffect(() => {
  //   // const posts = ref(db, 'posts');
  //   // onValue(posts, (snapshot) => {
  //   //   snapshot.forEach(item => {
  //   //     if(item.val().authorID === user!.uid) {
  //   //       console.log(item.val())
  //   //     }
  //   //   })
  //   // })
  //
  // }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 15 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              type={reveal ? 'text' : 'password'}
              {...register('password')}
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setReveal((prev) => !prev)}>
                      {reveal ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Change Password
        </Button>
      </Box>

      <Snackbar
        open={successEdit}
        autoHideDuration={4000}
        onClose={() => setSuccessEdit(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Password has been changed
        </Alert>
      </Snackbar>

      <Snackbar
        open={successEdit}
        autoHideDuration={4000}
        onClose={() => setSuccessEdit(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Password has been changed
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
      <Snackbar
        open={errorType === 'auth/requires-recent-login'}
        autoHideDuration={4000}
        onClose={() => setErrorType(null)}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Please relogin for this operation
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
