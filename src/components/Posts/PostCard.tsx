import React, { FC, useEffect, useState } from 'react';
import { IPostData, IPost, Reaction } from '../../interfaces';
import {
  Box,
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
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { update } from 'firebase/database';
import { commentsRef, postsRef } from '../App';
import EditIcon from '@mui/icons-material/Edit';
import { $currentUser } from '../../currUserStore';
import { useStore } from 'effector-react';
import { EditPost } from './EditPost';
import { Comments } from './Comments';
interface IPostCardProps {
  item: IPostData;
  closePost: () => void;
}

export const PostCard: FC<IPostCardProps> = ({ item, closePost }) => {
  const [reaction, setReaction] = useState<Reaction>('none');
  const [isFavorite, setFavorite] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);

  const user = useStore($currentUser);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClickReaction = (react: Reaction) => {
    const tempPost = Object.assign(item);
    const updates: IPost = {};

    if (react === reaction) {
      tempPost.countOfLikes = item.countOfLikes.filter(
        (item) => item !== user!.uid
      );
      tempPost.countOfDislikes = item.countOfDislikes.filter(
        (item) => item !== user!.uid
      );
      updates[tempPost.postUID + '/'] = tempPost;
      update(postsRef, updates).finally(() => setReaction('none'));
      return;
    }
    if (react === 'dislike') {
      if (item.countOfDislikes.includes(user!.uid)) {
        tempPost.countOfDislikes = item.countOfDislikes.filter(
          (item) => item !== user!.uid
        );
      } else {
        tempPost.countOfDislikes.push(user!.uid);
      }
      tempPost.countOfLikes = item.countOfLikes.filter(
        (item) => item !== user!.uid
      );

      updates[tempPost.postUID + '/'] = tempPost;
      update(postsRef, updates).finally(() => setReaction('dislike'));
      return;
    }

    if (item.countOfLikes.includes(user!.uid)) {
      tempPost.countOfLikes = item.countOfLikes.filter(
        (item) => item !== user!.uid
      );
    } else {
      tempPost.countOfLikes.push(user!.uid);
    }
    tempPost.countOfDislikes = item.countOfLikes.filter(
      (item) => item !== user!.uid
    );

    updates[tempPost.postUID + '/'] = tempPost;
    update(postsRef, updates).finally(() => setReaction('like'));
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
    const tempPost = Object.assign(item);
    const updates: IPost = {};

    if (isFavorite) {
      if (!item.favorites.includes(user!.uid)) {
        tempPost.favorites.push(user!.uid);
      }
    }
    if (!isFavorite) {
      if (item.favorites.includes(user!.uid)) {
        tempPost.favorites = item.favorites.filter(
          (item) => item !== user!.uid
        );
      }
    }
    updates[tempPost.postUID + '/'] = tempPost;
    update(postsRef, updates);
  }, [isFavorite]);

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 15 }}>
      {!isEdit && (
        <Card>
          <CardHeader
            title={item.title}
            action={
              <>
                {user!.uid === item.authorID && (
                  <IconButton>
                    <EditIcon onClick={() => setEdit((prev) => !prev)} />
                  </IconButton>
                )}
                <IconButton>
                  <CloseIcon onClick={closePost} />
                </IconButton>
              </>
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

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginLeft: '16px',
              }}
            >
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
            <IconButton
              aria-label="favorite"
              onClick={() => setFavorite((prev) => !prev)}
            >
              {isFavorite && <StarOutlinedIcon />}
              {!isFavorite && <StarBorderIcon />}
            </IconButton>
            <IconButton onClick={() => setShowComments((prev) => !prev)}>
              {showComments && <ChatBubbleIcon />}
              {!showComments && <ChatBubbleOutlineOutlinedIcon />}
            </IconButton>
          </CardActions>
        </Card>
      )}
      {showComments && <Comments postID={item.postUID} />}
      {isEdit && <EditPost closeEdit={closePost} item={item} />}
    </Container>
  );
};
