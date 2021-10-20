import React, { FC, useEffect, useState } from 'react';
import { IComments, ICommentsData } from '../../interfaces';
import { commentsRef, db } from '../App';
import { child, get, push, ref, update } from 'firebase/database';
import { ICommentsForm } from '../../yup/yup.interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { commentSchema } from '../../yup/yup.schemas';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Skeleton,
  TextField,
} from '@mui/material';
import { useStore } from 'effector-react';
import { $currentUser } from '../../currUserStore';
import { Comment } from './Comment';
interface ICommentsProps {
  postID: string;
}
export const Comments: FC<ICommentsProps> = ({ postID }) => {
  const [commentsList, setCommentsList] = useState<ICommentsData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const user = useStore($currentUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ICommentsForm>({
    resolver: yupResolver(commentSchema),
  });

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const snapshot = await get(child(ref(db), 'comments/'));
      if (snapshot.val()) {
        let tempArray: ICommentsData[] = Object.values(snapshot.val());
        tempArray = tempArray.filter((item) => item.postUID === postID);
        tempArray = tempArray.map((item) => {
          if (!item.countOfDislikes) {
            item.countOfDislikes = [];
          }
          if (!item.countOfLikes) {
            item.countOfLikes = [];
          }
          return item;
        });
        setCommentsList(tempArray);
      } else {
        setCommentsList([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const onSubmit: SubmitHandler<ICommentsForm> = async (data) => {
    const updates: IComments = {};
    const commentKey = push(commentsRef, updates).key;

    updates[commentKey + '/'] = {
      commentsUID: commentKey!,
      mainText: data.mainText,
      countOfLikes: [],
      countOfDislikes: [],
      date: new Date().toISOString(),
      authorUID: user!.uid,
      postUID: postID,
      userPhoto:
        user!.photoURL ??
        'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      userName: user!.displayName ?? user!.email!,
    };

    try {
      await update(commentsRef, updates);
      reset(undefined);
    } finally {
      fetchComments();
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 5 }}>
      {isLoading && <Skeleton />}

      <CssBaseline />
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              {...register('mainText')}
              error={Boolean(errors.mainText?.message)}
              helperText={errors.mainText?.message}
              fullWidth
              maxRows={4}
              multiline
              id="mainText"
              label="Comment"
              name="mainText"
              autoComplete="mainText"
            />
          </Grid>
          <Grid item xs={6}>
            <Button type="submit" variant="contained" size="large">
              Send comment
            </Button>
          </Grid>
          {commentsList.map((comment, index) => (
            <Comment item={comment} key={index} />
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
