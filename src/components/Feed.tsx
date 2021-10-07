import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { child, get, onValue, ref } from 'firebase/database';
import { db, postsRef } from './App';
import { IPost } from '../dataIntefaces';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Container,
  IconButton,
  Skeleton,
} from '@mui/material';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { CardActions } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';


export const Feed: React.FC = () => {
  const [postsList, setPostsList] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [whichCardIsOpen, setOpenCard] = useState<number | undefined>();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const snapshot = await get(child(ref(db), 'posts/'));
        if (snapshot.val()) {
          setPostsList(Object.values(snapshot.val()));
        } else {
          setPostsList([]);
        }
        setIsLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 15 }}>
      {isLoading && <Skeleton />}

      {isLoaded && postsList.length === 0 && 'empty'}

      {isLoaded &&
        postsList.length !== 0 &&
        postsList.map((item, index) => (
          <Card key={index} sx={{ maxWidth: '100%', m: 2 }}>
            <CardHeader title={item.title} subheader={item.date} />
            <CardMedia
              component="img"
              height="340"
              image={
                item.photoURL !== ''
                  ? item.photoURL
                  : 'https://i.stack.imgur.com/y9DpT.jpg'
              }
              alt={item.title}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" component="p">
                {item.description}
              </Typography>
            </CardContent>
            <CardActions disableSpacing style={{flexDirection: 'column', }}>
              <Typography>post by: {item.authorEmail}</Typography>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',

                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                >
                  Likes: {item.countOfLikes}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                >
                  Dislikes: {item.countOfDislikes}
                </Typography>
              </div>
              <div>
                <IconButton aria-label="add to favorites">
                  <ThumbUpIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ThumbDownAltIcon />
                </IconButton>
              </div>
              <ExpandMore
                onClick={() =>
                  index === whichCardIsOpen
                    ? setOpenCard(undefined)
                    : setOpenCard(index)
                }
                aria-expanded={whichCardIsOpen === index}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse
              in={whichCardIsOpen === index}
              timeout="auto"
              unmountOnExit
            >
              <CardContent>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {item.mainText}
                </pre>
              </CardContent>
            </Collapse>
          </Card>
        ))}
    </Container>
  );
};
