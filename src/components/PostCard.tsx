import React, { FC } from 'react';
import { IPost } from '../dataIntefaces';
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
interface IPostCardProps {
  item: IPost;
  closePost: () => void;
}
export const PostCard: FC<IPostCardProps> = ({ item, closePost }) => {
  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 15 }}>
      <Card>
        <CardHeader
          title={item.title}
          action={
            <IconButton>
              <CloseIcon onClick={closePost}/>
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
          <IconButton aria-label="add to favorites">
            <ThumbUpIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ThumbDownAltIcon />
          </IconButton>
          <IconButton aria-label="share">
            <StarBorderIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
};
