import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { IPostForm, postSchema } from '../yupInterfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { $currentUser } from '../currentUserStore';
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { updatePassword } from 'firebase/auth';
import { useStore } from 'effector-react';
import { IPost } from '../dataIntefaces';
import { push, ref, set } from 'firebase/database';
import { db } from './App';

export const AddPost: React.FC = () => {
  const user = useStore($currentUser);
  const [loader, setLoader] = useState<boolean>(false);
  const [successPublish, setSuccessPublish] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IPostForm>({
    resolver: yupResolver(postSchema),
  });

  const onSubmit: SubmitHandler<IPostForm> = (data) => {
    setLoader(true);
    const newPost: IPost = {
      authorID: user!.uid,
      title: data.title,
      description: data.description,
      date: (new Date()).toISOString(),
      photoURL: data.photoURL ?? '',
      mainText: data.mainText,
      countOfLikes: 0,
      countOfDislikes: 0,
    };
    set(push(ref(db, 'posts/')), newPost)
      .catch(() => setLoader(false))
      .finally(() => {
        setLoader(false);
        setSuccessPublish(true);
      });
    reset()
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 15 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('title')}
              error={Boolean(errors.title?.message)}
              helperText={errors.title?.message}
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoComplete="title"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('photoURL')}
              error={Boolean(errors.photoURL?.message)}
              helperText={errors.photoURL?.message}
              fullWidth
              name="photoURL"
              label="Photo"
              type="photoURL"
              id="photoURL"
              autoComplete="new-photoURL"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              {...register('description')}
              error={Boolean(errors.description?.message)}
              helperText={errors.description?.message}
              fullWidth
              name="description"
              label="Short description"
              type="text"
              id="description"
              autoComplete="description"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              {...register('mainText')}
              error={Boolean(errors.mainText?.message)}
              helperText={errors.mainText?.message}
              fullWidth
              name="mainText"
              label="Text"
              type="text"
              id="mainText"
              autoComplete="mainText"
              multiline
              rows={5}
              required
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Publish Post
        </Button>
      </Box>

      <Snackbar
        open={successPublish}
        autoHideDuration={4000}
        onClose={() => setSuccessPublish(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Post has been published
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
