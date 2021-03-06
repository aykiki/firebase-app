import React, { FC, useEffect, useState } from 'react';
import { IComments, ICommentsData, Reaction } from '../../interfaces';
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { useStore } from 'effector-react';
import { $currentUser } from '../../currUserStore';
import { commentsRef } from '../App';
import { update } from 'firebase/database';

interface ICommentProps {
  item: ICommentsData;
}
export const Comment: FC<ICommentProps> = ({ item }) => {
  const [reaction, setReaction] = useState<Reaction>('none');

  const user = useStore($currentUser);

  const handleClickReaction = (react: Reaction) => {
    if (react === reaction) {
      deleteReaction();
      return;
    }
    addReaction(react);
  };

  const deleteReaction = async () => {
    const updates: IComments = {};
    const tempComment = Object.assign(item);
    tempComment.countOfLikes = item.countOfLikes.filter(
      (it) => it !== user!.uid
    );
    tempComment.countOfDislikes = item.countOfDislikes.filter(
      (it) => it !== user!.uid
    );
    updates[tempComment.commentUID + '/'] = tempComment;
    await update(commentsRef, updates).finally(() => setReaction('none'));
  };

  const addReaction = async (react: Reaction) => {
    const updates: IComments = {};
    const tempComment = Object.assign(item);

    if (
      item.countOfLikes.includes(user!.uid) ||
      item.countOfDislikes.includes(user!.uid)
    ) {
      deleteReaction();
    }

    if (react === 'like') {
      tempComment.countOfLikes.push(user!.uid);
    } else {
      tempComment.countOfDislikes.push(user!.uid);
    }

    updates[tempComment.commentsUID + '/'] = tempComment;
    await update(commentsRef, updates).finally(() => setReaction(react));
  };

  useEffect(() => {
    if (item.countOfLikes.includes(user!.uid)) {
      setReaction('like');
    }

    if (item.countOfDislikes.includes(user!.uid)) {
      setReaction('dislike');
    }
  }, []);

  return (
    <Grid item xs={12}>
      <Paper sx={{ display: 'flex', gap: '18px', padding: '20px' }}>
        <Avatar src={item.userPhoto} alt={item.userName} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body1" component="pre">
            {item.mainText}
          </Typography>
          <Box>
            <Typography variant="overline">
              {new Date(item.date).toDateString()}
            </Typography>
            <Typography variant="overline" ml="12px">
              {item.userName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {item.countOfLikes.length}
            <IconButton
              aria-label="like"
              onClick={() => handleClickReaction('like')}
            >
              {reaction === 'like' && <ThumbUpIcon />}
              {reaction !== 'like' && <ThumbUpAltOutlinedIcon />}
            </IconButton>
            {item.countOfDislikes.length}
            <IconButton
              aria-label="dislike"
              onClick={() => handleClickReaction('dislike')}
            >
              {reaction === 'dislike' && <ThumbDownAltIcon />}
              {reaction !== 'dislike' && <ThumbDownOutlinedIcon />}
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};
