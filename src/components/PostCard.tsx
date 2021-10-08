import React, { FC, useEffect, useState } from 'react';
import { IPost, Reaction } from '../dataIntefaces';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { Container } from '@mui/material';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { child, push, update } from 'firebase/database';
import { db, postsRef } from './App';
import { $currentUser } from '../currentUserStore';
import { useStore } from 'effector-react';
interface IPostCardProps {
  item: IPost;
  closePost: () => void;
}

export const PostCard: FC<IPostCardProps> = ({ item, closePost }) => {
  const user = useStore($currentUser);
  const [reaction, setReaction] = useState<Reaction>('none');
  const [favorites, setFavorites] = useState<boolean>(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const giveReaction = (react: Reaction) => {
    if (react === reaction) {
      setReaction('none');
      return;
    }
    if (reaction !== react) {
      setReaction(react);
      return;
    }
    setReaction('none');
  };

  useEffect(() => {
    if (item.countOfDislikes) {
      if (item.countOfDislikes.includes(user!.uid)) {
      } else {
        setReaction('dislike');
      }
    }
    if (item.countOfLikes) {
      if (item.countOfLikes.includes(user!.uid)) {
      } else {
        setReaction('like');
      }
    }
  }, []);
  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 15 }}>
      <Card>
        <CardHeader
          title={item.title}
          action={
            <IconButton>
              <CloseIcon onClick={closePost} />
            </IconButton>
          }
        />

        <CardMedia
          component="img"
          height="640"
          image={
            item.photoURL !== ''
              ? item.photoURL
              : 'https://i.stack.imgur.com/y9DpT.jpg'
          }
          alt={item.title}
        />
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            component="pre"
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {item.mainText}
          </Typography>
        </CardContent>
        <CardActions>
          <Typography variant="body2" color="text.secondary" component="p">
            post by: {item.authorEmail}
          </Typography>
          <IconButton aria-label="like" onClick={() => giveReaction('like')}>
            {reaction === 'like' && <ThumbUpIcon />}
            {reaction !== 'like' && <ThumbUpAltOutlinedIcon />}
          </IconButton>
          <IconButton
            aria-label="dislike"
            onClick={() => giveReaction('dislike')}
          >
            {reaction === 'dislike' && <ThumbDownAltIcon />}
            {reaction !== 'dislike' && <ThumbDownOutlinedIcon />}
          </IconButton>
          <IconButton
            aria-label="favorite"
            onClick={() => setFavorites((prev) => !prev)}
          >
            {favorites && <StarOutlinedIcon />}
            {!favorites && <StarBorderIcon />}
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
};
