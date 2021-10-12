import React, { useEffect, useState } from 'react';
import { child, get, ref } from 'firebase/database';
import { db } from './App';
import { IPost } from '../dataIntefaces';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import { PostCard } from './PostCard';
import { $currentUser } from '../currentUserStore';
import { useStore } from 'effector-react';

export const Favorites: React.FC = () => {
  const user = useStore($currentUser);

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
          let tempArray: IPost[] = Object.values(snapshot.val());
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
          tempArray = tempArray.filter((item) =>
            item.favorites.includes(user!.uid)
          );
          setPostsList(tempArray);
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
    <>
      {isLoading && <Skeleton />}

      {isLoaded && postsList.length === 0 && (
        <Container component="main" sx={{ mt: 15, mb: 10 }}>
          You are not the chosen one
        </Container>
      )}

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
                <Grid item xs={1}>
                  <Card key={index}>
                    <CardHeader
                      title={item.title}
                      subheader={new Date(item.date).toDateString()}
                    />
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
                        Likes:{' '}
                        {item.countOfLikes ? item.countOfLikes.length : 0}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="p"
                      >
                        Dislikes:{' '}
                        {item.countOfDislikes ? item.countOfDislikes.length : 0}
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
