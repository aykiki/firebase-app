import React, { FC, useEffect, useState } from 'react';
import { IPost, newPostData, Reaction } from '../dataIntefaces';
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
import { appAuth, db, postsRef } from './App';
import { $currentUser } from '../currentUserStore';
import { useStore } from 'effector-react';
interface IPostCardProps {
  item: IPost;
  closePost: () => void;
}

export const PostCard: FC<IPostCardProps> = ({ item, closePost }) => {
  const user = useStore($currentUser);
  const [reaction, setReaction] = useState<Reaction>('none');
  const [isFavorite, setFavorite] = useState<boolean>(false);
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
    if (item.countOfLikes.includes(user!.uid)) {
      setReaction('like');
    }

    if (item.countOfDislikes.includes(user!.uid)) {
      setReaction('dislike');
    }

    if (item.favorites.includes(user!.uid)) {
      setFavorite(true);
    }
  }, []);

  useEffect(() => {
    if (reaction === 'dislike') {
      if (item.countOfDislikes.includes(user!.uid)) {
        changeReaction('deleteDislike', user!.uid);
      } else {
        changeReaction('deleteLike', user!.uid);
        changeReaction('addDislike', user!.uid);
      }
    } else if (reaction === 'like') {
      if (item.countOfLikes.includes(user!.uid)) {
        changeReaction('deleteLike', user!.uid);
      } else {
        changeReaction('deleteDislike', user!.uid);
        changeReaction('addLike', user!.uid);
      }
    } else {
      changeReaction('deleteDislike', user!.uid);
      changeReaction('deleteLike', user!.uid);
    }
  }, [reaction]);

  const changeReaction = (control: string, userUID: string) => {
    const tempPost = Object.assign(item);
    if (control === 'deleteDislike') {
      tempPost.countOfDislikes = item.countOfDislikes.filter(
        (item) => item !== userUID
      );
    }
    if (control === 'addDislike') {
      tempPost.countOfDislikes.push(userUID);
    }
    if (control === 'deleteLike') {
      tempPost.countOfLikes = item.countOfLikes.filter(
        (item) => item !== userUID
      );
    }
    if (control === 'addLike') {
      tempPost.countOfLikes.push(userUID);
    }

    if (control === 'deleteFromFavorites') {
      tempPost.favorites = item.favorites.filter((item) => item !== userUID);
    }

    if (control === 'addToFavorites') {
      tempPost.favorites.push(userUID);
    }

    const updates: newPostData = {};
    updates[tempPost.postUID + '/'] = tempPost;
    update(postsRef, updates);
  };

  useEffect(() => {
    if (isFavorite) {
      if (!item.favorites.includes(user!.uid)) {
        changeReaction('addToFavorites', user!.uid);
      }
    }
    if (!isFavorite) {
      if (item.favorites.includes(user!.uid)) {
        changeReaction('deleteFromFavorites', user!.uid);
      }
    }
  }, [isFavorite]);

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
            onClick={() => setFavorite((prev) => !prev)}
          >
            {isFavorite && <StarOutlinedIcon />}
            {!isFavorite && <StarBorderIcon />}
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
};
