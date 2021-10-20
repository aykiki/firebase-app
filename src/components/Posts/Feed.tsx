import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { child, get, ref } from 'firebase/database';
import { db } from '../App';
import { IPostData } from '../../interfaces';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Skeleton,
} from '@mui/material';
import { CardActions } from '@material-ui/core';
import { PostCard } from './PostCard';

export const Feed: React.FC = () => {
  const [postsList, setPostsList] = useState<IPostData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [whichCardIsOpen, setOpenCard] = useState<number | undefined>();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const snapshot = await get(child(ref(db), 'posts/'));
      if (snapshot.val()) {
        let tempArray: IPostData[] = Object.values(snapshot.val());
        tempArray = tempArray.map((item) => {
          if (!item.countOfDislikes) {
            item.countOfDislikes = [];
          }
          if (!item.countOfLikes) {
            item.countOfLikes = [];
          }
          if (!item.favorites) {
            item.favorites = [];
          }
          return item;
        });
        setPostsList(tempArray);
      } else {
        setPostsList([]);
      }
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (whichCardIsOpen === undefined) {
      fetchPosts();
    }
  }, [whichCardIsOpen]);

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
            postsList
              .map((item, index) => (
                <Grid key={index} item xs={1}>
                  <Card>
                    <CardHeader
                      title={item.title}
                      subheader={new Date(item.date).toDateString()}
                    />
                    <CardMedia
                      component="img"
                      height="250"
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
                        Likes: {item.countOfLikes.length}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="p"
                      >
                        Dislikes: {item.countOfDislikes.length}
                      </Typography>

                      <Button onClick={() => setOpenCard(index)}>
                        Read more
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
              .reverse()}
        </Grid>
      </Container>
    </>
  );
};
