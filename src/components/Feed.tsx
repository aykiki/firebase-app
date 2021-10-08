import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { child, get, onValue, ref } from 'firebase/database';
import { db, postsRef } from './App';
import { IPost } from '../dataIntefaces';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Container,
  Grid,
  IconButton,
  Skeleton,
} from '@mui/material';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { CardActions } from '@material-ui/core';
import { StarBorderOutlined } from '@material-ui/icons';
import { PostCard } from './PostCard';

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
          console.log(Object.values(snapshot.val()))
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

  useEffect(()=>{
    console.log(postsList)
  }, [postsList])

  return (
    <>
      {isLoading && <Skeleton />}

      {isLoaded && postsList.length === 0 && 'empty'}

      {whichCardIsOpen !== undefined && (
        <PostCard
          item={postsList[whichCardIsOpen]}
          closePost={() => setOpenCard(undefined)}
        />
      )}
      <Container component="main" sx={{ mt: 15, mb: 10 }}>
        <Grid
          container
          spacing={{ xs: 1, sm: 2, md: 3 }}
          columns={{ xs: 2, sm: 3, md: 15 }}
          direction="row"
          justifyContent="start"
          alignItems="flex-start"
        >
          {isLoaded &&
            whichCardIsOpen === undefined &&
            postsList.map((item, index) => (
              <Grid item xs={1}>
                <Card key={index}>
                  <CardHeader title={item.title} subheader={new Date(item.date).toDateString()} />
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="pre"
                    >
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    disableSpacing
                    style={{ flexDirection: 'column' }}
                  >
                    <Typography>post by: {item.authorEmail}</Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="p"
                    >
                      Likes: {item.countOfLikes ? item.countOfLikes.length: 0}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="p"
                    >
                      Dislikes: {item.countOfDislikes ? item.countOfDislikes.length: 0}
                    </Typography>

                    <Button onClick={() => setOpenCard(index)}>
                      Read more
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )).reverse()}
        </Grid>
      </Container>
    </>
  );
};
